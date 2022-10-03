<template>
  <q-item
    v-bind="$attrs"
    @touchstart="touchstart"
    @touchend="touchend"
    @touchmove="touchMove"
    class="unselectable item"
    :class="isSelected ? 'is-selected' : ''"
  >
    <transition name="icon">
      <div class="q-ml-md flex items-center" v-if="isChoice">
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
    touchstart() {
      this.$emit('start')
    },
    touchend() {
      this.$emit('end')
    },
    touchMove() {
      this.$emit('move')
    }
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

.item {
  border-bottom: 1px solid #F6F6F6;
}
.is-selected {
  background: rgba(70, 156, 248, 0.4);
  border-bottom: 1px solid #8CA0B7;
  color: #fff;
}
.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
