import store from 'src/store'

export const getContactsSelectOptions = (contacts, selectContacts) => {
  const filteredContacts = []
  const currentUserEmail = store.getters['core/userPublicId']
  contacts.forEach((contact) => {
    const index = selectContacts.findIndex( selectContact => selectContact.email === (contact.ViewEmail || contact.email))
      if (index === -1 && currentUserEmail !== (contact.ViewEmail || contact.email)) {
        filteredContacts.push({
          email: contact.ViewEmail || contact.email,
          label: contact.ViewEmail || contact.email,
          value: contact.ViewEmail || contact.email,
          status: '',
        })
      }
  })
  return filteredContacts
}
export const getAllContactsSelectOptions = (contacts) => {
  return contacts.map( contact => {
    return {
      email: contact.ViewEmail || contact.email,
      label: contact.ViewEmail || contact.email,
      value: contact.ViewEmail || contact.email,
      status: '',
    }
  } )
}
