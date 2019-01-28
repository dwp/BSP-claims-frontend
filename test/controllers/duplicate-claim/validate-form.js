'use strict';

require('marko/node-require').install();
const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {validateForm} = require('../../../src/pages/duplicate-claim/functions');

const next = () => {};

const testData = {
  continueClaim: 'true'
};

test('should be a function', t => {
  t.is(typeof validateForm, 'function');
});

test('should add request body form values to res.locals if data is valid', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.body = testData;

  validateForm(req, res, next);

  t.deepEqual(res.locals.values, testData);
});

test('should not add unexpected request body form values to paymentDetails session if data is invalid', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {continueClaim: '', hackerData: 'oh no'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.continueClaim.values, {continueClaim: ''});
});

test('should add request body form values to session if data is invalid', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {continueClaim: ''};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.continueClaim.values, values);
});

test('should add presence error if nothing was selected', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {continueClaim: ''};
  const errors = {presence: 'duplicate-claim:unfinishedClaim.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.continueClaim, {values, errors});
});
