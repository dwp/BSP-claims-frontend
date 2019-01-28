'use strict';

const getDateString = require('./get-date-string');
const sanitiseNino = require('./strip-spaces-force-uppercase');

module.exports = formData => ({
  claimantDetails: {
    title: formData.title,
    fullName: formData.fullName,
    dateOfBirth: getDateString(formData.dateOfBirthYear, formData.dateOfBirthMonth, formData.dateOfBirthDay),
    sex: formData.sex
  },
  partnerDetails: {
    nino: sanitiseNino(formData.partnerNino),
    title: formData.partnerTitle,
    fullName: formData.partnerFullName,
    dateOfDeath: getDateString(formData.dateOfDeathYear, formData.dateOfDeathMonth, formData.dateOfDeathDay)
  },
  dateOfClaim: getDateString(formData.dateOfClaimYear, formData.dateOfClaimMonth, formData.dateOfClaimDay)
});
