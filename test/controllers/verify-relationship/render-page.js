'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/verify-relationship/functions');
const template = require('../../../src/pages/verify-relationship/template.marko');

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
  },
  eligibilityCriteria: {
    marriedAtDateOfDeath: true
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
  t.is(typeof renderPage, 'function');
});

test('should render correct template', t => {
  const {req, res} = t.context.setup();

  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.template, template);
});

test('should pass claim data to template as values, flattening eligibilityCriteria', t => {
  const {req, res} = t.context.setup();

  req.claim = claimResponse;

  renderPage(req, res);
  t.is(res.templateData.values.marriedAtDateOfDeath, claimResponse.eligibilityCriteria.marriedAtDateOfDeath);
});

test('should flatten verifications in claim data', t => {
  const {req, res} = t.context.setup();

  req.claim = {
    ...claimResponse,
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

  renderPage(req, res);
  t.is(res.templateData.values.marriageVerifiedByCert, 'true');
  t.is(res.templateData.values.marriageVerifiedInCIS, 'true');
});

test('should pass values from session to template instead of calling API, if they exist', t => {
  const {req, res} = t.context.setup();

  const values = {
    marriedAtDateOfDeath: 'true',
    seenEvidence: 'true'
  };

  req.session[req.params.claimId].relationship = {values};
  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.templateData.values, values);
});

test('should set relationship session object to undefined after complete', t => {
  const {req, res} = t.context.setup();

  const values = {
    marriedAtDateOfDeath: 'true',
    seenEvidence: 'true'
  };

  req.session[req.params.claimId].relationship = {values};
  req.claim = claimResponse;

  renderPage(req, res);
  t.is(req.session[req.params.claimId].relationship, undefined);
});

test('should pass errors from session to template', t => {
  const {req, res} = t.context.setup();

  const values = {};
  const errors = {
    marriedAtDateOfDeath: 'Select ‘Yes’ or ‘No’'
  };

  req.session[req.params.claimId].relationship = {errors, values};
  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.templateData.errors, errors);
});

test('should pass claimId from URL to template', t => {
  const {req, res} = t.context.setup();

  req.session[req.params.claimId].relationship = {values: {}};
  req.claim = claimResponse;

  renderPage(req, res);
  t.is(res.templateData.claimId, req.params.claimId);
});
