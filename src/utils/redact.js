'use strict';

const redactNino = /()[a-zA-Z]{2}[\d]{6}[a-zA-Z]+/g;
const redactSortCode = /(sortCode[\\":]+)[\d-]+/g;
const redactAccountNumber = /(accountNumber[\\":]+)[\d]+/g;
const redactRollNumber = /(rollNumber[\\":]+)[\d]+/g;
const redactDateOfBirth = /(dateOfBirth[\\":]+)[\d-]+/g;
const redactDateOfDeath = /(dateOfDeath[\\":]+)[\d-]+/g;
const redactAllAtributes = /(attributeValue[\\":]+)[\d-]+/g;
const redactCHB = /()CHB[\d]{8}[a-zA-Z]{2}/g;
const redactString = '$1REDACTED';
const {VERBOSE_LOGGING} = require('../lib/constants');

module.exports = function (body) {
  if (VERBOSE_LOGGING) {
    return body;
  }

  return JSON.stringify(body)
    .replace(redactNino, redactString)
    .replace(redactSortCode, redactString)
    .replace(redactAccountNumber, redactString)
    .replace(redactRollNumber, redactString)
    .replace(redactCHB, redactString)
    .replace(redactDateOfDeath, redactString)
    .replace(redactAllAtributes, redactString)
    .replace(redactDateOfBirth, redactString);
};
