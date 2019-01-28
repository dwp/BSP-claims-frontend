'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/start-new-claim/functions');
const template = require('../../../src/pages/start-new-claim/template.marko');

test.beforeEach(t => {
  t.context.setup = () => {
    const req = new FakeRequest();
    req.params.claimId = 1;
    req.claim = {};
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

test('should render the start-new-claim template', t => {
  const {req, res} = t.context.setup();

  renderPage(req, res);

  t.deepEqual(res.template, template);
});

test('should pass values from session to template, if they exist', t => {
  const {req, res} = t.context.setup();

  const values = {test: 'value'};
  const errors = {errors: 'something'};

  req.session.startNewClaim = {values, errors};

  renderPage(req, res);

  t.deepEqual(res.templateData.values, values);
});

test('should pass errors from session to template, if they exist', t => {
  const {req, res} = t.context.setup();

  const errors = {test: 'error'};

  req.session.startNewClaim = {errors};

  renderPage(req, res);

  t.deepEqual(res.templateData.errors, errors);
});

test('should empty startNewClaim session data after render', t => {
  const {req, res} = t.context.setup();

  const errors = {test: 'error'};

  req.session[req.params.claimId].errors = {errors};

  renderPage(req, res);

  t.is(req.session.startNewClaim, undefined);
});

test('should pass data to template, if there is any', t => {
  const {req, res} = t.context.setup();

  const values = {dataitem: 'test', claimId: 1};

  req.session.startNewClaim = {values};

  renderPage(req, res);

  t.deepEqual(res.templateData.values, values);
});
