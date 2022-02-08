<template>
  <q-btn
    @click="showDialog"
    :class="`create-btn rotate ${classes}`"
    color="primary"
    size="17px"
    :icon="icon"
    round
  />
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AppCreateButton',
  props: {
    icon: { type: String, default: '' },
  },
  computed: {
    ...mapGetters('files', ['dialogComponent']),
    classes() {
      if (this.dialogComponent.component === 'CreateButtonsDialogs') {
        return 'z-index-max'
      }
      return 'z-index-min'
    },
  },
  methods: {
    ...mapActions('filesmobile', ['changeDialogComponent']),
    showDialog() {
      if (this.dialogComponent.component === 'CreateButtonsDialogs') {
        this.changeDialogComponent({ component: '' })
      } else {
        this.changeDialogComponent({ component: 'CreateButtonsDialogs' })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.create-btn {
  position: fixed;
  bottom: 100px;
  right: 20px;
}
.rotate {
  transform: rotateY(180deg);
}
.z-index-max {
  z-index: 10000;
}
.z-index-min {
  z-index: 1;
}
</style>
