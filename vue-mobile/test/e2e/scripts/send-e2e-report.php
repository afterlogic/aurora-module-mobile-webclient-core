<?php
/**
 * Sends a Playwright E2E HTML report by email over raw SMTP (no Composer deps).
 * Works on Windows and Linux as long as the `openssl` PHP extension is enabled
 * (needed for SSL/TLS SMTP, which virtually every provider requires today).
 * PHP 7.x compatible (no constructor property promotion, no str_starts_with/str_contains).
 *
 * Usage:
 *   php send-e2e-report.php [path-to-html-report] [--status=passed|failed] [--to=a@x.com,b@y.com]
 *       [--subject="..."] [--screenshots=path1.png,path2.png]
 *
 * If the report path is omitted, no attachment/report link is sent — instead a plain
 * test email goes out to confirm the mail delivery channel is working.
 *
 * The report's containing directory (index.html + its data/ subfolder with screenshots and
 * traces) is zipped and attached as a whole — attaching index.html alone would leave the
 * screenshots behind, since Playwright stores them as separate sibling files. Requires the
 * `zip` PHP extension; falls back to attaching the bare index.html if it's unavailable.
 * --screenshots additionally attaches failure screenshots directly as images, so they're
 * visible in the email without unzipping anything.
 *
 * Settings file: `.env.e2e`, resolved 3 directories above this script (i.e. next
 * to the project root — adjust the `dirname($scriptDir, 3)` call in main() if your
 * layout differs). Real environment variables always win over its values.
 *
 * Configuration (environment variables, or the `.env.e2e` file above):
 *   MAIL_HOST            smtp.example.com
 *   MAIL_PORT            587 (STARTTLS) | 465 (implicit SSL) | 25 (unencrypted, not recommended)
 *   MAIL_ENCRYPTION      tls | ssl | none
 *   MAIL_USERNAME        SMTP auth login
 *   MAIL_PASSWORD        SMTP auth password / app password
 *   MAIL_FROM_ADDRESS    sender@example.com
 *   MAIL_FROM_NAME       "E2E Bot" (optional)
 *   E2E_MAIL_TO          comma-separated default recipient list (overridable with --to)
 *   E2E_MAIL_SUBJECT     default subject template (overridable with --subject)
 *   WEB_INSTALL_URL      base URL of the installation, e.g. https://dev.example.com
 *                         (its filesystem root is assumed to be 4 directories above
 *                         .env.e2e — see buildReportUrl())
 *
 * Exit code: 0 on success, 1 on any failure (bad args, SMTP error, etc).
 * Never throws past main() — always exits cleanly so callers can decide whether
 * a failed email should also fail the overall CI job.
 */

function startsWith(string $haystack, string $needle): bool
{
    return substr($haystack, 0, strlen($needle)) === $needle;
}

function loadDotEnvIfPresent(string $path): void
{
    if (!is_file($path)) {
        return;
    }
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) {
            continue;
        }
        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        $value = trim($value, "\"'");
        // Real environment variables always win over .env values.
        if (getenv($key) === false) {
            putenv("$key=$value");
        }
    }
}

function envOrFail(string $key): string
{
    $value = getenv($key);
    if ($value === false || $value === '') {
        fwrite(STDERR, "[send-e2e-report] Missing required environment variable: $key\n");
        exit(1);
    }
    return $value;
}

function parseArgs(array $argv): array
{
    $positional = [];
    $options = ['status' => null, 'to' => null, 'subject' => null, 'screenshots' => null];

    foreach (array_slice($argv, 1) as $arg) {
        if (startsWith($arg, '--status=')) {
            $options['status'] = substr($arg, 9);
        } elseif (startsWith($arg, '--to=')) {
            $options['to'] = substr($arg, 5);
        } elseif (startsWith($arg, '--subject=')) {
            $options['subject'] = substr($arg, 10);
        } elseif (startsWith($arg, '--screenshots=')) {
            $options['screenshots'] = substr($arg, 14);
        } else {
            $positional[] = $arg;
        }
    }

    return [$positional[0] ?? null, $options];
}

/**
 * Zips an entire directory (e.g. the Playwright HTML report, with its `data/` attachments)
 * so screenshots/traces travel with the report instead of being left behind as an orphaned
 * index.html. Returns null if ext-zip isn't available or zipping fails — caller falls back
 * to attaching the bare file.
 */
