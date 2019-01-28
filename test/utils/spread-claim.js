'use strict';

const test = require('ava');
const spreadClaim = require('../../src/utils/spread-claim');

const claim = {
  created: '2018-10-24T15:33:31.274Z',
  claimId: 17,
  claimantId: 20,
  nino: 'AA676767A',
  dateOfClaim: '2018-02-02',
  claimantDetails: {
    title: 'Mr',
    fullName: 'John',
    dateOfBirth: '2018-02-02',
    sex: 'Female'
  },
  partnerDetails: {
    title: 'Mr',
    fullName: 'John',
    nino: 'AA767676A',
    dateOfDeath: '2018-02-02'
  },
  paymentAccount: {
    accountType: 'UKBank',
    nameOnAccount: 'John',
    sortCode: '123456',
    accountNumber: '12345678',
    rollNumber: null
  },
  eligibilityCriteria: {
    marriedAtDateOfDeath: true,
    dependentChildren: true,
    pregnantAtDateOfDeath: false,
    sufficientNIContributions: true
  },
  changeInfoList: [],
  verificationList: [],
  decision: {
    allow: true,
    decisionCriteriaList: []
  },
  schedule: null
};
const spreadedClaim = {
  values: {
    dateOfBirthDay: '02',
    dateOfBirthMonth: '02',
    dateOfBirthYear: '2018',
    dateOfClaimDay: '02',
    dateOfClaimMonth: '02',
    dateOfClaimYear: '2018',
    dateOfDeathDay: '02',
    dateOfDeathMonth: '02',
    dateOfDeathYear: '2018',
    fullName: 'John',
    nino: 'AA676767A',
    partnerFullName: 'John',
    partnerNino: 'AA767676A',
    partnerTitle: 'Mr',
    sex: 'Female',
    title: 'Mr'
  }
};
test('should export a function', t => {
  t.is(typeof spreadClaim, 'function');
});

test('should return a spread object', t => {
  const output = spreadClaim(claim);
  t.deepEqual(output, spreadedClaim);
  t.is(typeof output, 'object');
});
