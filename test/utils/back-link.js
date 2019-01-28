'use strict';

const test = require('ava');
const backLinker = require('../../src/utils/back-link');

const testBackLink = ['one', 'two', 'three'];

test('should export an object containing two functions', t => {
  t.is(typeof backLinker, 'object');
  t.is(typeof backLinker.storeBackLink, 'function');
  t.is(typeof backLinker.returnLink, 'function');
});

test('storeBackLink should return an array', t => {
  const backLink = backLinker.storeBackLink('what', testBackLink);
  t.is(typeof backLink, 'object');
});

test('storeBackLink should return ammended array', t => {
  const backLink = backLinker.storeBackLink('four', testBackLink);
  t.deepEqual([...testBackLink, 'four'], backLink);
});

test('returnLink should return the last item of an array', t => {
  const backLink = backLinker.returnLink(testBackLink, 'someView');
  t.is(backLink, 'three');
});

test('returnLink shouldnt keep stacking the same page (string) over', t => {
  const backLink = backLinker.returnLink(testBackLink, 'three');
  t.is(backLink, 'two');
});
