'use strict';

require('marko/node-require').install();

const nock = require('nock');
const test = require('ava');
const {
  API_URL, API_END_POINT_CLAIMS,
  CHANGE_HISTORY_REL_VERIFIED,
  CHANGE_HISTORY_REL_NOT_VERIFIED
} = require('../../../src/lib/constants');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {reviseClaimData} = require('../../../src/pages/verify-relationship/functions');

const testData = {
  claimId: 1,
  marriedAtDateOfDeath: 'true',
  seenEvidence: 'true',
  marriageVerifiedByCert: 'true',
  marriageVerifiedInCIS: 'true',
  marriageVerifiedInNIRS: 'true',
  marriageDateDay: '23',
  marriageDateMonth: '03',
  marriageDateYear: '1985'
};

const claimResponse = {
  claimId: 1,
  claimantId: 1,
  dateOfClaim: '2018-01-09',
  nino: 'QQ123456A',
  claimantDetails: {
    title: 'Mr',
    fullName: 'Hammond Eggs',
    dateOfBirth: '1960-02-03',
    sex: 'Male'
  },
  partnerDetails: {
    nino: 'QQ123456B',
    title: 'Ms',
    fullName: 'Bacon N. Eggs',
    dateOfDeath: '2017-12-12'
  },
  eligibilityCriteria: {
    pregnantAtDateOfDeath: true
  }
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

test('should revise claim removing marriage verifiaction if marriedAtDateOfDeath is true and seenEvidence is false', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {...testData, seenEvidence: 'false'};
  req.claim = {
    ...claimResponse,
    eligibilityCriteria: {
      ...claimResponse.eligibilityCriteria,
      marriedAtDateOfDeath: res.locals.values.marriedAtDateOfDeath
    },
    changeInfoList: [{
      agentIdentifier: 'KONG_DISABLED',
      agentName: 'Kong Disabled',
      changeDescription: CHANGE_HISTORY_REL_NOT_VERIFIED
    }]
  };

  await reviseClaimData(req, res);
  t.deepEqual(req.session[1].relationshipVerification, req.claim);
});

test('should redirect to wait-for-evidence page if marriedAtDateOfDeath is true and seenEvidence is false', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {...testData, seenEvidence: 'false'};
  req.claim = {
    ...claimResponse,
    eligibilityCriteria: {
      ...claimResponse.eligibilityCriteria,
      marriedAtDateOfDeath: res.locals.values.marriedAtDateOfDeath
    },
    changeInfoList: [{
      agentIdentifier: 'KONG_DISABLED',
      agentName: 'Kong Disabled',
      changeDescription: CHANGE_HISTORY_REL_NOT_VERIFIED
    }]
  };

  await reviseClaimData(req, res);
  t.deepEqual(res.redirectedTo, `/claim/${req.params.claimId}/verify-relationship/wait-for-evidence`);
});

test('should add claim to session if marriedAtDateOfDeath is false', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {...testData, marriedAtDateOfDeath: 'false'};
  req.claim = claimResponse;

  const result = {
    ...claimResponse,
    eligibilityCriteria: {
      ...claimResponse.eligibilityCriteria,
      marriedAtDateOfDeath: res.locals.values.marriedAtDateOfDeath
    }
  };

  await reviseClaimData(req, res);
  t.deepEqual(result, req.session[1].relationshipVerification);
});

