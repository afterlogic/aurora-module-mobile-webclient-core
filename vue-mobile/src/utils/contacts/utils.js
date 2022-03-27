import store from 'src/store'

export const getContactsSelectOptions = (contacts, selectContacts) => {
  const filteredContacts = []
  const currentUserEmail = store.getters['core/userPublicId']
  contacts.forEach((contact) => {
    if (contact.isGroup || contact.IsGroup) {
      const index = selectContacts.findIndex( selectContact => selectContact.email === (contact.Name || contact.email))
      if (index === -1 && currentUserEmail !== (contact.Name || contact.email)) {
        filteredContacts.push({
          email: contact.Name || contact.email,
          label: contact.Name || contact.email,
          value: contact.Name || contact.email,
          isAll: contact.IsAll || contact.isAll,
          isGroup: true,
          groupId: contact.Id || contact.groupId,
          status: '',
        })
      }
    } else {
      const index = selectContacts.findIndex( selectContact => selectContact.email === (contact.ViewEmail || contact.email))
      if (index === -1 && currentUserEmail !== (contact.ViewEmail || contact.email)) {
        filteredContacts.push({
          email: contact.ViewEmail || contact.email,
          label: contact.ViewEmail || contact.email,
          value: contact.ViewEmail || contact.email,
          status: '',
        })
      }
    }
  })
  return filteredContacts
}
export const getAllContactsSelectOptions = (contacts) => {
  return contacts.map( contact => {
    if (contact?.IsGroup || contact.isGroup) {
      return {
        email: contact.Name || contact.email,
        label: contact.Name || contact.email,
        value: contact.Name || contact.email,
        isAll: contact.IsAll || contact.isAll,
        isGroup: true,
        groupId: contact.Id || contact.groupId,
        status: '',
      }
    } else  {
      return {
        email: contact.ViewEmail || contact.email,
        label: contact.ViewEmail || contact.email,
        value: contact.ViewEmail || contact.email,
        status: '',
      }
    }
  } )
}
