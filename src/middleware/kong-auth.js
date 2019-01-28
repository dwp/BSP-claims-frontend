'use strict';

const requiredProperties = [
  'cis.dwp_staffid',
  'cis.SLOC',
  'cis.givenname',
  'cis.surname',
  'username'
];

function getAuthError(message) {
  return Object.assign(new Error(`[authHeaderCheck] ${message}`), {status: 401});
}

function authKong(req, res, next) {
  const cookies = req.headers.cookie;

  if (cookies === undefined) {
    return next(getAuthError('Cookie not found in headers'));
  }

  const payloadStart = cookies.indexOf('tokenPayload');

  if (payloadStart === -1) {
    return next(getAuthError('Payload not found in cookie'));
  }

  const endOfToken = cookies.indexOf(';', payloadStart);
  const actualEndOfToken = (endOfToken === -1) ? cookies.length : endOfToken;
  const fullJwtEncoded = cookies.substring(payloadStart + 13, actualEndOfToken);
  const jwtString = Buffer.from(fullJwtEncoded, 'base64').toString('binary');
  const jwtObject = JSON.parse(jwtString);

  const now = new Date();

  if (typeof jwtObject.exp !== 'number' || jwtObject.exp * 1000 < now.getTime()) {
    return next(getAuthError('JWT expired'));
  }

  const missingProperties = requiredProperties.filter(path => {
    const props = path.split('.');
    let part = jwtObject;

    for (const prop of props) {
      part = part[prop];

      if (typeof part === 'undefined') {
        return true;
      }
    }

    return false;
  });

  if (missingProperties.length > 0) {
    return next(getAuthError(`${missingProperties.join(', ')} missing from payload`));
  }

  req.user = {
    ...jwtObject,
    username: jwtObject.cis.givenname + ' ' + jwtObject.cis.surname
  };

  next();
}

/* eslint camelcase: ["error", {properties: "never"}] */
function fakeKong(req, res, next) {
  req.user = {
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
    exp: new Date().getTime() + 86400000,
    alg: 'KONG_DISABLED'
  };

  next();
}

module.exports = process.env.KONG_ENABLED === 'true' ? authKong : fakeKong;
