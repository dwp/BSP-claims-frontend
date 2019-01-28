'use strict';

require('marko/node-require').install();
const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {redirect} = require('../../../src/pages/duplicate-claim/functions');

const testData = {
  continueClaim: 'true'
};
const claimData = {
  created: '2018-10-15T15:53:25.718Z',
  claimId: 77,
  claimantId: 93,
  nino: 'AA123456A',
  dateOfClaim: '2018-02-02',
  claimantDetails: {
    title: 'Mr',
    fullName: 'John Son',
    dateOfBirth: '2018-02-02',
    sex: 'Female'},
  partnerDetails: {
    title: 'Mr',
    fullName: 'John',
    nino: 'AA234567A',
    dateOfDeath: '2018-02-02'},
  paymentAccount: null,
  eligibilityCriteria: null,
  changeInfoList: [
    {
      created: '2018-10-15T15:53:25.726Z',
      changeDescription: 'ClaimantDetailsEntered',
      agentName: 'Kong Disabled',
      agentIdentifier: 'KONG_DISABLED'
    }
  ],
  verificationList: null,
  decision: null,
  schedule: null,
  statusCode: 409
};

test('should be a function', t => {
  t.is(typeof redirect, 'function');
});

test('should redirect to tasks to complete when yes is selected', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  res.locals.values = {...testData};
  req.session.duplicateClaim = claimData;

  await redirect(req, res);
  t.is(res.redirectedTo, '/claim/77/tasks-to-complete');
});

test('should redirect back to start-new-claim if no is answered', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  res.locals.values = {continueClaim: 'false'};
  req.session.duplicateClaim = claimData;

  await redirect(req, res);
  t.is(res.redirectedTo, '/start-new-claim');
});
