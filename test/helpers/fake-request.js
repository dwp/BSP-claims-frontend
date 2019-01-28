'use strict';

/* eslint camelcase: ["error", {properties: "never"}] */

module.exports = function (originalUrl, lang) {
  const me = this;

  this.user = {
    sid: 'cb9c1a5b-6910-fb2f-957a-9c72a392d90d',
    iat: 1498060266,
    cis: {
      SLOC: '000000',
      dwp_staffid: 'KONG_DISABLED'
    },
    sub: 'KONG_DISABLED',
    iss: 'KONG_DISABLED',
    aud: 'KONG_DISABLED',
    username: 'Kong Disabled',
    exp: new Date().getTime() + 86400000,
    alg: 'KONG_DISABLED'
  };
  this.body = {};
  this.headers = {};
  this.language = 'en' || lang;
  this.originalUrl = originalUrl;
  this.params = {};
  this.query = {};
  this.sessionDestroyed = false;
  this.session = {
    destroy(cb) {
      me.sessionDestroyed = true;
      return cb();
    }
  };
  this.get = function (key) {
    return this[key];
  };

  this.t = function (messageKey, data) {
    if (data) {
      return messageKey + JSON.stringify(data);
    }

    return messageKey;
  };
};
