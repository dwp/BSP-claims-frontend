'use strict';

const test = require('ava');
const FakeRequest = require('../helpers/fake-request');
const FakeResponse = require('../helpers/fake-response');
const duplicate = require('../../src/middleware/duplicate');

test('should be a function', t => {
  t.is(typeof duplicate, 'function');
});

test('should pass error into next()', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  const error = new Error();

  duplicate(error, req, res, err => t.true(err === error));
});

test('should redirect to duplicate page if error code = 409', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  const error = new Error();
  error.statusCode = 409;
  error.response = {body: {}};
  req.session.duplicateClaim = {};

  duplicate(error, req, res);

  t.is(res.redirectedTo, '/claim/duplicate-claim');
});

test('should set session data if error code = 409', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  const error = new Error();
  error.statusCode = 409;
  error.response = {body: {}};

  duplicate(error, req, res);

  t.deepEqual(req.session.duplicateClaim, error.response.body);
});
