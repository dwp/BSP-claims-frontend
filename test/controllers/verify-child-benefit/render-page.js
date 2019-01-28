'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/verify-child-benefit/functions');
const template = require('../../../src/pages/verify-child-benefit/template.marko');

const claimResponse = {
  claimantId: 1,
  title: 'Mr',
  fullName: 'Hammond Eggs',
  dateOfBirth: '1960-03-02',
  sex: 'Male',
  dateOfClaim: '2018-09-01'
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

test('should pass claim data to template as values', t => {
  const {req, res} = t.context.setup();

  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.templateData.values, claimResponse);
});

test('should flatten verifications in claim data', t => {
  const {req, res} = t.context.setup();

  const claimResp = {
    ...claimResponse,
    verificationList: [
      {
        category: 'children',
        verificationAttributeList: [
          {
            attributeName: 'CHIBinCBOL',
            attributeValue: 'true'
          },
          {
            attributeName: 'CHIB',
            attributeValue: 'CHB12345678AA'
          }
        ]
      }
    ]
  };

  const expectedTemplateData = {
    ...claimResponse,
    childrenCHIBinCBOL: 'true',
    childrenCHIB: 'CHB12345678AA'
  };
  req.claim = claimResp;

  renderPage(req, res);
  t.deepEqual(res.templateData.values, expectedTemplateData);
});

test('should pass values from session to template instead of calling API, if they exist', t => {
  const {req, res} = t.context.setup();

  const values = {
    childrenCHIBinCBOL: 'true',
    childrenCHIB: 'CHB12345678AA'
  };

  req.session[req.params.claimId].childBenefit = {values};
  req.claim = claimResponse;

  renderPage(req, res);
  t.deepEqual(res.templateData.values, values);
});

test('should pass errors from session to template', t => {
  const {req, res} = t.context.setup();

  const values = {};
  const errors = {
    childrenCHIBinCBOL: 'Select ‘Yes’ or ‘No’'
  };

  req.session[req.params.claimId].childBenefit = {errors, values};

  renderPage(req, res);
  t.deepEqual(res.templateData.errors, errors);
});

test('should pass claimId from URL to template', async t => {
  const {req, res} = t.context.setup();

  req.session[req.params.claimId].childBenefit = {values: {}};

  await renderPage(req, res);
  t.is(res.templateData.claimId, req.params.claimId);
});
