<template>
  <q-dialog v-bind="$attrs" @escape-key="cancelDialog">
    <q-card class="q-dialog-size dialog" style="min-width: 300px">
      <div class="dialog__head">
        <slot name="head"/>
      </div>
      <q-card-actions align="right">
        <slot name="actions" />
      </q-card-actions>
      <cancel-cross-icon v-if="showCross" class="cancel-icon" @click="cancelDialog"/>
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
    cancelDialog: { type: Function, default: () => null },
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
