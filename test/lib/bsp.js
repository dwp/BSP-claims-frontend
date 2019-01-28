'use strict';

import {serial as test} from 'ava';

require('marko/node-require').install();
const nock = require('nock');
const sinon = require('sinon');
const {API_URL, API_END_POINT_CLAIMANTS, API_END_POINT_SCHEDULE} = require('../../src/lib/constants');
const FakeRequest = require('../helpers/fake-request');
const FakeResponse = require('../helpers/fake-response');
const {newClaimant, newClaim, getClaim, getClaimAndAudit, getSchedule, getScheduleAndAudit, getPotentialDecision, decideClaim, findClaim, reviseClaim, reviseAndAuditClaim, stopScheduleAndAudit, deleteClaim} = require('../../src/lib/bsp.js');
const logger = require('../../src/utils/logger');
const audit = require('../../src/utils/audit');

const testData = {
  title: 'Mr',
  fullName: 'Hammond Eggs',
  nino: 'QQ123123A',
  dateOfBirthDay: '11',
  dateOfBirthMonth: '11',
  dateOfBirthYear: '1985',
  sex: 'Male',
  partnerTitle: 'Mr',
  partnerFullName: 'Bacon N. Eggs',
  partnerNino: 'QQ111111A',
  dateOfDeathDay: '07',
  dateOfDeathMonth: '07',
  dateOfDeathYear: '2017',
  dateOfClaimDay: '12',
  dateOfClaimMonth: '12',
  dateOfClaimYear: '2017'
};

const claimantRequest = {
  nino: testData.nino
};

const claimantResponse = {
  claimantId: 1,
  created: '2018-01-30T09:00:00.000Z',
  nino: testData.nino
};

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

  sinon.replace(logger, 'request', sinon.fake());
  sinon.replace(logger, 'response', sinon.fake());
  sinon.replace(audit, 'sendMessage', sinon.fake());
});

test.afterEach(() => {
  sinon.restore();
});

test('should be a function', t => {
  t.is(typeof newClaimant, 'function');
  t.is(typeof newClaim, 'function');
  t.is(typeof getClaim, 'function');
  t.is(typeof getClaimAndAudit, 'function');
  t.is(typeof getSchedule, 'function');
  t.is(typeof getScheduleAndAudit, 'function');
  t.is(typeof getPotentialDecision, 'function');
  t.is(typeof decideClaim, 'function');
  t.is(typeof findClaim, 'function');
  t.is(typeof reviseClaim, 'function');
  t.is(typeof reviseAndAuditClaim, 'function');
  t.is(typeof stopScheduleAndAudit, 'function');
  t.is(typeof deleteClaim, 'function');
});

test('newClaimant should post an object and return one', async t => {
  const mock = nock(API_URL)
    .post(API_END_POINT_CLAIMANTS, claimantRequest)
    .reply(200, claimantResponse);

  const result = await newClaimant(testData.nino);

  t.deepEqual(result, claimantResponse);
  t.true(mock.isDone());
});

test('newClaimant log twice', async t => {
  const mock = nock(API_URL)
    .post(API_END_POINT_CLAIMANTS, claimantRequest)
    .reply(200, claimantResponse);

  await newClaimant(testData.nino);

  t.true(logger.request.calledOnce);
  t.true(logger.response.calledOnce);
  t.true(mock.isDone());
});

test('getScheduleAndAudit should post an object and return one', async t => {
  const {req} = t.context.setup();

  req.params.scheduleId = 31;

  const mock = nock(API_URL)
    .get(API_END_POINT_SCHEDULE + '/' + req.params.scheduleId)
    .reply(200, claim);

  const result = await getScheduleAndAudit(req);

  t.deepEqual(result, claim);
  t.true(mock.isDone());
});

test('getScheduleAndAudit should log twice and audit once', async t => {
  const {req} = t.context.setup();

  req.params.scheduleId = 31;

  const mock = nock(API_URL)
    .get(API_END_POINT_SCHEDULE + '/' + req.params.scheduleId)
    .reply(200, claim);

  await getScheduleAndAudit(req);

  t.true(logger.request.calledOnce);
  t.true(logger.response.calledOnce);
  t.true(audit.sendMessage.calledOnce);
  t.true(mock.isDone());
});
