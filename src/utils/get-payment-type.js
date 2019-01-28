'use strict';

const higher = {
  initialBenefitCode: '73130',
  monthlyBenefitCode: '73132'
};

const standard = {
  initialBenefitCode: '73129',
  monthlyBenefitCode: '73131'
};

module.exports = payment => {
  if (payment.description === 'UpratedInitialBackdating') {
    return 'BackdatedInitialUprating';
  }

  if (payment.description === 'UpratedMonthlyBackdating') {
    return 'BackdatedMonthlyUprating';
  }

  if (payment.description) {
    return payment.description;
  }

  if (payment.benefitCode === higher.initialBenefitCode ||
      payment.benefitCode === standard.initialBenefitCode) {
    return 'StandardInitial';
  }

  if (payment.paymentType === 'Irregular' && (payment.benefitCode === higher.monthlyBenefitCode ||
      payment.benefitCode === standard.monthlyBenefitCode)) {
    return 'StandardMonthly';
  }
};
