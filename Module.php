<?php
/**
 * This code is licensed under Afterlogic Software License.
 * For full statements of the license see LICENSE file.
 */

namespace Aurora\Modules\CoreMobileWebclient;

/**
 * Mobile webclient for core view models.
 *
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2023, Afterlogic Corp.
 *
 * @property Settings $oModuleSettings
 *
 * @package Modules
 */
class Module extends \Aurora\System\Module\AbstractLicensedModule
{
    public function init()
    {
        \Aurora\System\Router::getInstance()->registerArray(
            self::GetName(),
            [
                'mobile-version' => [$this, 'EntryMobileVersion'],
            ]
        );

        $this->subscribeEvent('Core::UpdateSettings::after', array($this, 'onAfterUpdateSettings'));
    }

    /**
     * @return Module
     */
    public static function getInstance()
    {
        return parent::getInstance();
    }

    /**
     * @return Module
     */
    public static function Decorator()
    {
        return parent::Decorator();
    }

    /**
     * @return Settings
     */
    public function getModuleSettings()
    {
        return $this->oModuleSettings;
    }

    /**
     * @ignore
     */
    public function EntryMobileVersion()
    {
        \Aurora\Modules\CoreWebclient\Module::Decorator()->SetHtmlOutputHeaders();
        $sResult = \file_get_contents('./static/vue-mobile/index.html');
        if ($sResult === false) {
            return '';
        }

        // Link previews (Telegram etc.) read title/description from this HTML.
        // Prefer Branding ProductName, then Core SiteName — same fallback as the login UI.
        $sPreviewName = $this->getLinkPreviewName();
        $sPreviewNameEsc = \htmlspecialchars($sPreviewName, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

        $sResult = \preg_replace('/<title>.*?<\/title>/s', '<title>' . $sPreviewNameEsc . '</title>', $sResult, 1) ?? $sResult;
        $sResult = \preg_replace(
            '/<meta\b[^>]*\bname=(["\']?)description\1[^>]*>/i',
            '<meta name="description" content="' . $sPreviewNameEsc . '">',
            $sResult,
            1
        ) ?? $sResult;

        if (\stripos($sResult, 'og:title') === false) {
            $sResult = \preg_replace(
                '/<\/title>/i',
                '</title><meta property="og:title" content="' . $sPreviewNameEsc . '">'
                    . '<meta property="og:description" content="' . $sPreviewNameEsc . '">',
                $sResult,
                1
            ) ?? $sResult;
        }

        return $sResult;
    }

    /**
     * Name used in link-preview meta tags for the mobile SPA entry.
     */
    protected function getLinkPreviewName()
    {
        try {
            if (\Aurora\System\Api::GetModuleManager()->ModuleExists('BrandingWebclient')) {
                $aBranding = \Aurora\Modules\BrandingWebclient\Module::Decorator()->GetSettings();
                if (\is_array($aBranding) && !empty($aBranding['ProductName'])) {
                    return (string) $aBranding['ProductName'];
                }
            }
            if (\Aurora\System\Api::GetModuleManager()->ModuleExists('Core')) {
                $oCoreSettings = \Aurora\Modules\Core\Module::getInstance()->oModuleSettings;
                if ($oCoreSettings && !empty($oCoreSettings->SiteName)) {
                    return (string) $oCoreSettings->SiteName;
                }
            }
        } catch (\Throwable $oException) {
            // Fall through to default.
        }

        return 'Aurora';
    }

    public function GetSettings()
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

        $oUser = \Aurora\System\Api::getAuthenticatedUser();

        return array(
            'Theme' => $oUser && null !== $oUser->getExtendedProp(self::GetName() . '::Theme') ? $oUser->getExtendedProp(self::GetName() . '::Theme') : $this->oModuleSettings->Theme,
            'ThemeList' => $this->oModuleSettings->ThemeList,
        );
    }

    /**
     *
     * @param array $Args
     * @param mixed $Result
     */
    public function onAfterUpdateSettings($Args, &$Result)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        $oUser = \Aurora\System\Api::getAuthenticatedUser();
        if ($oUser && $oUser->isNormalOrTenant()) {
            if (isset($Args['MobileTheme'])) {
                $oUser->setExtendedProp(self::GetName() . '::Theme', $Args['MobileTheme']);
            }

            $oCoreDecorator = \Aurora\Modules\Core\Module::Decorator();
            $Result = $oCoreDecorator->UpdateUserObject($oUser);
        }

        if ($oUser && $oUser->Role === \Aurora\System\Enums\UserRole::SuperAdmin) {
            if (isset($Args['MobileTheme'])) {
                $this->setConfig('Theme', $Args['MobileTheme']);
            }

            $Result = $this->saveModuleConfig();
        }
    }
}
