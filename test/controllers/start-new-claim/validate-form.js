'use strict';

require('marko/node-require').install();

const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {validateForm} = require('../../../src/pages/start-new-claim/functions');

const next = () => {};
const testData = {
  title: 'Mr',
  fullName: 'Hammond Eggs',
  nino: 'AA123123A',
  dateOfBirthDay: '11',
  dateOfBirthMonth: '11',
  dateOfBirthYear: '1985',
  sex: 'Male',
  dateOfClaimDay: '12',
  dateOfClaimMonth: '12',
  dateOfClaimYear: '2017',
  dateOfDeathDay: '12',
  dateOfDeathMonth: '12',
  dateOfDeathYear: '2017',
  partnerNino: 'AA111111A',
  partnerTitle: 'Mr',
  partnerFullName: 'Bacon N. Eggs'
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

test('should add request body form values to res.locals', t => {
  const {req, res} = t.context.setup();

  req.body = testData;

  validateForm(req, res, next);

  t.deepEqual(res.locals.values, testData);
});

test('should add request body form values to startNewClaim session if errors', t => {
  const {req, res} = t.context.setup();

  req.body = {...testData, fullName: ''};

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim.values, req.body);
});

test('should not add unexpected request body form values to res.locals', t => {
  const {req, res} = t.context.setup();

  req.body = {...testData, hackerData: 'oh no'};

  validateForm(req, res, next);

  t.deepEqual(res.locals.values, testData);
});

test('should not add unexpected request body form values to startNewClaim session', t => {
  const {req, res} = t.context.setup();

  req.body = {...testData, hackerData: 'oh no', fullName: ''};

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim.values, {...testData, fullName: ''});
});

test('should trim request body form values before adding to res.locals', t => {
  const {req, res} = t.context.setup();

  req.body = {
    title: ' Mr ',
    fullName: ' Hammond Eggs ',
    nino: '  AA123123A ',
    dateOfBirthDay: ' 11  ',
    dateOfBirthMonth: ' 11 ',
    dateOfBirthYear: ' 1985 ',
    sex: ' Male ',
    dateOfClaimDay: '  12  ',
    dateOfClaimMonth: '  12 ',
    dateOfClaimYear: ' 2017 ',
    dateOfDeathDay: '12',
    dateOfDeathMonth: '12',
    dateOfDeathYear: '2017',
    partnerNino: 'AA111111A',
    partnerTitle: 'Mr',
    partnerFullName: ' Bacon N. Eggs'
  };
  req.params.claimId = 1;

  validateForm(req, res, next);

  t.deepEqual(res.locals.values, testData);
});

test('should trim request body form values before adding to startNewClaim session', t => {
  const {req, res} = t.context.setup();

  req.body = {
    title: ' Mr ',
    fullName: '  ',
    nino: '  AA123123A ',
    dateOfBirthDay: ' 11  ',
    dateOfBirthMonth: ' 11 ',
    dateOfBirthYear: ' 1985 ',
    sex: ' Male ',
    dateOfClaimDay: '  12  ',
    dateOfClaimMonth: '  12 ',
    dateOfClaimYear: ' 2017 ',
    dateOfDeathDay: '12',
    dateOfDeathMonth: '12',
    dateOfDeathYear: '2017',
    partnerNino: 'AA111111A',
    partnerTitle: 'Mr',
    partnerFullName: 'Bacon N. Eggs '
  };

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim.values, {...testData, fullName: ''});
});

