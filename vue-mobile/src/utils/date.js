import moment from 'moment'

// import coreSettings from 'src/modules/core/settings.js'

function _getDateFormatForMoment(sDateFormat) {
  let sMomentDateFormat = 'MM/DD/YYYY'

  switch (sDateFormat) {
    case 'MM/DD/YYYY':
      sMomentDateFormat = 'MM/DD/YYYY'
      break
    case 'DD/MM/YYYY':
      sMomentDateFormat = 'DD/MM/YYYY'
      break
    case 'DD Month YYYY':
      sMomentDateFormat = 'DD MMMM YYYY'
      break
  }

  return sMomentDateFormat
}

function _getTimeFormat() {
  //return (coreSettings.iTimeFormat === 0) ? 'HH:mm' : 'hh:mm A'
  return 'hh:mm A'
}

export default {
  getShortDate: function (iTimeStampInUTC, bTime) {
    let sResult = '',
      oMoment = moment(iTimeStampInUTC * 1000),
      oMomentNow = null

    if (oMoment) {
      oMomentNow = moment()

      if (oMomentNow.format('L') === oMoment.format('L')) {
        sResult = oMoment.format(_getTimeFormat())
        bTime = true
      } else {
        if (
          oMomentNow.clone().subtract(1, 'days').format('L') ===
          oMoment.format('L')
        ) {
          sResult = 'Yesterday'
          bTime = true
        } else {
          // if (coreSettings.bUserSelectsDateFormat) {
          //   sResult = oMoment.format(_getDateFormatForMoment(coreSettings.sDateFormat))
          // } else {
          if (oMomentNow.year() === oMoment.year()) {
            sResult = oMoment.format('MMM D')
          } else {
            sResult = oMoment.format('MMM D, YYYY')
          }
          // }
        }

        if (!!bTime) {
          sResult += ', ' + oMoment.format(_getTimeFormat())
        }
      }
    }

    return sResult
  },

  /**
   * @return {string}
   */
  getDate: function (iTimeStampInUTC) {
    let oMoment = moment(iTimeStampInUTC * 1000),
      sFormat = 'ddd, MMM D, YYYY'

    // if (coreSettings.bUserSelectsDateFormat) {
    //   sFormat = 'ddd, ' + _getDateFormatForMoment(coreSettings.sDateFormat)
    // }

    return oMoment.format(sFormat)
  },

  /**
   * @return {string}
   */
  getTime: function (iTimeStampInUTC) {
    let oMoment = moment(iTimeStampInUTC * 1000)
    return oMoment.format(_getTimeFormat())
  },

  /**
   * @return {string}
   */
  getFullDate: function (iTimeStampInUTC) {
    return this.getDate(iTimeStampInUTC) + ' ' + this.getTime(iTimeStampInUTC)
  },
}
