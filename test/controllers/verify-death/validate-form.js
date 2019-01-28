'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {validateForm} = require('../../../src/pages/verify-death/functions');

const next = () => {};
const testData = {
  seenEvidence: 'true',
  deathVerifiedByCert: 'true',
  deathVerifiedInCIS: 'true',
  deathVerifiedInNIRS: 'true',
  deathVerifiedByBS: 'true',
  deathDateDay: '23',
  deathDateMonth: '03',
  deathDateYear: '1985'
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
  t.is(typeof validateForm, 'function');
});

test('should add request body form values to res.locals if data is valid', t => {
  const {req, res} = t.context.setup();

  req.body = testData;

  validateForm(req, res, next);

  t.deepEqual(res.locals.values, testData);
});

test('should add request body form values to session if data is invalid', t => {
  const {req, res} = t.context.setup();

  req.body = {...testData, seenEvidence: ''};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].death.values, req.body);
});

test('should not add unexpected request body form values to death session if data is invalid', t => {
  const {req, res} = t.context.setup();

  req.body = {...testData, seenEvidence: '', hackerData: 'oh no'};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].death.values, {...testData, seenEvidence: ''});
});

test('should not add unexpected request body form values to res.locals.values', t => {
  const {req, res} = t.context.setup();

  req.body = {...testData, hackerData: 'oh no'};

  validateForm(req, res, next);

  t.deepEqual(res.locals.values, testData);
});

test('should trim request body form values before adding res.locals.values', t => {
  const {req, res} = t.context.setup();

  req.body = {
    seenEvidence: '   true ',
    deathVerifiedByCert: ' true',
    deathVerifiedInCIS: 'true ',
    deathVerifiedInNIRS: '   true',
    deathVerifiedByBS: '  true ',
    deathDateDay: '23 ',
    deathDateMonth: ' 03',
    deathDateYear: ' 1985 '
  };

  validateForm(req, res, next);

  t.deepEqual(res.locals.values, {...testData});
});

test('should trim request body form values before adding to death session if data is invalid', t => {
  const {req, res} = t.context.setup();

  req.body = {
    seenEvidence: '',
    deathVerifiedByCert: ' true',
    deathVerifiedInCIS: 'true ',
    deathVerifiedInNIRS: '   true',
    deathVerifiedByBS: '  true ',
    deathDateDay: '23 ',
    deathDateMonth: ' 03',
    deathDateYear: ' 1985 '
  };

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].death.values, {...testData, seenEvidence: ''});
});

test('should add presence error to session object if seenEvidence is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, seenEvidence: ''};
  const errors = {seenEvidence: 'verify-death:form.seenEvidence.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].death, {values, errors});
});

test('should add presence error to session object if all evidences are blank and seenEvidence is true', t => {
  const {req, res} = t.context.setup();

  const values = {
    ...testData,
    deathVerifiedByCert: '',
    deathVerifiedInCIS: '',
    deathVerifiedInNIRS: '',
    deathVerifiedByBS: ''
  };
  const errors = {evidence: 'verify-death:form.evidence.errors.presence'};

  req.body = values;
  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].death, {values, errors});
});

test('should add presence error to session object if all deathDate fields are blank and seenEvidence is true', t => {
  const {req, res} = t.context.setup();

  const values = {
    ...testData,
    deathDateDay: '',
    deathDateMonth: '',
    deathDateYear: ''
  };
  const errors = {deathDate: 'verify-death:form.deathDate.errors.presence'};

  req.body = values;
  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].death, {values, errors});
});

test('should add format error to session object if all deathDate fields form an invalid date and seenEvidence is true', t => {
  const {req, res} = t.context.setup();

  const values = {
    ...testData,
    deathDateDay: '50',
    deathDateMonth: '20',
    deathDateYear: '9'
  };
  const errors = {deathDate: 'verify-death:form.deathDate.errors.format'};

  req.body = values;
  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].death, {values, errors});
});

test('should add future error to session object if all deathDate fields form a future date and seenEvidence is true', t => {
  const {req, res} = t.context.setup();

  const values = {
    ...testData,
    deathDateDay: '20',
    deathDateMonth: '12',
    deathDateYear: '9999'
  };
  const errors = {deathDate: 'verify-death:form.deathDate.errors.future'};

  req.body = values;
  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].death, {values, errors});
});

test('should not validate evidence and deathDate if seenEvidence is false', t => {
  const {req, res} = t.context.setup();

  const values = {
    seenEvidence: 'false',
    deathVerifiedByCert: '',
    deathVerifiedInCIS: '',
    deathVerifiedInNIRS: '',
    deathVerifiedByBS: '',
    deathDateDay: '20',
    deathDateMonth: '12',
    deathDateYear: '9999'
  };

  req.body = values;
  validateForm(req, res, next);

  t.is(typeof req.session[req.params.claimId].death, 'undefined');
});

test('should redirect back to GET if there are any validation errors', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, seenEvidence: ''};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(res.redirectedTo, 'back');
});

test('should call next middleware if there are no validation errors', t => {
  const {req, res} = t.context.setup();

  req.body = testData;

  validateForm(req, res, () => t.pass());
});
