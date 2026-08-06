<template>
  <q-item clickable v-close-popup>
    <AppActionIconContainer class="q-mr-md">
      <slot />
    </AppActionIconContainer>
    <q-item-section>
      {{ actionLabel }}
    </q-item-section>
  </q-item>
</template>

<script>
import AppActionIconContainer from 'src/components/common/AppActionIconContainer'

export default {
  name: 'AppMoreActionContainer',

  components: {
    AppActionIconContainer,
  },

  props: {
    actionLabel: {
      type: String,
      default: '',
    },
  },
}
</script>