test('should add presence error to session objects if title is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, title: ''};
  const errors = {title: 'start-new-claim:form.title.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add format error to session objects if title contains invalid characters', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, title: 'Mr!@|'};
  const errors = {title: 'start-new-claim:form.title.errors.format{"invalid":"‘!’, ‘@’, ‘|’"}'};

  req.body = values;
  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add presence error to session objects if fullName is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, fullName: ''};
  const errors = {fullName: 'start-new-claim:form.fullName.errors.presence'};

  req.body = values;
  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add format error to session objects if fullName contains invalid characters', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, fullName: 'Hammond Eggs!@|'};
  const errors = {fullName: 'start-new-claim:form.fullName.errors.format{"invalid":"‘!’, ‘@’, ‘|’"}'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add presence error to session objects if nino is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, nino: ''};
  const errors = {nino: 'start-new-claim:form.nino.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add format error to session objects if nino is not in the correct format', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, nino: 'QQ123123A'};
  const errors = {nino: 'start-new-claim:form.nino.errors.format'};

  req.body = values;
  req.params.claimId = 1;
  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add presence error to session objects if all dateOfBirth fields are blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfBirthDay: '', dateOfBirthMonth: '', dateOfBirthYear: ''};
  const errors = {dateOfBirth: 'start-new-claim:form.dateOfBirth.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add future error to session objects if date of Birth is in the future', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfBirthDay: '01', dateOfBirthMonth: '01', dateOfBirthYear: '3000'};
  const errors = {dateOfBirth: 'start-new-claim:form.dateOfBirth.errors.future'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add format error to session objects if dateOfBirthDay field is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfBirthDay: ''};
  const errors = {dateOfBirth: 'start-new-claim:form.dateOfBirth.errors.format'};

  req.body = values;
  req.params.claimId = 1;
  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add format error to session objects if dateOfBirthMonth field is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfBirthMonth: ''};
  const errors = {dateOfBirth: 'start-new-claim:form.dateOfBirth.errors.format'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add format error to session objects if dateOfBirthYear field is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfBirthYear: ''};
  const errors = {dateOfBirth: 'start-new-claim:form.dateOfBirth.errors.format'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add presence error to session objects if sex field is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, sex: ''};
  const errors = {sex: 'start-new-claim:form.sex.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add presence error to session objects if sex field is something other than Male or Female', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, sex: 'Vorgon'};
  const errors = {sex: 'start-new-claim:form.sex.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add presence error to session objects if all dateOfClaim fields are blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfClaimDay: '', dateOfClaimMonth: '', dateOfClaimYear: ''};
  const errors = {dateOfClaim: 'start-new-claim:form.dateOfClaim.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add future error to session objects if date of Claim is in the future', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfClaimDay: '01', dateOfClaimMonth: '03', dateOfClaimYear: '3000'};
  const errors = {dateOfClaim: 'start-new-claim:form.dateOfClaim.errors.future'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add format error to session objects if dateOfClaimDay field is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfClaimDay: ''};
  const errors = {dateOfClaim: 'start-new-claim:form.dateOfClaim.errors.format'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add format error to session objects if dateOfClaimMonth field is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfClaimMonth: ''};
  const errors = {dateOfClaim: 'start-new-claim:form.dateOfClaim.errors.format'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add format error to session objects if dateOfClaimYear field is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfClaimYear: ''};
  const errors = {dateOfClaim: 'start-new-claim:form.dateOfClaim.errors.format'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add validation errors to session objects if dateOfClaim is before dateOfBirth', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfClaimDay: '12', dateOfClaimMonth: '12', dateOfClaimYear: '2017', dateOfBirthDay: '01', dateOfBirthMonth: '01', dateOfBirthYear: '2018'};
  const errors = {dateOfClaim: 'start-new-claim:form.dateOfClaim.errors.beforeDateOfBirth', dateOfBirth: 'start-new-claim:form.dateOfBirth.errors.afterDateOfClaim'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add validation errors to session objects if dateOfClaim is before BSP eligibility date', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfClaimDay: '12', dateOfClaimMonth: '12', dateOfClaimYear: '2016'};
  const errors = {dateOfClaim: 'start-new-claim:form.dateOfClaim.errors.eligibility'};
  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should redirect back to GET if there are any validation errors', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, fullName: ''};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(res.redirectedTo, 'back');
});

test('should call next middleware if there are no validation errors', t => {
  const {req, res} = t.context.setup();

  req.body = testData;

  validateForm(req, res, () => t.pass());
});

test('should add validation errors to session objects if nino matches partner nino', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, nino: 'AA111111A', partnerNino: 'AA111111A'};
  const errors = {nino: 'start-new-claim:form.nino.errors.ninoMatchPartner', partnerNino: 'start-new-claim:form.partnerNino.errors.ninoMatchClaimant'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add presence error to session objects if all dateOfDeath fields are blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfDeathDay: '', dateOfDeathMonth: '', dateOfDeathYear: ''};
  const errors = {dateOfDeath: 'start-new-claim:form.dateOfDeath.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add validation errors to session objects if dateOfClaim is before dateOfDeath', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfClaimDay: '12', dateOfClaimMonth: '12', dateOfClaimYear: '2017', dateOfDeathDay: '01', dateOfDeathMonth: '01', dateOfDeathYear: '2018'};
  const errors = {dateOfClaim: 'start-new-claim:form.dateOfClaim.errors.beforeDateOfDeath', dateOfDeath: 'start-new-claim:form.dateOfDeath.errors.afterDateOfClaim'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add future error to session objects if date of Death is in the future', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfDeathDay: '01', dateOfDeathMonth: '03', dateOfDeathYear: '3000'};
  const errors = {dateOfDeath: 'start-new-claim:form.dateOfDeath.errors.future'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add format error to session objects if dateOfDeathDay field is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfDeathDay: ''};
  const errors = {dateOfDeath: 'start-new-claim:form.dateOfDeath.errors.format'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add format error to session objects if dateOfDeathMonth field is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfDeathMonth: ''};
  const errors = {dateOfDeath: 'start-new-claim:form.dateOfDeath.errors.format'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add format error to session objects if dateOfDeathYear field is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfDeathYear: ''};
  const errors = {dateOfDeath: 'start-new-claim:form.dateOfDeath.errors.format'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add validation errors to session objects if dateOfDeath is before BSP eligibility date', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, dateOfDeathDay: '12', dateOfDeathMonth: '12', dateOfDeathYear: '2016'};
  const errors = {dateOfDeath: 'start-new-claim:form.dateOfDeath.errors.eligibility'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add validation errors to session objects if dateOfDeath is before dateOfBirth', t => {
  const {req, res} = t.context.setup();

  const values = {...testData,
    dateOfClaimDay: '02', dateOfClaimMonth: '01', dateOfClaimYear: '2018',
    dateOfBirthDay: '01', dateOfBirthMonth: '01', dateOfBirthYear: '2018',
    dateOfDeathDay: '10', dateOfDeathMonth: '12', dateOfDeathYear: '2017'
  };
  const errors = {dateOfDeath: 'start-new-claim:form.dateOfDeath.errors.beforeDateOfBirth', dateOfBirth: 'start-new-claim:form.dateOfBirth.errors.afterDateOfDeath'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add presence error to session objects if partnerNino field is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, partnerNino: ''};
  const errors = {partnerNino: 'start-new-claim:form.partnerNino.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add presence error to session objects if partnerTitle field is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, partnerTitle: ''};
  const errors = {partnerTitle: 'start-new-claim:form.partnerTitle.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add presence error to session objects if partnerFullName field is blank', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, partnerFullName: ''};
  const errors = {partnerFullName: 'start-new-claim:form.partnerFullName.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add format error to session objects if partnerNino is not in the correct format', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, partnerNino: 'QQ123123A'};
  const errors = {partnerNino: 'start-new-claim:form.partnerNino.errors.format'};

  req.body = values;
  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add format error to session objects if partnerTitle contains invalid characters', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, partnerTitle: 'Mr!@|'};
  const errors = {partnerTitle: 'start-new-claim:form.partnerTitle.errors.format{"invalid":"‘!’, ‘@’, ‘|’"}'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});

test('should add format error to session objects if partnerFullName contains invalid characters', t => {
  const {req, res} = t.context.setup();

  const values = {...testData, partnerFullName: 'Sam i!@|'};
  const errors = {partnerFullName: 'start-new-claim:form.partnerFullName.errors.format{"invalid":"‘!’, ‘@’, ‘|’"}'};

  req.body = values;
  validateForm(req, res, next);

  t.deepEqual(req.session.startNewClaim, {values, errors});
});
