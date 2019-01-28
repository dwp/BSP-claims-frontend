'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {validateForm} = require('../../../src/pages/verify-ni-conts/functions');

const next = () => {};
const testData = {
  sufficientNIContributions: 'true',
  niContsYear: '2016'
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

test('should add request body form values to session if data is invalid', t => {
  const {req, res} = t.context.setup();

  req.body = {...testData, sufficientNIContributions: ''};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].niConts.values, req.body);
});

test('should not add unexpected request body form values to childBenefit session if data is invalid', t => {
  const {req, res} = t.context.setup();

  req.body = {...testData, sufficientNIContributions: '', hackerData: 'oh no'};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].niConts.values, {...testData, sufficientNIContributions: ''});
});

test('should not add unexpected request body form values to res.locals.values', t => {
  const {req, res} = t.context.setup();

  req.body = {...testData, hackerData: 'oh no'};

  validateForm(req, res, next);

  t.deepEqual(res.locals.values, testData);
});

test('should trim request body form values before adding res.locals.values', t => {
  const {req, res} = t.context.setup();

  req.body = {
    sufficientNIContributions: 'true',
    niContsYear: '  2016  '
  };

  validateForm(req, res, next);

  t.deepEqual(res.locals.values, testData);
});

test('should trim request body form values before adding to niConts session if data is invalid', t => {
  const {req, res} = t.context.setup();

  req.body = {
    sufficientNIContributions: 'true',
    niContsYear: '  1965  '
  };

  const expectedValues = {
    sufficientNIContributions: 'true',
    niContsYear: '1965'
  };

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].niConts.values, expectedValues);
});

test('should add presence error to session object if sufficientNIContributions is not true or false', t => {
  const {req, res} = t.context.setup();

  const errors = {sufficientNIContributions: 'verify-ni-conts:form.sufficientNIContributions.errors.presence'};

  req.body = {...testData, sufficientNIContributions: ''};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].niConts.errors, errors);
});

test('should add presence error to session object if sufficientNIContributions is true but niContsYear is blank', t => {
  const {req, res} = t.context.setup();

  const errors = {niContsYear: 'verify-ni-conts:form.niContsYear.errors.presence'};

  req.body = {...testData, niContsYear: ''};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].niConts.errors, errors);
});

test('should not add presence error to session object if sufficientNIContributions is false and niContsYear is blank', t => {
  const {req, res} = t.context.setup();

  req.body = {sufficientNIContributions: 'false', niContsYear: ''};

  validateForm(req, res, next);

  t.is(typeof req.session[req.params.claimId].niConts, 'undefined');
});

test('should add format error to session object if sufficientNIContributions is true and niContsYear is future year', t => {
  const {req, res} = t.context.setup();

  const errors = {niContsYear: 'verify-ni-conts:form.niContsYear.errors.format.futureYear'};

  req.body = {...testData, niContsYear: '2020'};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].niConts.errors, errors);
});

test('should add format error to session object if sufficientNIContributions is true and niContsYear is before 1975', t => {
  const {req, res} = t.context.setup();

  const errors = {niContsYear: 'verify-ni-conts:form.niContsYear.errors.format.before1975'};

  req.body = {...testData, niContsYear: '1965'};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].niConts.errors, errors);
});

test('should add format error to session object if sufficientNIContributions is true and niContsYear is not a number', t => {
  const {req, res} = t.context.setup();

  const errors = {niContsYear: 'verify-ni-conts:form.niContsYear.errors.format.notNumber'};

  req.body = {...testData, niContsYear: 'not a number'};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].niConts.errors, errors);
});

test('should redirect back to GET if there are any validation errors', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, sufficientNIContributions: ''};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(res.redirectedTo, 'back');
});

test('should call next middleware if there are no validation errors', t => {
  const {req, res} = t.context.setup();

  req.body = testData;

  validateForm(req, res, () => t.pass());
});
