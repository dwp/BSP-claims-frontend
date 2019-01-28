'use strict';

const test = require('ava');
const marko = require('../helpers/marko');
const html = require('../helpers/html');

test('should render nothing if there are no link tags',
  marko.outputIs,
  html`<bsp-nav-links></bsp-nav-links>`,
  '');

test('should render the correct mark up',
  marko.outputIs,
  html`
    <bsp-nav-links>
      <@link href="/test-page" title="Test page"/>
    </bsp-nav-links>`,
  html`
    <nav class="nav-bar">
      <ul class="nav-list">
        <li class="nav-list-item">
          <a href="/test-page" class="nav-link"
            data-test-hook="test-page">
            Test page
          </a>
        </li>
      </ul>
    </nav>`);

test('should set "from" stageprompt action to $global request originalUrl',
  marko.outputIs,
  html`
    <bsp-nav-links>
      <@link href="/test-page" title="Test page"/>
    </bsp-nav-links>`,
  html`
    <nav class="nav-bar">
      <ul class="nav-list">
        <li class="nav-list-item">
          <a href="/test-page" class="nav-link"
            data-test-hook="test-page">
            Test page
          </a>
        </li>
      </ul>
    </nav>`,
  {
    req: {
      originalUrl: '/this-page'
    }
  });

test('should set "from" stageprompt action to "home" if request URL is /',
  marko.outputIs,
  html`
    <bsp-nav-links>
      <@link href="/test-page" title="Test page"/>
    </bsp-nav-links>`,
  html`
    <nav class="nav-bar">
      <ul class="nav-list">
        <li class="nav-list-item">
          <a href="/test-page" class="nav-link"
            data-test-hook="test-page">
            Test page
          </a>
        </li>
      </ul>
    </nav>`,
  {
    req: {
      originalUrl: '/'
    }
  });

test('should set "to" stageprompt action to "home" if href is /',
  marko.outputIs,
  html`
    <bsp-nav-links>
      <@link href="/" title="Home"/>
    </bsp-nav-links>`,
  html`
    <nav class="nav-bar">
      <ul class="nav-list">
        <li class="nav-list-item">
          <a href="/" class="nav-link"
            data-test-hook="home">
            Home
          </a>
        </li>
      </ul>
    </nav>`);

test('should render multiple links',
  marko.outputIs,
  html`
    <bsp-nav-links>
      <@link href="/first" title="First page"/>
      <@link href="/second" title="Second page"/>
      <@link href="/third" title="Third page"/>
    </bsp-nav-links>`,
  html`
    <nav class="nav-bar">
      <ul class="nav-list">
        <li class="nav-list-item">
          <a href="/first" class="nav-link"
            data-test-hook="first-page">
            First page
          </a>
        </li>
        <li class="nav-list-item">
          <a href="/second" class="nav-link"
            data-test-hook="second-page">
            Second page
          </a>
        </li>
        <li class="nav-list-item">
          <a href="/third" class="nav-link"
            data-test-hook="third-page">
            Third page
          </a>
        </li>
      </ul>
    </nav>`);

test('should add "nav-link-active" class to link if it shares it\'s href with the page you\'re on',
  marko.outputIs,
  html`
    <bsp-nav-links>
      <@link href="/first" title="First page"/>
      <@link href="/second" title="Second page"/>
      <@link href="/third" title="Third page"/>
    </bsp-nav-links>`,
  html`
    <nav class="nav-bar">
      <ul class="nav-list">
        <li class="nav-list-item">
          <a href="/first" class="nav-link"
            data-test-hook="first-page">
            First page
          </a>
        </li>
        <li class="nav-list-item">
          <a href="/second" class="nav-link nav-link-active"
            data-test-hook="second-page">
            Second page
          </a>
        </li>
        <li class="nav-list-item">
          <a href="/third" class="nav-link"
            data-test-hook="third-page">
            Third page
          </a>
        </li>
      </ul>
    </nav>`,
  {
    req: {
      originalUrl: '/second'
    }
  });

test('should ignore originalUrl query string during active link href comparison',
  marko.outputIs,
  html`
    <bsp-nav-links>
      <@link href="/first" title="First page"/>
      <@link href="/second" title="Second page"/>
      <@link href="/third" title="Third page"/>
    </bsp-nav-links>`,
  html`
    <nav class="nav-bar">
      <ul class="nav-list">
        <li class="nav-list-item">
          <a href="/first" class="nav-link"
            data-test-hook="first-page">
            First page
          </a>
        </li>
        <li class="nav-list-item">
          <a href="/second" class="nav-link nav-link-active"
            data-test-hook="second-page">
            Second page
          </a>
        </li>
        <li class="nav-list-item">
          <a href="/third" class="nav-link"
            data-test-hook="third-page">
            Third page
          </a>
        </li>
      </ul>
    </nav>`,
  {
    req: {
      originalUrl: '/second?foo=bar'
    }
  });
