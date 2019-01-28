'use strict';

require('marko/node-require').install();

const test = require('ava');
const nock = require('nock');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {get} = require('../../../src/pages/find-claim/functions');
const findPage = require('../../../src/pages/find-claim/template.marko');
const {API_URL} = require('../../../src/lib/constants');

test.beforeEach('find-claim', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  t.context = {req, res};
});

test('should be a function', t => {
  t.is(typeof get, 'function');
});

test('should render the find page, passing in empty object if no query string', t => {
  const {req, res} = t.context;
  get(req, res);

  t.deepEqual(t.context.res.templateData, {});
  t.deepEqual(t.context.res.template, findPage);
});

test('should render the find page, passing in errors if nino query string is empty', t => {
  const nino = '';
  t.context.req.query.nino = nino;
  get(t.context.req, t.context.res);

  t.deepEqual(t.context.res.template, findPage);
  t.deepEqual(t.context.res.templateData, {
    nino, errors: {nino: 'find-claim:form.find.errors.presence'}
  });
});

test('should render the find page, passing in errors and the nino if nino is invalid', t => {
  const nino = 'NOT A NINO';
  t.context.req.query.nino = nino;
  get(t.context.req, t.context.res);

  t.deepEqual(t.context.res.template, findPage);
  t.deepEqual(t.context.res.templateData, {
    nino, errors: {nino: 'find-claim:form.find.errors.format'}
  });
});

test('should render the find page, passing in search promise and nino if nino is valid', async t => {
  const nino = 'JJ123123D';
  t.context.req.query.nino = nino;

  const mock = nock(API_URL)
    .get('/claims')
    .query({nino})
    .reply(200, []);

  get(t.context.req, t.context.res);

  await t.context.res.templateData.searchResults;
  t.deepEqual(t.context.res.template, findPage);
  t.is(t.context.res.templateData.nino, nino);
  t.true(t.context.res.templateData.searchResults instanceof Promise);
  t.true(mock.isDone());
});

test('should call the find page url', async t => {
  const nino = 'JJ123123D';
  t.context.req.query.nino = nino;

  const mock = nock(API_URL)
    .get('/claims')
    .query({nino})
    .reply(200, []);

  get(t.context.req, t.context.res);
  await t.notThrowsAsync(t.context.res.templateData.searchResults);
  t.true(mock.isDone());
});

test('should call the find page url with one nino if sent two ninos', async t => {
  const nino = ['JJ123123D', 'AA111111G'];
  t.context.req.query.nino = nino;

  const mock = nock(API_URL)
    .get('/claims')
    .query({nino: nino[0]})
    .reply(200, []);

  get(t.context.req, t.context.res);
  await t.notThrowsAsync(t.context.res.templateData.searchResults);
  t.true(mock.isDone());
});
