<template>
  <q-item v-if="storage" clickable v-ripple @click.prevent="selectStorage">
    <q-item-section avatar>
      <storage-icon></storage-icon>
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-subtitle1">{{ storage.DisplayName }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import StorageIcon from "components/files/icons/StorageIcon";

export default {
  name: "StorageItem",
  components: {
    StorageIcon
  },
  props: {
    storage: { type: Object, default: null }
  },
  methods: {
    selectStorage() {
      console.log('selectStorage')
    }
  }
}
</script>

<style scoped>

</style>
