'use strict';

const test = require('ava');
const nock = require('nock');
const FakeRequest = require('../helpers/fake-request');
const FakeResponse = require('../helpers/fake-response');
const {API_URL, API_END_POINT_CLAIMS} = require('../../src/lib/constants');
const gateKeeper = require('../../src/middleware/gate-keeper');

const claim = {
  claimId: 1,
  claimantId: 1,
  title: 'Mr',
  fullName: 'Hammond Eggs',
  dateOfBirth: '1960-03-02',
  sex: 'Male',
  dateOfClaim: '2018-09-01',
  decision: null
};

test('should be a function', t => {
  t.is(typeof gateKeeper, 'function');
});

test('If no claim should call next()', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  req.params.claim = undefined;
  t.plan(1);

  gateKeeper(req, res, () => {
    t.pass();
  });
});

test('If accessing an allowed link for the unfinished claim,' +
' should call next with claim in req.claim', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  req.params.claimId = 1;
  req.originalUrl = API_END_POINT_CLAIMS + '/' + req.params.claimId + '/tasks-to-complete';

  const mock = nock(API_URL)
    .get(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply(200, claim);

  t.plan(3);

  await gateKeeper(req, res, () => {
    t.pass();
  });
  t.true(mock.isDone());
  t.deepEqual(req.claim, claim);
});

test('If accessing an allowed link for the finished claim,' +
' should call next with claim in req.claim', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const decidedClaim = {...claim, decision: {allowed: true}};
  req.params.claimId = 1;
  req.originalUrl = API_END_POINT_CLAIMS + '/' + req.params.claimId + '/view';

  const mock = nock(API_URL)
    .get(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply(200, decidedClaim);

  t.plan(3);

  await gateKeeper(req, res, () => {
    t.pass();
  });
  t.true(mock.isDone());
  t.deepEqual(req.claim, decidedClaim);
});

test('If accessing an disallowed link for the finished claim,' +
 'should redirect to start-new-claim with claim in req.claim', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const decidedClaim = {...claim, decision: {allowed: true}};
  req.params.claimId = 1;
  req.originalUrl = API_END_POINT_CLAIMS + '/' + req.params.claimId + '/tasks-to-complete';

  const mock = nock(API_URL)
    .get(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply(200, decidedClaim);

  t.plan(4);

  await gateKeeper(req, res, () => {
    t.pass();
  });
  t.true(mock.isDone());
  t.deepEqual(req.claim, decidedClaim);
  t.deepEqual(res.redirectedTo, '/start-new-claim');
});

test('If accessing an disallowed link for the unfinished claim,' +
 'should redirect to /view with claim in req.claim', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  req.params.claimId = 1;
  req.originalUrl = API_END_POINT_CLAIMS + '/' + req.params.claimId + '/view';

  const mock = nock(API_URL)
    .get(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply(200, claim);

  t.plan(4);

  await gateKeeper(req, res, () => {
    t.pass();
  });
  t.true(mock.isDone());
  t.deepEqual(req.claim, claim);
  t.deepEqual(res.redirectedTo, `/claim/${req.params.claimId}/tasks-to-complete`);
});

test('If the backend fails the page should error', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  req.params.claimId = 1;
  req.originalUrl = API_END_POINT_CLAIMS + '/' + req.params.claimId + '/view';

  const mock = nock(API_URL)
    .get(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply(401);

  t.plan(2);

  await gateKeeper(req, res, () => {
    t.pass();
  });
  t.true(mock.isDone());
});
