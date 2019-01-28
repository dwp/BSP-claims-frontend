'use strict';

require('marko/node-require').install();

const test = require('ava');
const nock = require('nock');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {API_URL, API_END_POINT_CLAIMS, API_END_POINT_DECISION} = require('../../../src/lib/constants');
const {renderPage} = require('../../../src/pages/tasks-to-complete/functions');
const template = require('../../../src/pages/tasks-to-complete/template.marko');

const claim = {
  claimantId: 1,
  title: 'Mr',
  fullName: 'Hammond Eggs',
  dateOfBirth: '1960-03-02',
  sex: 'Male',
  dateOfClaim: '2018-09-01'
};

test('should be a function', t => {
  t.is(typeof renderPage, 'function');
});

test('should render correct template', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  res.locals.claim = claim;
  req.params.claimId = 1;

  const mock = nock(API_URL)
    .get(API_END_POINT_CLAIMS + '/' + req.params.claimId + API_END_POINT_DECISION)
    .reply(200);

  await renderPage(req, res);
  t.deepEqual(res.template, template);
  t.true(mock.isDone());
});

test('should pass claim data from locals to template', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  res.locals.claim = claim;
  req.params.claimId = 1;

  const mock = nock(API_URL)
    .get(API_END_POINT_CLAIMS + '/' + req.params.claimId + API_END_POINT_DECISION)
    .reply(200);

  await renderPage(req, res);
  t.deepEqual(res.templateData.claim, res.locals.claim);
  t.true(mock.isDone());
});

test('should pass allowable flag to template as true if claim is allowable', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  res.locals.claim = claim;
  req.params.claimId = 1;

  const mock = nock(API_URL)
    .get(API_END_POINT_CLAIMS + '/' + req.params.claimId + API_END_POINT_DECISION)
    .reply(200, {
      decision: {
        allow: true
      }
    });

  await renderPage(req, res);
  t.true(res.templateData.allowable);
  t.true(mock.isDone());
});

test('should pass allowable flag to template as false if claim is not decidable', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  res.locals.claim = claim;
  req.params.claimId = 1;

  const mock = nock(API_URL)
    .get(API_END_POINT_CLAIMS + '/' + req.params.claimId + API_END_POINT_DECISION)
    .reply(200, {
      decision: undefined
    });

  await renderPage(req, res);
  t.false(res.templateData.allowable);
  t.true(mock.isDone());
});

test('should flatten verifications in claim data', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  res.locals.claim = {
    ...claim,
    marriedAtDateOfDeath: 'true',
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
          }
        ]
      }
    ]
  };

  const mock = nock(API_URL)
    .get(API_END_POINT_CLAIMS + '/' + req.params.claimId + API_END_POINT_DECISION)
    .reply(200);

  const expectedTemplateData = {
    ...claim,
    marriedAtDateOfDeath: 'true',
    marriageVerifiedByCert: 'true',
    marriageVerifiedInCIS: 'true'
  };

  await renderPage(req, res);
  t.deepEqual(res.templateData.claim, expectedTemplateData);
  t.true(mock.isDone());
});
