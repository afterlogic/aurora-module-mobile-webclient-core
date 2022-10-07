<template>
  <!-- <div class="app-create-button" @click="showDialog" :class="{'rotate': rotate}"> -->
  <div class="app-create-button" :class="{'rotate': rotate}">
    <slot>
      <plus-icon color="#fff" />
    </slot>
  </div>
</template>

<script>
// import PlusBtnIcon from 'components/common/icons/PlusBtnIcon'
import PlusIcon from 'components/common/icons/Plus1Icon'

export default {
  name: 'AppCreateButton',
  components: {
    PlusIcon,
  },
  props: {
    classes: { type: String, default: 'z-index-min' },
    // showDialog: { type: Function, default: () => null },
    rotate: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss" scoped>
  
.app-create-button {
  position: fixed;
  bottom: 76px;
  right: 16px;
  transition-duration: 300ms;
  background-color: #469CF8;
  box-shadow: 0 0 10px #469CF8;
  border-radius: 100px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.rotate {
  transform: rotate(225deg);
  z-index: 10000;
  box-shadow: 0 0 14px darken(#469CF8, 10%);
}
</style>
