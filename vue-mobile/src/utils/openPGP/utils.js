import OpenPgp from 'src/modules/openpgp/OpenPgp'
import OpenPgpKey from 'src/modules/openpgp/classes/OpenPgpKey'
import addressUtils from 'src/utils/address'
import types from 'src/utils/types'

export const checkPgpKeys = async (keysArmorToImport, openPgpExternalKeys) => {
  const keysFromArmor = await OpenPgp.getArmorInfo(keysArmorToImport),
    keysBroken = [],
    keysAlreadyThere = [],
    keysPrivateExternal = [],
    keysToImport = []
  if (types.isNonEmptyArray(keysFromArmor)) {
    keysFromArmor.forEach((key) => {
      if (key) {
        let keyUsersIds = key.getUserIds(),
          keyEmail = keyUsersIds.length > 0 ? keyUsersIds[0] : '0',
          keyEmailParts = addressUtils.getEmailParts(keyEmail),
          sameUserKeys = OpenPgp.getOwnKeysByEmails(
            [keyEmailParts.email],
            key.isPublic()
          ),
          hasSameExternalKey = !!openPgpExternalKeys.find(
            (externalKey) =>
              key.isPublic() && externalKey.sEmail === keyEmailParts.email
          ),
          hasSameKey = sameUserKeys.length > 0 || hasSameExternalKey,
          noEmail = !addressUtils.isCorrectEmail(keyEmailParts.email),
          bitSize = key.primaryKey.params[0].byteLength() * 8,
          keyData = new OpenPgpKey({
            armor: key.armor(),
            email: keyEmail,
            isPublic: key.isPublic(),
            isExternal: !OpenPgp.isOwnEmail(keyEmailParts.email),
          })
        keyData.addInfo = key.isPublic()
          ? '(' + bitSize + '-bit, public)'
          : '(' + bitSize + '-bit, private)'
        keyData.checked = !hasSameKey && !noEmail

        if (noEmail) {
          keysBroken.push(keyData)
        } else if (hasSameKey) {
          keysAlreadyThere.push(keyData)
        } else if (
          !key.isPublic() &&
          !OpenPgp.isOwnEmail(keyEmailParts.email)
        ) {
          keysPrivateExternal.push(keyData)
        } else {
          keysToImport.push(keyData)
        }
      }
    })
  }

  return {
    keysBroken,
    keysAlreadyThere,
    keysPrivateExternal,
    keysToImport,
  }
}