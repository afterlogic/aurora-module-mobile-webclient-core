import { useCoreStore } from './index-pinia'
import { useContactsStore } from 'src/../../../ContactsMobileWebclient/vue-mobile/store/index-pinia.js'
import { useParanoidEncryptionStore } from 'src/../../../CoreParanoidEncryptionWebclientPlugin/vue-mobile/store/index-pinia.js'
import { useFilesStore } from 'src/../../../FilesMobileWebclient/vue-mobile/store/index-pinia.js'
import { useMailStore } from 'src/../../../MailMobileWebclient/vue-mobile/store/index-pinia.js'
import { useOpenPGPStore } from 'src/../../../OpenPgpMobileWebclient/vue-mobile/store/index-pinia.js'

export {
  useCoreStore,  
  useContactsStore,
  useParanoidEncryptionStore,
  useFilesStore,
  useMailStore,
  useOpenPGPStore,
}