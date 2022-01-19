<template>
  <div class="q-gutter-y-md q-px-lg full-height flex wrap content-between">
    <FolderBlurredIcon class="absolute back-icon" />
    <div class="full-width text-weight-medium text-container">
      <FolderFilledIcon />
      <p class="q-mt-xl page-heading">
        {{ $t('MOBILEAPPSWEBCLIENT.HEADING_FILES_APP') }}
      </p>
      <p class="q-mt-lg text-grey-5">LOG IN TO CONTINUE</p>
    </div>
    <div class="full-width">
      <q-form>
        <AppInput
          v-model="login"
          :placeholder="$t('COREWEBCLIENT.LABEL_EMAIL')"
          type="email"
        />
        <AppInput v-model="password" placeholder="Password" type="password" />
      </q-form>
    </div>
    <div class="full-width q-pb-xl">
      <AppButton
        @click="proceedLogin"
        label="Login"
        :disabled="!login || !password"
      />
    </div>
  </div>
</template>

<script>
import AppInput from 'components/common/AppInput'
import AppButton from 'components/common/AppButton'
import FolderFilledIcon from 'components/common/icons/login/FolderFilledIcon'
import FolderBlurredIcon from 'components/common/icons/login/FolderBlurredIcon'
import { mapActions } from 'vuex'

export default {
  name: 'LoginMobile',
  components: {
    AppInput,
    AppButton,
    FolderFilledIcon,
    FolderBlurredIcon,
  },
  data: () => ({
    login: '',
    password: '',
  }),
  methods: {
    ...mapActions('user', ['loginFunc']),
    async proceedLogin() {
      try {
        console.log('DT: this', this)
        const parameters = {
          Login: this.login,
          Password: this.password,
        }
        const response = await this.loginFunc(parameters)
        if (response) console.log('DT: response', response)
      } catch (err) {
        console.log('DT: Error', Error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.back-icon {
  margin-left: -1.5rem;
}
.text-container {
  margin-top: 5.375rem;
}
.page-heading {
  font-size: 2.25rem;
  line-height: 1.5rem;
}
</style>
