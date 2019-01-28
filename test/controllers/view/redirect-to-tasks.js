'use strict';

require('marko/node-require').install();

const test = require('ava');
const nock = require('nock');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {API_URL, API_END_POINT_CLAIMS} = require('../../../src/lib/constants');
const {redirectToTasks} = require('../../../src/pages/view/functions.js');

const next = () => {};

const claim = {
  claimId: 1,
  decision: {
    allow: false,
    decisionCriteriaList: [{
      criteria: 'marriage',
      reason: 'Disallowed'
    }]
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
  t.is(typeof redirectToTasks, 'function');
});

test('should request claim data for claimId from URL', async t => {
  const {req, res} = t.context.setup();

  const mock = nock(API_URL)
    .get(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply(200);

  await redirectToTasks(req, res, next);
  t.true(mock.isDone());
});

test('should redirect to tasks-to-complete page if claim is undecided', async t => {
  const {req, res} = t.context.setup();

  const mock = nock(API_URL)
    .get(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply(200);

  await redirectToTasks(req, res, next);
  t.is(res.redirectedTo, 'tasks-to-complete');
  t.true(mock.isDone());
});

test('should add claim data to locals if claim is decided', async t => {
  const {req, res} = t.context.setup();

  const mock = nock(API_URL)
    .get(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply(200, claim);

  await redirectToTasks(req, res, next);
  t.deepEqual(res.locals.claim, claim);
  t.true(mock.isDone());
});

test('should call next() if claim is decided', async t => {
  const {req, res} = t.context.setup();

  const mock = nock(API_URL)
    .get(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply(200, claim);

  t.plan(2);

  await redirectToTasks(req, res, () => t.pass());
  t.true(mock.isDone());
});
