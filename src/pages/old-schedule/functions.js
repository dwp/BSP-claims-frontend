'use strict';

const {getSchedule, getScheduleAndAudit} = require('../../lib/bsp');
const template = require('./template.marko');

async function renderPage(req, res) {
  let claim = {};
  const {scheduleId} = req.params;
  req.session['schedule' + scheduleId] = req.session['schedule' + scheduleId] || {};
  if (req.session['schedule' + scheduleId].visited) {
    claim = await getSchedule(scheduleId);
  } else {
    claim = await getScheduleAndAudit(req, scheduleId);
    req.session['schedule' + scheduleId].visited = true;
  }

  res.marko(template, {claim});
}

module.exports = {renderPage};