function zipDirectory(string $dir): ?string
{
    if (!class_exists('ZipArchive')) {
        return null;
    }

    $zipPath = tempnam(sys_get_temp_dir(), 'e2e-report-') . '.zip';
    $zip = new ZipArchive();
    if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
        return null;
    }

    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS)
    );
    foreach ($files as $file) {
        $localName = str_replace('\\', '/', substr($file->getPathname(), strlen($dir) + 1));
        $zip->addFile($file->getPathname(), $localName);
    }
    $zip->close();

    return $zipPath;
}

/** Minimal RFC 5321 SMTP client: connect, EHLO, optional STARTTLS, AUTH LOGIN, MAIL/RCPT/DATA. */
final class SmtpClient
{
    /** @var resource */
    private $socket;

    /** @var string */
    private $host;

    /** @var int */
    private $port;

    /** @var string tls | ssl | none */
    private $encryption;

    /** @var int */
    private $timeoutSeconds;

    public function __construct(string $host, int $port, string $encryption, int $timeoutSeconds = 20)
    {
        $this->host = $host;
        $this->port = $port;
        $this->encryption = $encryption;
        $this->timeoutSeconds = $timeoutSeconds;
    }

    public function send(string $username, string $password, string $from, array $to, string $rawMessage): void
    {
        $this->connect();
        $this->expect(220);

        $this->ehlo();

        if ($this->encryption === 'tls') {
            $this->command('STARTTLS');
            $this->expect(220);
            $this->enableCrypto();
            $this->ehlo(); // must re-negotiate capabilities after STARTTLS
        }

        $this->authLogin($username, $password);

        $this->command('MAIL FROM:<' . $from . '>');
        $this->expect(250);

        foreach ($to as $recipient) {
            $this->command('RCPT TO:<' . $recipient . '>');
            $this->expect(250, 251);
        }

        $this->command('DATA');
        $this->expect(354);

        // Dot-stuff any line that starts with a lone '.', per RFC 5321.
        $stuffed = preg_replace('/^\./m', '..', $rawMessage);
        $this->write($stuffed . "\r\n.\r\n");
        $this->expect(250);

        $this->command('QUIT');
        fclose($this->socket);
    }

    private function connect(): void
    {
        $prefix = $this->encryption === 'ssl' ? 'ssl://' : '';
        $target = $prefix . $this->host . ':' . $this->port;

        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true,
            ],
        ]);

        $socket = @stream_socket_client(
            $target,
            $errno,
            $errstr,
            $this->timeoutSeconds,
            STREAM_CLIENT_CONNECT,
            $context
        );

        if ($socket === false) {
            throw new RuntimeException("Could not connect to $target: [$errno] $errstr");
        }

        stream_set_timeout($socket, $this->timeoutSeconds);
        $this->socket = $socket;
    }

    private function enableCrypto(): void
    {
        $ok = stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        if ($ok !== true) {
            throw new RuntimeException('STARTTLS negotiation failed');
        }
    }

    private function ehlo(): void
    {
        $this->command('EHLO ' . (gethostname() ?: 'localhost'));
        $this->expect(250);
    }

    private function authLogin(string $username, string $password): void
    {
        $this->command('AUTH LOGIN');
        $this->expect(334);
        $this->command(base64_encode($username));
        $this->expect(334);
        $this->command(base64_encode($password));
        $this->expect(235);
    }

    private function command(string $line): void
    {
        $this->write($line . "\r\n");
    }

    private function write(string $data): void
    {
        if (fwrite($this->socket, $data) === false) {
            throw new RuntimeException('Failed writing to SMTP socket');
        }
    }

    /** Reads one (possibly multi-line) SMTP response and asserts its status code. */
    private function expect(int ...$acceptableCodes): void
    {
        $response = '';
        do {
            $line = fgets($this->socket, 515);
            if ($line === false) {
                throw new RuntimeException('SMTP connection closed unexpectedly while awaiting: ' . implode('/', $acceptableCodes));
            }
            $response .= $line;
            // Multi-line responses use "250-text"; the final line uses "250 text".
            $continues = isset($line[3]) && $line[3] === '-';
        } while ($continues);

        $code = (int) substr($response, 0, 3);
        if (!in_array($code, $acceptableCodes, true)) {
            throw new RuntimeException("Unexpected SMTP response (wanted " . implode('/', $acceptableCodes) . "): " . trim($response));
        }
    }
}

/**
 * @param array<int, array{path: string, name?: string}> $attachments
 */
