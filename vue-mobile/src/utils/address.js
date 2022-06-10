import _ from 'lodash'

function isCorrectEmail (value = '') {
  return !!value.match(/^[A-Z0-9\"!#\$%\^\{\}`~&'\+\-=_\.]+@[A-Z0-9\.\-]+$/i)
}

function getFullEmail (name = '', email = '') {
  let fullEmail = email

  if (name.length > 0) {
    if (email.length > 0) {
      if (isCorrectEmail(name) || name.indexOf(',') !== -1) {
        fullEmail = `"${name}" <${email}>`
      } else {
        fullEmail = `${name} <${email}>`
      }
    } else {
      fullEmail = name
    }
  }

  return fullEmail
}

function getFullEmailsFromMailsoAddresses(...mailsoAddressesList) {
  let fullEmails = []
  mailsoAddressesList.forEach(mailsoAddress => {
    if (Array.isArray(mailsoAddress && mailsoAddress['@Collection'])) {
      fullEmails = fullEmails.concat(mailsoAddress['@Collection'].map(addressData => getFullEmail(addressData.DisplayName, addressData.Email)))
    }
  })
  return fullEmails
}

function getDisplayNamesFromMailsoAddresses(...mailsoAddressesList) {
  let fullEmails = []
  mailsoAddressesList.forEach(mailsoAddress => {
    if (Array.isArray(mailsoAddress && mailsoAddress['@Collection'])) {
      fullEmails = fullEmails.concat(mailsoAddress['@Collection'].map(addressData => {
        return addressData.DisplayName ? addressData.DisplayName : addressData.Email
      }))
    }
  })
  return fullEmails
}

let addressUtils = {
  /**
   * Obtains Recipient-object which include "name", "email" and "full" fields from string.
   * @param {string} sFullEmail String includes only name, only email or both name and email.
   * @param {boolean} bIgnoreQuotesInName
   * @return {Object}
   */
  getEmailParts: function (sFullEmail, bIgnoreQuotesInName) {
    let iQuote1Pos = sFullEmail.indexOf('"'),
      iQuote2Pos = sFullEmail.indexOf('"', iQuote1Pos + 1),
      iLeftBrocketPos = sFullEmail.indexOf('<', iQuote2Pos),
      iPrevLeftBroketPos = -1,
      iRightBrocketPos = -1,
      sName = '',
      sEmail = ''

    while (iLeftBrocketPos !== -1) {
      iPrevLeftBroketPos = iLeftBrocketPos
      iLeftBrocketPos = sFullEmail.indexOf('<', iLeftBrocketPos + 1)
    }

    iLeftBrocketPos = iPrevLeftBroketPos
    iRightBrocketPos = sFullEmail.indexOf('>', iLeftBrocketPos + 1)

    if (iLeftBrocketPos === -1) {
      sEmail = _.trim(sFullEmail)
    } else {
      iQuote1Pos = bIgnoreQuotesInName ? -1 : iQuote1Pos
      sName =
        iQuote1Pos === -1
          ? _.trim(sFullEmail.substring(0, iLeftBrocketPos))
          : _.trim(sFullEmail.substring(iQuote1Pos + 1, iQuote2Pos))

      sEmail = _.trim(
        sFullEmail.substring(iLeftBrocketPos + 1, iRightBrocketPos)
      )
    }

    return {
      name: sName,
      email: sEmail,
      full: getFullEmail(sName, sEmail),
    }
  },

  /**
   * @param {string} sAddresses
   * @return {Array}
   */
  getIncorrectEmailsFromAddressString: function (sAddresses) {
    let aEmails = sAddresses
        .replace(/"[^"]*"/g, '')
        .replace(/;/g, ',')
        .split(','),
      aIncorrectEmails = [],
      iIndex = 0,
      iLen = aEmails.length,
      sFullEmail = '',
      oEmailParts = null

    for (; iIndex < iLen; iIndex++) {
      sFullEmail = _.trim(aEmails[iIndex])
      if (sFullEmail.length > 0) {
        oEmailParts = addressUtils.getEmailParts(_.trim(aEmails[iIndex]))
        if (!isCorrectEmail(oEmailParts.email)) {
          aIncorrectEmails.push(oEmailParts.email)
        }
      }
    }

    return aIncorrectEmails
  },

  isCorrectEmail,
  getFullEmail,
  getDisplayNamesFromMailsoAddresses,
  getFullEmailsFromMailsoAddresses,
}

export default addressUtils
