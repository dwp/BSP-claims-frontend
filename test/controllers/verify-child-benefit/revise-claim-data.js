'use strict';

require('marko/node-require').install();

const nock = require('nock');
const test = require('ava');
const {
  API_URL, API_END_POINT_CLAIMS,
  CHANGE_HISTORY_CHIB_VERIFIED,
  CHANGE_HISTORY_CHIB_NOT_VERIFIED
} = require('../../../src/lib/constants');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {reviseClaimData} = require('../../../src/pages/verify-child-benefit/functions');

const testData = {
  claimId: 1,
  dependentChildren: false,
  pregnantAtDateOfDeath: false,
  childrenCHIBinCBOL: 'true',
  childrenCHIB: 'CHB12345678AA'
};

const claimResponse = {
  claimId: 1,
  claimantId: 1,
  title: 'Mr',
  fullName: 'Hammond Eggs',
  dateOfBirth: '1960-03-02',
  sex: 'Male',
  dateOfClaim: '2018-09-01',
  verificationList: [{
    category: 'marriage',
    verificationAttributeList: [
      {
        attributeName: 'verifiedByCert',
        attributeValue: 'true'
      },
      {
        attributeName: 'date',
        attributeValue: '2017-10-10'
      }
    ]
  }]
};

const revisionRequest = {
  ...claimResponse,
  verificationList: [
    ...claimResponse.verificationList,
    {
      category: 'children',
      verificationAttributeList: [
        {
          attributeName: 'CHIBinCBOL',
          attributeValue: 'true'
        },
        {
          attributeName: 'CHIB',
          attributeValue: 'CHB12345678AA'
        }
      ]
    }
  ],
  changeInfoList: [{
    agentIdentifier: 'KONG_DISABLED',
    agentName: 'Kong Disabled',
    changeDescription: CHANGE_HISTORY_CHIB_VERIFIED
  }]
};

const unverifedRevisionRequest = {
  ...revisionRequest,
  verificationList: [
    ...claimResponse.verificationList,
    {
      category: 'children',
      verificationAttributeList: [
        {
          attributeName: 'CHIBinCBOL',
          attributeValue: 'false'
        }
      ]
    }
  ],
  changeInfoList: [{
    agentIdentifier: 'KONG_DISABLED',
    agentName: 'Kong Disabled',
    changeDescription: CHANGE_HISTORY_CHIB_NOT_VERIFIED
  }]
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
  t.is(typeof reviseClaimData, 'function');
});

test('should revise claim with new verifications from res.locals', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = testData;
  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, revisionRequest)
    .reply(200);

  await reviseClaimData(req, res);
  t.true(mock.isDone());
});

test('should santise CHIB before revising claim', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {...testData, childrenCHIB: 'chb12345678aa'};
  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, revisionRequest)
    .reply(200);

  await reviseClaimData(req, res);
  t.true(mock.isDone());
});

test('should set change history message to verified if CHIBinCBOL is true', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {...testData, childrenCHIB: 'chb12345678aa'};
  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, revisionRequest)
    .reply(200);

  await reviseClaimData(req, res);
  t.true(mock.isDone());
});

test('should add data to session if childrenCHIBinCBOL is false', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {...testData, childrenCHIBinCBOL: 'false'};
  req.claim = claimResponse;

  await reviseClaimData(req, res);
  t.deepEqual(unverifedRevisionRequest, req.session[req.params.claimId].childBenefitClaim);
});

test('should redirect to tasks-to-complete if childrenCHIBinCBOL is true', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = testData;
  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply(200);

  await reviseClaimData(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/tasks-to-complete`);
  t.true(mock.isDone());
});

test('should redirect to standard-rate if childrenCHIBinCBOL is false', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {...testData, childrenCHIBinCBOL: 'false'};
  req.claim = claimResponse;

  await reviseClaimData(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/standard-rate`);
});

test('should redirect to tasks-to-complete if childrenCHIBinCBOL is false but pregnanantAtDateOfDeath is true', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {...testData, childrenCHIBinCBOL: 'false'};
  req.claim = {
    ...claimResponse,
    eligibilityCriteria: {
      dependentChildren: true,
      pregnantAtDateOfDeath: true
    }
  };

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply(200);

  await reviseClaimData(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/tasks-to-complete`);
  t.true(mock.isDone());
});
