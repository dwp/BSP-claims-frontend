'use strict';

const Request = require('./fake-request');

module.exports = function (request) {
  const me = this;

  this.locals = {};
  this.kong = {};
  this.marko = function (template, data) {
    this.template = template;
    this.templateData = data;
    return this;
  };

  this.redirect = function (url) {
    me.redirectedTo = url;
    return me;
  };

  this.req = request || new Request();
  this.status = function (statusCode) {
    this.statusCode = statusCode;
    return this;
  };
};
