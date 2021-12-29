<template>
  <q-toolbar style="height: 55px; font-size: 16px; padding: 0" class="bg-primary">
    <q-card-actions align="left" class="col-3">
      <q-btn flat size="15px" color="black" round dense icon="close" @click="removeCopiedItems"/>
    </q-card-actions>
    <div class="text-center text-black text-bold col-6">
      <span>Move files/folders</span>
    </div>
    <div class="col-3 flex justify-end q-pr-sm">
      <q-btn flat size="15px" color="black" round dense icon="create_new_folder" />
      <q-btn flat size="15px" color="black" round dense icon="list"/>
    </div>
  </q-toolbar>
</template>

<script>
export default {
  name: "CopyMoveHeader",
  computed: {
    copiedItems() {
      return this.$store.getters['files/getCopiedFiles']
    }
  },
  methods: {
    removeCopiedItems() {
      this.$store.dispatch('files/removeCopiedFiles', { items: this.copiedItems, status: false })
    }
  }
}
</script>

<style scoped>

</style>
