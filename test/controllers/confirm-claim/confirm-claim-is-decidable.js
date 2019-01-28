'use strict';

require('marko/node-require').install();
const test = require('ava');
const nock = require('nock');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {confirmClaimIsDecidable} = require('../../../src/pages/confirm-claim/functions');
const {API_URL, API_END_POINT_CLAIMS, API_END_POINT_DECISION} = require('../../../src/lib/constants');

test('should be a function', t => {
  t.is(typeof confirmClaimIsDecidable, 'function');
});

test('should get a potential Decision (Ready) and call next', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;

  const mock = nock(API_URL)
    .get(API_END_POINT_CLAIMS + '/' + req.params.claimId + API_END_POINT_DECISION)
    .reply(200, true);

  await confirmClaimIsDecidable(req, res, () => t.pass());
  t.true(mock.isDone());
});

test('should get a potential Decision (not ready) and call redirect', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;

  const mock = nock(API_URL)
    .get(API_END_POINT_CLAIMS + '/' + req.params.claimId + API_END_POINT_DECISION)
    .reply(200, false);

  await confirmClaimIsDecidable(req, res);
  t.is(res.redirectedTo, '/claim/1/tasks-to-complete');
  t.true(mock.isDone());
});
