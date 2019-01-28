'use strict';

require('marko/node-require').install();
require('lasso').configure(require('../../config/lasso'));

const test = require('ava');
const cheerio = require('cheerio');
const template = require('../../src/pages/duplicate-claim/template.marko');

// $ const {values = {}, errors = {}, claim = {}, scheduleId} = data;

const templateData = {
  created: '2018-10-15T15:53:25.718Z',
  claimId: 77,
  claimantId: 93,
  nino: 'AA123456A',
  dateOfClaim: '2018-02-02',
  claimantDetails: {
    title: 'Mr',
    fullName: 'John Son',
    dateOfBirth: '2018-02-02',
    sex: 'Female'},
  partnerDetails: {
    title: 'Mr',
    fullName: 'John',
    nino: 'AA234567A',
    dateOfDeath: '2018-02-02'},
  paymentAccount: null,
  eligibilityCriteria: null,
  changeInfoList: [
    {
      created: '2018-10-15T15:53:25.726Z',
      changeDescription: 'ClaimantDetailsEntered',
      agentName: 'Kong Disabled',
      agentIdentifier: 'KONG_DISABLED'
    }
  ],
  verificationList: null,
  decision: null,
  schedule: null
};

test.cb('render the template with the Allowed claim heading', t => {
  const out = template.createOut();
  out.stream.req = {t: key => key, language: 'en'};

  template.render({claim: {...templateData, schedule: {scheduleId: 77}}, scheduleId: 77}, out);

  out.on('finish', () => {
    const $ = cheerio.load(out.getOutput());
    t.is($('h1').text(), 'duplicate-claim:currentClaim:heading');
    t.end();
  });

  out.end();
});

test.cb('render the template with the unfinished claim heading', t => {
  const out = template.createOut({req: {csrfToken: () => 'blarg'}});
  out.stream.req = {t: key => key, language: 'en'};
  template.render({claim: {...templateData, schedule: null}, scheduleId: null}, out);

  out.on('finish', () => {
    const $ = cheerio.load(out.getOutput());
    t.is($('h1').text(), 'duplicate-claim:unfinishedClaim:heading');
    t.end();
  });

  out.end();
});

test.cb('render the template with the schedule only heading', t => {
  const out = template.createOut();
  out.stream.req = {t: key => key, language: 'en'};

  template.render({claim: {claimId: null, schedule: {scheduleId: 18}}, scheduleId: 18}, out);

  out.on('finish', () => {
    const $ = cheerio.load(out.getOutput());
    t.is($('h1').text(), 'duplicate-claim:activeSchedule:heading');
    t.end();
  });

  out.end();
});
