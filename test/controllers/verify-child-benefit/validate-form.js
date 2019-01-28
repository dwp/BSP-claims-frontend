'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {validateForm} = require('../../../src/pages/verify-child-benefit/functions');

const next = () => {};
const testData = {
  childrenCHIBinCBOL: 'true',
  childrenCHIB: 'CHB12345678AA'
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

  req.body = {...testData, childrenCHIBinCBOL: ''};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].childBenefit.values, req.body);
});

test('should not add unexpected request body form values to childBenefit session if data is invalid', t => {
  const {req, res} = t.context.setup();

  req.body = {...testData, childrenCHIBinCBOL: '', hackerData: 'oh no'};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].childBenefit.values, {...testData, childrenCHIBinCBOL: ''});
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
    childrenCHIBinCBOL: 'true',
    childrenCHIB: '  CHB12345678AA  '
  };

  validateForm(req, res, next);

  t.deepEqual(res.locals.values, testData);
});

test('should trim request body form values before adding to childBenefit session if data is invalid', t => {
  const {req, res} = t.context.setup();

  req.body = {
    childrenCHIBinCBOL: 'true',
    childrenCHIB: '  CHB12345678A  '
  };

  const expectedValues = {
    childrenCHIBinCBOL: 'true',
    childrenCHIB: 'CHB12345678A'
  };
  req.params.claimId = 1;

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].childBenefit.values, expectedValues);
});

test('should add presence error to session object if childrenCHIBinCBOL is not true or false', t => {
  const {req, res} = t.context.setup();

  const errors = {childrenCHIBinCBOL: 'child-benefit:form.childrenCHIBinCBOL.errors.presence'};

  req.body = {...testData, childrenCHIBinCBOL: ''};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].childBenefit.errors, errors);
});

test('should add presence error to session object if childrenCHIBinCBOL is true but childrenCHIB is blank', t => {
  const {req, res} = t.context.setup();

  const errors = {childrenCHIB: 'child-benefit:form.childrenCHIB.errors.presence'};

  req.body = {...testData, childrenCHIB: ''};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].childBenefit.errors, errors);
});

test('should add format error to session object if childrenCHIBinCBOL is true and childrenCHIB is invalid', t => {
  const {req, res} = t.context.setup();

  const errors = {childrenCHIB: 'child-benefit:form.childrenCHIB.errors.format'};

  req.body = {...testData, childrenCHIB: 'CHB66D'};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].childBenefit.errors, errors);
});

test('should redirect back to GET if there are any validation errors', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, childrenCHIBinCBOL: ''};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(res.redirectedTo, 'back');
});

test('should call next middleware if there are no validation errors', t => {
  const {req, res} = t.context.setup();

  req.body = testData;

  validateForm(req, res, () => t.pass());
});
