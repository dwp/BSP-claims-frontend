'use strict';

require('marko/node-require').install();

const test = require('ava');
const nock = require('nock');
const {
  API_URL,
  API_END_POINT_CLAIMS,
  CHANGE_HISTORY_DEPENDENT_CHILDREN_YES,
  CHANGE_HISTORY_DEPENDENT_CHILDREN_NO,
  CHANGE_HISTORY_DEPENDENT_CHILDREN_YES_PREGNANT,
  CHANGE_HISTORY_DEPENDENT_CHILDREN_NO_PREGNANT
} = require('../../../src/lib/constants');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {reviseClaimData} = require('../../../src/pages/dependent-children/functions');

test('should be a function', t => {
  t.is(typeof reviseClaimData, 'function');
});

test('should revise claim with data from locals with history as CHANGE_HISTORY_DEPENDENT_CHILDREN_YES if dependentChildren is "true" and pregnantAtDateOfDeath is "false"', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  res.locals.values = {
    dependentChildren: 'true',
    pregnantAtDateOfDeath: 'false'
  };

  const claimResponse = {
    claimId: 1,
    fullName: 'Hammond Eggs',
    eligibilityCriteria: {
      marriedAtDateOfDeath: true
    }
  };
  const claimRevision = {
    claimId: 1,
    fullName: 'Hammond Eggs',
    eligibilityCriteria: {
      marriedAtDateOfDeath: true,
      ...res.locals.values
    },
    changeInfoList: [{
      agentIdentifier: 'KONG_DISABLED',
      agentName: 'Kong Disabled',
      changeDescription: CHANGE_HISTORY_DEPENDENT_CHILDREN_YES
    }]
  };

  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, claimRevision)
    .reply(200);

  await reviseClaimData(req, res);
  t.true(mock.isDone());
});

test('should revise claim with data from locals with history as CHANGE_HISTORY_DEPENDENT_CHILDREN_NO if dependentChildren is "false" and pregnantAtDateOfDeath is "false"', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  res.locals.values = {
    dependentChildren: 'false',
    pregnantAtDateOfDeath: 'false'
  };

  const claimResponse = {
    claimId: 1,
    fullName: 'Hammond Eggs',
    eligibilityCriteria: {
      marriedAtDateOfDeath: true
    }
  };
  const claimRevision = {
    claimId: 1,
    fullName: 'Hammond Eggs',
    eligibilityCriteria: {
      marriedAtDateOfDeath: true,
      ...res.locals.values
    },
    changeInfoList: [{
      agentIdentifier: 'KONG_DISABLED',
      agentName: 'Kong Disabled',
      changeDescription: CHANGE_HISTORY_DEPENDENT_CHILDREN_NO
    }]
  };

  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, claimRevision)
    .reply(200);

  await reviseClaimData(req, res);
  t.true(mock.isDone());
});

test('should revise claim with data from locals with history as CHANGE_HISTORY_DEPENDENT_CHILDREN_YES_PREGNANT if dependentChildren is "true" and pregnantAtDateOfDeath is "true"', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  res.locals.values = {
    dependentChildren: 'true',
    pregnantAtDateOfDeath: 'true'
  };

  const claimResponse = {
    claimId: 1,
    fullName: 'Hammond Eggs',
    eligibilityCriteria: {
      marriedAtDateOfDeath: true
    }
  };
  const claimRevision = {
    claimId: 1,
    fullName: 'Hammond Eggs',
    eligibilityCriteria: {
      marriedAtDateOfDeath: true,
      ...res.locals.values
    },
    changeInfoList: [{
      agentIdentifier: 'KONG_DISABLED',
      agentName: 'Kong Disabled',
      changeDescription: CHANGE_HISTORY_DEPENDENT_CHILDREN_YES_PREGNANT
    }]
  };

  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, claimRevision)
    .reply(200);

  await reviseClaimData(req, res);
  t.true(mock.isDone());
});

test('should revise claim with data from locals with history as CHANGE_HISTORY_DEPENDENT_CHILDREN_NO_PREGNANT if dependentChildren is "false" and pregnantAtDateOfDeath is "true"', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  res.locals.values = {
    dependentChildren: 'false',
    pregnantAtDateOfDeath: 'true'
  };

  const claimResponse = {
    claimId: 1,
    fullName: 'Hammond Eggs',
    eligibilityCriteria: {
      marriedAtDateOfDeath: true
    }
  };
  const claimRevision = {
    claimId: 1,
    fullName: 'Hammond Eggs',
    eligibilityCriteria: {
      marriedAtDateOfDeath: true,
      ...res.locals.values
    },
    changeInfoList: [{
      agentIdentifier: 'KONG_DISABLED',
      agentName: 'Kong Disabled',
      changeDescription: CHANGE_HISTORY_DEPENDENT_CHILDREN_NO_PREGNANT
    }]
  };

  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, claimRevision)
    .reply(200);

  await reviseClaimData(req, res);
  t.true(mock.isDone());
});

test('should redirect to tasks-to-complete', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  res.locals.values = {
    dependentChildren: 'false',
    pregnantAtDateOfDeath: 'true'
  };
  const claimResponse = {
    claimId: 1,
    fullName: 'Hammond Eggs',
    eligibilityCriteria: {
      marriedAtDateOfDeath: true
    }
  };
  const claimRevision = {
    claimId: 1,
    fullName: 'Hammond Eggs',
    eligibilityCriteria: {
      marriedAtDateOfDeath: true,
      ...res.locals.values
    },
    changeInfoList: [{
      agentIdentifier: 'KONG_DISABLED',
      agentName: 'Kong Disabled',
      changeDescription: CHANGE_HISTORY_DEPENDENT_CHILDREN_NO_PREGNANT
    }]
  };

  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, claimRevision)
    .reply(200);

  await reviseClaimData(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/tasks-to-complete`);
  t.true(mock.isDone());
});
