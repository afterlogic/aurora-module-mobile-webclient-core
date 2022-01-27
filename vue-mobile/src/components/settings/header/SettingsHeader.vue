<template>
  <div>
    <q-toolbar
      class="text-black flex justify-center"
      style="height: 55px; font-size: 16px; padding: 0"
    >
      <q-card-actions align="left" class="col-3">
        <q-btn
          v-if="showBackAction"
          flat
          size="15px"
          color="black"
          round
          dense
          icon="chevron_left"
          @click="onPreviousPath"
        />
      </q-card-actions>
      <div class="col-6 text-center text-bold">{{ header }}</div>
      <div class="col-3" />
    </q-toolbar>
  </div>
</template>

<script>
import { settingsHeaderTittle } from 'src/utils/enums'

export default {
  name: 'SettingsHeader',
  computed: {
    showBackAction() {
      const patch = this.$route.fullPath.split('/')
      return patch[2] !== 'menu'
    },
    header() {
      const patch = this.$route.fullPath.split('/')
      return settingsHeaderTittle[patch[patch.length - 1]]
    },
  },
  methods: {
    onPreviousPath() {
      this.$router.back()
    },
  },
}
</script>

<style scoped></style>
