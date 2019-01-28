'use strict';

module.exports = function (claim) {
  const {claimantDetails, partnerDetails} = claim;
  const dob = claimantDetails.dateOfBirth.match(/[\d]{4}|[\d]{2}/gm);
  const dod = partnerDetails.dateOfDeath.match(/[\d]{4}|[\d]{2}/gm);
  const doc = claim.dateOfClaim.match(/[\d]{4}|[\d]{2}/gm);
  return {
    values: {
      title: claimantDetails.title,
      nino: claim.nino,
      fullName: claimantDetails.fullName,
      dateOfBirthYear: dob[0],
      dateOfBirthMonth: dob[1],
      dateOfBirthDay: dob[2],
      sex: claimantDetails.sex,
      partnerNino: partnerDetails.nino,
      partnerTitle: partnerDetails.title,
      partnerFullName: partnerDetails.fullName,
      dateOfDeathYear: dod[0],
      dateOfDeathMonth: dod[1],
      dateOfDeathDay: dod[2],
      dateOfClaimYear: doc[0],
      dateOfClaimMonth: doc[1],
      dateOfClaimDay: doc[2]
    }
  };
};
