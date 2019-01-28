'use strict';

module.exports = claim => {
  const UNKNOWN = 'UnknownReason';

  if (!claim || !claim.decision || claim.decision.allow) {
    return '';
  }

  if (!Array.isArray(claim.decision.decisionCriteriaList)) {
    return UNKNOWN;
  }

  if (claim.decision.decisionCriteriaList[0]) {
    return claim.decision.decisionCriteriaList[0].criteria + claim.decision.decisionCriteriaList[0].reason || UNKNOWN;
  }

  return UNKNOWN;
};
