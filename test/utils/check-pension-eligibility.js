'use strict';

const test = require('ava');
const checkPensionElig = require('../../src/utils/check-pension-eligibility');

test('should be a funciton', t => {
  t.is(typeof checkPensionElig, 'function');
});

test('should return true if date of birth causes ineligible', t => {
  const claim = {
    dateOfDeathYear: '2017',
    dateOfDeathMonth: '02',
    dateOfDeathDay: '04',
    dateOfBirthYear: '1930',
    dateOfBirthMonth: '02',
    dateOfBirthDay: '04',
    sex: 'Male'};

  t.true(checkPensionElig(claim));
});

test('should return false if date of birth does not cause ineligible', t => {
  const claim = {
    dateOfDeathYear: '2017',
    dateOfDeathMonth: '02',
    dateOfDeathDay: '04',
    dateOfBirthYear: '1965',
    dateOfBirthMonth: '02',
    dateOfBirthDay: '04',
    sex: 'Male'};

  t.false(checkPensionElig(claim));
});

test('should return error if date of death cannot be a valid date', t => {
  const claim = {
    dateOfDeathYear: '2017',
    dateOfDeathMonth: '13',
    dateOfDeathDay: '04',
    dateOfBirthYear: '1965',
    dateOfBirthMonth: '02',
    dateOfBirthDay: '04',
    sex: 'Male'};

  const error = t.throws(() => {
    checkPensionElig(claim);
  }, TypeError);
  t.deepEqual(error.message, 'Date of death is invalid');
});
