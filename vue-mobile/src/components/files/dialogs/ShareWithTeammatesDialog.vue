<template>
  <q-dialog v-model="openDialog">
    <div class="q-dialog-size bg-white q-pt-md q-px-sm" style="min-width: 320px">
      <div style="font-size: 15px" class="q-px-md text-bold text-black text">
        <span>{{ $t('SHAREDFILES.ACTION_SHARE') }}</span>
      </div>
      <div class="q-pl-md q-mt-md flex full-width row">
        <div class="col-8">
          <q-select
            :disable="!selectOptions.length"
            model-value=""
            dense outlined v-model="currentUser"
            :options="selectOptions"
          />
        </div>
        <div class="flex col-4 justify-center items-center">
          <plus-icon style="fill: #d0d0d0" class="" @click="selectUser"/>
        </div>
      </div>
      <div style="min-height: 120px" class="flex q-ma-md users-list">
        <div v-if="!contactsList.length" class="users-list__title q-ma-md text-center full-width">No shares yet</div>
        <div v-if="contactsList.length">
          <div class="q-ma-sm flex justify-between full-width" v-for="contact in contactsList" :key="contact.value">
            <div class="q-mx-sm">{{ contact.email }}</div>
            <div class="q-mx-sm">read only</div>
          </div>
        </div>
      </div>
      <q-card-actions class="q-my-sm" align="right">
        <button-dialog :saving="saving" :action="showHistory" label="$t('SHAREDFILES.ACTION_SHOW_HISTORY')" />
        <button-dialog :saving="saving" :action="save" label="$t('COREWEBCLIENT.ACTION_SAVE')" />
        <button-dialog :saving="saving" :action="cancel" label="$t('COREWEBCLIENT.ACTION_CLOSE')" />
      </q-card-actions>
    </div>
  </q-dialog>
</template>

<script>
import ButtonDialog from "components/files/common/ButtonDialog";
import PlusIcon from "components/common/icons/PlusIcon";
import { getContactsSelectOptions } from "src/utils/contacts/utils";
import { mapActions } from "vuex";

export default {
  name: "ShareWithTeammatesDialog",
  components: {
    ButtonDialog,
    PlusIcon
  },
  created() {
    this.getContactsOptions()
  },
  props: {
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false }
  },
  data () {
    return {
      itemName: this.file.name,
      openDialog: false,
      saving: false,
      currentUser: null,
      userName: '',
      contactsList:  [],
      selectOptions: []
    }
  },
  watch: {
    dialog(val) {
      this.openDialog = val
    }
  },
  methods: {
    ...mapActions('contacts', ['asyncGetContacts']),
    selectUser() {
      this.contactsList.push(this.currentUser)
    },
    async getContactsOptions() {
      const parameters = {
        Search: "",
        Storage: "team",
        SortField: 3,
        SortOrder: 1,
        WithGroups: false,
        WithoutTeamContactsDuplicates: true
      }
      const contacts = await this.asyncGetContacts(parameters)
      const options = getContactsSelectOptions(contacts?.List)
      console.log(options, 'options')
      this.selectOptions = options
    },
    showHistory() {
      console.log('showHistory')
    },
    save() {
      console.log('save')
    },
    cancel() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style lang="scss" scoped>
.users-list {
  border: 1px solid #d0d0d0;
  border-radius: 10px;
}
.users-list__title {
  font-size: 18px;
  color: #d0d0d0;
}
</style>
