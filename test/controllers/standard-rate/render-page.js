'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/standard-rate/functions');
const template = require('../../../src/pages/standard-rate/template.marko');

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

test('should export a function', t => {
  t.is(typeof renderPage, 'function');
});

test('should render correct template', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.template, template);
});

test('should pass clainant’s fullName from claim API to template', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  req.claim = claimResponse;

  renderPage(req, res);
  t.is(res.templateData.fullName, claimResponse.claimantDetails.fullName);
});

test('should set fullname to underfined if no data in storage', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  req.claim = {};

  renderPage(req, res);
  t.is(res.templateData.fullName, undefined);
});
