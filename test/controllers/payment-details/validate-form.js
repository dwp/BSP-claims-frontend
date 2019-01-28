'use strict';

require('marko/node-require').install();
const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {validateForm} = require('../../../src/pages/payment-details/functions');

const next = () => {};

const testData = {
  detailsPresent: 'yes',
  accountType: 'UKBuildingSociety',
  nameOnAccount: 'Tesy McTestface',
  sortCode: '123456',
  accountNumber: '12345678',
  rollNumber: 'roll123'
};

test('should be a function', t => {
  t.is(typeof validateForm, 'function');
});

test('should add request body form values to res.locals if data is valid', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.body = testData;

  validateForm(req, res, next);

  t.deepEqual(res.locals.values, testData);
});

test('should not add unexpected request body form values to paymentDetails session if data is invalid', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {...testData, accountType: '', hackerData: 'oh no'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.paymentDetails.values, {...testData, accountType: ''});
});

test('should add request body form values to session if data is invalid', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {...testData, detailsPresent: ''};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.paymentDetails.values, values);
});

test('should add presence error if payment details was not selected', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {...testData, detailsPresent: ''};
  const errors = {detailsPresent: 'payment-details:form.detailsPresent.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.paymentDetails, {values, errors});
});

test('should not add errors if payment details was no', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {
    accountType: '',
    nameOnAccount: '',
    sortCode: '',
    accountNumber: '',
    rollNumber: '',
    detailsPresent: 'no'
  };

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(res.locals.values, values);
});

test('should add presence error that account type was not selected', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {...testData, accountType: ''};
  const errors = {accountType: 'payment-details:form.accountType.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.paymentDetails, {values, errors});
});

test('should add presense error if account name field is blank when details present is yes', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const errors = {nameOnAccount: 'payment-details:form.nameOnAccount.errors.presence'};
  const values = {...testData, nameOnAccount: ''};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.paymentDetails, {values, errors});
});

test('should add presence error when sort code is empty', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {...testData, sortCode: ''};
  const errors = {sortCode: 'payment-details:form.sortCode.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.paymentDetails, {values, errors});
});

test('should add presence error when account number is empty', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {...testData, accountNumber: ''};
  const errors = {accountNumber: 'payment-details:form.accountNumber.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.paymentDetails, {values, errors});
});

test('should add presence error when roll number is empty', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {...testData, rollNumber: '', accountType: 'UKBuildingSociety'};
  const errors = {rollNumber: 'payment-details:form.rollNumber.errors.presence'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.paymentDetails, {values, errors});
});

test('should add format error when account name is invalid', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {...testData, nameOnAccount: 'Have pipe | will error'};
  const errors = {nameOnAccount: 'payment-details:form.nameOnAccount.errors.format{"invalid":"‘|’"}'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.paymentDetails, {values, errors});
});

test('should add format error when account number is invalid', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {...testData, accountNumber: 'asdfgdfghj'};
  const errors = {accountNumber: 'payment-details:form.accountNumber.errors.format'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.paymentDetails, {values, errors});
});

test('should add format error when sort code is invalid', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {...testData, sortCode: 'asdfgdfghj'};
  const errors = {sortCode: 'payment-details:form.sortCode.errors.format'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.paymentDetails, {values, errors});
});

test('should add format error when roll number is invalid', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {...testData, rollNumber: 'Have pipe | will error'};
  const errors = {rollNumber: 'payment-details:form.rollNumber.errors.format{"invalid":"‘|’"}'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.paymentDetails, {values, errors});
});

test('should set roll number to undefined when account type is bank', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {...testData, accountType: 'UKBank'};

  req.body = values;

  validateForm(req, res, next);

  t.is(res.locals.values.rollNumber, undefined);
});

test('should keep roll number account type is building', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {...testData};

  req.body = values;

  validateForm(req, res, next);

  t.is(res.locals.values.rollNumber, 'roll123');
});

test('should add modulus error when sort code and account number not a valid combination', t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);
  const values = {...testData, sortCode: '112233', accountNumber: '12345679'};
  const errors = {sortCode: 'payment-details:form.sortCode.errors.modulus',
    accountNumber: 'payment-details:form.accountNumber.errors.modulus'};

  req.body = values;

  validateForm(req, res, next);

  t.deepEqual(req.session.paymentDetails, {values, errors});
});
