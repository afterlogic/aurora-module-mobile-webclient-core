<template>
  <div class="q-gutter-y-md q-px-lg full-height flex column login-page">
    <FolderBlurredIcon class="absolute login-page__back-icon" />
    <div class="full-width text-weight-medium login-page__text">
      <FolderFilledIcon />
      <p class="q-mt-xl login-page__text__heading">
        {{ $t('MOBILEAPPSWEBCLIENT.HEADING_FILES_APP') }}
      </p>
      <p class="q-mt-lg text-grey-5">LOG IN TO CONTINUE</p>
    </div>
    <div
      class="content-between full-width full-height flex column justify-between"
    >
      <div>
        <div v-if="!isTwoFactor">
          <q-form>
            <AppInput
              type="email"
              v-model="login"
              :placeholder="$t('COREWEBCLIENT.LABEL_EMAIL')"
            />
            <AppInput
              type="password"
              v-model="password"
              placeholder="Password"
            />
          </q-form>
        </div>
        <div v-else class="text-center two-factor">
          <p class="text-weight-medium two-factor__heading">
            {{ $t('TWOFACTORAUTH.HEADING_TWA_VERIFICATION') }}
          </p>
          <p class="q-mt-sm">
            {{ $t('TWOFACTORAUTH.INFO_TWA_VERIFICATION') }}
          </p>
          <div class="q-mt-lg">
            <div v-if="isMethodChoosing">
              <p class="q-mt-sm">
                {{ $t('TWOFACTORAUTH.INFO_OTHER_VERIFICATION_OPTIONS') }}
              </p>
              <AppButton
                :label="$t('TWOFACTORAUTH.ACTION_USE_AUTHENTICATOR_APP')"
                @click="chooseMethod('verification')"
                class="q-mt-lg"
              />
              <AppButton
                :label="$t('TWOFACTORAUTH.LABEL_ENTER_BACKUP_CODE')"
                @click="chooseMethod('backup')"
                class="q-mt-md"
              />
            </div>
            <div v-else-if="trustDeviceForm">
              <p class="q-mt-sm">You’re all set</p>
              <AppCheckbox
                v-model="trustDevice"
                label="Don’t ask again on this device for 14 days"
              />
              <AppButton
                label="Continue"
                class="q-mt-lg"
                :loading="loading"
                @click="goHome"
              />
            </div>
            <div v-else>
              <p class="q-mt-sm">
                Specify verification code from the Authenticator app
              </p>
              <AppInput
                v-if="verificationOption === 'verification'"
                type="text"
                v-model="verificationCode"
                placeholder="Verification code"
              />
              <AppInput
                v-else
                type="text"
                v-model="backupCode"
                placeholder="Backup code"
              />
              <AppButton
                label="Verify"
                class="q-mt-lg q-mb-md"
                :loading="loading"
                @click="verifyCode"
                :disabled="disabledVerification"
              />
              <a
                href="javascript:void(0)"
                @click.prevent="isMethodChoosing = !isMethodChoosing"
              >
                {{ $t('TWOFACTORAUTH.ACTION_TRY_ANOTHER_WAY') }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="q-pb-xl text-center">
        <div v-if="!isTwoFactor">
          <AppButton
            label="Login"
            :loading="loading"
            @click="proceedLogin"
            :disabled="!login || !password"
          />
        </div>
        <a
          v-else
          href="javascript:void(0)"
          @click.prevent="isTwoFactor = !isTwoFactor"
          :styles="{
            opacity: getAuthTokenStatus ? 0 : 1,
            pointerEvents: 'none',
          }"
        >
          Back to login
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import AppInput from 'components/common/AppInput'
import AppButton from 'components/common/AppButton'
import FolderFilledIcon from 'components/common/icons/login/FolderFilledIcon'
import FolderBlurredIcon from 'components/common/icons/login/FolderBlurredIcon'
import { mapActions, mapGetters } from 'vuex'
import AppCheckbox from 'components/common/AppCheckbox'

export default {
  name: 'LoginMobile',
  components: {
    AppCheckbox,
    AppInput,
    AppButton,
    FolderFilledIcon,
    FolderBlurredIcon,
  },
  data: () => ({
    login: '',
    password: '',
    loading: false,
    isTwoFactor: false,
    trustDevice: false,
    trustDeviceForm: false,
    isMethodChoosing: false,
    backupCode: '',
    verificationCode: '',
    verificationOption: 'verification', // 'verification', 'backup', 'key'
  }),
  computed: {
    ...mapGetters('user', ['getAuthTokenStatus']),
    disabledVerification() {
      return this.verificationOption === 'verification'
        ? !this.verificationCode
        : !this.backupCode
    },
  },
  methods: {
    ...mapActions('user', ['loginFunc']),
    async proceedLogin() {
      const parameters = {
        Login: this.login,
        Password: this.password,
      }
      const response = await this.loginFunc(parameters)
      if (response && response.TwoFactorAuth) {
        this.isTwoFactor = true
      }
    },
    verifyCode() {
      console.log('DT: verify', this.verificationCode)
    },
    chooseMethod(method) {
      this.isMethodChoosing = false
      this.verificationOption = method
    },
    goHome() {
      console.log('DT: goHome')
    },
  },
}
</script>

<style lang="scss" scoped>
.login-page {
  &__back-icon {
    margin-left: -1.5rem;
  }
  &__text {
    margin-top: 5.375rem;

    &__heading {
      font-size: 2.25rem;
      line-height: 1.5rem;
    }
  }
  .two-factor {
    &__heading {
      font-size: 1.125rem;
      line-height: 1.25rem;
    }
  }
}
</style>
