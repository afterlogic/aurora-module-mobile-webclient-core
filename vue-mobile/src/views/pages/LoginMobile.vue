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
          v-model="form.login.value"
          :placeholder="$t('COREWEBCLIENT.LABEL_EMAIL')"
          :rules-props="form.login.rules"
          type="email"
        />
        <AppInput
          v-model="form.password.value"
          placeholder="Password"
          :rules-props="form.password.rules"
          type="password"
        />
      </q-form>
    </div>
    <div class="full-width q-pb-xl">
      <AppButton @click="proceedLogin" label="Login"></AppButton>
    </div>
  </div>
</template>

<script>
import AppInput from 'components/common/AppInput'
import AppButton from 'components/common/AppButton'
import FolderFilledIcon from 'components/files/icons/login/FolderFilledIcon'
import FolderBlurredIcon from 'components/files/icons/login/FolderBlurredIcon'
import { validators } from 'src/utils/validation'
import { useForm } from 'src/hooks/form'
import { useStore } from 'vuex'

const required = (val) => !!val
const minLength = (num) => (val) => val.length >= num

export default {
  name: 'LoginMobile',
  components: {
    AppInput,
    AppButton,
    FolderFilledIcon,
    FolderBlurredIcon,
  },
  setup() {
    const store = useStore()
    const form = useForm({
      login: {
        value: '',
        validators: { required: validators.required },
      },
      password: {
        value: '',
        validators: {
          required: validators.required,
          minLength: validators.minLength(8),
        },
      },
    })

    const proceedLogin = () => {
      const parameters = {
        Login: form.login.value,
        Password: form.password.value,
      }
      store.dispatch('user/login', parameters)
    }
    return { form, proceedLogin }
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
