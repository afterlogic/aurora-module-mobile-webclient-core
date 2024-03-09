<template>
  <q-toggle
    :class="`toggle ${value ? '' : 'toggle-disable'} full-width justify-between`"
    v-bind="$attrs"
    color="primary"
    :false-value="false"
    :true-value="true"
    :label="label"
    left-label
    keep-color
  />
</template>

<script>
export default {
  name: "AppToggle",
  props: {
    label: { type: String, default: '' },
    value: { type: Boolean, default: false }
  }
}
</script>

<style>
.toggle .q-toggle__track {
  height: 24px;
  width: 48px;
  border-radius: 13px;
  opacity: 1 !important;
  position: absolute;
  top: 8px;
}
.toggle .q-toggle__inner--truthy .q-toggle__thumb {
  left: 26px;
}
.toggle .q-toggle__thumb {
  top: 10px;
  left: 2px;
  width: 20px;
  height: 20px;
}
.q-toggle__inner--truthy .q-toggle__thumb:after {
  background-color: #fff;
}
.toggle .q-toggle__inner {
  padding: 0 !important;
}


.toggle-disable .q-toggle__track {
  height: 24px;
  width: 48px;
  border-radius: 13px;
  border: 2px solid #469CF8;
  background: rgba(70, 156, 248, 0.2);
  opacity: 1 !important;
  position: absolute;
  top: 8px;
}
.toggle-disable .q-toggle__thumb:after {
  border: 2px solid;
  box-shadow: none !important;
}
.toggle-disable .q-toggle__thumb {
  top: 8px;
  left: 0;
  width: 24px;
  height: 24px;
}

</style>
