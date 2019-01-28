'use strict';

/* eslint camelcase: ["error", {properties: "never"}] */

import {serial as test} from 'ava';

const timekeeper = require('timekeeper');
const FakeRequest = require('../helpers/fake-request');
const FakeResponse = require('../helpers/fake-response');

const cookies = 'language=en; token=eyJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiYWxnIjoiUlNBLU9BRVAiLCJ0eXAiOiJKV0UifQ.bGVX5gBPMMpsQmQgSyqBOG9M0Em_Yc7xlcmuz_b6OX1SlOr3l-IRZLVuDEnqu32SFhZ9EfZoVeSynUFYF8lHEGDW4BsozR5yi38wWdVsVTPNht09B6x5vlcIoLMPYW1sKvp-EN-h5gfVQi37_AdvBvG2TUQsKoc6eNACE2uhZ7eFu_5NqSscOoWXIDl907pOrQbEOjYFZTYaW-qOSCdrIKysrjaeqXQLM6MNpc_A-KfPyZbaTdLYwZqHGe5-5JYqp9WA-ouzevKdkYUIIZ-WC8UVhxDTpMRe2wkgm_qmN79BdtqZ6M80Z4w5oQCxBa0HVxbcpngaGdZrRUfZbCBipjTZJcIu9hZJ5jdfxB2SyEPk__YQ72VTNE7gr8HGkAEJutUz0ePPu80XkNoiSvZeBsXHBzJflKsfdMZgSdo5cbtcmdf56DHySXRG_wr0Nsmjt48tlWCnwk4Mf1V-WhvIZ-mz4Wn8R40LQuNfxbUNaREBTrMm04Yg97PY56lqTxEeUgrczGxyGgmUTHJ6Bpp67nfPy7ZcbsEAwFtuJIz5gSMNl0jGe_jG_IIMoFQGVS91TS8IiTRhW5gj7v1CZNcdpRBg-7yxIWfn9PjqG0YDbDt5hCYso0tlJmw1nuhYroheBvnZIW3tj3tf5G0K4NaHR-SkXa-ZuUZZDz81Cho2eEpvNOOkPXOT81AyC8yVvkpEDEbLfIy9N2I2wDOw7AdA4F-i2y99lnSsWEe-94ynWE3e3qUp3W8_ZB2HllIFOBD1OkqluwsLrQgDcfeF1eqy5YNVDwBtFCYZfJWmG4hv2os7DU2PrmlTKFtHXsuFVSiQZPPRju2y7l2PalVZMfJUuHuV8YhcrU7BT6sx0xaAr4qaN5P8P7aiuwWYaAWIvRmdtmkA7ut6HxgYNI8wge3sUl1KnHJWT8rNj9vdEJdXKZ879ricLhHTsBzi2iJv2ACZ1E-eaxWhxUjgnJ9hQRW3MDCEvg7YJa12hbh8aDzEmQFV-3SKalrcjozfNWnJIVG_.Cl8lGsKUYt7n_xjKsF9krbUPdMixwYLe_1lYSCUVRH7dtROVw_7x1dDauggoTrReelJTFurtdbZRniZdYHxKOnSwinEt1EiZy8JHyzMmHHb2yxRydAFvL9HJpU69jq-YlCFs2qqtvjifuedIvW-u_ETF7nL1-9YPIKWoKD975oopGyUSAg1wD7BjOiPmhONCIyQlNFPZoXfPCqtM3Ni06mwfpA7TRgYCg8ZiHRbrZBqykp7-pXiJSpDXTvZxpYNzWv9U75WP0JCUwFFhX1b7qU4MeQ7lnRQDEraocuT7ODjhf-av7ZmtRPtqQ_jSA5C7jFgPOsgIcdtz4bXSRHj1nP1PECkX3MkqyCMX71S-tBbh-JGanUohdCbzpsAPMlP9PmLW8MUHZCuky4SiQ0DL5DC915BryWIJXsXS3psIHWdRyw8S9yu0QUj9wg4gzB9sqb5QjS7EZzQ6IUBrLszfMKq-hMJgkwuEel7KmKfL-iWINAurKMEeFgvgQkAno7VL1NPPIftM6wNbRhlyKTdd5DRWsHfTIX32woBa3iRlPz8QQQX8gJ6LS3lCYtIdpNxB-kpqJ7s5Fms86xW6SR9PfvDBVAmwnZYxybaFA76Y-tOayX7TXnWOoWn0Ma_MyU18q9y1uJ51zkXcEaNPizmMmpJYSE3n7bm-xheHLrQj8Y8.2-aQNBlRIXXQc86khihg7DJdqLvw1lwbLcqvNKOtTxq5SThc_InHDBVJj7LbIp3QkyYIAY2jgmd9nGx-iXX1vhyrd4Mx-9IjxqU1eMfA9IBfIJ97N3STrnWvV5Y_GDHzJbhZDVDDlKE9cx3ixfho5ieXeBkRpdEPYAPhZxY720YHI9d0AbiEJcpQzLotuJzKuaajL01aIXaRPTzV4PK8IOuxkxFrSY7F9NRaQfgam_OxX5adCIzBQ-Z-W5l3IQGWt8C5mAdjhy5zZLN694PgpCLd-ihqpuHAsXImsHtsTzGky_uIS3gRBBSJvShIMrvy7vLHVJzABVMosiW3zXrxhLjMoTMc30Qnf2cMH4HPH4D851antZ3klu3PgS-3nStIQ5-9WvlEM5cXinWM9VHk8bEfzv7mnqhuwTUv9-HsZZM.JEZKHCbBVWJulFQoESjwJxpCzvWQtNR4I0LNyLBybB8; tokenPayload=eyJzaWQiOiJlMDUzYjBmYS03ZmZmLWIwZGItYmJhYi0yMTcxMmUyZDg0NzMiLCJpYXQiOjE0OTQ4NTM4MDAsImNpcyI6eyJkd3Bfc3RhZmZpZCI6ImltdGlhekBUZWNoTGFiLkRXUC5nb3YudWsiLCJTTE9DIjoiMTIzNDU2NyIsImdpdmVubmFtZSI6IlRlc3QiLCJzdXJuYW1lIjoiVXNlciJ9LCJzdWIiOiJpbXRpYXpAVGVjaExhYi5EV1AuZ292LnVrIiwiaXNzIjoiZHdwLWFkZnMiLCJhdWQiOiJEb21haW4gVXNlcnMsRGV2ZWxvcGVycyIsInVzZXJuYW1lIjoiSW10aWF6IiwiZXhwIjoxNDk0ODg2MjAwLCJhbGciOiJIUzI1NiJ9; seen_cookie_message=yes; bruce=s%3AFn9PEuTAX7tal_4PUY0UMrF3q5_3rhgZ.xbdmJqyh4%2F1Sh0SEivEx%2FWnxhiesrozIGWIv8kZJO4s';

