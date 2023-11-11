<template>
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8H0" :stroke="color" stroke-width="2"/>
    <path d="M8 0L8 16" :stroke="color" stroke-width="2"/>
  </svg>
</template>

<script>
export default {
  name: 'PlusIcon',
  props: {
    color: { type: String, default: '#000' }
  },
}
</script>
