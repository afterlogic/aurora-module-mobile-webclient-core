<template>
  <q-layout class="app-layout" view="hhh LpR fFf">
    <UploaderComponent ref="uploader" />
    <UnsavedChangesDialog ref="unsavedChangesDialog"/>
    <component
      v-for="component in currentComponents"
      :key="component.name"
      :ref="component.name"
      :is="component.component"
    />
    <router-view />
  </q-layout>
</template>

<script>
import { mapState } from 'pinia'
import { defineComponent } from 'vue'
import modulesManager from 'src/modules-manager'
import types from 'src/utils/types'
import eventBus from 'src/event-bus'

import { useCoreStore } from 'src/stores/index-pinia'
import UploaderComponent from 'components/common/UploaderComponent'
import UnsavedChangesDialog from "components/common/dialogs/UnsavedChangesDialog";

const mixins = {
  methods: {
    unsavedChangesDialog(next) {
      this.$refs.unsavedChangesDialog.openConfirmDiscardChangesDialog(next)
    },
    uploadFiles(methods) {
      this.$refs.uploader.open(methods)
    },
    nextUploadFiles(methods) {
      this.$refs.uploader.upload(methods)
    },
    _getParentComponent(sComponentName) {
      if (this.$options.name === sComponentName) return this
      let oComponent = null
      let oParent = this.$parent
      while (oParent && !oComponent) {
        if (oParent.$options.name === sComponentName) {
          oComponent = oParent
        }
        oParent = oParent.$parent
      }
      return oComponent
    },
  },
}
export default defineComponent({
  name: 'App',

  mixins: [mixins],

  components: {
    UploaderComponent,
    UnsavedChangesDialog
  },

  data: () => ({
    currentComponents: []
  }),
  async mounted() {
    eventBus.$on('CoreMobileWebclient::InitSubscription', this.initSubscription)
    eventBus.$on('CoreMobileWebclient::SetComponents', this.setComponents)
  },

  computed: {
    ...mapState(useCoreStore, ['locale', 'isUserNormalOrTenant']),
  },
  watch: {
    locale(lang) {
      this.$i18n.locale = lang
    },
    isUserNormalOrTenant () {
      const currentRoute = this.$router.currentRoute.value
      const currentPath = currentRoute?.path
      const matchedRoutes = types.pArray(currentRoute?.matched)
      const correctedPath = modulesManager.correctPathForUser(matchedRoutes)
      if (matchedRoutes.length > 0 && currentPath !== correctedPath) {
        this.$router.push(correctedPath)
      }
    },
  },
  methods: {
    initSubscription() {
      eventBus.$emit('CoreMobileWebclient::CheckComponents', this.currentComponents)
    },
    setComponents(component) {
      this.currentComponents.push(component)
    }
  }
})
</script>
