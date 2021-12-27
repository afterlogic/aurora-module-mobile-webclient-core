const fileActions = {
  copy: {
    method: () => console.log('copy'),
    name: 'copy',
    displayName: 'Copy/Move'
  },
  createShareableLink: {
    method: () => console.log('createShareableLink'),
    name: 'createShareableLink',
    displayName: 'Create shareable link'
  },
  shareWithTeammates: {
    method: () => console.log('shareWithTeammates'),
    name: 'shareWithTeammates',
    displayName: 'Share with teammates'
  },
  share: {
    method: () => console.log('share'),
    name: 'share',
    displayName: 'Share'
  },
  download: {
    method: () => console.log('download'),
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
    method: () => console.log('delete'),
    name: 'delete',
    displayName: 'Delete'
  }
}

export const getFileActions = file => {
  const actions = []
  if (file) {
    Object.keys(fileActions).forEach(key => {
      actions.push(fileActions[key])
    })
  }
  return actions
}
