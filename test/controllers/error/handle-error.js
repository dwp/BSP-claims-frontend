'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const handleError = require('../../../src/pages/error');
const template = require('../../../src/pages/error/template.marko');

test('should be a function', t => {
  t.is(typeof handleError, 'function');
});

test('should render correct template', t => {
  const req = new FakeRequest('/test');
  const res = new FakeResponse(req);
  const err = new Error();

  handleError(err, req, res);
  t.deepEqual(res.template, template);
});

test('should pass correct data to template', t => {
  const req = new FakeRequest('/test');
  const res = new FakeResponse(req);
  const err = new Error();

  err.status = 404;

  handleError(err, req, res);
  t.deepEqual(res.templateData, {
    status: err.status,
    stack: err.stack,
    url: req.originalUrl
  });
});

test('should set error status to 500 if there is no status property', t => {
  const req = new FakeRequest('/test');
  const res = new FakeResponse(req);
  const err = new Error();

  handleError(err, req, res);
  t.deepEqual(res.templateData, {
    status: 500,
    stack: err.stack,
    url: req.originalUrl
  });
});
