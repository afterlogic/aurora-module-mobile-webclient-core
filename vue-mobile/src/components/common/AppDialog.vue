<template>
  <q-dialog full-hight v-bind="$attrs" @escape-key="close" persistent @shake="shake">
    <q-card class="dialog card-radius" :style="{ minWidth: width }">
      <div class="dialog__title dialog__title-text q-mx-lg">
        <slot name="title"/>
      </div>
      <div class="scroll dialog__content">
        <slot name="content"/>
      </div>
      <q-card-actions :align="alignActions">
        <slot name="actions" />
      </q-card-actions>
      <CancelCrossIcon v-if="showCross" class="cancel-icon" @click="close"/>
      <slot name="dialogs"/>
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
    showCross: { type: Boolean, default: () => true },
    width: { type: String, default: '300px' },
    alignActions: { type: String, default: 'right' },
    headMaxHeight: {type: String, default: '60vh' }
  },
  methods: {
    shake() {
      this.close()
    }
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
  display: flex;
  flex-direction: column;
  &__title {
    padding-top: 36px;
  }
}
.card-radius {
  border-radius: 10px;
}
</style>
