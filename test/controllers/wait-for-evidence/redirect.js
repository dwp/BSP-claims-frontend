'use strict';

require('marko/node-require').install();

const test = require('ava');
const nock = require('nock');
const {
  API_URL, API_END_POINT_CLAIMS,
  CHANGE_HISTORY_REL_NOT_VERIFIED
} = require('../../../src/lib/constants');

const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {redirect} = require('../../../src/pages/wait-for-evidence/functions.js');

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
  }
};

test('should be a function', t => {
  t.is(typeof redirect, 'function');
});

test('should redirect to tasks-to-complete if wait is Y', async t => {
  const {req, res} = t.context.setup();

  req.body.wait = 'Y';

  req.session[1] = {
    relationshipVerification: {...claimResponse}
  };
  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply((uri, requestBody) => {
      t.deepEqual(requestBody, {
        ...claimResponse,
        changeInfoList: [{
          agentIdentifier: 'KONG_DISABLED',
          agentName: 'Kong Disabled',
          changeDescription: CHANGE_HISTORY_REL_NOT_VERIFIED
        }]
      });
    });

  await redirect(req, res);
  t.true(mock.isDone());
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/tasks-to-complete`);
});

test('should redirect to disallow if wait is N', async t => {
  const {req, res} = t.context.setup();

  req.body.wait = 'N';

  await redirect(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/verify-relationship/wait-for-evidence/disallow-claim`);
});
