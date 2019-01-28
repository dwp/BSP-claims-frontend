'use strict';

const test = require('ava');
const FakeRequest = require('../helpers/fake-request');
const FakeResponse = require('../helpers/fake-response');
const notFound = require('../../src/middleware/not-found');

test('should be a function', t => {
  t.is(typeof notFound, 'function');
});

test('should pass error into next()', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  notFound(req, res, err => t.truthy(err instanceof Error));
});

test('should set error message to Not Found', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  notFound(req, res, err => t.is(err.message, 'Not Found'));
});

test('should set status of 404 on error', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  notFound(req, res, err => t.is(err.status, 404));
});