const payloadCookie = 'tokenPayload=eyJzaWQiOiJlMDUzYjBmYS03ZmZmLWIwZGItYmJhYi0yMTcxMmUyZDg0NzMiLCJpYXQiOjE0OTQ4NTM4MDAsImNpcyI6eyJkd3Bfc3RhZmZpZCI6ImltdGlhekBUZWNoTGFiLkRXUC5nb3YudWsiLCJTTE9DIjoiMTIzNDU2NyIsImdpdmVubmFtZSI6IlRlc3QiLCJzdXJuYW1lIjoiVXNlciJ9LCJzdWIiOiJpbXRpYXpAVGVjaExhYi5EV1AuZ292LnVrIiwiaXNzIjoiZHdwLWFkZnMiLCJhdWQiOiJEb21haW4gVXNlcnMsRGV2ZWxvcGVycyIsInVzZXJuYW1lIjoiSW10aWF6IiwiZXhwIjoxNDk0ODg2MjAwLCJhbGciOiJIUzI1NiJ9';
const payloadWithoutSLOC = 'tokenPayload=eyJzaWQiOiJlMDUzYjBmYS03ZmZmLWIwZGItYmJhYi0yMTcxMmUyZDg0NzMiLCJpYXQiOjE0OTQ4NTM4MDAsImNpcyI6eyJkd3Bfc3RhZmZpZCI6ImltdGlhekBUZWNoTGFiLkRXUC5nb3YudWsiLCJnaXZlbm5hbWUiOiJLb25nIiwic3VybmFtZSI6IkRpc2FibGVkIn0sInN1YiI6ImltdGlhekBUZWNoTGFiLkRXUC5nb3YudWsiLCJpc3MiOiJkd3AtYWRmcyIsImF1ZCI6IkRvbWFpbiBVc2VycyxEZXZlbG9wZXJzIiwidXNlcm5hbWUiOiJJbXRpYXoiLCJleHAiOjE0OTQ4ODYyMDAsImFsZyI6IkhTMjU2In0';
const payloadWithoutUsername = 'tokenPayload=eyJzaWQiOiJlMDUzYjBmYS03ZmZmLWIwZGItYmJhYi0yMTcxMmUyZDg0NzMiLCJpYXQiOjE0OTQ4NTM4MDAsImNpcyI6eyJkd3Bfc3RhZmZpZCI6ImltdGlhekBUZWNoTGFiLkRXUC5nb3YudWsiLCJTTE9DIjoiMTIzNDU2NyIsImdpdmVubmFtZSI6IktvbmciLCJzdXJuYW1lIjoiRGlzYWJsZWQifSwic3ViIjoiaW10aWF6QFRlY2hMYWIuRFdQLmdvdi51ayIsImlzcyI6ImR3cC1hZGZzIiwiYXVkIjoiRG9tYWluIFVzZXJzLERldmVsb3BlcnMiLCJleHAiOjE0OTQ4ODYyMDAsImFsZyI6IkhTMjU2In0';
const payloadWithoutDwpStaffId = 'tokenPayload=eyJzaWQiOiJlMDUzYjBmYS03ZmZmLWIwZGItYmJhYi0yMTcxMmUyZDg0NzMiLCJpYXQiOjE0OTQ4NTM4MDAsImNpcyI6eyJTTE9DIjoiMTIzNDU2NyIsImdpdmVubmFtZSI6IktvbmciLCJzdXJuYW1lIjoiRGlzYWJsZWQifSwic3ViIjoiaW10aWF6QFRlY2hMYWIuRFdQLmdvdi51ayIsImlzcyI6ImR3cC1hZGZzIiwiYXVkIjoiRG9tYWluIFVzZXJzLERldmVsb3BlcnMiLCJ1c2VybmFtZSI6IkltdGlheiIsImV4cCI6MTQ5NDg4NjIwMCwiYWxnIjoiSFMyNTYifQ';
const payloadWithoutAny = 'tokenPayload=eyJzaWQiOiJlMDUzYjBmYS03ZmZmLWIwZGItYmJhYi0yMTcxMmUyZDg0NzMiLCJpYXQiOjE0OTQ4NTM4MDAsImNpcyI6eyJ0ZXN0IjoidGVzdCJ9LCJzdWIiOiJpbXRpYXpAVGVjaExhYi5EV1AuZ292LnVrIiwiaXNzIjoiZHdwLWFkZnMiLCJhdWQiOiJEb21haW4gVXNlcnMsRGV2ZWxvcGVycyIsImV4cCI6MTQ5NDg4NjIwMCwiYWxnIjoiSFMyNTYifQ';
const payloadWithoutSurname = 'tokenPayload=eyJzaWQiOiJlMDUzYjBmYS03ZmZmLWIwZGItYmJhYi0yMTcxMmUyZDg0NzMiLCJpYXQiOjE0OTQ4NTM4MDAsImNpcyI6eyJkd3Bfc3RhZmZpZCI6ImltdGlhekBUZWNoTGFiLkRXUC5nb3YudWsiLCJTTE9DIjoiMTIzNDU2NyIsImdpdmVubmFtZSI6IktvbmcifSwic3ViIjoiaW10aWF6QFRlY2hMYWIuRFdQLmdvdi51ayIsImlzcyI6ImR3cC1hZGZzIiwiYXVkIjoiRG9tYWluIFVzZXJzLERldmVsb3BlcnMiLCJ1c2VybmFtZSI6IkltdGlheiIsImV4cCI6MTQ5NDg4NjIwMCwiYWxnIjoiSFMyNTYifQ';
const payloadWithoutGivenname = 'tokenPayload=eyJzaWQiOiJlMDUzYjBmYS03ZmZmLWIwZGItYmJhYi0yMTcxMmUyZDg0NzMiLCJpYXQiOjE0OTQ4NTM4MDAsImNpcyI6eyJkd3Bfc3RhZmZpZCI6ImltdGlhekBUZWNoTGFiLkRXUC5nb3YudWsiLCJTTE9DIjoiMTIzNDU2NyIsInN1cm5hbWUiOiJEaXNhYmxlZCJ9LCJzdWIiOiJpbXRpYXpAVGVjaExhYi5EV1AuZ292LnVrIiwiaXNzIjoiZHdwLWFkZnMiLCJhdWQiOiJEb21haW4gVXNlcnMsRGV2ZWxvcGVycyIsInVzZXJuYW1lIjoiSW10aWF6IiwiZXhwIjoxNDk0ODg2MjAwLCJhbGciOiJIUzI1NiJ9';

