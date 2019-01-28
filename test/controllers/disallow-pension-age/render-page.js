'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/disallow-pension-age/functions');
const template = require('../../../src/pages/disallow-pension-age/template.marko');

const claimResponse = {
  claimId: 1,
  claimantId: 1,
  dateOfBirthDay: '9',
  dateOfBirthMonth: '01',
  dateOfBirthYear: '2018',
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

  req.session = {startNewClaim: {values: claimResponse}};

  renderPage(req, res);
  t.deepEqual(res.template, template);
});

test('should pass claimant date of dirth from claim API to template', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.session = {startNewClaim: {values: claimResponse}};

  renderPage(req, res);
  t.deepEqual(res.templateData.day, claimResponse.dateOfBirthDay);
});
