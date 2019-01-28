'use strict';

require('marko/node-require').install();

const test = require('ava');
const nock = require('nock');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/old-schedule/functions');
const {API_URL, API_END_POINT_SCHEDULE} = require('../../../src/lib/constants');
const template = require('../../../src/pages/old-schedule/template.marko');

const claim = {
  scheduleId: 31,
  name: 'John',
  nino: 'QQ111222A',
  status: 'Active',
  rate: '73131',
  activeBankDetails: {
    sortCode: '123456',
    accountNumber: '12345678',
    accountName: 'John',
    rollNumber: null
  },
  schedule: {
    nino: 'QQ111222A'
  },
  issuedPayments: [],
  plannedPayments: []
};

test('should be a function', t => {
  t.is(typeof renderPage, 'function');
});

test('should render correct template', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.scheduleId = 31;

  const mock = nock(API_URL)
    .get(API_END_POINT_SCHEDULE + '/' + req.params.scheduleId)
    .reply(200, claim);

  await renderPage(req, res);

  t.deepEqual(res.template, template);
  t.true(mock.isDone());
});

test('should throw if the backend fails', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.scheduleId = 31;

  const mock = nock(API_URL)
    .get(API_END_POINT_SCHEDULE + '/' + req.params.scheduleId)
    .reply(400, claim);

  try {
    await renderPage(req, res);
  } catch (error) {
    t.is(error.statusCode, 400);
  }

  t.true(mock.isDone());
});

test('should pass claim data from locals to template', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  res.locals.claim = claim;

  const mock = nock(API_URL)
    .get(API_END_POINT_SCHEDULE + '/' + req.params.scheduleId)
    .reply(200, claim);

  await renderPage(req, res);
  t.deepEqual(res.templateData, {claim: res.locals.claim});
  t.true(mock.isDone());
});
