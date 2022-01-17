<template>
  <div class="q-gutter-y-md q-px-md full-height flex wrap content-between">
    <div class="full-width">
      <h4 class="q-my-sm">{{ $t('MOBILEAPPSWEBCLIENT.HEADING_MAIL_APP') }}</h4>
      <p>Log in to continue</p>
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

<style scoped></style>
