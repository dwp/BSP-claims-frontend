'use strict';

require('marko/node-require').install();
const test = require('ava');
const nock = require('nock');
const {API_URL, API_END_POINT_CLAIMS, API_END_POINT_DECISION} = require('../../../src/lib/constants');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {decide} = require('../../../src/pages/confirm-claim/functions');

test('should be a function', t => {
  t.is(typeof decide, 'function');
});

test('should decide claim and redirect to decision page', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  req.session[1] = {ninoToDecide: 'AA676767A'};

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId + API_END_POINT_DECISION)
    .reply((uri, requestBody) => {
      t.deepEqual(requestBody, '');
    });
  await decide(req, res);
  t.is(res.redirectedTo, '/claim/1/decision');
  t.true(mock.isDone());
});

test('should throw error if backend fails', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  req.session[1] = {ninoToDecide: 'AA676767A'};

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId + API_END_POINT_DECISION)
    .reply(400);
  try {
    await decide(req, res);
  } catch (error) {
    t.is(error.statusCode, 400);
  }

  t.true(mock.isDone());
});
