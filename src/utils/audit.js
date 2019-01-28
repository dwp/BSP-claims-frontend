'use strict';

const get = require('lodash.get');
const AWS = require('aws-sdk');
const flattenVerificationList = require('../utils/flatten-verifications');

const pino = require('../utils/pino');
const auditConstants = require('../lib/audit-constants');

AWS.config.update({region: auditConstants.AUDIT_SQS_REGION});

const sqs = new AWS.SQS();

if (auditConstants.AUDIT_SQS_FLAG === true) {
  const buildAnAttribute = (title, attribute, message) => {
    if (attribute[0] || attribute[1] || attribute[2]) {
      return {
        esiAttributeTitle: title,
        esiBeforeImage: attribute[0] || '',
        esiAfterImage: attribute[1] || '',
        esiReferenceData: attribute[2] || '',
        esiMessageText: message
      };
    }
  };

  const addAttributes = (array, attributes) => {
    for (const attribute of attributes) {
      if (attribute) {
        array.eventSpecificInformation.eventAttributes.push(attribute);
      }
    }
  };

  module.exports = {
    /* eslint max-params: ["error", 6] */
    buildAuditObject: (user, claim, revisionData, messageType, uuid, date) => {
      if (claim) {
        const messageBody = {
          carfVersion: '1.2',
          dataType: 'BUS',
          eventDateAndTime: date || new Date(),
          identifier: user.cis.dwp_staffid,
          name: user.username,
          nino: claim.nino || revisionData.nino,
          outcomeCode: auditConstants.AUDIT_CODE_SUCCESS,
          processInstance: uuid,
          sourceSystem: 'BSP',
          sourceSubSystem: 'CMS',
          eventSpecificInformation: {
            eventAttributes: []
          }
        };

        if (messageType === auditConstants.AUDIT_CHANGE_PAYMENT_DETAILS) {
          messageBody.actionCd = messageType;
          const messageDetails = 'Change Payment Details';
          messageBody.eventNumber = 'E0461010';
          const {accountType, nameOnAccount, sortCode, accountNumber, rollNumber} = claim.paymentAccount || '';
          addAttributes(
            messageBody,
            [
              buildAnAttribute('claimId', ['', '', claim.claimId], messageDetails),
              buildAnAttribute('accountType', [accountType, revisionData.paymentAccount.accountType, ''], messageDetails),
              buildAnAttribute('nameOnAccount', [nameOnAccount, revisionData.paymentAccount.nameOnAccount, ''], messageDetails),
              buildAnAttribute('sortCode', [sortCode, revisionData.paymentAccount.sortCode, ''], messageDetails),
              buildAnAttribute('accountNumber', [accountNumber, revisionData.paymentAccount.accountNumber, ''], messageDetails),
              buildAnAttribute('rollNumber', [rollNumber, revisionData.paymentAccount.rollNumber, ''], messageDetails)
            ]
          );
        } else if (messageType === auditConstants.AUDIT_CAPTURE_PAYMENT_DETAILS) {
          messageBody.actionCd = messageType;
          const messageDetails = 'Capture Payment Details';
          messageBody.eventNumber = 'E0461001';
          const {accountType, nameOnAccount, sortCode, accountNumber, rollNumber} = claim.paymentAccount || '';
          addAttributes(
            messageBody,
            [
              buildAnAttribute('claimId', ['', '', claim.claimId], messageDetails),
              buildAnAttribute('accountType', [accountType, revisionData.paymentAccount.accountType, ''], messageDetails),
              buildAnAttribute('nameOnAccount', [nameOnAccount, revisionData.paymentAccount.nameOnAccount, ''], messageDetails),
              buildAnAttribute('sortCode', [sortCode, revisionData.paymentAccount.sortCode, ''], messageDetails),
              buildAnAttribute('accountNumber', [accountNumber, revisionData.paymentAccount.accountNumber, ''], messageDetails),
              buildAnAttribute('rollNumber', [rollNumber, revisionData.paymentAccount.rollNumber, ''], messageDetails)
            ]
          );
        } else if (messageType === auditConstants.AUDIT_VERIFY_DEATH) {
          messageBody.actionCd = messageType;
          claim = flattenVerificationList(claim);
          revisionData = flattenVerificationList(revisionData);
          const messageDetails = 'Verify date of death';
          messageBody.eventNumber = 'E0461002';
          addAttributes(
            messageBody,
            [
              buildAnAttribute('claimId', ['', '', claim.claimId], messageDetails),
              buildAnAttribute('verifiedByCert', [claim.deathVerifiedByCert, revisionData.deathVerifiedByCert, ''], messageDetails),
              buildAnAttribute('verifiedInCIS', [claim.deathVerifiedInCIS, revisionData.deathVerifiedInCIS, ''], messageDetails),
              buildAnAttribute('verifiedInNIRS', [claim.deathVerifiedInNIRS, revisionData.deathVerifiedInNIRS, ''], messageDetails),
              buildAnAttribute('verifiedByBS', [claim.deathVerifiedByBS, revisionData.deathVerifiedByBS, ''], messageDetails),
              buildAnAttribute('date', [claim.deathDate, revisionData.deathDate, ''], messageDetails)
            ]
          );
        } else if (messageType === auditConstants.AUDIT_VERIFY_CHILD) {
          messageBody.actionCd = messageType;
          claim = flattenVerificationList(claim);
          revisionData = flattenVerificationList(revisionData);
          const messageDetails = 'Verify child benefit';
          messageBody.eventNumber = 'E0461005';
          addAttributes(
            messageBody,
            [
              buildAnAttribute('claimId', ['', '', claim.claimId], messageDetails),
              buildAnAttribute('CHIBinCBOL', [claim.childrenCHIBinCBOL, revisionData.childrenCHIBinCBOL, ''], messageDetails),
              buildAnAttribute('CHIB', [claim.childrenCHIB, revisionData.childrenCHIB, ''], messageDetails)
            ]
          );
        } else if (messageType === auditConstants.AUDIT_DISALLOW) {
          messageBody.actionCd = messageType;
          const messageDetails = 'Disallow a BSP claim';
          messageBody.eventNumber = 'E0461014';
          addAttributes(
            messageBody, [
              buildAnAttribute('claimId', ['', '', claim.claimId], messageDetails),
              buildAnAttribute('disallowReason', ['', get(revisionData, 'decision.decisionCriteriaList[0].criteria', '') + get(revisionData, 'decision.decisionCriteriaList[0].reason', ''), ''], messageDetails)
            ]
          );
        } else if (messageType === auditConstants.AUDIT_UPRATE_CLAIM) {
          messageBody.actionCd = messageType;
          claim = flattenVerificationList(claim);
          revisionData = flattenVerificationList(revisionData);
          const messageDetails = 'Change rate of an allowed claim';
          messageBody.eventNumber = 'E0461011';

          const eventAttributes = [
            buildAnAttribute('claimId', ['', '', claim.claimId], messageDetails)
          ];

          const depChildren = get(claim, 'eligibilityCriteria.dependentChildren', undefined);
          const depChildrenString = depChildren === undefined ? depChildren : depChildren.toString();
          const pregnant = get(claim, 'eligibilityCriteria.pregnantAtDateOfDeath', undefined);
          const pregnantString = pregnant === undefined ? pregnant : pregnant.toString();

          if ((revisionData.eligibilityCriteria.dependentChildren === 'true') !== depChildren) {
            eventAttributes.push(buildAnAttribute('dependentChildren', [depChildrenString, revisionData.eligibilityCriteria.dependentChildren, ''], messageDetails));
          }

          if ((revisionData.eligibilityCriteria.pregnantAtDateOfDeath === 'true') !== pregnant) {
            eventAttributes.push(buildAnAttribute('pregnantAtDateOfDeath', [pregnantString, revisionData.eligibilityCriteria.pregnantAtDateOfDeath, ''], messageDetails));
          }

          if (revisionData.childrenCHIB !== claim.childrenCHIB) {
            eventAttributes.push(buildAnAttribute('CHIB', [claim.childrenCHIB, revisionData.childrenCHIB, ''], messageDetails));
          }

          messageBody.eventSpecificInformation = {
            eventAttributes
          };
        } else if (messageType === auditConstants.AUDIT_VERIFY_NICONTS) {
          messageBody.actionCd = messageType;
          claim = flattenVerificationList(claim);
          revisionData = flattenVerificationList(revisionData);
          const messageDetails = 'Verify national insurance contributions';
          messageBody.eventNumber = 'E0461004';
          addAttributes(
            messageBody,
            [
              buildAnAttribute('claimId', ['', '', claim.claimId], messageDetails),
              buildAnAttribute('year', [claim.niContsYear, revisionData.niContsYear, ''], messageDetails)
            ]
          );
        } else if (messageType === auditConstants.AUDIT_VERIFY_RELATIONSHIP) {
          messageBody.actionCd = messageType;
          claim = flattenVerificationList(claim);
          revisionData = flattenVerificationList(revisionData);
          const messageDetails = 'Verify marriage/ civil partnership';
          messageBody.eventNumber = 'E0461003';
          addAttributes(
            messageBody,
            [
              buildAnAttribute('claimId', ['', '', claim.claimId], messageDetails),
              buildAnAttribute('verifedByCert', [claim.marriageVerifiedByCert, revisionData.marriageVerifiedByCert, ''], messageDetails),
              buildAnAttribute('verifiedInCIS', [claim.marriageVerifiedInCIS, revisionData.marriageVerifiedInCIS, ''], messageDetails),
              buildAnAttribute('verifiedInNIRS', [claim.marriageVerifiedInNIRS, revisionData.marriageVerifiedInNIRS, ''], messageDetails),
              buildAnAttribute('date', [claim.marriageDate, revisionData.marriageDate, ''], messageDetails)
            ]
          );
        } else if (messageType === auditConstants.AUDIT_DEPENDENT_CHILDREN) {
          messageBody.actionCd = messageType;
          const messageDetails = 'Capture dependent children details';
          const {dependentChildren, pregnantAtDateOfDeath} = claim.eligibilityCriteria || '';
          messageBody.eventNumber = 'E0461000';
          addAttributes(
            messageBody,
            [
              buildAnAttribute('claimId', ['', '', claim.claimId], messageDetails),
              buildAnAttribute('dependentChildren', [dependentChildren, revisionData.eligibilityCriteria.dependentChildren, ''], messageDetails),
              buildAnAttribute('pregnantAtDateOfDeath', [pregnantAtDateOfDeath, revisionData.eligibilityCriteria.pregnantAtDateOfDeath, ''], messageDetails)
            ]
          );
        } else if (messageType === auditConstants.AUDIT_CREATE_CLAIM) {
          messageBody.actionCd = messageType;
          const messageDetails = 'Create new BSP Claim';
          messageBody.eventNumber = 'E0460999';
          addAttributes(
            messageBody,
            [
              buildAnAttribute('claimId', ['', '', claim.claimId], messageDetails),
              buildAnAttribute('claimantDetailsTitle', ['', revisionData.claimantDetails.title, ''], messageDetails),
              buildAnAttribute('claimantDetailsName', ['', revisionData.claimantDetails.fullName, ''], messageDetails),
              buildAnAttribute('claimantDetailsDateOfBirth', ['', revisionData.claimantDetails.dateOfBirth, ''], messageDetails),
              buildAnAttribute('claimantDetailsSex', ['', revisionData.claimantDetails.sex, ''], messageDetails),
              buildAnAttribute('partnerDetailsNino', ['', revisionData.partnerDetails.nino, ''], messageDetails),
              buildAnAttribute('partnerDetailsTitle', ['', revisionData.partnerDetails.title, ''], messageDetails),
              buildAnAttribute('partnerDetailsName', ['', revisionData.partnerDetails.fullName, ''], messageDetails),
              buildAnAttribute('partnerDetailsDateOfDeath', ['', revisionData.partnerDetails.dateOfDeath, ''], messageDetails),
              buildAnAttribute('dateOfClaim', ['', revisionData.dateOfClaim, ''], messageDetails)
            ]
          );
        } else if (messageType === auditConstants.AUDIT_VIEW_CLAIM || messageType === auditConstants.AUDIT_VIEW_SCHEDULE) {
          messageBody.actionCd = auditConstants.AUDIT_VIEW_CLAIM;
          const messageDetails = 'View a BSP claim';
          messageBody.eventNumber = 'E0461009';
          addAttributes(
            messageBody,
            [
              buildAnAttribute('claimId', ['', '', claim.claimId], messageDetails),
              buildAnAttribute('scheduleId', ['', '', claim.scheduleId], messageDetails)
            ]
          );
        } else if (messageType === auditConstants.AUDIT_DECIDE_CLAIM) {
          messageBody.actionCd = messageType;
          const messageDetails = 'Confirm claim details';
          messageBody.eventNumber = 'E0461006';
          addAttributes(
            messageBody,
            [buildAnAttribute('claimId', ['', '', claim.claimId], messageDetails)]
          );
        } else if (messageType === auditConstants.AUDIT_SEARCH_CLAIM) {
          messageBody.actionCd = messageType;
          const messageDetails = 'Search for a BSP claim';
          messageBody.eventNumber = 'E0461008';
          addAttributes(
            messageBody,
            [
              buildAnAttribute('nino', ['', '', revisionData.nino], messageDetails),
              buildAnAttribute('numberOfClaimRecords', ['', '', revisionData.numberOfClaimRecords.toString()], messageDetails),
              buildAnAttribute('numberOfScheduleRecords', ['', '', revisionData.numberOfScheduleRecords.toString()], messageDetails)
            ]
          );
        } else if (messageType === auditConstants.AUDIT_STOP_CLAIM) {
          messageBody.actionCd = messageType;
          const messageDetails = 'Stop payment schedule';
          messageBody.eventNumber = 'E0461012';
          addAttributes(
            messageBody,
            [
              buildAnAttribute('claimId', ['', '', revisionData.claimId], messageDetails),
              buildAnAttribute('scheduleId', ['', '', revisionData.scheduleId], messageDetails),
              buildAnAttribute('effectiveDate', ['', revisionData.effectiveDate, ''], messageDetails),
              buildAnAttribute('reason', ['', revisionData.reason, ''], messageDetails)
            ]
          );
        } else if (messageType === auditConstants.AUDIT_DELETE_CLAIM) {
          messageBody.actionCd = messageType;
          const messageDetails = 'Delete claim details';
          messageBody.eventNumber = 'E0461015';
          addAttributes(
            messageBody,
            [buildAnAttribute('claimId', ['', '', claim.claimId], messageDetails)]
          );
        }

        return messageBody;
      }
    },
    sendMessage: messageObject => {
      if (process.env.NODE_ENV !== 'test') {
        if (auditConstants.AUDIT_SQS_QUEUE) {
          const message = {
            QueueUrl: auditConstants.AUDIT_SQS_QUEUE,
            DelaySeconds: 10,
            MessageBody: JSON.stringify(messageObject),
            MessageAttributes: {
              loggingId: {
                DataType: 'String',
                StringValue: messageObject.processInstance
              }
            }
          };
          sqs.sendMessage(message, (err, data) => {
            if (err) {
              pino.error({
                level: 'ERROR',
                timestamp: new Date(),
                err
              });
            } else {
              pino.info({data});
            }
          });
        } else {
          pino.error('AUDIT_SQS_QUEUE not set');
        }
      }
    }
  };
} else {
  module.exports = {
    buildAuditObject: () => {},
    sendMessage: () => {}
  };
}
