'use strict';

const test = require('ava');
const marko = require('../helpers/marko');
const html = require('../helpers/html');

test('should render the correct markup',
  marko.outputIs,
  html`
    <bsp-summary>
      <@item name="Colour">Purple</@item>
    </bsp-summary>`,
  html`
    <dl class="data-summary">
      <dt data-test-hook="colour" class="data-summary-key">
        Colour
      </dt>
      <dd data-test-hook="colour" class="data-summary-value">
        Purple
      </dd>
    </dl>`);

test('should set test-hook as item name in lower case with spaces as dashes',
  marko.outputIs,
  html`
    <bsp-summary>
      <@item name="Favourite colour">Purple</@item>
    </bsp-summary>`,
  html`
    <dl class="data-summary">
      <dt data-test-hook="favourite-colour" class="data-summary-key">
        Favourite colour
      </dt>
      <dd data-test-hook="favourite-colour" class="data-summary-value">
        Purple
      </dd>
    </dl>`);

test('should trim spaces around test-hook',
  marko.test,
  html`
    <bsp-summary>
      <@item name=" Favourite colour ">Purple</@item>
    </bsp-summary>`,
  t => {
    const expectedVal = 'favourite-colour';
    t.is(t.context.$('dt').attr('data-test-hook'), expectedVal);
    t.is(t.context.$('dd').attr('data-test-hook'), expectedVal);
  });

test('should replace consecutive spaces in name with single dash in test-hook',
  marko.outputIs,
  html`
    <bsp-summary>
      <@item name="Favourite    colour">Purple</@item>
    </bsp-summary>`,
  html`
    <dl class="data-summary">
      <dt data-test-hook="favourite-colour" class="data-summary-key">
        Favourite    colour
      </dt>
      <dd data-test-hook="favourite-colour" class="data-summary-value">
        Purple
      </dd>
    </dl>`);

test('should handle mulitple <@item>s',
  marko.outputIs,
  html`
    <bsp-summary>
      <@item name="Favourite colour">Purple</@item>
      <@item name="Favourite food">Spaghetti</@item>
    </bsp-summary>`,
  html`
    <dl class="data-summary">
      <dt data-test-hook="favourite-colour" class="data-summary-key">
        Favourite colour
      </dt>
      <dd data-test-hook="favourite-colour" class="data-summary-value">
        Purple
      </dd>
      <dt data-test-hook="favourite-food" class="data-summary-key">
        Favourite food
      </dt>
      <dd data-test-hook="favourite-food" class="data-summary-value">
        Spaghetti
      </dd>
    </dl>`);

test('should overide generated data-test-hook with item hook attribute',
  marko.outputIs,
  html`
    <bsp-summary>
      <@item name="Favourite colour" hook="colour">Purple</@item>
    </bsp-summary>`,
  html`
    <dl class="data-summary">
      <dt data-test-hook="colour" class="data-summary-key">
        Favourite colour
      </dt>
      <dd data-test-hook="colour" class="data-summary-value">
        Purple
      </dd>
    </dl>`);
