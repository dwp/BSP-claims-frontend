'use strict';

module.exports = function () {
  const me = this;

  me.called = false;
  me.call = function (err) {
    if (err) {
      me.err = err;
    }

    me.called = true;
    return me;
  };
};
