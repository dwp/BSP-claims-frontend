'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {renderPage} = require('../../../src/pages/confirm-claim/functions');
const template = require('../../../src/pages/confirm-claim/template.marko');

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

  req.claim = {claimId: 1};

  renderPage(req, res);
  t.deepEqual(res.template, template);
});
