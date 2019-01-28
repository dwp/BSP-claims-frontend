'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/change-dependent-children/functions');
const template = require('../../../src/pages/change-dependent-children/template.marko');

const claimResponse = {
  claimantId: 1,
  title: 'Mr',
  fullName: 'Hammond Eggs',
  dateOfBirth: '1960-03-02',
  sex: 'Male',
  dateOfClaim: '2018-09-01',
  eligibilityCriteria: {
    dependentChildren: true,
    pregnantAtDateOfDeath: false
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

test('should render correct template', async t => {
  const {req, res} = t.context.setup();

  req.session[req.params.claimId].dependentChildren = {values: {}};

  await renderPage(req, res);
  t.deepEqual(res.template, template);
});

test('should pass session data to template as values', async t => {
  const {req, res} = t.context.setup();

  req.session[req.params.claimId] = {
    changeDependentChildren: {values: claimResponse.eligibilityCriteria}
  };
  await renderPage(req, res);
  t.deepEqual(res.templateData.values, claimResponse.eligibilityCriteria);
});

test('should pass errors from session to template', async t => {
  const {req, res} = t.context.setup();

  const values = {};
  const errors = {
    dependentChildren: 'Select ‘Yes’ or ‘No’'
  };

  req.session[req.params.claimId] = {
    changeDependentChildren: {values, errors}
  };
  req.session[req.params.claimId].changeDependentChildren = {values, errors};

  await renderPage(req, res);
  t.deepEqual(res.templateData.errors, errors);
});

test('should pass claimId from URL to template', async t => {
  const {req, res} = t.context.setup();

  req.session[req.params.claimId].dependentChildren = {values: {}};

  await renderPage(req, res);
  t.is(res.templateData.claimId, req.params.claimId);
});
