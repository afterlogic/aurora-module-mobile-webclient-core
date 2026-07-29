<template>
  <div>
    <q-input
      v-model="searchText"
      :style="{ height: '36px' }"
      :input-style="{ height: '36px' }"
      placeholder="Search"
      autofocus
      borderless
      outlined
      dense
      class="q-mt-lg q-mx-lg contact-search"
      debounce="400"
    />
  </div>
  <AppListLoader v-if="isWaitingContacts" />
  <div class="scroll full-width q-mt-lg" style="max-height: 400px;">
    <div v-if="!isWaitingContacts">
      <AppContactItem
        v-for="contact in contacts"
        :contact="contact"
        :key="contact.ETag"
        @click="selectContact(contact)"
        class="q-mb-md q-mx-lg"
      />
    </div>
  </div>
</template>

<script>
import AppContactItem from "components/common/AppContactItem";
import AppListLoader from "components/common/AppListLoader";
import _ from 'lodash'

export default {
  name: "AppSelectRecipient",
  components: {
    AppContactItem,
    AppListLoader,
  },
  props: {
    onGetContacts: { type: Function, required: true },
    getContactsParameters: { type: Object, required: true }
  },
  async mounted() {
    this.parameters = _.cloneDeep(this.getContactsParameters)
    this.contacts = await this.onGetContacts(this.getContactsParameters)
  },
  data: () => ({
    isWaitingContacts: false,
    parameters: null,
    searchText: '',
    contacts: []
  }),
  watch: {
    async searchText(text) {
      this.isWaitingContacts = true
      this.parameters['Search'] = text
      this.contacts = await this.onGetContacts(this.parameters)
      this.isWaitingContacts = false
    }
  },
  methods: {
    selectContact(contact) {
      this.$emit('selectContact', contact)
    }
  }
}
</script>
