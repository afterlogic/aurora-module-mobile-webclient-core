<template>
  <div class="q-gutter-y-md q-px-lg full-height flex column login-page">
    <FolderBlurredIcon class="absolute login-page__back-icon" />
    <div class="full-width text-weight-medium login-page__text">
      <FolderFilledIcon />
      <p class="q-mt-lg login-page__text__heading">
        {{ heading }}
      </p>
      <p class="q-mt-lg text-grey-5 text-uppercase">
        {{ subheading }}
      </p>
    </div>
    <div class="content-between full-width full-height flex column justify-between">
      <slot />
    </div>
  </div>
</template>

<script>
import FolderFilledIcon from 'components/common/icons/login/FolderFilledIcon'
import FolderBlurredIcon from 'components/common/icons/login/FolderBlurredIcon'

import settings from '../settings'

export default {
  name: 'LoginLayout',

  props: {
    subheading: {
      type: String,
      default: '',
    },
  },

  components: {
    FolderFilledIcon,
    FolderBlurredIcon,
  },

  computed: {
    heading() {
      return settings.getSetting('siteName')
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  flex-wrap: inherit;

  &__back-icon {
    margin-left: -1.5rem;
  }
  &__text {
    margin-top: 5.375rem;

    &__heading {
      font-size: 2.25rem;
      line-height: 1.5rem;
    }
  }
}
</style>
