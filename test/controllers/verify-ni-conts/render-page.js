'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/verify-ni-conts/functions');
const template = require('../../../src/pages/verify-ni-conts/template.marko');

const claimResponse = {
  verificationList: [
    {
      category: 'niConts',
      verificationAttributeList: [
        {
          attributeName: 'year',
          attributeValue: '2018'
        }
      ]
    }
  ],
  eligibilityCriteria: {sufficientNIContributions: 'true'}
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

test('should be a function', t => {
  t.is(typeof renderPage, 'function');
});

test('should render correct template', t => {
  const {req, res} = t.context.setup();

  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.template, template);
});

test('should pass flattened verification and claim data to template as values', t => {
  const {req, res} = t.context.setup();

  const expectedData = {niContsYear: '2018', sufficientNIContributions: 'true'};

  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.templateData.values, expectedData);
});

test('should pass values from session to template instead of calling API, if they exist', t => {
  const {req, res} = t.context.setup();

  const values = {
    sufficientNIContributions: 'true',
    niContsYear: '2018'
  };
  req.claim = claimResponse;

  req.session[req.params.claimId].niConts = {values};

  renderPage(req, res);
  t.deepEqual(res.templateData.values, values);
});

test('should set ni session object to undefined after complete', t => {
  const {req, res} = t.context.setup();

  const values = {
    sufficientNIContributions: 'true',
    niContsYear: '2018'
  };
  req.claim = claimResponse;

  req.session[req.params.claimId].niConts = {values};

  renderPage(req, res);
  t.is(req.session[req.params.claimId].niConts, undefined);
});

test('should pass errors from session to template', t => {
  const {req, res} = t.context.setup();

  const values = {};
  const errors = {
    sufficientNIContributions: 'Select ‘Yes’ or ‘No’'
  };

  req.session[req.params.claimId].niConts = {errors, values};
  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.templateData.errors, errors);
});

test('should pass claimId from URL to template', t => {
  const {req, res} = t.context.setup();

  req.session[req.params.claimId].niConts = {values: {}};
  req.claim = claimResponse;

  renderPage(req, res);
  t.is(res.templateData.claimId, req.params.claimId);
});
