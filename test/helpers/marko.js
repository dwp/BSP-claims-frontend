'use strict';

const path = require('path');
const marko = require('marko');
const pretty = require('pretty');
const cheerio = require('cheerio');

const templatePath = path.join(__dirname, 'test.marko');
const prettyOpts = {ocd: true};

function renderSource(templateSrc, $global) {
  delete require.cache[templatePath + '.js'];
  return marko.load(
    templatePath,
    templateSrc,
    {writeToDisk: false}
  ).renderToString({$global});
}

function outputIs(t, templateSrc, expectedOutput, $global = {}) {
  const output = renderSource(templateSrc, $global);

  t.is(pretty(output, prettyOpts), pretty(expectedOutput, prettyOpts));
}

function throws(t, templateSrc, $global = {}) {
  t.throws(() => renderSource(templateSrc, $global), Error);
}

function test(t, templateSrc, cb, $global = {}) {
  const output = renderSource(templateSrc, $global);
  const $ = cheerio.load(output);
  t.context.html = output;
  t.context.$ = $;
  return cb(t);
}

module.exports = {outputIs, throws, test};
