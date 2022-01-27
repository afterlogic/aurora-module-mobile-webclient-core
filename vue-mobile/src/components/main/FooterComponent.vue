<template>
  <q-footer v-if="showFooter" elevated class="bg-white">
    <component :is="component" />
  </q-footer>
</template>

<script>
import CopiedFooter from '../../../../../FilesMobileWebclient/vue-mobile/components/footer/CopiedFooter'
import DefaultFooter from 'components/common/footer/DefaultFooter'
import { mapGetters } from 'vuex'

export default {
  name: 'FooterComponent',
  components: {
    CopiedFooter,
    DefaultFooter,
  },
  computed: {
    ...mapGetters('files', ['copiedFiles']),
    component() {
      return this.isCopiedFiles ? 'CopiedFooter' : 'DefaultFooter'
    },
    isCopiedFiles() {
      return !!this.copiedFiles.length
    },
    showFooter() {
      const patch = this.$route.fullPath.split('/')
      if (patch[1] === 'settings') {
        if (patch[2] !== 'menu') {
          return false
        }
      }
      return true
    },
  },
}
</script>

<style scoped></style>
