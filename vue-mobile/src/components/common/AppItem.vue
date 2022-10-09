<template>
  <q-item
    v-bind="$attrs"
    class="unselectable list-item"
    :class="{'list-item__selected': isSelected}"
  >
  <!-- @touchstart="touchstart"
    @touchend="touchend"
    @touchmove="touchMove" -->
    <transition name="icon">
      <div class="q-mr-md flex items-center" v-if="isChoice">
        <not-selected-item-icon v-if="!isSelected" />
        <selected-item-icon v-if="isSelected"/>
      </div>
    </transition>
    <slot />
  </q-item>
</template>

<script>
import NotSelectedItemIcon from "components/common/icons/NotSelectedItemIcon";
import SelectedItemIcon from "components/common/icons/SelectedItemIcon";

export default {
  name: "AppItem",
  props: {
    item: { type: Object, required: true },
    isSelected: { type: Boolean, default: false },
    isChoice: { type: Boolean, default: false },
  },
  components: {
    NotSelectedItemIcon,
    SelectedItemIcon
  },
  methods: {
    // touchstart() {
    //   this.$emit('start')
    // },
    // touchend() {
    //   this.$emit('end')
    // },
    // touchMove() {
    //   this.$emit('move')
    // }
  }
}
</script>

<style scoped>
.icon-enter-active {
  transition: opacity 0.5s ease;
}
.icon-leave-active {
  transition: opacity 0.2s ease;
}

.icon-enter-from,
.icon-leave-to {
  opacity: 0;
}

</style>
