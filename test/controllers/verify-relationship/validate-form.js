'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {validateForm} = require('../../../src/pages/verify-relationship/functions');

const next = () => {};

const testData = {
  marriedAtDateOfDeath: 'true',
  seenEvidence: 'true',
  marriageVerifiedByCert: 'true',
  marriageVerifiedInCIS: 'true',
  marriageVerifiedInNIRS: 'true',
  marriageDateDay: '23',
  marriageDateMonth: '03',
  marriageDateYear: '1985'
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

  req.body = {...testData, marriedAtDateOfDeath: ''};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].relationship.values, req.body);
});

test('should not add unexpected request body form values to relationship session if data is invalid', t => {
  const {req, res} = t.context.setup();

  req.body = {...testData, marriedAtDateOfDeath: '', hackerData: 'oh no'};

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].relationship.values, {...testData, marriedAtDateOfDeath: ''});
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
    marriedAtDateOfDeath: ' true ',
    seenEvidence: '   true ',
    marriageVerifiedByCert: ' true',
    marriageVerifiedInCIS: 'true ',
    marriageVerifiedInNIRS: '   true',
    marriageDateDay: '23 ',
    marriageDateMonth: ' 03',
    marriageDateYear: ' 1985 '
  };

  validateForm(req, res, next);

  t.deepEqual(res.locals.values, {...testData});
});

test('should trim request body form values before adding to relationship session if data is invalid', t => {
  const {req, res} = t.context.setup();

  req.body = {
    marriedAtDateOfDeath: '  ',
    seenEvidence: '   true ',
    marriageVerifiedByCert: ' true',
    marriageVerifiedInCIS: 'true ',
    marriageVerifiedInNIRS: '   true',
    marriageDateDay: '23 ',
    marriageDateMonth: ' 03',
    marriageDateYear: ' 1985 '
  };

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].relationship.values, {...testData, marriedAtDateOfDeath: ''});
});

test('should add presence error to session object if marriedAtDateOfDeath is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, marriedAtDateOfDeath: ''};
  const errors = {marriedAtDateOfDeath: 'relationship:form.marriedAtDateOfDeath.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].relationship, {values, errors});
});

test('should add presence error to session object if seenEvidence is blank and marriedAtDateOfDeath is Y', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, seenEvidence: ''};
  const errors = {seenEvidence: 'relationship:form.seenEvidence.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].relationship, {values, errors});
});

test('should add presence error to session object if all evidences are blank and seenEvidence is Y', t => {
  const {req, res} = t.context.setup();

  const values = {
    ...testData,
    marriageVerifiedByCert: '',
    marriageVerifiedInCIS: '',
    marriageVerifiedInNIRS: ''
  };
  const errors = {evidence: 'relationship:form.evidence.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].relationship, {values, errors});
});

test('should add presence error to session object if all marriageDate fields are blank and seenEvidence is Y', t => {
  const {req, res} = t.context.setup();

  const values = {
    ...testData,
    marriageDateDay: '',
    marriageDateMonth: '',
    marriageDateYear: ''
  };
  const errors = {marriageDate: 'relationship:form.marriageDate.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].relationship, {values, errors});
});

test('should add format error to session object if all marriageDate fields form an invalid date and seenEvidence is Y', t => {
  const {req, res} = t.context.setup();

  const values = {
    ...testData,
    marriageDateDay: '50',
    marriageDateMonth: '20',
    marriageDateYear: '9'
  };
  const errors = {marriageDate: 'relationship:form.marriageDate.errors.format'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].relationship, {values, errors});
});

test('should add future error to session object if all marriageDate fields form a future date and seenEvidence is Y', t => {
  const {req, res} = t.context.setup();

  const values = {
    ...testData,
    marriageDateDay: '20',
    marriageDateMonth: '12',
    marriageDateYear: '9999'
  };
  const errors = {marriageDate: 'relationship:form.marriageDate.errors.future'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session[req.params.claimId].relationship, {values, errors});
});

test('should not validate evidence and marriageDate if seenEvidence is N', t => {
  const {req, res} = t.context.setup();

  const values = {
    marriedAtDateOfDeath: 'true',
    seenEvidence: 'false',
    marriageVerifiedByCert: '',
    marriageVerifiedInCIS: '',
    marriageVerifiedInNIRS: '',
    marriageDateDay: '20',
    marriageDateMonth: '12',
    marriageDateYear: '9999'
  };

  req.body = values;

  validateForm(req, res, next);

  t.is(typeof req.session[req.params.claimId].relationship, 'undefined');
});

test('should not validate seenEvidence, evidence and marriageDate if marriedAtDateOfDeath is N', t => {
  const {req, res} = t.context.setup();

  const values = {
    marriedAtDateOfDeath: 'false',
    seenEvidence: '',
    marriageVerifiedByCert: '',
    marriageVerifiedInCIS: '',
    marriageVerifiedInNIRS: '',
    marriageDateDay: '20',
    marriageDateMonth: '12',
    marriageDateYear: '9999'
  };

  req.body = values;

  validateForm(req, res, next);

  t.is(typeof req.session[req.params.claimId].relationship, 'undefined');
});

test('should redirect back to GET if there are any validation errors', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, marriedAtDateOfDeath: ''};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(res.redirectedTo, 'back');
});

test('should call next middleware if there are no validation errors', t => {
  const {req, res} = t.context.setup();

  req.body = testData;

  validateForm(req, res, () => t.pass());
});
