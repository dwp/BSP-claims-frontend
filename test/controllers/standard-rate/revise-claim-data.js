'use strict';

require('marko/node-require').install();

const nock = require('nock');
const test = require('ava');
const {
  API_URL, API_END_POINT_CLAIMS,
  CHANGE_HISTORY_CHIB_NOT_VERIFIED
} = require('../../../src/lib/constants');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {reviseClaimData} = require('../../../src/pages/standard-rate/functions');

const claimResponse = {
  claimId: 1,
  claimantId: 1,
  nino: 'QQ123456A',
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

const unverifedRevisionRequest = {
  ...claimResponse,
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
    req.session[req.params.claimId].childBenefitClaim = unverifedRevisionRequest;
    req.session[req.params.claimId].childBenefit = {some: 'thing'};
    return {
      req,
      res: new FakeResponse(req)
    };
  };
});

test('should be a function', t => {
  t.is(typeof reviseClaimData, 'function');
});

test('should set change history message to unverified if CHIBinCBOL is false', async t => {
  const {req, res} = t.context.setup();

  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply((uri, requestBody) => {
      t.deepEqual(requestBody, unverifedRevisionRequest);
    });

  await reviseClaimData(req, res);
  t.true(mock.isDone());
});

test('should redirect to tasks-to-complete if submitted', async t => {
  const {req, res} = t.context.setup();

  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply(200);

  await reviseClaimData(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/tasks-to-complete`);
  t.true(mock.isDone());
});

test('should clear out the sessions on successful submission', async t => {
  const {req, res} = t.context.setup();

  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply(200);

  await reviseClaimData(req, res);
  t.deepEqual(undefined, req.session[req.params.claimId].childBenefitClaim);
  t.deepEqual(undefined, req.session[req.params.claimId].childBenefit);
  t.true(mock.isDone());
});
