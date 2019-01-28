'use strict';

require('marko/node-require').install();
const test = require('ava');
const nock = require('nock');
const {API_URL, API_END_POINT_CLAIMS, CHANGE_HISTORY_CHIB_VERIFIED, CHANGE_HISTORY_RATE, CHANGE_HISTORY_DEPENDENT_CHILDREN_YES} = require('../../../src/lib/constants');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {reviseClaimData} = require('../../../src/pages/confirm-dependent-children/functions');

const testData = {
  claimId: 1,
  values: {
    dependentChildren: 'true',
    pregnantAtDateOfDeath: 'false',
    childrenCHIBinCBOL: 'true',
    childrenCHIB: 'AB12345678AB'
  }
};

const claimResponse = {
  claimId: 1,
  eligibilityCriteria: {
    dependentChildren: 'true',
    pregnantAtDateOfDeath: 'false'
  },
  paymentAccount: {
    accountType: 'UKBank',
    nameOnAccount: '',
    sortCode: '',
    accountNumber: '',
    rollNumber: ''
  }};
const revisionRequest = {
  claimId: 1,
  paymentAccount: {
    accountType: 'UKBank',
    nameOnAccount: '',
    sortCode: '',
    accountNumber: '',
    rollNumber: ''
  },
  eligibilityCriteria: {
    dependentChildren: 'true',
    pregnantAtDateOfDeath: 'false'
  },
  changeInfoList: [{
    agentIdentifier: 'KONG_DISABLED',
    agentName: 'Kong Disabled',
    changeDescription: CHANGE_HISTORY_DEPENDENT_CHILDREN_YES
  },
  {
    agentIdentifier: 'KONG_DISABLED',
    agentName: 'Kong Disabled',
    changeDescription: CHANGE_HISTORY_CHIB_VERIFIED
  },
  {
    agentIdentifier: 'KONG_DISABLED',
    agentName: 'Kong Disabled',
    changeDescription: CHANGE_HISTORY_RATE
  }],
  verificationList: [{
    category: 'children',
    verificationAttributeList: [
      {
        attributeName: 'CHIBinCBOL',
        attributeValue: 'true'
      },
      {
        attributeName: 'CHIB',
        attributeValue: 'AB12345678AB'
      }
    ]
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

test('should if no req.session[id] is avaliable create one and redirect to backLink', async t => {
  const {req, res} = t.context.setup();

  await reviseClaimData(req, res);
  t.deepEqual(req.session[1], {});
  t.is(res.redirectedTo, '/claim/1/change-dependent-children');
});

test('should revise claim with new data from req.session', async t => {
  const {req, res} = t.context.setup();

  req.session[1] = {
    changeDependentChildren: {...testData},
    changeChildBenefitNumber: {...testData}
  };
  req.claim = claimResponse;
  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, revisionRequest)
    .reply(200);

  await reviseClaimData(req, res);
  t.true(mock.isDone());
});

test('should revise claim with new data from req.session when person is Pregnant', async t => {
  const {req, res} = t.context.setup();

  req.session[1] = {
    changeDependentChildren: {
      values: {
        dependentChildren: 'false',
        pregnantAtDateOfDeath: 'true'
      }
    },
    changeChildBenefitNumber: {}
  };
  claimResponse.eligibilityCriteria = {
    dependentChildren: 'false',
    pregnantAtDateOfDeath: 'true'
  };
  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply((uri, requestBody) => {
      t.deepEqual(requestBody, {claimId: 1, paymentAccount: {accountType: 'UKBank', nameOnAccount: '', sortCode: '', accountNumber: '', rollNumber: ''},
        eligibilityCriteria: {dependentChildren: 'false', pregnantAtDateOfDeath: 'true'},
        changeInfoList: [
          {agentIdentifier: 'KONG_DISABLED', agentName: 'Kong Disabled', changeDescription: 'ChildrenDetailsEnteredAsFalseAndPregnant'},
          {agentIdentifier: 'KONG_DISABLED', agentName: 'Kong Disabled', changeDescription: 'ChangedRate'}
        ]});
    });

  await reviseClaimData(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/payment-schedule`);
  t.true(mock.isDone());
});

test('should revise claim with new data from req.session when person provides CHIB', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {...testData};
  req.session[1] = {
    changeDependentChildren: {...testData},
    changeChildBenefitNumber: {...testData}
  };
  req.claim = {...claimResponse};
  req.session.changePaymentDetailsOrigin = 'payment-schedule';

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, revisionRequest)
    .reply(200);

  await reviseClaimData(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/payment-schedule`);
  t.true(mock.isDone());
});

test('should redirect to change-payment-details if there is no session data', async t => {
  const {req, res} = t.context.setup();

  req.session[1] = {
    changeDependentChildren: undefined,
    changeChildBenefitNumber: undefined
  };
  await reviseClaimData(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/change-dependent-children`);
});
