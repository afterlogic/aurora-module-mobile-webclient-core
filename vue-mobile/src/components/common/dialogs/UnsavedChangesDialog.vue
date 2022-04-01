<template>
  <app-dialog v-model="confirm" :close="cancel">
    <template v-slot:content>
      <div class="dialog__title-text q-mx-lg q-my-md">
        <span>{{ $t('COREWEBCLIENT.CONFIRM_DISCARD_CHANGES') }}</span>
      </div>
    </template>

    <template v-slot:actions>
      <button-dialog
        :action="discard"
        label="Discard"
      />
    </template>
  </app-dialog>
</template>

<script>
import _ from 'lodash'
import AppDialog from "components/common/AppDialog";
import ButtonDialog from "components/common/ButtonDialog";

export default {
  name: 'UnsavedChangesDialog',
  components: { AppDialog, ButtonDialog },
  data () {
    return {
      confirm: false,
      next: null,
    }
  },

  methods: {
    openConfirmDiscardChangesDialog: async function (next) {
      this.next = next
      this.confirm = true
    },

    discard () {
      // proceed with new screen, current changes will be lost
      if (_.isFunction(this.next)) {
        this.next()
      }
      this.confirm = false
    },

    cancel () {
      // stay put, changes need to be cared of
      this.confirm = false
    },
  },
}
</script>

<style scoped>

</style>
