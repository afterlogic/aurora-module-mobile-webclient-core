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

export const fileActions = {
  copy: {
    method: async (store) => {
      const currentFile = store.getters['files/currentFile']
      await store.dispatch('files/addCopyItems', { items: [currentFile] })
    },
    name: 'copy',
    displayName: 'Copy/Move'
  },
  createShareableLink: {
    method: null,
    name: 'createShareableLink',
    component: 'CreateShareableLinkDialog',
    displayName: i18n.$t.OPENPGPFILESWEBCLIENT.HEADING_CREATE_PUBLIC_LINK
  },
  shareWithTeammates: {
    method: null,
    name: 'shareWithTeammates',
    component: 'ShareWithTeammatesDialog',
    displayName: i18n.$t.SHAREDFILES.ACTION_SHARE
  },
  share: {
    method: null,
    name: 'share',
    displayName: i18n.$t.COREWEBCLIENT.ACTION_SHARE
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
    displayName: i18n.$t.COREWEBCLIENT.ACTION_DOWNLOAD_FILE
  },
  rename: {
    method: null,
    name: 'rename',
    component: 'RenameItemDialog',
    displayName: i18n.$t.FILESWEBCLIENT.ACTION_RENAME
  },
  delete: {
    method: null,
    name: 'delete',
    component: 'DeleteItemsDialog',
    displayName: i18n.$t.COREWEBCLIENT.ACTION_REMOVE
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
