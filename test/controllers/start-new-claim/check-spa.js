'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {checkSPA} = require('../../../src/pages/start-new-claim/functions');

const next = () => {};
const testData = {
  title: 'Mr',
  fullName: 'Hammond Eggs',
  nino: 'AA123123A',
  dateOfBirthDay: '11',
  dateOfBirthMonth: '11',
  dateOfBirthYear: '1985',
  sex: 'Male',
  dateOfClaimDay: '12',
  dateOfClaimMonth: '12',
  dateOfClaimYear: '2017',
  dateOfDeathDay: '12',
  dateOfDeathMonth: '12',
  dateOfDeathYear: '2017',
  partnerNino: 'AA111111A',
  partnerTitle: 'Mr',
  partnerFullName: 'Bacon N. Eggs'
};

test.beforeEach(t => {
  t.context.setup = () => {
    const req = new FakeRequest();
    req.params.claimId = 1;
    req.session[req.params.claimId] = req.session[req.params.claimId] || {};
    return {
      req,
      res: new FakeResponse(req)
    };
  };
});

test('should be a function', t => {
  t.is(typeof checkSPA, 'function');
});

test('should call next middleware if there are no validation errors', t => {
  const {req, res} = t.context.setup();

  res.locals = {values: testData};
  checkSPA(req, res, () => t.pass());
});

test('should redirect to disallow claim if over State pension age', t => {
  const {req, res} = t.context.setup();

  res.locals = {values: {...testData, dateOfBirthYear: '1930'}};
  checkSPA(req, res, next);
  t.deepEqual(res.redirectedTo, '/claim/disallow-claim-state-pension-age');
});

test('should store claim in session if over State pension age', t => {
  const {req, res} = t.context.setup();

  res.locals = {values: {...testData, dateOfBirthYear: '1930'}};
  checkSPA(req, res, next);
  t.deepEqual(req.session.startNewClaim.values, res.locals.values);
});
