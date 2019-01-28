'use strict';

require('marko/node-require').install();
const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/confirm-dependent-children/functions');
const template = require('../../../src/pages/confirm-dependent-children/template.marko');

const claim = {
  claimantId: 1,
  title: 'Mr',
  fullName: 'Hammond Eggs',
  dateOfBirth: '1960-03-02',
  sex: 'Male',
  dateOfClaim: '2018-09-01',
  eligibilityCriteria: {
    dependentChildren: 'true',
    pregnantAtDateOfDeath: 'false'
  },
  verificationList: [
    {
      category: 'children',
      verificationAttributeList: [
        {
          attributeName: 'CHIBinCBOL',
          attributeValue: 'false'
        },
        {
          attributeName: 'CHIB',
          attributeValue: ''
        }
      ]
    }
  ]
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

test('should render confirm-dependent-children template', t => {
  const {req, res} = t.context.setup();

  req.claim = claim;
  req.session[1] = {
    changeDependentChildren: {values: {dependentChildren: 'true'}}
  };

  renderPage(req, res);

  t.deepEqual(res.template, template);
});

test('should pass data to template, if there is any', t => {
  const {req, res} = t.context.setup();

  const values = {testResult: 'test'};

  req.claim = claim;
  req.session[1] = {
    changeDependentChildren: {values: {testResult: 'test'}}
  };

  renderPage(req, res);

  t.deepEqual(res.templateData.changeDetails, values);
});

test('should redirect to the change-dependent-children page if there is no claim data in the session', t => {
  const {req, res} = t.context.setup();

  req.session[req.params.claimId].changeDependentChildren = undefined;
  req.session[req.params.claimId].changeDependentChildrenBackStack = [`/claim/${req.params.claimId}/change-dependent-children`];
  req.claim = claim;

  renderPage(req, res);

  t.is(res.redirectedTo, `/claim/${req.params.claimId}/change-dependent-children`);
});
