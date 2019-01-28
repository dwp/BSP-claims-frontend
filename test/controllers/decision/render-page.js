'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/decision/functions');
const template = require('../../../src/pages/decision/template.marko');

const claimResponse = {
  claim: 1,
  claimantId: 1,
  decision: {
    allow: true
  }
};

test('should export a function', t => {
  t.is(typeof renderPage, 'function');
});

test('should render correct template and pass the claim data from the API to the template', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.template, template);
  t.deepEqual(res.templateData.claim, claimResponse);
});

test('should pass claimId from URL to template', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  req.claim = claimResponse;

  renderPage(req, res);
  t.is(res.templateData.claimId, req.params.claimId);
});

test('should redirect to tasks-to-complete if claim has no decision', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  req.claim = {};

  renderPage(req, res);
  t.is(res.redirectedTo, '/claim/1/tasks-to-complete');
});
