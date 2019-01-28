'use strict';

const test = require('ava');
const marko = require('../helpers/marko');
const html = require('../helpers/html');

const i18n = (key, opts) => String(key) + (opts ? JSON.stringify(opts) : '');

test('should throw an error if there is no history attribute',
  marko.throws,
  html`<bsp-claim-history/>`);

test('should render the correct mark up with undefined effective date',
  marko.outputIs,
  html`
    <bsp-claim-history history=[{agentIdentifier: '123', agentName: 'Hammond Eggs', changeDescription: 'Test', created:'2018-01-01'}]/>`,
  html`
    <h2 class="heading-medium">
      claim-history:heading
    </h2>
    <ol class="claim-history">
      <li class="claim-history-item">
        <h3 class="claim-history-title">
          claim-history:Test.heading
        </h3>
        <p class="claim-history-meta">
          <span data-staff-id="123" class="claim-history-agent">
            claim-history:byUserOnDate{"user":"Hammond Eggs"}
          </span>
          <span class="claim-history-date">
            date:dayMonthYear{"year":2018,"month":1,"day":1}
          </span>
        </p>
        <p class="claim-history-body">
          claim-history:Test.body
        </p>
      </li>
    </ol>`,
  {
    req: {t: i18n}
  });

test('should render the correct mark up with effective and created date',
  marko.outputIs,
  html`
    <bsp-claim-history history=[{agentIdentifier: '123', agentName: 'Hammond Eggs', changeDescription: 'Test', effectiveDate: '2018-07-12', created:'2018-01-01'}]/>`,
  html`
    <h2 class="heading-medium">
      claim-history:heading
    </h2>
    <ol class="claim-history">
      <li class="claim-history-item">
        <h3 class="claim-history-title">
          claim-history:Test.heading
        </h3>
        <p class="claim-history-meta">
          <span data-staff-id="123" class="claim-history-agent">
            claim-history:byUserOnDate{"user":"Hammond Eggs"}
          </span>
          <span class="claim-history-date">
            date:dayMonthYear{"year":2018,"month":1,"day":1}
          </span>
        </p>
        <p class="claim-history-body">
          claim-history:Test.body{"year":2018,"month":7,"day":12}
        </p>
      </li>
    </ol>`,
  {
    req: {t: i18n}
  });

test('should render the correct mark up with null effective date',
  marko.outputIs,
  html`
    <bsp-claim-history history=[{agentIdentifier: '123', agentName: 'Hammond Eggs', effectiveDate: null, changeDescription: 'Test', created:'2018-01-01'}]/>`,
  html`
    <h2 class="heading-medium">
      claim-history:heading
    </h2>
    <ol class="claim-history">
      <li class="claim-history-item">
        <h3 class="claim-history-title">
          claim-history:Test.heading
        </h3>
        <p class="claim-history-meta">
          <span data-staff-id="123" class="claim-history-agent">
            claim-history:byUserOnDate{"user":"Hammond Eggs"}
          </span>
          <span class="claim-history-date">
            date:dayMonthYear{"year":2018,"month":1,"day":1}
          </span>
        </p>
        <p class="claim-history-body">
          claim-history:Test.body
        </p>
      </li>
    </ol>`,
  {
    req: {t: i18n}
  });

test('should not render body if i18n returns an empty string',
  marko.outputIs,
  html`
    <bsp-claim-history history=[{agentIdentifier: '123', agentName: 'Hammond Eggs', changeDescription: 'Test', created:'2018-01-01'}]/>`,
  html`
    <h2 class="heading-medium">
      claim-history:heading
    </h2>
    <ol class="claim-history">
      <li class="claim-history-item">
        <h3 class="claim-history-title">
          claim-history:Test.heading
        </h3>
        <p class="claim-history-meta">
          <span data-staff-id="123" class="claim-history-agent">
            claim-history:byUserOnDate{"user":"Hammond Eggs"}
          </span>
          <span class="claim-history-date">
            date:dayMonthYear{"year":2018,"month":1,"day":1}
          </span>
        </p>
      </li>
    </ol>`,
  {
    req: {
      t(key, opts) {
        return key.indexOf('.body') > -1 ? '' : i18n(key, opts);
      }
    }
  });

test('should render date only if agent name is system_agent',
  marko.outputIs,
  html`
    <bsp-claim-history history=[{agentIdentifier: '123', agentName: 'system_agent', changeDescription: 'Test', created:'2018-01-01'}]/>`,
  html`
    <h2 class="heading-medium">
      claim-history:heading
    </h2>
    <ol class="claim-history">
      <li class="claim-history-item">
        <h3 class="claim-history-title">
          claim-history:Test.heading
        </h3>
        <p class="claim-history-meta">
          <span class="claim-history-date">
            date:dayMonthYear{"year":2018,"month":1,"day":1}
          </span>
        </p>
      </li>
    </ol>`,
  {
    req: {
      t(key, opts) {
        return key.indexOf('.body') > -1 ? '' : i18n(key, opts);
      }
    }
  });

test('should render multiple history items',
  marko.outputIs,
  html`
    <bsp-claim-history history=[
      {agentIdentifier: '123', agentName: 'Hammond Eggs', changeDescription: 'Change1', created:'2018-01-01'},
      {agentIdentifier: '123', agentName: 'Hammond Eggs', changeDescription: 'Change2', created:'2018-01-01'}
    ]/>`,
  html`
    <h2 class="heading-medium">
      claim-history:heading
    </h2>
    <ol class="claim-history">
      <li class="claim-history-item">
        <h3 class="claim-history-title">
          claim-history:Change1.heading
        </h3>
        <p class="claim-history-meta">
          <span data-staff-id="123" class="claim-history-agent">
            claim-history:byUserOnDate{"user":"Hammond Eggs"}
          </span>
          <span class="claim-history-date">
            date:dayMonthYear{"year":2018,"month":1,"day":1}
          </span>
        </p>
        <p class="claim-history-body">
          claim-history:Change1.body
        </p>
      </li>
      <li class="claim-history-item">
        <h3 class="claim-history-title">
          claim-history:Change2.heading
        </h3>
        <p class="claim-history-meta">
          <span data-staff-id="123" class="claim-history-agent">
            claim-history:byUserOnDate{"user":"Hammond Eggs"}
          </span>
          <span class="claim-history-date">
            date:dayMonthYear{"year":2018,"month":1,"day":1}
          </span>
        </p>
        <p class="claim-history-body">
          claim-history:Change2.body
        </p>
      </li>
    </ol>`,
  {
    req: {t: i18n}
  });
