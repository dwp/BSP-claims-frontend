'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {validateForm} = require('../../../src/pages/wait-for-evidence/functions');

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
  t.is(typeof validateForm, 'function');
});

test('should add presence error to session objects if wait is blank', t => {
  const {req, res} = t.context.setup();

  const expectedErrors = {wait: 'wait-for-evidence:form.wait.errors'};

  validateForm(req, res);

  t.deepEqual(req.session[req.params.claimId].waitForEvidence, {errors: expectedErrors});
});

test('should add presence error to session objects if wait' +
 'field is something other than yes or no', t => {
  const {req, res} = t.context.setup();

  const expectedErrors = {wait: 'wait-for-evidence:form.wait.errors'};

  req.body.wait = 'maybe';
  validateForm(req, res);

  t.deepEqual(req.session[req.params.claimId].waitForEvidence, {errors: expectedErrors});
});

test('should redirect back to page if there are errors', t => {
  const {req, res} = t.context.setup();

  req.body.wait = 'maybe';
  validateForm(req, res);

  t.is(res.redirectedTo, 'back');
});

test('should call next if there are no errors', t => {
  const {req, res} = t.context.setup();

  req.body.wait = 'Y';
  validateForm(req, res, () => t.pass());
});
