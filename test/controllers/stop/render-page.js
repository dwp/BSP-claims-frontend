'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/stop/functions');
const template = require('../../../src/pages/stop/template.marko');

const claimResponse = {
  claimId: 1,
  claimantId: 1,
  dateOfClaim: '2018-01-09',
  claimantDetails: {
    title: 'Mr',
    fullName: 'Hammond Eggs',
    dateOfBirth: '1960-02-03',
    sex: 'Male'
  }
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

test('should export a function', t => {
  t.is(typeof renderPage, 'function');
});

test('should render correct template', t => {
  const {req, res} = t.context.setup();

  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.template, template);
});

test('should pass claimId from claim API to template', t => {
  const {req, res} = t.context.setup();

  req.claim = claimResponse;

  renderPage(req, res);
  t.is(res.templateData.claimId, claimResponse.claimId);
});

test('should pass data to template, if there is any', t => {
  const {req, res} = t.context.setup();

  const values = {testResult: 'test'};

  req.session[req.params.claimId].stopClaim = {values};

  renderPage(req, res);

  t.deepEqual(res.templateData.values, values);
});
