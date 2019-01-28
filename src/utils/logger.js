'use strict';

const pino = require('../utils/pino');
const redact = require('./redact');

const request = (requestHeaders, requestData, label, url) => {
  pino.info({
    description: label,
    request: {
      url,
      requestHeaders: redact(requestHeaders),
      requestData: redact(requestData)
    }
  });
};

const response = (response, label) => {
  pino.info({
    description: label,
    interactionId: response.headers.interactionid,
    response: redact(response.body)
  });
};

if (process.env.NODE_ENV === 'test') {
  module.exports = {
    request: () => {},
    response: () => {}
  };
} else {
  module.exports = {request, response};
}