function buildMimeMessage(
    string $from,
    string $fromName,
    array $to,
    string $subject,
    string $bodyText,
    array $attachments = []
): string {
    $date = date('r');
    $messageId = '<' . bin2hex(random_bytes(16)) . '@' . (gethostname() ?: 'localhost') . '>';

    // No attachments (mail-channel test): a plain single-part message, no MIME multipart needed.
    if (empty($attachments)) {
        $headers = [
            'From' => sprintf('%s <%s>', encodeHeaderWord($fromName), $from),
            'To' => implode(', ', $to),
            'Subject' => encodeHeaderWord($subject),
            'Date' => $date,
            'Message-ID' => $messageId,
            'MIME-Version' => '1.0',
            'Content-Type' => 'text/plain; charset=UTF-8',
            'Content-Transfer-Encoding' => 'base64',
        ];

        $lines = [];
        foreach ($headers as $name => $value) {
            $lines[] = "$name: $value";
        }
        $lines[] = '';
        $lines[] = chunk_split(base64_encode($bodyText));

        return implode("\r\n", $lines);
    }

    $boundary = 'e2e-report-' . bin2hex(random_bytes(12));

    $headers = [
        'From' => sprintf('%s <%s>', encodeHeaderWord($fromName), $from),
        'To' => implode(', ', $to),
        'Subject' => encodeHeaderWord($subject),
        'Date' => $date,
        'Message-ID' => $messageId,
        'MIME-Version' => '1.0',
        'Content-Type' => "multipart/mixed; boundary=\"$boundary\"",
    ];

    $lines = [];
    foreach ($headers as $name => $value) {
        $lines[] = "$name: $value";
    }
    $lines[] = '';

    // Plain-text body: pass/fail status + link to the hosted report.
    $lines[] = "--$boundary";
    $lines[] = 'Content-Type: text/plain; charset=UTF-8';
    $lines[] = 'Content-Transfer-Encoding: base64';
    $lines[] = '';
    $lines[] = chunk_split(base64_encode($bodyText));

    foreach ($attachments as $attachment) {
        $attachmentPath = $attachment['path'];
        $attachmentName = $attachment['name'] ?? basename($attachmentPath);
        $attachmentType = detectMimeType($attachmentPath);
        $attachmentData = chunk_split(base64_encode(file_get_contents($attachmentPath)));
        $lines[] = "--$boundary";
        $lines[] = "Content-Type: $attachmentType; name=\"$attachmentName\"";
        $lines[] = 'Content-Transfer-Encoding: base64';
        $lines[] = "Content-Disposition: attachment; filename=\"$attachmentName\"";
        $lines[] = '';
        $lines[] = $attachmentData;
    }
    $lines[] = "--$boundary--";

    return implode("\r\n", $lines);
}

/** Real content type of the attachment, so the MIME header never lies about what's inside. */
function detectMimeType(string $path): string
{
    if (function_exists('mime_content_type')) {
        $detected = @mime_content_type($path);
        if ($detected !== false && $detected !== '') {
            return $detected;
        }
    }

    $extensionTypes = [
        'html' => 'text/html',
        'htm' => 'text/html',
        'zip' => 'application/zip',
        'txt' => 'text/plain',
        'json' => 'application/json',
    ];
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));

    return $extensionTypes[$ext] ?? 'application/octet-stream';
}

