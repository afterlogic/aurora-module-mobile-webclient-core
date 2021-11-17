<template>
  <div class="q-gutter-y-md column q-px-md" style="width: 100%">
    <div>
      <h4 class="q-my-sm">Aurora Mail</h4>
      <p>Log in to continue</p>
    </div>
   <div style="margin-top: 100px">
     <AppInput v-model="login" placeholder="Email"></AppInput>
     <AppInput v-model="password" placeholder="Password"></AppInput>
   </div>
    <AppButton style="margin-top: 100px" @click="proceedLogin" label="Login"></AppButton>
  </div>
</template>

<script>
import AppInput from 'components/common/AppInput'
import AppButton from 'components/common/AppButton'

export default {
  name: 'LoginMobile',
  components: {
    AppInput,
    AppButton
  },
  data() {
    return {
      login: '',
      password: '',
      loading: false,
    }
  },
  methods: {
    test(test) {
      console.log(test, 'test')
    },
    proceedLogin () {
      const parameters = {
        Login: this.login,
        Password: this.password,
      }
      this.$store.dispatch('user/login', parameters)
    },
  }
}
</script>

<style scoped>

</style>
