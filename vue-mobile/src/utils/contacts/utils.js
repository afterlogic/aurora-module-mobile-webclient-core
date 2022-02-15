export const getContactsSelectOptions = (contacts, selectContacts) => {
  const filteredContacts = []
  contacts.forEach((contact) => {
    const index = selectContacts.findIndex( selectContact => selectContact.email === contact.ViewEmail)
      if (index === -1) {
        filteredContacts.push({
          email: contact.ViewEmail,
          label: contact.ViewEmail,
          value: contact.ViewEmail,
          status: '',
        })
      }
  })
  return filteredContacts
}
