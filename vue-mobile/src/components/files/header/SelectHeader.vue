<template>
  <q-toolbar style="height: 55px; font-size: 16px; padding: 0" class="bg-primary">
    <q-card-actions align="left" class="col-4">
      <q-btn flat size="15px" @click="removeSelectedItems" color="black" round dense icon="close" />
    </q-card-actions>
    <div class="text-center text-black text-bold col-4">
      <span>{{`Selected: ${items.length}`}}</span>
    </div>
    <q-card-actions align="right" class="col-4">
      <q-btn flat size="15px" color="black" round dense icon="drive_file_move" />
      <q-btn flat size="15px" color="black" round dense icon="delete_outline" />
    </q-card-actions>
  </q-toolbar>
</template>

<script>
export default {
  name: "SelectHeader",
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    removeSelectedItems() {
      this.$store.dispatch('files/removeSelectedItems', { items: this.items })
    }
  }
}
</script>

<style scoped>

</style>
