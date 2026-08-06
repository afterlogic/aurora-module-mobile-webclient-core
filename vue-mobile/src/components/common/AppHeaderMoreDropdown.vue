<template>
  <div class="dropdown-more">
    <q-btn-dropdown
      v-bind="$attrs"
      :menu-offset="menuOffset"
      flat
      unelevated
      dense
    >
      <template v-slot:label>
        <slot name="label" />
      </template>
      <slot />
    </q-btn-dropdown>
  </div>
</template>

<script>
export default {
  name: 'AppHeaderMoreDropdown',

  inheritAttrs: false,

  props: {
    menuOffset: {
      type: Array,
      default: () => [8, -45],
    },
  },
}
</script>
