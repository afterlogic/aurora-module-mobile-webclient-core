import appApi from 'src/api'

export default {
  asyncGetContacts: async ({}, parameters) => {
    return await appApi.contacts.getContactSuggestions(parameters)
  },
}
