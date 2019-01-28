'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {validateForm} = require('../../../src/pages/change-pregnant/functions');

const next = () => {};
const testData = {
  dependentChildren: 'true',
  pregnantAtDateOfDeath: 'false'
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
  t.is(typeof validateForm, 'function');
});

test('should add request body form values to res.locals if data is valid', t => {
  const {req, res} = t.context.setup();

  req.body = testData;

  validateForm(req, res, next);

  t.deepEqual(res.locals.values, testData);
});

test('should not add unexpected request body form values to dependentChildren session if data is invalid', t => {
  const {req, res} = t.context.setup();

  req.params.claimId = 1;

  req.body = {...testData, pregnantAtDateOfDeath: '', hackerData: 'oh no'};

  validateForm(req, res, next);

  t.deepEqual(req.session[1].changeDependentChildren.values, {...testData, pregnantAtDateOfDeath: ''});
});

test('should not add unexpected request body form values to res.locals.values', t => {
  const {req, res} = t.context.setup();

  req.body = {...testData, hackerData: 'oh no'};

  validateForm(req, res, next);

  t.deepEqual(res.locals.values, testData);
});

test('should add presence error to session object if pregnantAtDateOfDeath is something other than "yes" or "no"', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, pregnantAtDateOfDeath: ''};
  const errors = {pregnantAtDateOfDeath: 'dependent-children:form.pregnantAtDateOfDeath.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session[1].changeDependentChildren, {values, errors});
});

test('should redirect back to GET if there are any validation errors', t => {
  const {req, res} = t.context.setup();

  req.body = {};
  validateForm(req, res, next);

  t.deepEqual(res.redirectedTo, 'back');
});

test('should call next middleware if there are no validation errors', t => {
  const {req, res} = t.context.setup();

  req.body = testData;
  validateForm(req, res, () => t.pass());
});
