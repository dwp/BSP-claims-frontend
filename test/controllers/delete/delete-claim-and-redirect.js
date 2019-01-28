'use strict';

require('marko/node-require').install();

const test = require('ava');
const nock = require('nock');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {deleteClaimAndRedirect} = require('../../../src/pages/delete/functions');
const {API_URL, API_END_POINT_CLAIMS} = require('../../../src/lib/constants');

test('should be a function', t => {
  t.is(typeof deleteClaimAndRedirect, 'function');
});

test('should delete claim if activated', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.claim = {
    claimId: 1,
    nino: 'QQ111222A'
  };

  const mock = nock(API_URL)
    .delete(API_END_POINT_CLAIMS + '/' + req.claim.claimId)
    .reply(200);

  await deleteClaimAndRedirect(req, res);
  t.true(mock.isDone());
});

test('should redirect to start new claim pagen', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.claim = {
    claimId: 1,
    nino: 'QQ111222A'
  };

  const mock = nock(API_URL)
    .delete(API_END_POINT_CLAIMS + '/' + req.claim.claimId)
    .reply(200);

  await deleteClaimAndRedirect(req, res);

  t.is(res.redirectedTo, '/start-new-claim');
  t.true(mock.isDone());
});
