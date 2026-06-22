import { defineBoot } from '#q-app/wrappers'

import FolderFilledIcon from 'src/components/common/icons/login/FolderFilledIcon'
import FolderBlurredIcon from 'src/components/common/icons/login/FolderBlurredIcon'

export default defineBoot(({ app }) => {
  app.component('FolderFilledIcon', FolderFilledIcon)
  app.component('FolderBlurredIcon', FolderBlurredIcon)
})
