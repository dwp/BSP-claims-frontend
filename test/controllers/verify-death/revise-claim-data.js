'use strict';

require('marko/node-require').install();

const nock = require('nock');
const test = require('ava');
const {
  API_URL, API_END_POINT_CLAIMS,
  CHANGE_HISTORY_DEATH_VERIFIED
} = require('../../../src/lib/constants');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {reviseClaimData} = require('../../../src/pages/verify-death/functions');

const testData = {
  seenEvidence: 'true',
  deathVerifiedByCert: 'true',
  deathVerifiedInCIS: 'true',
  deathVerifiedInNIRS: 'true',
  deathDateDay: '23',
  deathDateMonth: '03',
  deathDateYear: '1985'
};

const claimResponse = {
  claimId: 1,
  claimantId: 1,
  title: 'Mr',
  fullName: 'Hammond Eggs',
  dateOfBirth: '1960-03-02',
  sex: 'Male',
  dateOfClaim: '2018-09-01',
  dependentChildren: true
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

test('should save data into the session if seenEvidence is false', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {...testData, seenEvidence: 'false'};

  req.claim = {
    ...claimResponse,
    verificationList: [
      {
        category: 'death',
        verificationAttributeList: [
          {
            attributeName: 'verifiedByCert',
            attributeValue: 'true'
          },
          {
            attributeName: 'verifiedInCIS',
            attributeValue: 'true'
          }
        ]
      }
    ]
  };

  await reviseClaimData(req, res);
  t.deepEqual(req.session[1].deathVerification, {
    ...claimResponse,
    verificationList: []
  });
});

test('should redirect to wait-for-evidence page if seenEvidence is false', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {...testData, seenEvidence: 'false'};
  req.claim = claimResponse;

  await reviseClaimData(req, res);
  t.deepEqual(res.redirectedTo, `/claim/${req.params.claimId}/verify-death/wait-for-evidence`);
});

test('should revise claim with data from res.locals.values if seenEvidence is true', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = testData;
  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, {
      ...claimResponse,
      verificationList: [{
        category: 'death',
        verificationAttributeList: [
          {
            attributeName: 'verifiedByCert',
            attributeValue: testData.deathVerifiedByCert
          },
          {
            attributeName: 'verifiedInCIS',
            attributeValue: testData.deathVerifiedInCIS
          },
          {
            attributeName: 'verifiedInNIRS',
            attributeValue: testData.deathVerifiedInNIRS
          },
          {
            attributeName: 'date',
            attributeValue: `${testData.deathDateYear}-${testData.deathDateMonth}-${testData.deathDateDay}`
          }
        ]
      }],
      changeInfoList: [{
        agentIdentifier: 'KONG_DISABLED',
        agentName: 'Kong Disabled',
        changeDescription: CHANGE_HISTORY_DEATH_VERIFIED
      }]
    })
    .reply(200);

  await reviseClaimData(req, res);
  t.true(mock.isDone());
});

test('should not set evidences in verificationList if they are undefined', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {
    ...testData,
    deathVerifiedInCIS: undefined,
    deathVerifiedInNIRS: undefined
  };
  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, {
      ...claimResponse,
      changeInfoList: [{
        agentIdentifier: 'KONG_DISABLED',
        agentName: 'Kong Disabled',
        changeDescription: CHANGE_HISTORY_DEATH_VERIFIED
      }],
      verificationList: [{
        category: 'death',
        verificationAttributeList: [
          {
            attributeName: 'verifiedByCert',
            attributeValue: 'true'
          },
          {
            attributeName: 'date',
            attributeValue: '1985-03-23'
          }
        ]
      }]
    })
    .reply(200);

  await reviseClaimData(req, res);
  t.true(mock.isDone());
});

test('should redirect to tasks-to-complete if seenEvidence is true', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = testData;
  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, {
      ...claimResponse,
      verificationList: [{
        category: 'death',
        verificationAttributeList: [
          {
            attributeName: 'verifiedByCert',
            attributeValue: testData.deathVerifiedByCert
          },
          {
            attributeName: 'verifiedInCIS',
            attributeValue: testData.deathVerifiedInCIS
          },
          {
            attributeName: 'verifiedInNIRS',
            attributeValue: testData.deathVerifiedInNIRS
          },
          {
            attributeName: 'date',
            attributeValue: `${testData.deathDateYear}-${testData.deathDateMonth}-${testData.deathDateDay}`
          }
        ]
      }],
      changeInfoList: [{
        agentIdentifier: 'KONG_DISABLED',
        agentName: 'Kong Disabled',
        changeDescription: CHANGE_HISTORY_DEATH_VERIFIED
      }]
    })
    .reply(200);

  await reviseClaimData(req, res);
  t.true(mock.isDone());
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/tasks-to-complete`);
});
