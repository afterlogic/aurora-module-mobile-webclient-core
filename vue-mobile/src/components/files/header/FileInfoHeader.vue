<template>
  <q-toolbar style="height: 55px; font-size: 16px; padding: 0">
    <q-card-actions align="left" class="col-6">
      <q-btn
        flat size="15px" color="black"
        round dense icon="chevron_left"
        @click="onPreviousPath"
      />
    </q-card-actions>
    <div class="col-6 flex justify-end q-pr-sm">
      <q-btn flat size="15px" color="black" round dense icon="share" @click="deleteFile"/>
      <q-btn class="q-ml-sm" flat size="15px" color="black" round dense icon="file_download" @click="deleteFile"/>
      <q-btn class="q-ml-sm" flat size="15px" color="black" round dense icon="delete_outline" @click="deleteFile"/>
      <q-btn class="q-ml-sm" flat size="15px" color="black" round dense icon="list"/>
    </div>
  </q-toolbar>
</template>

<script>
export default {
  name: "FileInfoHeader",
  methods: {
    onPreviousPath() {
      console.log('hey')
    },
    deleteFile() {
      console.log('delete')
    }
  }
}
</script>

<style scoped>

</style>