function encodeHeaderWord(string $value): string
{
    // Encode as UTF-8 "encoded word" only if needed, so plain ASCII stays readable.
    if (preg_match('/^[\x20-\x7E]*$/', $value)) {
        return $value;
    }
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

/** Path of $to relative to $from. Assumes $to lives under $from. */
function relativePath(string $from, string $to): string
{
    $from = str_replace('\\', '/', rtrim($from, '/\\'));
    $to = str_replace('\\', '/', rtrim($to, '/\\'));

    $fromParts = explode('/', $from);
    $toParts = explode('/', $to);

    while (count($fromParts) > 0 && count($toParts) > 0 && $fromParts[0] === $toParts[0]) {
        array_shift($fromParts);
        array_shift($toParts);
    }

    return implode('/', $toParts);
}

/**
 * Builds the public URL for the report: WEB_INSTALL_URL + the report's path
 * relative to the installation's filesystem root (4 directories above .env.e2e).
 */
function buildReportUrl(string $webInstallUrl, string $envPath, string $reportPath): string
{
    $installRoot = realpath(dirname($envPath, 4)) ?: dirname($envPath, 4);
    $reportRealPath = realpath($reportPath) ?: $reportPath;

    $relative = relativePath($installRoot, $reportRealPath);

    return rtrim($webInstallUrl, '/') . '/' . ltrim($relative, '/');
}

function main(): void
{
    $scriptDir = __DIR__;
    $envPath = dirname($scriptDir, 3) . DIRECTORY_SEPARATOR . '.env.e2e';
    loadDotEnvIfPresent($envPath);

    [$reportPath, $options] = parseArgs($_SERVER['argv']);
    $isChannelTest = $reportPath === null;

    if (!$isChannelTest && !is_file($reportPath)) {
        fwrite(STDERR, "[send-e2e-report] Report file not found: $reportPath\n");
        exit(1);
    }

    $host = envOrFail('MAIL_HOST');
    $port = (int) envOrFail('MAIL_PORT');
    $encryption = strtolower(getenv('MAIL_ENCRYPTION') ?: 'tls');
    $username = envOrFail('MAIL_USERNAME');
    $password = envOrFail('MAIL_PASSWORD');
    $fromAddress = envOrFail('MAIL_FROM_ADDRESS');
    $fromName = getenv('MAIL_FROM_NAME') ?: 'E2E Bot';
    $webInstallUrl = envOrFail('WEB_INSTALL_URL');

    $toRaw = $options['to'] ?? getenv('E2E_MAIL_TO');
    if (!$toRaw) {
        fwrite(STDERR, "[send-e2e-report] No recipients: set E2E_MAIL_TO or pass --to=a@x.com,b@y.com\n");
        exit(1);
    }
    $to = array_values(array_filter(array_map('trim', explode(',', $toRaw))));

    $screenshotPaths = [];
    if ($options['screenshots']) {
        foreach (explode(',', $options['screenshots']) as $shot) {
            $shot = trim($shot);
            if ($shot !== '' && is_file($shot)) {
                $screenshotPaths[] = $shot;
            }
        }
    }

    $zipPath = null;

    if ($isChannelTest) {
        $subject = $options['subject'] ?? 'Mobile E2E mail channel test';
        $bodyText = "This is a test email confirming the E2E report mail delivery channel is working.\n";
        $attachments = [];
    } else {
        $status = $options['status'] ?? getenv('E2E_REPORT_STATUS') ?: null;
        $defaultSubject = getenv('E2E_MAIL_SUBJECT') ?: 'Mobile E2E test report';
        $subject = $options['subject'] ?? $defaultSubject;
        if ($status !== null) {
            $subject = '[' . strtoupper($status) . '] ' . $subject;
        }

        $reportUrl = buildReportUrl($webInstallUrl, $envPath, $reportPath);

        $statusText = $status === 'passed'
            ? 'All tests passed successfully.'
            : ($status === 'failed' ? 'Test failed!' : 'Test passed.');

        $attachments = [];

        // The bare index.html can't show screenshots/traces on its own — they live in a
        // sibling data/ folder — so zip the whole report directory and attach that instead.
        $zipPath = zipDirectory(dirname($reportPath));
        if ($zipPath !== null) {
            $attachments[] = ['path' => $zipPath, 'name' => 'playwright-report.zip'];
            $reportNote = "Full interactive report attached as a zip: unzip it and open index.html "
                . "(or run `npx playwright show-report <unzipped-folder>` for trace replay).\n";
        } else {
            $attachments[] = ['path' => $reportPath, 'name' => basename($reportPath)];
            $reportNote = "Note: could not zip the report folder (ext-zip missing?) — attached bare "
                . "index.html, screenshots won't display without their data/ folder.\n";
        }

        foreach ($screenshotPaths as $index => $shotPath) {
            $attachments[] = ['path' => $shotPath, 'name' => 'failure-' . ($index + 1) . '-' . basename($shotPath)];
        }

        $bodyText = $statusText . "\n\nFollow the link for more details: " . $reportUrl . "\n\n" . $reportNote;
        if (!empty($screenshotPaths)) {
            $bodyText .= count($screenshotPaths) . " failure screenshot(s) attached separately.\n";
        }
    }

    $exitCode = 0;
    try {
        $message = buildMimeMessage($fromAddress, $fromName, $to, $subject, $bodyText, $attachments);

        $client = new SmtpClient($host, $port, $encryption);
        $client->send($username, $password, $fromAddress, $to, $message);

        echo $isChannelTest
            ? "[send-e2e-report] Test email sent to: " . implode(', ', $to) . "\n"
            : "[send-e2e-report] Sent report to: " . implode(', ', $to) . "\n";
    } catch (Throwable $e) {
        fwrite(STDERR, '[send-e2e-report] Failed to send email: ' . $e->getMessage() . "\n");
        $exitCode = 1;
    } finally {
        if ($zipPath !== null && is_file($zipPath)) {
            @unlink($zipPath);
        }
    }

    if ($exitCode !== 0) {
        exit($exitCode);
    }
}

main();
