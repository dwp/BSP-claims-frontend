'use strict';

require('marko/node-require').install();
const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/confirm-payment-details/functions');
const template = require('../../../src/pages/confirm-payment-details/template.marko');

test('should be a function', t => {
  t.is(typeof renderPage, 'function');
});

test('should render confirm-payment-details template', t => {
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

  t.deepEqual(res.templateData.changePayment, values);
});

test('should redirect to the change-payment-details page if there is no claim data in the session', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  req.params.claimId = 1;
  req.session[1] = {
    changePayment: undefined
  };
  renderPage(req, res);

  t.is(res.redirectedTo, `/claim/${req.params.claimId}/change-payment-details`);
});
