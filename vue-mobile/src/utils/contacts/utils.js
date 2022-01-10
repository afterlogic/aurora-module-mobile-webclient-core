export const getContactsSelectOptions = (contacts) => {
  return contacts.map( contact => {
    return {
      email: contact.ViewEmail,
      label: contact.ViewEmail,
      value: contact.ViewEmail,
    }
  } )
}
