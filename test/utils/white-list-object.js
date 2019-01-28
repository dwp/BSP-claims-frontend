'use strict';

const test = require('ava');
const whiteListObject = require('../../src/utils/white-list-object');

test('should export a function', t => {
  t.is(typeof whiteListObject, 'function');
});

test('should return an object with only properties specified', t => {
  const object = {a: 'a', b: 'b', c: 'c', d: 'd'};
  const expectedObject = {a: 'a', c: 'c'};
  const output = whiteListObject(object, ['a', 'c']);
  t.deepEqual(output, expectedObject);
});

test('should return an object including missing properties as empty strings', t => {
  const object = {a: 'a', c: 'c'};
  const expectedObject = {a: 'a', b: '', c: 'c', d: ''};
  const output = whiteListObject(object, ['a', 'b', 'c', 'd']);
  t.deepEqual(output, expectedObject);
});

test('should replace allowed properties which aren\'t strings with empty strings', t => {
  const object = {a: 'a', b: {}, c: 5, d: false};
  const expectedObject = {a: 'a', b: '', c: '', d: ''};
  const output = whiteListObject(object, ['a', 'b', 'c', 'd']);
  t.deepEqual(output, expectedObject);
});

test('should trim leading or trailing white space from all properites', t => {
  const object = {a: 'a ', b: ' b', c: ' c ', d: '  d  '};
  const expectedObject = {a: 'a', b: 'b', c: 'c', d: 'd'};
  const output = whiteListObject(object, ['a', 'b', 'c', 'd']);
  t.deepEqual(output, expectedObject);
});

test('should return an empty object if no properties are specified', t => {
  const object = {a: 'a', b: 'b', c: 'c', d: 'd'};
  const expectedObject = {};
  const output = whiteListObject(object);
  t.deepEqual(output, expectedObject);
});

test('should return an equivolent object if object properties match specified list', t => {
  const object = {a: 'a', b: 'b', c: 'c', d: 'd'};
  const output = whiteListObject(object, ['a', 'b', 'c', 'd']);
  t.deepEqual(output, object);
});
