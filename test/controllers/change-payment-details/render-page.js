'use strict';

require('marko/node-require').install();
const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/change-payment-details/functions');
const template = require('../../../src/pages/change-payment-details/template.marko');

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

test('should render change-payment-details template', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  req.session[1] = {
    changePayment: {values: 'values'}
  };

  renderPage(req, res);

  t.deepEqual(res.template, template);
});

test('should pass data to template, if there is any', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {testResult: 'test'};

  req.params.claimId = 1;
  req.session[1] = {
    changePayment: {values}
  };

  renderPage(req, res);

  t.deepEqual(res.templateData.values, values);
});

test('should pass errors to template, if there are any', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const errors = {testResult: 'error'};
  const values = {};

  req.params.claimId = 1;
  req.session[1] = {
    changePayment: {values, errors}
  };

  renderPage(req, res);

  t.deepEqual(res.templateData.errors, errors);
});

test('should pass claim data from session storage to template, if there is any', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  req.session[1] = {
    changePayment: {values: claimResponse, errors: {}}
  };
  await renderPage(req, res);
  t.deepEqual(res.templateData.values, claimResponse);
});
