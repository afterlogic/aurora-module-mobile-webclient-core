export const getFiles = (items) => {
  const files = []
  items.forEach( file => {
    if (!file.IsFolder) {
      files.push(file)
    }
  })
  return files
}
export const getFolders = (items) => {
  const folders = []
  items.forEach( file => {
    if (file.IsFolder) {
      folders.push(file)
    }
  })
  return folders
}
export const getShortName = (name, length) => {
    if (name.length > length) {
      return name.substr(0, length - 2)
    }
    return name
}
