'use strict';

const test = require('ava');
const searchChangeHistory = require('../../src/utils/search-change-history');
const constants = require('../../src/lib/constants');

test('should be a funciton', t => {
  t.is(typeof searchChangeHistory, 'function');
});

test('should return true if changeInfoList contains a the specified verification message when one match string is passed', t => {
  const changeInfoList = [
    {
      changeDescription: constants.CHANGE_HISTORY_DEATH_VERIFIED
    },
    {
      changeDescription: constants.CHANGE_HISTORY_DEPENDENT_CHILDREN_YES_PREGNANT
    },
    {
      changeDescription: constants.CHANGE_HISTORY_NEW_CLAIM
    }
  ];

  t.true(searchChangeHistory(changeInfoList, constants.CHANGE_HISTORY_DEATH_VERIFIED));
});

test('should return true if changeInfoList contains one of the specified verification messages when multiple match strings are passed', t => {
  const changeInfoList = [
    {
      changeDescription: constants.CHANGE_HISTORY_DEATH_NOT_VERIFIED
    },
    {
      changeDescription: constants.CHANGE_HISTORY_DEPENDENT_CHILDREN_YES_PREGNANT
    },
    {
      changeDescription: constants.CHANGE_HISTORY_ADD_PAYMENT_DETAILS
    }
  ];

  t.true(searchChangeHistory(changeInfoList, constants.CHANGE_HISTORY_DEPENDENT_CHILDREN_YES_PREGNANT, constants.CHANGE_HISTORY_ADD_PAYMENT_DETAILS));
});

test('should return true if changeInfoList contains both', t => {
  const changeInfoList = [
    {
      changeDescription: constants.CHANGE_HISTORY_DEATH_VERIFIED
    },
    {
      changeDescription: constants.CHANGE_HISTORY_DEPENDENT_CHILDREN_YES_PREGNANT
    },
    {
      changeDescription: constants.CHANGE_HISTORY_DEATH_NOT_VERIFIED
    },
    {
      changeDescription: constants.CHANGE_HISTORY_NEW_CLAIM
    }
  ];

  t.true(searchChangeHistory(changeInfoList, constants.CHANGE_HISTORY_DEATH_VERIFIED, constants.CHANGE_HISTORY_DEPENDENT_CHILDREN_YES_PREGNANT));
});

test('should return false if any random string is passed in that doesn\'t match a changeHistory message', t => {
  const changeInfoList = [
    {
      changeDescription: constants.CHANGE_HISTORY_CHIB_VERIFIED
    },
    {
      changeDescription: constants.CHANGE_HISTORY_DEPENDENT_CHILDREN_YES_PREGNANT
    },
    {
      changeDescription: constants.CHANGE_HISTORY_NEW_CLAIM
    }
  ];

  t.false(searchChangeHistory(changeInfoList, 'RANDOM STRING TEST'));
});

test('should return false if changeInfoList is not passed any string(s) to match on', t => {
  const changeInfoList = [
    {
      changeDescription: constants.CHANGE_HISTORY_CHIB_VERIFIED
    },
    {
      changeDescription: constants.CHANGE_HISTORY_DEPENDENT_CHILDREN_YES_PREGNANT
    },
    {
      changeDescription: constants.CHANGE_HISTORY_NEW_CLAIM
    }
  ];

  t.false(searchChangeHistory(changeInfoList));
});

test('should return false if changeInfoList is passed a number to match on', t => {
  const changeInfoList = [
    {
      changeDescription: constants.CHANGE_HISTORY_CHIB_VERIFIED
    },
    {
      changeDescription: constants.CHANGE_HISTORY_DEPENDENT_CHILDREN_YES_PREGNANT
    },
    {
      changeDescription: constants.CHANGE_HISTORY_NEW_CLAIM
    }
  ];

  t.false(searchChangeHistory(changeInfoList, 1));
});

test('should return false if changeInfoList is empty', t => {
  const changeInfoList = [];

  t.false(searchChangeHistory(changeInfoList, constants.CHANGE_HISTORY_DEPENDENT_CHILDREN_YES_PREGNANT));
});
