'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/verify-death/functions');
const template = require('../../../src/pages/verify-death/template.marko');

const claimResponse = {
  claimantId: 1,
  title: 'Mr',
  fullName: 'Hammond Eggs',
  dateOfBirth: '1960-03-02',
  sex: 'Male',
  dateOfClaim: '2018-09-01',
  seenEvidence: 'true'
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
  t.is(typeof renderPage, 'function');
});

test('should render correct template', t => {
  const {req, res} = t.context.setup();

  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.template, template);
});

test('should pass claim data to template as values', t => {
  const {req, res} = t.context.setup();

  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.templateData.values, claimResponse);
});

test('should flatten verifications in claim data', t => {
  const {req, res} = t.context.setup();

  req.claim = {
    ...claimResponse,
    verificationList: [
      {
        category: 'death',
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

  const expectedTemplateData = {
    ...claimResponse,
    deathVerifiedByCert: 'true',
    deathVerifiedInCIS: 'true'
  };

  renderPage(req, res);
  t.deepEqual(res.templateData.values, expectedTemplateData);
});

test('should pass values from session to template instead of calling API, if they exist', t => {
  const {req, res} = t.context.setup();

  const values = {
    marriedAtDateOfDeath: 'true',
    seenEvidence: 'true'
  };

  req.claim = claimResponse;
  req.session[req.params.claimId].death = {values};

  renderPage(req, res);
  t.deepEqual(res.templateData.values, values);
});

test('should set death session object to undefined after complete', t => {
  const {req, res} = t.context.setup();

  const values = {
    marriedAtDateOfDeath: 'true',
    seenEvidence: 'true'
  };

  req.claim = claimResponse;
  req.session[req.params.claimId].death = {values};

  renderPage(req, res);
  t.is(req.session[req.params.claimId].death, undefined);
});

test('should pass errors from session to template', t => {
  const {req, res} = t.context.setup();

  const values = {};
  const errors = {
    seenEvidence: 'Select ‘Yes’ or ‘No’'
  };

  req.session[req.params.claimId].death = {errors, values};
  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.templateData.errors, errors);
});

test('should pass claimId from URL to template', t => {
  const {req, res} = t.context.setup();

  req.session[req.params.claimId].death = {values: {}};
  req.claim = claimResponse;

  renderPage(req, res);
  t.is(res.templateData.claimId, req.params.claimId);
});
