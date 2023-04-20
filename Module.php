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

    public function GetSettings()
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

        $oUser = \Aurora\System\Api::getAuthenticatedUser();

        return array(
            'Theme' => $oUser && isset($oUser->{self::GetName().'::Theme'}) ? $oUser->{self::GetName().'::Theme'} : $this->oModuleSettings->Theme,
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
                $oUser->setExtendedProp(self::GetName().'::Theme', $Args['MobileTheme']);
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
