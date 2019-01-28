'use strict';

const got = require('got');
const uuidv4 = require('uuid/v4');
const logger = require('../utils/logger');
const audit = require('../utils/audit');

const {API_URL, API_END_POINT_CLAIMANTS, API_END_POINT_CLAIMS, API_END_POINT_SCHEDULE, API_END_POINT_DECISION, FAKE_NINO, API_END_POINT_STOP} = require('./constants');
const {AUDIT_CODE_FAILURE, AUDIT_CODE_DUPLICATE, AUDIT_CREATE_CLAIM, AUDIT_DECIDE_CLAIM, AUDIT_VIEW_CLAIM, AUDIT_VIEW_SCHEDULE, AUDIT_SEARCH_CLAIM} = require('./audit-constants');

const json = true;

async function newClaimant(nino) {
  const headers = {interactionId: uuidv4()};
  const url = `${API_URL}${API_END_POINT_CLAIMANTS}`;
  logger.request(headers, nino, 'newClaimant', url);
  const fullRequest = await got.post(url, {body: {nino}, headers, json});
  logger.response(fullRequest, 'newClaimant');
  return fullRequest.body;
}

async function newClaim(req, claimantNino, claimData) {
  const headers = {interactionId: uuidv4()};
  const url = `${API_URL}${API_END_POINT_CLAIMS}`;
  let auditMessage = {};
  logger.request(headers, claimData, 'newClaim', url);
  try {
    const fullRequest = await got.post(url, {body: claimData, headers, json});
    auditMessage = audit.buildAuditObject(req.user, {claimId: fullRequest.body.claimId || '', nino: claimantNino}, claimData, AUDIT_CREATE_CLAIM, headers.interactionId);
    logger.response(fullRequest, 'newClaim');
    return fullRequest;
  } catch (error) {
    // If (error.statusCode === 409) {
    //   // Audit here?
    // }
    auditMessage = audit.buildAuditObject(req.user, {claimId: '', nino: claimantNino}, claimData, AUDIT_CREATE_CLAIM, headers.interactionId);
    if (auditMessage) {
      auditMessage.outcomeCode = error.statusCode === 409 ? AUDIT_CODE_DUPLICATE : AUDIT_CODE_FAILURE;
    }

    throw error;
  } finally {
    audit.sendMessage(auditMessage);
  }
}

async function getClaim(claimId) {
  const headers = {interactionId: uuidv4()};
  const url = `${API_URL}${API_END_POINT_CLAIMS}/${claimId}`;
  logger.request(headers, claimId, 'getClaim', url);
  const fullRequest = await got.get(url, {headers, json});
  logger.response(fullRequest, 'getClaim');
  return fullRequest.body;
}

async function getClaimAndAudit(req, claimId) {
  const headers = {interactionId: uuidv4()};
  const url = `${API_URL}${API_END_POINT_CLAIMS}/${claimId}`;
  let auditMessage = {};
  logger.request(headers, claimId, 'getClaimAndAudit', url);
  try {
    const fullRequest = await got.get(url, {headers, json});
    auditMessage = audit.buildAuditObject(req.user, {claimId, nino: fullRequest.body.nino}, {}, AUDIT_VIEW_CLAIM, headers.interactionId);
    logger.response(fullRequest, 'getClaimAndAudit');
    return fullRequest.body;
  } catch (error) {
    auditMessage = audit.buildAuditObject(req.user, {claimId, nino: FAKE_NINO}, {}, AUDIT_VIEW_CLAIM, headers.interactionId);
    auditMessage.outcomeCode = AUDIT_CODE_FAILURE;
    throw error;
  } finally {
    audit.sendMessage(auditMessage);
  }
}

async function getSchedule(scheduleId) {
  const headers = {interactionId: uuidv4()};
  const url = `${API_URL}${API_END_POINT_SCHEDULE}/${scheduleId}`;
  logger.request(headers, scheduleId, 'getClaim', url);
  const fullRequest = await got.get(url, {headers, json});
  logger.response(fullRequest, 'getSchedule');
  return fullRequest.body;
}

async function getScheduleAndAudit(req) {
  const {scheduleId} = req.params;
  const headers = {interactionId: uuidv4()};
  const url = `${API_URL}${API_END_POINT_SCHEDULE}/${scheduleId}`;
  let auditMessage = {};
  logger.request(headers, scheduleId, 'getScheduleAndAudit', url);
  try {
    const fullRequest = await got.get(url, {headers, json});
    auditMessage = audit.buildAuditObject(req.user, {scheduleId, nino: fullRequest.body.schedule.nino}, {}, AUDIT_VIEW_SCHEDULE, headers.interactionId);
    logger.response(fullRequest, 'getScheduleAndAudit');
    return fullRequest.body;
  } catch (error) {
    auditMessage = audit.buildAuditObject(req.user, {scheduleId, nino: FAKE_NINO}, {}, AUDIT_VIEW_SCHEDULE, headers.interactionId);
    auditMessage.outcomeCode = AUDIT_CODE_FAILURE;
    throw error;
  } finally {
    audit.sendMessage(auditMessage);
  }
}

async function getPotentialDecision(claimId) {
  const headers = {interactionId: uuidv4()};
  const url = `${API_URL}${API_END_POINT_CLAIMS}/${claimId}${API_END_POINT_DECISION}`;
  logger.request(headers, claimId, 'getPotentialDecision', url);
  const fullRequest = await got.get(url, {headers, json});
  logger.response(fullRequest, 'getPotentialDecision');
  return fullRequest.body.decision || false;
}

