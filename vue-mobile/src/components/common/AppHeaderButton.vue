<template>
  <q-btn
    v-bind="$attrs"
    :class="buttonClass"
    :icon="showIconProp ? icon : undefined"
    :label="isIconVariant ? undefined : label"
    :color="buttonColor"
    flat
    :round="isIconVariant"
    dense
    :no-caps="!isIconVariant"
    :size="buttonSize"
    :loading="loading"
    :disable="disable"
  >
    <slot />
  </q-btn>
</template>

<script>
export default {
  name: 'AppHeaderButton',

  inheritAttrs: false,

  props: {
    variant: {
      type: String,
      default: 'icon',
      validator: (value) => ['icon', 'text'].includes(value),
    },
    icon: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isIconVariant() {
      return this.variant === 'icon'
    },

    showIconProp() {
      return this.isIconVariant && this.icon && !this.$slots.default
    },

    buttonColor() {
      if (this.color) {
        return this.color
      }

      return this.isIconVariant ? 'black' : 'primary'
    },

    buttonSize() {
      if (this.size) {
        return this.size
      }

      return this.isIconVariant ? undefined : '14px'
    },

    buttonClass() {
      return this.isIconVariant
        ? 'app-header-button app-header-button--icon'
        : 'app-header-button app-header-button--text'
    },
  },
}
</script>

<style lang="scss" scoped>
.app-header-button--text {
  font-size: 14px;
  font-weight: 500;
  min-height: 28px;
  padding: 0 4px;
}
</style>
