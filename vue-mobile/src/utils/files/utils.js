import typesUtils from "src/utils/types";

const parseFile = file => {
  return {
    loading: false,
    content: typesUtils.pString(file.Content),
    size: typesUtils.pInt(file.Size),
    file: file,
    hash: typesUtils.pString(file.Hash),
    name: typesUtils.pString(file.Name),
    type: typesUtils.pString(file.Type),
    lastModified: typesUtils.pInt(file.LastModified),
    owner: typesUtils.pString(file.Owner),
    fullPath: typesUtils.pString(file.FullPath),
    path: typesUtils.pString(file.Path),
    isFolder: typesUtils.pBool(file.IsFolder),
    shares: typesUtils.pArray(file?.ExtendedProps?.Shares),
    publicLink: typesUtils.pArray(file?.ExtendedProps?.PublicLink),
    downloadUrl: typesUtils.pString(file?.Actions?.download?.url),
    eitUrl: typesUtils.pString(file?.Actions?.edit?.url),
    viewUrl: typesUtils.pString(file?.Actions?.view?.url),
    openUrl: typesUtils.pString(file?.Actions?.open?.url),
    paranoidKey: typesUtils.pString(file?.ExtendedProps?.ParanoidKey),
    initializationVector: typesUtils.pString(file?.ExtendedProps?.InitializationVector),
    thumbnailUrl: typesUtils.pString(file?.ThumbnailUrl),
    contentType: typesUtils.pString(file.ContentType),
    cancelToken: null,
    isSelected: false,
    isCopied: false,
  }
}

export const getParseFiles = (items) => {
  const files = []
  items.forEach( file => {
    if (!file.IsFolder) {
      files.push(parseFile(file))
    }
  })
  return files
}
export const getParseFolders = (items) => {
  const folders = []
  items.forEach( file => {
    if (file.IsFolder) {
      folders.push(parseFile(file))
    }
  })
  return folders
}
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
export const getFilteredItems = (items, key) => {
  return items.filter(item => {
    if (item[key]) {
      return item
    }
  })
}
