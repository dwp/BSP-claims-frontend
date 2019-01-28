'use strict';

const test = require('ava');
const marko = require('../helpers/marko');
const html = require('../helpers/html');

test('should throw an error if there is no name attribute',
  marko.throws,
  html`<bsp-search-box label="Enter name of cat" button-text="Search cats"/>`);

test('should throw an error if there is no label attribute',
  marko.throws,
  html`<bsp-search-box name="search" button-text="Search cats"/>`);

test('should throw an error if there is no button-text attribute',
  marko.throws,
  html`<bsp-search-box label="Enter name of cat" name="search"/>`);

test('should render the correct markup',
  marko.outputIs,
  html`
    <bsp-search-box label="Enter name of cat" name="search"
      button-text="Search cats"/>`,
  html`
    <div class="form-group search-group">
      <label for="input-search" class="form-label">
        <span>Enter name of cat</span>
      </label>
      <input type="search" name="search" id="input-search" autocomplete="off"
        class="form-control form-control-search">
      <button type="submit" class="button-search">
        <span class="visually-hidden">Search cats</span>
      </button>
    </div>`);

test('should use ID attribute value over generated IDs',
  marko.outputIs,
  html`
    <bsp-search-box label="Enter name of cat" name="search"
      button-text="Search cats" id="my-id"/>`,
  html`
    <div class="form-group search-group">
      <label for="my-id" class="form-label">
        <span>Enter name of cat</span>
      </label>
      <input type="search" name="search" id="my-id" autocomplete="off"
        class="form-control form-control-search">
      <button type="submit" class="button-search">
        <span class="visually-hidden">Search cats</span>
      </button>
    </div>`);

test('should set the value of the input using the value attribute',
  marko.outputIs,
  html`
    <bsp-search-box label="Enter name of cat" name="search" value="Tom"
      button-text="Search cats"/>`,
  html`
    <div class="form-group search-group">
      <label for="input-search" class="form-label">
        <span>Enter name of cat</span>
      </label>
      <input type="search" name="search" id="input-search" value="Tom"
        autocomplete="off" class="form-control form-control-search">
      <button type="submit" class="button-search">
        <span class="visually-hidden">Search cats</span>
      </button>
    </div>`);

test('should add error message and classes when passed an error object',
  marko.outputIs,
  html`
    <bsp-search-box label="Enter name of cat" name="search"
      error="Put something in the box" button-text="Search cats"/>`,
  html`
    <div class="form-group search-group form-group-error">
      <label for="input-search" class="form-label">
        <span>Enter name of cat</span>
        <span id="error-message-search" class="error-message">
          Put something in the box
        </span>
      </label>
      <input type="search" name="search" id="input-search" autocomplete="off"
        class="form-control form-control-search">
      <button type="submit" class="button-search">
        <span class="visually-hidden">Search cats</span>
      </button>
    </div>`);
