<template>
  <component :is="componentName" />
</template>

<script>
import FileIcon from 'components/files/icons/preview/FileIcon'
import FIleImageIcon from 'components/files/icons/preview/FIleImageIcon'
import FileLinkIcon from 'components/files/icons/preview/FileLinkIcon'
import FileLockIcon from 'components/files/icons/preview/FileLockIcon'
import FIleMediaIcon from 'components/files/icons/preview/FIleMediaIcon'
import FileTextIcon from 'components/files/icons/preview/FileTextIcon'

import { getPreviewIconName } from 'src/utils/files/utils'
export default {
  name: 'FileItemIcon',
  components: {
    FileIcon,
    FIleImageIcon,
    FileLinkIcon,
    FileLockIcon,
    FIleMediaIcon,
    FileTextIcon,
  },
  props: {
    fileName: { type: String, required: true },
  },
  computed: {
    componentName() {
      console.log(this.fileName, 'namenamename')
      return getPreviewIconName(this.fileName)
    },
  },
}
</script>

<style scoped></style>