test.beforeEach(() => {
  timekeeper.freeze('2017-04-10');
  delete require.cache[require.resolve('../../src/middleware/kong-auth')];
});
test.afterEach(() => timekeeper.reset());

test('KONG_ENABLED=false; should export function', t => {
  process.env.KONG_ENABLED = 'false';
  const kongAuth = require('../../src/middleware/kong-auth');

  t.is(typeof kongAuth, 'function');
});

test('KONG_ENABLED=false; should set default kong values in req.user', t => {
  process.env.KONG_ENABLED = 'false';
  const kongAuth = require('../../src/middleware/kong-auth');
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  kongAuth(req, res, () => {});

  t.deepEqual(req.user, {
    sid: 'cb9c1a5b-6910-fb2f-957a-9c72a392d90d',
    iat: 1498060266,
    cis: {
      SLOC: '000000',
      dwp_staffid: 'KONG_DISABLED',
      givenname: 'Kong',
      surname: 'Disabled'
    },
    sub: 'KONG_DISABLED',
    iss: 'KONG_DISABLED',
    aud: 'KONG_DISABLED',
    username: 'Kong Disabled',
    exp: 1491868800000,
    alg: 'KONG_DISABLED'
  });
});

test('KONG_ENABLED=false; should call next', t => {
  process.env.KONG_ENABLED = 'false';
  const kongAuth = require('../../src/middleware/kong-auth');
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  t.plan(1);

  kongAuth(req, res, () => {
    t.pass();
  });
});

