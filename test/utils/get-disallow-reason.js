'use strict';

const test = require('ava');
const getDisallowReason = require('../../src/utils/get-disallow-reason');

test('should export a function', t => {
  t.is(typeof getDisallowReason, 'function');
});

test('should return an empty string if no claim provided', t => {
  const result = getDisallowReason({});
  t.is(result, '');
});

test('should return an empty string if claim has no decision', t => {
  const result = getDisallowReason({claim: {
    decision: undefined
  }});
  t.is(result, '');
});

test('should return an empty string if claim has decision is not allowed', t => {
  const result = getDisallowReason({claim: {
    decision: 'refused'
  }});
  t.is(result, '');
});

test('should return UNKNOWN if claim has decision is made but there is no criteria', t => {
  const result = getDisallowReason({claimId: 10, decision: {
    allow: false
  }});
  t.is(result, 'UnknownReason');
});

test('should return the reason if claim has decision is with a reason', t => {
  const result = getDisallowReason({
    decision: {
      allow: false,
      decisionCriteriaList: [{criteria: 'correct', reason: 'reason'}]
    }
  });
  t.is(result, 'correctreason');
});

test('should return UNKNOWN if claim has decision but incomplete criteria list', t => {
  const result = getDisallowReason({
    decision: {
      allow: false,
      decisionCriteriaList: [{criteria: undefined}]
    }
  });
  t.is(result, 'UnknownReason');
});

test('should return UNKNOWN if claim has decision with no criteria', t => {
  const result = getDisallowReason({
    decision: {
      allow: false,
      decisionCriteriaList: []
    }
  });
  t.is(result, 'UnknownReason');
});
