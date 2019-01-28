'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/disallow-death-evidence/functions');
const template = require('../../../src/pages/disallow-death-evidence/template.marko');

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

test('should pass claimId from params to template', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;

  await renderPage(req, res);
  t.is(res.templateData.claimId, req.params.claimId);
});
