'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const tokenary = require('../src');

test('replaces every token in one shot', () => {
  const result = tokenary.replaceOneShot({
    source: 'Hello, {{name}}! You have {{count}} messages.',
    pairsMap: { name: 'Ada', count: 3 },
    keyMask: '{{?}}'
  });

  assert.equal(result, 'Hello, Ada! You have 3 messages.');
});

test('reuses a compiled replacer', () => {
  const compiledReplacer = tokenary.compile({
    pairsMap: { status: 'ready' },
    keyMask: ':?',
    replaceMask: '[?]'
  });

  assert.equal(
    tokenary.replace({ source: 'Service is :status.', compiledReplacer }),
    'Service is [ready].'
  );
  assert.equal(compiledReplacer(':status / :status'), '[ready] / [ready]');
});

test('treats invalid maps and replacers as identity operations', () => {
  assert.equal(
    tokenary.replaceOneShot({ source: null, pairsMap: [] }),
    ''
  );
  assert.equal(
    tokenary.replace({ source: 42, compiledReplacer: null }),
    '42'
  );
});

test('handles regex characters in tokens literally', () => {
  const result = tokenary.replaceOneShot({
    source: '$price + $price',
    pairsMap: { price: 10 },
    keyMask: '$?'
  });

  assert.equal(result, '10 + 10');
});

test('matches longer overlapping tokens first', () => {
  const result = tokenary.replaceOneShot({
    source: 'foobar foo',
    pairsMap: { foo: 'A', foobar: 'B' }
  });

  assert.equal(result, 'B A');
});

test('exposes only the frozen public API', () => {
  assert.deepEqual(
    Object.keys(tokenary),
    ['compile', 'replace', 'replaceOneShot']
  );
  assert.equal(Object.isFrozen(tokenary), true);
});

test('exposes named and default exports to ES modules', async () => {
  const imported = await import('@wolimp/tokenary');

  assert.equal(imported.compile, tokenary.compile);
  assert.equal(imported.default, tokenary);
});
