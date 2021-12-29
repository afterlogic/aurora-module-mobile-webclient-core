<template>
  <q-toolbar style="height: 60px" class="full-width">
    <div class="full-width flex no-wrap justify-between">
      <app-button size="15px" flat  class="q-px-md items-start" color="black"
                 label="Cancel"  @click="cancel"/>
      <app-button size="15px" flat class="q-px-sm"  color="black"
                 label="Copy" @click="copy"/>
      <app-button size="15px" flat class="q-px-md items-end"  color="black"
                 label="Move" @click="move"/>
    </div>
  </q-toolbar>
</template>

<script>
import AppButton from "components/common/AppButton";
export default {
  name: "CopiedFooter",
  components: {
    AppButton
  },
  methods: {
    cancel() {
      this.$store.dispatch('files/removeCopiedFiles')
    },
    copy() {
      this.$store.dispatch('files/copyItems')
    },
    move() {
      this.$store.dispatch('files/moveItems')
    }
  }
}
</script>

<style scoped>

</style>
