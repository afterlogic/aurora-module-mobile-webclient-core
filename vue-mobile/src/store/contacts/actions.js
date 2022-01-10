import AppApi from "src/api";

export default {
  asyncGetContacts: async ({}, parameters) => {
    return await AppApi.Contacts.getContactSuggestions(parameters)
  },
}
