'use strict';

const {getStatePensionDate} = require('get-uk-state-pension-date');
const getValidDate = require('./get-valid-date');
const getDateString = require('./get-date-string');

module.exports = claim => {
  const dateOfDeath = getValidDate(claim.dateOfDeathYear, claim.dateOfDeathMonth, claim.dateOfDeathDay);

  if (isNaN(dateOfDeath)) {
    throw new TypeError('Date of death is invalid');
  }

  const statePensionDate = getStatePensionDate(getDateString(claim.dateOfBirthYear, claim.dateOfBirthMonth, claim.dateOfBirthDay), claim.sex);

  return (statePensionDate && statePensionDate <= dateOfDeath);
};