test('KONG_ENABLED=true; should export function', t => {
  process.env.KONG_ENABLED = 'true';
  const kongAuth = require('../../src/middleware/kong-auth');

  t.is(typeof kongAuth, 'function');
});

test('KONG_ENABLED=true; should pass a 401 error to next if there is no cookie header', t => {
  process.env.KONG_ENABLED = 'true';
  const kongAuth = require('../../src/middleware/kong-auth');
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  t.plan(3);

  kongAuth(req, res, err => {
    t.true(err instanceof Error);
    t.is(err.status, 401);
    t.is(err.message, '[authHeaderCheck] Cookie not found in headers');
  });
});

test('KONG_ENABLED=true; should pass 401 error to next if there is no payload cookie', t => {
  process.env.KONG_ENABLED = 'true';
  const kongAuth = require('../../src/middleware/kong-auth');
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.headers.cookie = 'No payload';

  t.plan(3);

  kongAuth(req, res, err => {
    t.true(err instanceof Error);
    t.is(err.status, 401);
    t.is(err.message, '[authHeaderCheck] Payload not found in cookie');
  });
});

test('KONG_ENABLED=true; should pass 401 error to next if JWT has expired', t => {
  timekeeper.freeze(new Date('2017-10-10'));
  process.env.KONG_ENABLED = 'true';
  const kongAuth = require('../../src/middleware/kong-auth');
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.headers.cookie = cookies;

  t.plan(3);

  kongAuth(req, res, err => {
    t.true(err instanceof Error);
    t.is(err.status, 401);
    t.is(err.message, '[authHeaderCheck] JWT expired');
  });
});

test('KONG_ENABLED=true; should pass 401 error to next if cis.dwp_staffid is missing', t => {
  process.env.KONG_ENABLED = 'true';
  const kongAuth = require('../../src/middleware/kong-auth');
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.headers.cookie = payloadWithoutDwpStaffId;

  t.plan(3);

  kongAuth(req, res, err => {
    t.true(err instanceof Error);
    t.is(err.status, 401);
    t.is(err.message, '[authHeaderCheck] cis.dwp_staffid missing from payload');
  });
});

