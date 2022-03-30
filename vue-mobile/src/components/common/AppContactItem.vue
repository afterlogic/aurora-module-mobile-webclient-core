<template>
  <div class="row" v-if="contact">
    <div class="flex column col-10 contact" style="overflow: hidden">
      <span class="contact__name">{{ contact.FullName || $t('CONTACTSWEBCLIENT.LABEL_NO_NAME') }}</span>
      <span class="contact__email q-mt-xs">{{ contact.ViewEmail }}</span>
    </div>
    <div class="flex items-center justify-end col-2">
      <key-icon  v-if="contact.HasPgpPublicKey"/>
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
.contact {
&__name {
   font-size: 14px;
   line-height: 16px;
   letter-spacing: 0.3px;
   color: #000000;
   white-space: nowrap
 }
&__email {
   font-size: 12px;
   line-height: 10px;
   color: #969494;
   white-space: nowrap
 }
}
</style>
