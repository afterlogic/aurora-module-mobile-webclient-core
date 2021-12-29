<template>
  <q-toolbar style="height: 55px; font-size: 16px; padding: 0" class="bg-primary">
    <q-card-actions align="left" class="col-3">
      <q-btn
        v-if="currentPaths.length <= 1"
        flat size="15px" color="black"
        round dense icon="close"
        @click="removeCopiedItems"
      />
      <q-btn
        v-if="currentPaths.length > 1"
        flat size="15px" color="black"
        round dense icon="chevron_left"
        @click="onPreviousPath"
      />
    </q-card-actions>
    <div class="text-center text-black text-bold col-6">
      <span>Move files/folders</span>
    </div>
    <div class="col-3 flex justify-end q-pr-sm">
      <q-btn flat size="15px" color="black" round dense icon="create_new_folder" @click="createFolder"/>
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
    },
    currentPaths() {
      return this.$store.getters['files/getCurrentPaths']
    }
  },
  methods: {
    removeCopiedItems() {
      this.$store.dispatch('files/removeCopiedFiles', { items: this.copiedItems, status: false })
    },
    createFolder() {
      this.$store.dispatch('files/changeDialogComponent', { component: 'CreateFolderDialog' })
    },
    async onPreviousPath() {
      const paths = this.$store.getters['files/getCurrentPaths']
      await this.$store.dispatch('files/changeCurrentPaths', { path: paths[paths.length - 2], lastStorage: false })
      await this.$store.dispatch('files/asyncGetFiles')
    }
  }
}
</script>

<style scoped>

</style>