test('KONG_ENABLED=true; should pass 401 error to next if cis.SLOC is missing', t => {
  process.env.KONG_ENABLED = 'true';
  const kongAuth = require('../../src/middleware/kong-auth');
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.headers.cookie = payloadWithoutSLOC;

  t.plan(3);

  kongAuth(req, res, err => {
    t.true(err instanceof Error);
    t.is(err.status, 401);
    t.is(err.message, '[authHeaderCheck] cis.SLOC missing from payload');
  });
});

test('KONG_ENABLED=true; should pass 401 error to next if cis.givenname is missing', t => {
  process.env.KONG_ENABLED = 'true';
  const kongAuth = require('../../src/middleware/kong-auth');
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.headers.cookie = payloadWithoutGivenname;

  t.plan(3);

  kongAuth(req, res, err => {
    t.true(err instanceof Error);
    t.is(err.status, 401);
    t.is(err.message, '[authHeaderCheck] cis.givenname missing from payload');
  });
});

test('KONG_ENABLED=true; should pass 401 error to next if cis.surname is missing', t => {
  process.env.KONG_ENABLED = 'true';
  const kongAuth = require('../../src/middleware/kong-auth');
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.headers.cookie = payloadWithoutSurname;

  t.plan(3);

  kongAuth(req, res, err => {
    t.true(err instanceof Error);
    t.is(err.status, 401);
    t.is(err.message, '[authHeaderCheck] cis.surname missing from payload');
  });
});

test('KONG_ENABLED=true; should pass 401 error to next if username is missing', t => {
  process.env.KONG_ENABLED = 'true';
  const kongAuth = require('../../src/middleware/kong-auth');
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.headers.cookie = payloadWithoutUsername;

  t.plan(3);

  kongAuth(req, res, err => {
    t.true(err instanceof Error);
    t.is(err.status, 401);
    t.is(err.message, '[authHeaderCheck] username missing from payload');
  });
});

test('KONG_ENABLED=true; should pass 401 error to next if all are missing', t => {
  process.env.KONG_ENABLED = 'true';
  const kongAuth = require('../../src/middleware/kong-auth');
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.headers.cookie = payloadWithoutAny;

  t.plan(3);

  kongAuth(req, res, err => {
    t.true(err instanceof Error);
    t.is(err.status, 401);
    t.is(err.message, '[authHeaderCheck] cis.dwp_staffid, cis.SLOC, cis.givenname, cis.surname, username missing from payload');
  });
});

test('KONG_ENABLED=true; should decode the JWT payload and add object to req.user', t => {
  process.env.KONG_ENABLED = 'true';
  const kongAuth = require('../../src/middleware/kong-auth');
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.headers.cookie = cookies;

  kongAuth(req, res, () => {});

  t.deepEqual(req.user, {
    sid: 'e053b0fa-7fff-b0db-bbab-21712e2d8473',
    iat: 1494853800,
    cis: {
      dwp_staffid: 'imtiaz@TechLab.DWP.gov.uk',
      SLOC: '1234567',
      givenname: 'Test',
      surname: 'User'
    },
    sub: 'imtiaz@TechLab.DWP.gov.uk',
    iss: 'dwp-adfs',
    aud: 'Domain Users,Developers',
    username: 'Test User',
    exp: 1494886200,
    alg: 'HS256'
  });
});

test('KONG_ENABLED=true; should decode the JWT payload and add cis object to res.kong when it\'s the only cookie', t => {
  process.env.KONG_ENABLED = 'true';
  const kongAuth = require('../../src/middleware/kong-auth');
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.headers.cookie = payloadCookie;

  kongAuth(req, res, () => {});

  t.deepEqual(req.user, {
    sid: 'e053b0fa-7fff-b0db-bbab-21712e2d8473',
    iat: 1494853800,
    cis: {
      dwp_staffid: 'imtiaz@TechLab.DWP.gov.uk',
      SLOC: '1234567',
      givenname: 'Test',
      surname: 'User'
    },
    sub: 'imtiaz@TechLab.DWP.gov.uk',
    iss: 'dwp-adfs',
    aud: 'Domain Users,Developers',
    username: 'Test User',
    exp: 1494886200,
    alg: 'HS256'
  });
});

test('KONG_ENABLED=true; should call next on successful decode', t => {
  process.env.KONG_ENABLED = 'true';
  const kongAuth = require('../../src/middleware/kong-auth');
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.headers.cookie = payloadCookie;

  t.plan(1);

  kongAuth(req, res, () => {
    t.pass();
  });
});
