'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const tokenary = require('../src');

test('replaces every token in one shot', async () => {
  const result = await tokenary.replaceOneShot({
    source: 'Hello, {{name}}! You have {{count}} messages.',
    pairsMap: { name: 'Ada', count: 3 },
    keyMask: '{{?}}'
  });

  assert.equal(result, 'Hello, Ada! You have 3 messages.');
});

test('reuses a compiled replacer', async () => {
  const compiledReplacer = await tokenary.compile({
    pairsMap: { status: 'ready' },
    keyMask: ':?',
    replaceMask: '[?]'
  });

  assert.equal(
    await tokenary.replace({ source: 'Service is :status.', compiledReplacer }),
    'Service is [ready].'
  );
  assert.equal(compiledReplacer(':status / :status'), '[ready] / [ready]');
});

test('treats invalid maps and replacers as identity operations', async () => {
  assert.equal(
    await tokenary.replaceOneShot({ source: null, pairsMap: [] }),
    ''
  );
  assert.equal(
    await tokenary.replace({ source: 42, compiledReplacer: null }),
    '42'
  );
});

test('handles regex characters in tokens literally', async () => {
  const result = await tokenary.replaceOneShot({
    source: '$price + $price',
    pairsMap: { price: 10 },
    keyMask: '$?'
  });

  assert.equal(result, '10 + 10');
});

test('keeps the original adapter names as aliases', () => {
  assert.equal(tokenary.compileAdapter, tokenary.compile);
  assert.equal(tokenary.replaceAdapter, tokenary.replace);
  assert.equal(tokenary.replaceOneShotAdapter, tokenary.replaceOneShot);
  assert.equal(Object.isFrozen(tokenary), true);
});

test('exposes named and default exports to ES modules', async () => {
  const imported = await import('@wolimp/tokenary');

  assert.equal(imported.compile, tokenary.compile);
  assert.equal(imported.default, tokenary);
});
