/* eslint-disable no-var, prefer-arrow-callback */
/* global GOVUK */

$(document).ready(function () {
  'use strict';

  // Use GOV.UK shim-links-with-button-role.js to trigger a link styled to look
  // like a button, with role="button" when the space key is pressed.
  GOVUK.shimLinksWithButtonRole.init();

  var showHideContent = new GOVUK.ShowHideContent();
  showHideContent.init();

  // This prevents double submission of form
  var form = document.querySelector('form');
  var submitted = false;
  if (form) {
    form.addEventListener('submit', function (e) {
      if (submitted) {
        e.preventDefault();
      } else {
        submitted = true;
      }
    }, false);
  }
});
