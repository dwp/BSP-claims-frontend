'use strict';

function handleDuplicate(error, req, res, next) {
  if (error.statusCode === 409) {
    req.session.duplicateClaim = error.response.body;
    const {values} = req.session.startNewClaim || res.locals;
    req.session.duplicateClaim.original = values;

    return res.redirect('/claim/duplicate-claim');
  }

  next(error);
}

module.exports = handleDuplicate;