async function decideClaim(req, claimId) {
  const headers = {interactionId: uuidv4(), ...(getUserData(req))};
  const url = `${API_URL}${API_END_POINT_CLAIMS}/${claimId}${API_END_POINT_DECISION}`;
  const nino = req.session[claimId].ninoToDecide || FAKE_NINO;
  const auditMessage = audit.buildAuditObject(req.user, {claimId, nino}, {}, AUDIT_DECIDE_CLAIM, headers.interactionId);
  req.session[claimId].ninoToDecide = undefined;
  logger.request(headers, claimId, 'decideClaim', url);
  try {
    const fullRequest = await got.put(url, {headers, json});
    logger.response(fullRequest, 'decideClaim');
    return fullRequest.body;
  } catch (error) {
    if (auditMessage) {
      auditMessage.outcomeCode = AUDIT_CODE_FAILURE;
    }

    throw error;
  } finally {
    audit.sendMessage(auditMessage);
  }
}

async function findClaim(req, nino) {
  const headers = {interactionId: uuidv4()};
  const url = `${API_URL}${API_END_POINT_CLAIMS}`;
  let auditMessage = {};
  logger.request(headers, nino, 'findClaim', url);
  try {
    const fullRequest = await got.get(`${url}?nino=${nino}`, {headers, json});
    const numberOfClaimRecords = fullRequest.body.filter(claim => claim.claimId !== null).length;
    const numberOfScheduleRecords = fullRequest.body.length - numberOfClaimRecords;
    auditMessage = audit.buildAuditObject(req.user, {}, {nino, numberOfClaimRecords, numberOfScheduleRecords}, AUDIT_SEARCH_CLAIM, headers.interactionId);
    logger.response(fullRequest, 'findClaim');
    return fullRequest.body;
  } catch (error) {
    auditMessage = audit.buildAuditObject(req.user, {}, {nino}, AUDIT_SEARCH_CLAIM, headers.interactionId);
    auditMessage.outcomeCode = AUDIT_CODE_FAILURE;
    throw error;
  } finally {
    audit.sendMessage(auditMessage);
  }
}

async function reviseClaim(claimId, revisionData) {
  const headers = {interactionId: uuidv4()};
  const url = `${API_URL}${API_END_POINT_CLAIMS}/${claimId}`;

  logger.request(headers, revisionData, 'reviseClaim', url);
  const fullRequest = await got.put(url, {body: revisionData, headers, json});
  logger.response(fullRequest, 'reviseClaim');

  return fullRequest.body;
}

async function reviseAndAuditClaim(req, revisionData, claim, messageType) {
  const {claimId} = claim;
  const headers = {interactionId: uuidv4()};
  const url = `${API_URL}${API_END_POINT_CLAIMS}/${claimId}`;
  const auditMessage = audit.buildAuditObject(req.user, claim, revisionData, messageType, headers.interactionId);

  logger.request(headers, revisionData, 'reviseAndAuditClaim', url);
  try {
    const fullRequest = await got.put(url, {body: revisionData, headers, json});
    logger.response(fullRequest, 'reviseAndAuditClaim');
    return fullRequest.body;
  } catch (error) {
    if (auditMessage) {
      auditMessage.outcomeCode = AUDIT_CODE_FAILURE;
    }

    throw error;
  } finally {
    audit.sendMessage(auditMessage);
  }
}

async function stopScheduleAndAudit(req, reason, effectiveDate, messageType) {
  const {claim} = req;
  const headers = {interactionId: uuidv4()};
  const url = `${API_URL}${API_END_POINT_CLAIMS}/${claim.claimId}${API_END_POINT_STOP}`;
  const revisionData = {reason, effectiveDate, claimId: claim.claimId, scheduleId: claim.schedule.scheduleId};
  const auditMessage = audit.buildAuditObject(req.user, claim, revisionData, messageType, headers.interactionId);

  logger.request(headers, revisionData, 'stopScheduleAndAudit', url);
  try {
    const fullRequest = await got.put(url, {body: revisionData, headers, json});
    logger.response(fullRequest, 'stopScheduleAndAudit');
    return fullRequest.body;
  } catch (error) {
    const alreadyStopped = error.statusCode === 412;

    if (auditMessage) {
      auditMessage.outcomeCode = alreadyStopped ? AUDIT_CODE_DUPLICATE : AUDIT_CODE_FAILURE;
    }

    throw error;
  } finally {
    audit.sendMessage(auditMessage);
  }
}

async function deleteClaim(req, claimId, nino) {
  const headers = {
    ...(getUserData(req)),
    interactionId: uuidv4()
  };
  const url = `${API_URL}${API_END_POINT_CLAIMS}/${claimId}`;
  const auditMessage = audit.buildAuditObject(req.user, {claimId, nino}, {}, 'deleteClaim', headers.interactionId);
  logger.request(headers, {}, 'deleteClaim', url);
  try {
    const fullRequest = await got.delete(url, {headers, json});
    logger.response(fullRequest, 'deleteClaim');
    return fullRequest.body;
  } catch (error) {
    if (auditMessage) {
      auditMessage.outcomeCode = AUDIT_CODE_FAILURE;
    }

    throw error;
  } finally {
    audit.sendMessage(auditMessage);
  }
}

function getUserData(req) {
  return {
    userLocationId: req.user.cis.SLOC,
    userId: req.user.cis.dwp_staffid,
    username: req.user.username
  };
}

module.exports = {newClaimant, newClaim, getClaim, getClaimAndAudit, getSchedule, getScheduleAndAudit, getPotentialDecision, decideClaim, findClaim, reviseClaim, reviseAndAuditClaim, stopScheduleAndAudit, deleteClaim};