test('should revise claim, removing existing marriage verifications if marriedAtDateOfDeath is false', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {...testData, marriedAtDateOfDeath: 'false'};
  req.claim = {
    ...claimResponse,
    verificationList: [
      {
        category: 'marriage',
        verificationAttributeList: [
          {
            attributeName: 'verifiedByCert',
            attributeValue: 'true'
          },
          {
            attributeName: 'verifiedInCIS',
            attributeValue: 'true'
          },
          {
            attributeName: 'verifiedInNIRS',
            attributeValue: 'true'
          },
          {
            attributeName: 'date',
            attributeValue: '2017-10-10'
          }
        ]
      },
      {
        category: 'height',
        verificationAttributeList: [
          {
            attributeName: 'height',
            attributeValue: '6ft'
          }
        ]
      }
    ]
  };

  const result = {
    ...claimResponse,
    eligibilityCriteria: {
      ...claimResponse.eligibilityCriteria,
      marriedAtDateOfDeath: res.locals.values.marriedAtDateOfDeath
    },
    verificationList: [{
      category: 'height',
      verificationAttributeList: [
        {
          attributeName: 'height',
          attributeValue: '6ft'
        }
      ]
    }]
  };

  await reviseClaimData(req, res);
  t.deepEqual(result, req.session[1].relationshipVerification);
});

test('should redirect to disallow-relationship if marriedAtDateOfDeath is false', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {...testData, marriedAtDateOfDeath: 'false'};
  req.claim = claimResponse;

  await reviseClaimData(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/verify-relationship/disallow-claim`);
});

test('should revise claim with data from res.locals.values if marriedAtDateOfDeath is true and seenEvidence is true', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = testData;
  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, {
      ...claimResponse,
      eligibilityCriteria: {
        ...claimResponse.eligibilityCriteria,
        marriedAtDateOfDeath: res.locals.values.marriedAtDateOfDeath
      },
      verificationList: [{
        category: 'marriage',
        verificationAttributeList: [
          {
            attributeName: 'verifiedByCert',
            attributeValue: testData.marriageVerifiedByCert
          },
          {
            attributeName: 'verifiedInCIS',
            attributeValue: testData.marriageVerifiedInCIS
          },
          {
            attributeName: 'verifiedInNIRS',
            attributeValue: testData.marriageVerifiedInNIRS
          },
          {
            attributeName: 'date',
            attributeValue: `${testData.marriageDateYear}-${testData.marriageDateMonth}-${testData.marriageDateDay}`
          }
        ]
      }],
      changeInfoList: [{
        agentIdentifier: 'KONG_DISABLED',
        agentName: 'Kong Disabled',
        changeDescription: CHANGE_HISTORY_REL_VERIFIED
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
    marriageVerifiedInCIS: undefined,
    marriageVerifiedInNIRS: undefined
  };
  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, {
      ...claimResponse,
      eligibilityCriteria: {
        ...claimResponse.eligibilityCriteria,
        marriedAtDateOfDeath: res.locals.values.marriedAtDateOfDeath
      },
      changeInfoList: [{
        agentIdentifier: 'KONG_DISABLED',
        agentName: 'Kong Disabled',
        changeDescription: CHANGE_HISTORY_REL_VERIFIED
      }],
      verificationList: [{
        category: 'marriage',
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

test('should redirect to tasks-to-complete if marriedAtDateOfDeath is true and seenEvidence is true', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = testData;
  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, {
      ...claimResponse,
      eligibilityCriteria: {
        ...claimResponse.eligibilityCriteria,
        marriedAtDateOfDeath: res.locals.values.marriedAtDateOfDeath
      },
      verificationList: [{
        category: 'marriage',
        verificationAttributeList: [
          {
            attributeName: 'verifiedByCert',
            attributeValue: testData.marriageVerifiedByCert
          },
          {
            attributeName: 'verifiedInCIS',
            attributeValue: testData.marriageVerifiedInCIS
          },
          {
            attributeName: 'verifiedInNIRS',
            attributeValue: testData.marriageVerifiedInNIRS
          },
          {
            attributeName: 'date',
            attributeValue: `${testData.marriageDateYear}-${testData.marriageDateMonth}-${testData.marriageDateDay}`
          }
        ]
      }],
      changeInfoList: [{
        agentIdentifier: 'KONG_DISABLED',
        agentName: 'Kong Disabled',
        changeDescription: CHANGE_HISTORY_REL_VERIFIED
      }]
    })
    .reply(200);

  await reviseClaimData(req, res);
  t.true(mock.isDone());
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/tasks-to-complete`);
});
