<template>
  <div class="q-gutter-y-md q-px-lg full-height flex column login-page">
    <BlurredCircleIcon class="absolute no-pointer-events login-page__back-icon" />
    <div class="full-width text-weight-medium login-page__text">
      <img v-if="logoUrl" :src="logoUrl" class="login-page__logo" alt="" />
      <div v-else class="login-page__default-logo flex flex-center">
        <img :src="atIcon" class="login-page__default-logo__glyph" alt="" />
      </div>
      <p class="q-mt-lg ellipsis-3-lines login-page__text__heading">
        {{ heading }}
      </p>
      <p v-if="subheading" class="q-mt-lg text-grey-5 text-uppercase text-center">
        {{ subheading }}
      </p>
    </div>
    <div class="content-between login-content full-width flex column justify-between">
      <slot />
    </div>
  </div>
</template>

<script>
import BlurredCircleIcon from 'components/common/icons/login/BlurredCircleIcon'

import atIcon from 'src/assets/login-logo-at.svg'
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
    BlurredCircleIcon,
  },

  data() {
    return {
      atIcon,
    }
  },

  computed: {
    // Mobile login logo, falling back to the desktop login logo when it is not set.
    // When neither is set the default @ logo is shown.
    logoUrl() {
      return settings.getSetting('brandingMobileLoginLogo') ||
        settings.getSetting('brandingLoginLogo') || ''
    },
    heading() {
      return settings.getSetting('brandingProductName') || settings.getSetting('siteName')
    }
  }
}
</script>

<style lang="scss" scoped>
// Fill the space under the header for short forms (so `justify-between` keeps the
// button at the bottom), but grow past it for tall ones and let the page scroll.
.login-content {
  flex: 1 1 auto;
  flex-wrap: nowrap;
}
.login-page {
  // html/body have overflow:hidden, so the login screen itself is the scroll
  // container: the whole page (header + form) scrolls when a step — e.g. the
  // mandatory 2FA setup — is taller than the viewport. The post-login app uses
  // MainLayout, not this one, so it keeps its inner-only scrolling.
  overflow-y: auto;
  // `flex-wrap: nowrap` undoes Quasar's `.flex` default; with wrap, tall content
  // spills into a second column instead of extending the page.
  flex-wrap: nowrap;

  &__back-icon {
    margin-left: -5.5rem;
    margin-top: -2rem;
  }
  &__logo {
    max-width: 4.75rem;
    max-height: 4.75rem;
    object-fit: contain;
  }
  &__default-logo {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #469cf8;
    box-shadow: 0px 4px 10px 0px #1c85e766;

    &__glyph {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }
  }
  &__text {
    margin-top: 5.375rem;

    &__heading {
      font-size: 2.25rem;
      line-height: 1;
    }
  }
}
</style>
