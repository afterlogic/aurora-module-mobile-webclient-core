<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 295 299"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="147.5" cy="149.5" r="147.5" fill="#469CF8" fill-opacity="0.06" />
  </svg>
</template>

<script>
export default {
  name: 'BlurredCircleIcon',
  props: {
    width: { type: Number, default: 350 },
    height: { type: Number, default: 350 },
  },
}
</script>
