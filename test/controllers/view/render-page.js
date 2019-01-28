'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/view/functions');
const template = require('../../../src/pages/view/template.marko');

const claim = {
  claimId: 1,
  claimantId: 1,
  title: 'Mr',
  fullName: 'Hammond Eggs',
  dateOfBirth: '1960-03-02',
  sex: 'Male',
  dateOfClaim: '2018-09-01'
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

  res.locals.claim = claim;

  renderPage(req, res);
  t.deepEqual(res.template, template);
});

test('should pass claim data from locals to template', t => {
  const {req, res} = t.context.setup();

  res.locals.claim = claim;

  renderPage(req, res);
  t.deepEqual(res.templateData, {claim: res.locals.claim});
});

test('should flatten verifications in claim data', t => {
  const {req, res} = t.context.setup();

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

  const expectedTemplateData = {
    ...claim,
    marriedAtDateOfDeath: 'true',
    marriageVerifiedByCert: 'true',
    marriageVerifiedInCIS: 'true'
  };

  renderPage(req, res);
  t.deepEqual(res.templateData.claim, expectedTemplateData);
});
