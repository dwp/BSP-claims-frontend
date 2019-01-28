'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/disallow-ni-conts/functions');
const template = require('../../../src/pages/disallow-ni-conts/template.marko');

test('should export a function', t => {
  t.is(typeof renderPage, 'function');
});

test('should render correct template', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;

  await renderPage(req, res);
  t.deepEqual(res.template, template);
});

test('should pass claimId from URL to template', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;

  await renderPage(req, res);
  t.deepEqual(res.templateData.claimId, req.params.claimId);
});
