<template>
  <q-dialog v-bind="$attrs" @escape-key="close">
    <q-card class="q-dialog-size dialog" style="min-width: 300px">
      <div class="dialog__head q-mx-sm">
        <slot name="head"/>
      </div>
      <q-card-actions class="q-mx-sm" align="right">
        <slot name="actions" />
      </q-card-actions>
      <cancel-cross-icon v-if="showCross" class="cancel-icon" @click="close"/>
    </q-card>
  </q-dialog>
</template>

<script>

import CancelCrossIcon from "components/common/icons/CancelCrossIcon";

export default {
  name: "AppDialog",
  components: {
    CancelCrossIcon
  },
  props: {
    close: { type: Function, default: () => null },
    showCross: { type: Boolean, default: () => true }
  }
}
</script>

<style lang="scss" scoped>
.cancel-icon {
  position: absolute;
  top: 16px;
  right: 16px
}
.dialog {
  &__head {
    padding-top: 36px
  }
}
</style>
