'use strict';

require('marko/node-require').install();
const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/payment-details/functions');
const template = require('../../../src/pages/payment-details/template.marko');

const claimResponse = {
  paymentAccount: {
    accountType: 'UKBank',
    nameOnAccount: 'Im from the db',
    sortCode: '123456',
    accountNumber: '12345678',
    rollNumber: 'aw1345'
  }
};

test('should be a function', t => {
  t.is(typeof renderPage, 'function');
});

test('should render payment-details template', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  req.session.paymentDetails = {values: 'values'};

  renderPage(req, res);

  t.deepEqual(res.template, template);
});

test('should pass data to template, if there is any', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {testResult: 'test'};

  req.session.paymentDetails = {values};

  renderPage(req, res);

  t.deepEqual(res.templateData.values, values);
});

test('should pass errors to template, if there are any', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const errors = {testResult: 'error'};
  const values = {};

  req.session.paymentDetails = {values, errors};

  renderPage(req, res);

  t.deepEqual(res.templateData.errors, errors);
});

test('should pass claim data from storage to template, if there is any', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  req.params.claimId = 1;
  req.claim = claimResponse;

  renderPage(req, res);

  t.deepEqual(res.templateData.values, claimResponse.paymentAccount);
});

test('should set values to {} if there is no claim data in storage', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  req.params.claimId = 1;
  req.claim = {};

  renderPage(req, res);

  t.deepEqual(res.templateData.values, {});
});
