<template>
  <div class="flex justify-between no-wrap app-contact-item" v-if="contact">
    <div class="contact app-contact-item__info">
      <div class="app-contact-item__name-row">
        <span class="contact__name">{{ contact.FullName || $t('CONTACTSWEBCLIENT.LABEL_NO_NAME') }}</span>
      </div>
      <div>
        <span class="contact__email q-mt-xs">{{ contact.ViewEmail }}</span>
      </div>
    </div>
    <div class="app-contact-item__key flex items-center justify-end">
      <KeyIcon v-if="contact.HasPgpPublicKey"/>
    </div>
  </div>
</template>

<script>
import KeyIcon from "components/common/icons/KeyIcon";

export default {
  name: "AppContactItem",
  props: {
    contact: { type: Object, default: null }
  },
  components: {
    KeyIcon
  }
}
</script>

<style lang="scss" scoped>
.app-contact-item {
  min-width: 0;

  &__info {
    min-width: 0;
    flex: 1 1 auto;
    overflow: hidden;
  }

  &__name-row {
    min-width: 0;
    overflow: hidden;
  }

  &__key {
    flex-shrink: 0;
    margin-left: 8px;
  }
}

.contact {
  &__name {
    display: block;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.3px;
    color: #000000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__email {
    display: block;
    font-size: 12px;
    line-height: 10px;
    color: #969494;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
