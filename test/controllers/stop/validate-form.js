'use strict';

require('marko/node-require').install();
const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {validateForm} = require('../../../src/pages/stop/functions');

const next = () => {};

const testData = {
  deathDateDay: '10',
  deathDateMonth: '1',
  deathDateYear: '2016',
  prisonDateDay: '10',
  prisonDateMonth: '1',
  prisonDateYear: '2016',
  reason: 'error'
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

test('should pass error for reason to template when no reason is selected', t => {
  const {req, res} = t.context.setup();

  const errors = {reason: 'stop:form.reason.errors.presence'};

  req.body = {};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].stopClaim.errors, errors);
});

test('should pass error for death date to template when no death date is selected', t => {
  const {req, res} = t.context.setup();

  const errors = {deathDate: 'stop:form.deathDate.errors.presence'};

  req.body = {reason: 'death'};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].stopClaim.errors, errors);
});

test('should pass error for prisonDate date to template when no death date is selected', t => {
  const {req, res} = t.context.setup();

  const errors = {prisonDate: 'stop:form.prisonDate.errors.presence'};

  req.body = {reason: 'prison'};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].stopClaim.errors, errors);
});

test('should pass error for deathDate date to template when death date format is invalid', t => {
  const {req, res} = t.context.setup();

  const errors = {deathDate: 'stop:form.deathDate.errors.format'};

  req.body = {reason: 'death', deathDateDay: '13', deathDateMonth: '13', deathDateYear: '2018'};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].stopClaim.errors, errors);
});

test('should pass error for prisonDate date to template when prison date format is invalid', t => {
  const {req, res} = t.context.setup();

  const errors = {prisonDate: 'stop:form.prisonDate.errors.format'};

  req.body = {reason: 'prison', prisonDateDay: '13', prisonDateMonth: '13', prisonDateYear: '2018'};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].stopClaim.errors, errors);
});

test('should pass error for prisonDate date to template when prison date format is in the future', t => {
  const {req, res} = t.context.setup();

  const errors = {prisonDate: 'stop:form.prisonDate.errors.future'};

  req.body = {reason: 'prison', prisonDateDay: '13', prisonDateMonth: '11', prisonDateYear: '3000'};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].stopClaim.errors, errors);
});

test('should pass error for deathDate date to template when death date format is in the future', t => {
  const {req, res} = t.context.setup();

  const errors = {deathDate: 'stop:form.deathDate.errors.future'};

  req.body = {reason: 'death', deathDateDay: '13', deathDateMonth: '11', deathDateYear: '3000'};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].stopClaim.errors, errors);
});
