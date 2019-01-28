'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/wait-for-death/functions');
const template = require('../../../src/pages/wait-for-death/template.marko');

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

const claimResponse = {
  claimantDetails: {
    fullName: 'Hammond Eggs'
  }
};

test('should be a function', t => {
  t.is(typeof renderPage, 'function');
});

test('should render correct template', t => {
  const {req, res} = t.context.setup();

  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.template, template);
});

test('should pass errors to template from session if they exist', t => {
  const {req, res} = t.context.setup();

  const errors = {wait: 'This is required'};

  req.session[req.params.claimId].waitForDeath = {errors};
  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.templateData.errors, errors);
});

test('should pass claimId to template', t => {
  const {req, res} = t.context.setup();

  req.session[req.params.claimId].waitForDeath = {errors: {wait: 'This is required'}};
  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.templateData.claimId, req.params.claimId);
});

test('should pass fullName to template', t => {
  const {req, res} = t.context.setup();

  req.session[req.params.claimId].waitForDeath = {errors: {wait: 'This is required'}};
  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.templateData.fullName, req.claim.claimantDetails.fullName);
});

test('should set waitForDeath session object to undefined', t => {
  const {req, res} = t.context.setup();

  req.session[req.params.claimId].waitForDeath = {test: 'test'};
  req.claim = claimResponse;

  renderPage(req, res);
  t.is(req.session[req.params.claimId].waitForDeath, undefined);
});
