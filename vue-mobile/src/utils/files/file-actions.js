const i18n = {
  '$t': {
    OPENPGPFILESWEBCLIENT: {
      "HEADING_CREATE_PUBLIC_LINK": "Create shareable link",
    },
    SHAREDFILES: {
      "ACTION_SHARE": "Share with teammates",
    },
    COREWEBCLIENT: {
      "ACTION_SHARE": "Share",
      "ACTION_DOWNLOAD_FILE": "Download",
      "ACTION_REMOVE": "Remove",
    },
    FILESWEBCLIENT: {
      "ACTION_RENAME": "Rename",
    }
  }
}

const isArchiveElement = (path) => {
  return path.split('.')[path.split('.').length - 1] === 'zip'
}

const isShowAction = (action, file, storage, path) => {
  let result = true
  if (file){
    switch (action) {
      case 'copy':
        if (storage === 'shared') result = false
        if (isArchiveElement(path)) result = false
        break
      case 'createShareableLink':
        if (storage === 'shared') result = false
        if (isArchiveElement(path)) result = false
        break
      case 'shareWithTeammates':
        if (storage === 'corporate') result = false
        if (storage === 'shared') result = false
        if (isArchiveElement(path)) result = false
        break
      case 'download':
        if (file.isFolder) result = false
        break
      case 'rename':
        if (storage === 'shared') result = false
        if (isArchiveElement(path)) result = false
        break
      case 'delete':
        if (storage === 'shared') result = false
        if (isArchiveElement(path)) result = false
        break
      default:
        break
    }
  }
  return result
}

export const fileActions = {
  copy: {
    method: async (store) => {
      const currentFile = store.getters['files/currentFile']
      await store.dispatch('files/addCopyItems', { items: [currentFile] })
    },
    name: 'copy',
    displayName: 'Copy/Move',
    icon: 'content_copy',
    isShowAction: isShowAction,
  },
  createShareableLink: {
    method: null,
    name: 'createShareableLink',
    component: 'CreateShareableLinkDialog',
    displayName: i18n.$t.OPENPGPFILESWEBCLIENT.HEADING_CREATE_PUBLIC_LINK,
    icon: 'link',
    isShowAction: isShowAction,
  },
  shareWithTeammates: {
    method: null,
    name: 'shareWithTeammates',
    component: 'ShareWithTeammatesDialog',
    displayName: i18n.$t.SHAREDFILES.ACTION_SHARE,
    icon: 'share',
    isShowAction: isShowAction,
  },
  download: {
    method: (store) => {
      const file = store.getters['files/currentFile']
      store.dispatch('files/changeItemProperty', {
        item: file,
        property: 'downloading',
        value: true
      })
      store.dispatch('files/asyncDownloadFile')
    },
    name: 'download',
    displayName: i18n.$t.COREWEBCLIENT.ACTION_DOWNLOAD_FILE,
    icon: 'download',
    isShowAction: isShowAction,
  },
  rename: {
    method: null,
    name: 'rename',
    component: 'RenameItemDialog',
    displayName: i18n.$t.FILESWEBCLIENT.ACTION_RENAME,
    icon: 'edit',
    isShowAction: isShowAction,
  },
  delete: {
    method: null,
    name: 'delete',
    component: 'DeleteItemsDialog',
    displayName: 'Delete',
    icon: 'delete',
    isShowAction: isShowAction,
  }
}

export const getFileActionsList = file => {
  const actions = []
  if (file) {
    Object.keys(fileActions).forEach(key => {
      actions.push(fileActions[key])
    })
  }
  return actions
}
