'use strict';

const test = require('ava');
const marko = require('../helpers/marko');
const html = require('../helpers/html');

test('should render output of req.csrfToken() into hidden input tag',
  marko.outputIs,
  html`<bsp-csrf-token/>`,
  html`<input type="hidden" name="_csrf" value="token"/>`,
  {
    req: {
      csrfToken() {
        return 'token';
      }
    }
  }
);
