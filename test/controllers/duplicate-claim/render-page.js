'use strict';

require('marko/node-require').install();
const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/duplicate-claim/functions');
const template = require('../../../src/pages/duplicate-claim/template.marko');

const claimResponse = {
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
  t.is(typeof renderPage, 'function');
});

test('should render duplicate-claim template', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  req.session.startNewClaim = claimResponse;

  renderPage(req, res);

  t.deepEqual(res.template, template);
});

test('should redirect to start new claim page if there is no session data', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.session.startNewClaim = undefined;

  renderPage(req, res);

  t.is(res.redirectedTo, '/start-new-claim');
});

test('should pass errors to template, if there are any', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const errors = {testResult: 'error'};
  const values = {};

  req.session.startNewClaim = claimResponse;
  req.session.continueClaim = {values, errors};

  renderPage(req, res);

  t.deepEqual(res.templateData.errors, errors);
});

test('should set values to undefined if there is no claim data in storage', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.session.continueClaim = {};

  await renderPage(req, res);

  t.deepEqual(res.templateData.values, undefined);
});
