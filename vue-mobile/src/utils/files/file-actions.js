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
    displayName: 'Create shareable link'
  },
  shareWithTeammates: {
    method: null,
    name: 'shareWithTeammates',
    displayName: 'Share with teammates'
  },
  share: {
    method: null,
    name: 'share',
    displayName: 'Share'
  },
  download: {
    method: null,
    name: 'download',
    displayName: 'Download'
  },
  rename: {
    method: null,
    name: 'rename',
    component: 'RenameItemDialog',
    displayName: 'Rename'
  },
  delete: {
    method: null,
    name: 'delete',
    component: 'DeleteItemsDialog',
    displayName: 'Delete'
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
