module.exports = Object.freeze({
  user: {
    username: 'Kong',
    cis: {
      /* eslint camelcase: ["error", {properties: "never"}] */
      dwp_staffid: '000'
    }
  },
  uuid: '000999000',
  changePaymentDetails: {
    messageType: 'changePay',
    claim: {
      nino: 'QQ000000A',
      claimId: '1',
      paymentAccount: {
        accountType: 'UK',
        nameOnAccount: 'Hank',
        sortCode: '131313',
        accountNumber: '00099909',
        rollNumber: 'roll my number'
      }
    },
    revisionData: {
      paymentAccount: {
        accountType: 'UK',
        nameOnAccount: 'Venture',
        sortCode: '009999',
        accountNumber: '01010101',
        rollNumber: 'rolloff'
      }
    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461010',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Change Payment Details'
        }, {
          esiAttributeTitle: 'accountType',
          esiBeforeImage: 'UK',
          esiAfterImage: 'UK',
          esiReferenceData: '',
          esiMessageText: 'Change Payment Details'
        }, {
          esiAttributeTitle: 'nameOnAccount',
          esiBeforeImage: 'Hank',
          esiAfterImage: 'Venture',
          esiReferenceData: '',
          esiMessageText: 'Change Payment Details'
        }, {
          esiAttributeTitle: 'sortCode',
          esiBeforeImage: '131313',
          esiAfterImage: '009999',
          esiReferenceData: '',
          esiMessageText: 'Change Payment Details'
        }, {
          esiAttributeTitle: 'accountNumber',
          esiBeforeImage: '00099909',
          esiAfterImage: '01010101',
          esiReferenceData: '',
          esiMessageText: 'Change Payment Details'
        }, {
          esiAttributeTitle: 'rollNumber',
          esiBeforeImage: 'roll my number',
          esiAfterImage: 'rolloff',
          esiReferenceData: '',
          esiMessageText: 'Change Payment Details'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  verifyDeath: {
    messageType: 'verifyDeath',
    claim: {
      nino: 'QQ000000A',
      claimId: '1',
      verificationList: [
        {
          category: 'death',
          verificationAttributeList: [
            {
              attributeName: 'verifiedByCert',
              attributeValue: 'false'
            },
            {
              attributeName: 'verifiedInCIS',
              attributeValue: 'false'
            },
            {
              attributeName: 'verifiedInNIRS',
              attributeValue: 'false'
            },
            {
              attributeName: 'verifiedByBS',
              attributeValue: 'false'
            },
            {
              attributeName: 'date',
              attributeValue: '2018-02-03'
            }
          ]
        }
      ]
    },
    revisionData: {
      verificationList: [
        {
          category: 'death',
          verificationAttributeList: [
            {
              attributeName: 'verifiedByCert',
              attributeValue: 'true'
            },
            {
              attributeName: 'verifiedInCIS',
              attributeValue: 'true'
            },
            {
              attributeName: 'verifiedInNIRS',
              attributeValue: 'true'
            },
            {
              attributeName: 'verifiedByBS',
              attributeValue: 'true'
            },
            {
              attributeName: 'date',
              attributeValue: '2018-02-02'
            }
          ]
        }
      ]
    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461002',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Verify date of death'
        }, {
          esiAttributeTitle: 'verifiedByCert',
          esiBeforeImage: 'false',
          esiAfterImage: 'true',
          esiReferenceData: '',
          esiMessageText: 'Verify date of death'
        }, {
          esiAttributeTitle: 'verifiedInCIS',
          esiBeforeImage: 'false',
          esiAfterImage: 'true',
          esiReferenceData: '',
          esiMessageText: 'Verify date of death'
        }, {
          esiAttributeTitle: 'verifiedInNIRS',
          esiBeforeImage: 'false',
          esiAfterImage: 'true',
          esiReferenceData: '',
          esiMessageText: 'Verify date of death'
        }, {
          esiAttributeTitle: 'verifiedByBS',
          esiBeforeImage: 'false',
          esiAfterImage: 'true',
          esiReferenceData: '',
          esiMessageText: 'Verify date of death'
        }, {
          esiAttributeTitle: 'date',
          esiBeforeImage: '2018-02-03',
          esiAfterImage: '2018-02-02',
          esiReferenceData: '',
          esiMessageText: 'Verify date of death'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  verifyRel: {
    messageType: 'verifyRel',
    claim: {
      nino: 'QQ000000A',
      claimId: '1',
      verificationList: [
        {
          category: 'marriage',
          verificationAttributeList: [
            {
              attributeName: 'verifiedByCert',
              attributeValue: 'false'
            },
            {
              attributeName: 'verifiedInCIS',
              attributeValue: 'false'
            },
            {
              attributeName: 'verifiedInNIRS',
              attributeValue: 'false'
            },
            {
              attributeName: 'date',
              attributeValue: '2018-02-03'
            }
          ]
        }
      ]
    },
    revisionData: {
      verificationList: [
        {
          category: 'marriage',
          verificationAttributeList: [
            {
              attributeName: 'verifiedByCert',
              attributeValue: 'true'
            },
            {
              attributeName: 'verifiedInCIS',
              attributeValue: 'true'
            },
            {
              attributeName: 'verifiedInNIRS',
              attributeValue: 'true'
            },
            {
              attributeName: 'date',
              attributeValue: '2018-02-02'
            }
          ]
        }
      ],
      decision: null,
      scheduleId: null,
      schedule: null
    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461003',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Verify marriage/ civil partnership'
        }, {
          esiAttributeTitle: 'verifedByCert',
          esiBeforeImage: 'false',
          esiAfterImage: 'true',
          esiReferenceData: '',
          esiMessageText: 'Verify marriage/ civil partnership'
        }, {
          esiAttributeTitle: 'verifiedInCIS',
          esiBeforeImage: 'false',
          esiAfterImage: 'true',
          esiReferenceData: '',
          esiMessageText: 'Verify marriage/ civil partnership'
        }, {
          esiAttributeTitle: 'verifiedInNIRS',
          esiBeforeImage: 'false',
          esiAfterImage: 'true',
          esiReferenceData: '',
          esiMessageText: 'Verify marriage/ civil partnership'
        }, {
          esiAttributeTitle: 'date',
          esiBeforeImage: '2018-02-03',
          esiAfterImage: '2018-02-02',
          esiReferenceData: '',
          esiMessageText: 'Verify marriage/ civil partnership'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  verifyChild: {
    messageType: 'verifyChild',
    claim: {
      nino: 'QQ000000A',
      claimId: '1',
      verificationList: [
        {
          category: 'children',
          verificationAttributeList: [
            {
              attributeName: 'CHIBinCBOL',
              attributeValue: 'false'
            },
            {
              attributeName: 'CHIB',
              attributeValue: ''
            }
          ]
        }
      ]
    },
    revisionData: {
      verificationList: [
        {
          category: 'children',
          verificationAttributeList: [
            {
              attributeName: 'CHIBinCBOL',
              attributeValue: 'true'
            },
            {
              attributeName: 'CHIB',
              attributeValue: 'CHB12345678AB'
            }
          ]
        }
      ]
    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461005',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Verify child benefit'
        }, {
          esiAttributeTitle: 'CHIBinCBOL',
          esiBeforeImage: 'false',
          esiAfterImage: 'true',
          esiReferenceData: '',
          esiMessageText: 'Verify child benefit'
        }, {
          esiAttributeTitle: 'CHIB',
          esiBeforeImage: '',
          esiAfterImage: 'CHB12345678AB',
          esiReferenceData: '',
          esiMessageText: 'Verify child benefit'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  disallowDeath: {
    messageType: 'disClaim',
    claim: {
      nino: 'QQ000000A',
      claimId: '1',
      verificationList: [],
      decision: null,
      schedule: null
    },
    revisionData: {
      verificationList: [
        {
          category: 'death',
          verificationAttributeList: [
            {
              attributeName: 'verifiedByCert',
              attributeValue: 'true'
            },
            {
              attributeName: 'verifiedInCIS',
              attributeValue: 'true'
            },
            {
              attributeName: 'verifiedInNIRS',
              attributeValue: 'true'
            },
            {
              attributeName: 'verifiedByBS',
              attributeValue: 'true'
            },
            {
              attributeName: 'date',
              attributeValue: '2018-02-02'
            }
          ]
        }
      ],
      decision:
        {
          allow: 'false',
          decisionCriteriaList: [
            {
              criteria: 'death',
              reason: 'notVerified'
            }
          ]
        }

    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461014',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Disallow a BSP claim'
        }, {
          esiAttributeTitle: 'disallowReason',
          esiBeforeImage: '',
          esiAfterImage: 'deathnotVerified',
          esiReferenceData: '',
          esiMessageText: 'Disallow a BSP claim'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  disallowSPA: {
    messageType: 'disClaim',
    claim: {
      nino: 'QQ000000A',
      claimId: '1',
      verificationList: [],
      decision: null,
      schedule: null
    },
    revisionData: {
      verificationList: [
        {
          category: 'death',
          verificationAttributeList: [
            {
              attributeName: 'name1',
              attributeValue: 'value1'
            }
          ]
        }
      ],
      decision:
        {
          allow: 'false',
          decisionCriteriaList: [
            {
              criteria: 'dateOfBirth',
              reason: 'notAsExpected'
            }
          ]
        }

    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461014',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Disallow a BSP claim'
        }, {
          esiAttributeTitle: 'disallowReason',
          esiBeforeImage: '',
          esiAfterImage: 'dateOfBirthnotAsExpected',
          esiReferenceData: '',
          esiMessageText: 'Disallow a BSP claim'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  disallowNIConts: {
    messageType: 'disClaim',
    claim: {
      nino: 'QQ000000A',
      claimId: '1',
      verificationList: [],
      decision: null,
      schedule: null
    },
    revisionData: {
      verificationList: [
        {
          category: 'niConts',
          verificationAttributeList: [
            {
              attributeName: 'year',
              attributeValue: '2017'
            }
          ]
        }
      ],
      decision:
        {
          allow: 'false',
          decisionCriteriaList: [
            {
              criteria: 'niConts',
              reason: 'notAsExpected'
            }
          ]
        }

    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461014',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Disallow a BSP claim'
        }, {
          esiAttributeTitle: 'disallowReason',
          esiBeforeImage: '',
          esiAfterImage: 'niContsnotAsExpected',
          esiReferenceData: '',
          esiMessageText: 'Disallow a BSP claim'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  disallowNotMarried: {
    messageType: 'disClaim',
    claim: {
      nino: 'QQ000000A',
      claimId: '1',
      verificationList: [],
      decision: null,
      schedule: null
    },
    revisionData: {
      verificationList: [
        {
          category: 'marriage',
          verificationAttributeList: [
            {
              attributeName: 'married',
              attributeValue: 'false'
            }
          ]
        }
      ],
      decision:
        {
          allow: 'false',
          decisionCriteriaList: [
            {
              criteria: 'marriage',
              reason: 'notAsExpected'
            }
          ]
        }

    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461014',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Disallow a BSP claim'
        }, {
          esiAttributeTitle: 'disallowReason',
          esiBeforeImage: '',
          esiAfterImage: 'marriagenotAsExpected',
          esiReferenceData: '',
          esiMessageText: 'Disallow a BSP claim'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  disallowMarriageInvalid: {
    messageType: 'disClaim',
    claim: {
      nino: 'QQ000000A',
      claimId: '1',
      verificationList: [],
      decision: null,
      schedule: null
    },
    revisionData: {
      verificationList: [
        {
          category: 'marriage',
          verificationAttributeList: [
            {
              attributeName: 'verifiedByCert',
              attributeValue: 'false'
            },
            {
              attributeName: 'verifiedInCIS',
              attributeValue: 'false'
            },
            {
              attributeName: 'verifiedInNIRS',
              attributeValue: 'false'
            },
            {
              attributeName: 'date',
              attributeValue: '2018-02-03'
            }
          ]
        }
      ],
      decision:
        {
          allow: 'false',
          decisionCriteriaList: [
            {
              criteria: 'marriage',
              reason: 'notVerified'
            }
          ]
        }

    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461014',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Disallow a BSP claim'
        }, {
          esiAttributeTitle: 'disallowReason',
          esiBeforeImage: '',
          esiAfterImage: 'marriagenotVerified',
          esiReferenceData: '',
          esiMessageText: 'Disallow a BSP claim'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  niConts: {
    messageType: 'niConts',
    claim: {
      nino: 'QQ000000A',
      claimId: '1',
      verificationList: [
        {
          category: 'niConts',
          verificationAttributeList: [
            {
              attributeName: 'year',
              attributeValue: ''
            }
          ]
        }
      ]
    },
    revisionData: {
      verificationList: [
        {
          category: 'niConts',
          verificationAttributeList: [
            {
              attributeName: 'year',
              attributeValue: '2000'
            }
          ]
        }
      ]
    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461004',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Verify national insurance contributions'
        }, {
          esiAttributeTitle: 'year',
          esiBeforeImage: '',
          esiAfterImage: '2000',
          esiReferenceData: '',
          esiMessageText: 'Verify national insurance contributions'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  capDepChild: {
    messageType: 'capDepChild',
    claim: {
      nino: 'QQ000000A',
      claimId: '1',
      eligibilityCriteria: {
        dependentChildren: 'false',
        pregnantAtDateOfDeath: 'false'
      }
    },
    revisionData: {
      eligibilityCriteria: {
        dependentChildren: 'true',
        pregnantAtDateOfDeath: 'true'
      }
    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461000',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Capture dependent children details'
        }, {
          esiAttributeTitle: 'dependentChildren',
          esiBeforeImage: 'false',
          esiAfterImage: 'true',
          esiReferenceData: '',
          esiMessageText: 'Capture dependent children details'
        }, {
          esiAttributeTitle: 'pregnantAtDateOfDeath',
          esiBeforeImage: 'false',
          esiAfterImage: 'true',
          esiReferenceData: '',
          esiMessageText: 'Capture dependent children details'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  upRatePregnancy: {
    messageType: 'changeRate',
    claim: {
      nino: 'QQ000000A',
      claimId: '1',
      eligibilityCriteria: {
        dependentChildren: false,
        pregnantAtDateOfDeath: false
      }
    },
    revisionData: {
      eligibilityCriteria: {
        dependentChildren: 'false',
        pregnantAtDateOfDeath: 'true'
      }
    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461011',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Change rate of an allowed claim'
        }, {
          esiAttributeTitle: 'pregnantAtDateOfDeath',
          esiBeforeImage: 'false',
          esiAfterImage: 'true',
          esiReferenceData: '',
          esiMessageText: 'Change rate of an allowed claim'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  upRateCHIB: {
    messageType: 'changeRate',
    claim: {
      nino: 'QQ000000A',
      claimId: '1',
      eligibilityCriteria: {
        dependentChildren: true,
        pregnantAtDateOfDeath: false
      }
    },
    revisionData: {
      eligibilityCriteria: {
        dependentChildren: 'true',
        pregnantAtDateOfDeath: 'false'
      },
      verificationList: [
        {
          category: 'children',
          verificationAttributeList: [
            {
              attributeName: 'CHIBinCBOL',
              attributeValue: 'true'
            },
            {
              attributeName: 'CHIB',
              attributeValue: '12345678HG'
            }
          ]
        }
      ]
    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461011',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Change rate of an allowed claim'
        }, {
          esiAttributeTitle: 'CHIB',
          esiBeforeImage: '',
          esiAfterImage: '12345678HG',
          esiReferenceData: '',
          esiMessageText: 'Change rate of an allowed claim'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  upRateDepPreg: {
    messageType: 'changeRate',
    claim: {
      nino: 'QQ000000A',
      claimId: '1',
      eligibilityCriteria: {
        dependentChildren: false,
        pregnantAtDateOfDeath: false
      }
    },
    revisionData: {
      eligibilityCriteria: {
        dependentChildren: 'true',
        pregnantAtDateOfDeath: 'true'
      }
    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461011',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Change rate of an allowed claim'
        }, {
          esiAttributeTitle: 'pregnantAtDateOfDeath',
          esiBeforeImage: 'false',
          esiAfterImage: 'true',
          esiReferenceData: '',
          esiMessageText: 'Change rate of an allowed claim'
        }, {
          esiAttributeTitle: 'dependentChildren',
          esiBeforeImage: 'false',
          esiAfterImage: 'true',
          esiReferenceData: '',
          esiMessageText: 'Change rate of an allowed claim'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  upRatePregNotDep: {
    messageType: 'changeRate',
    claim: {
      nino: 'QQ000000A',
      claimId: '1',
      eligibilityCriteria: {
        dependentChildren: true,
        pregnantAtDateOfDeath: false
      }
    },
    revisionData: {
      eligibilityCriteria: {
        dependentChildren: 'true',
        pregnantAtDateOfDeath: 'true'
      }
    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461011',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Change rate of an allowed claim'
        }, {
          esiAttributeTitle: 'pregnantAtDateOfDeath',
          esiBeforeImage: 'false',
          esiAfterImage: 'true',
          esiReferenceData: '',
          esiMessageText: 'Change rate of an allowed claim'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  upRateDepStaySTD: {
    messageType: 'changeRate',
    claim: {
      nino: 'QQ000000A',
      claimId: '1',
      eligibilityCriteria: {
        dependentChildren: false,
        pregnantAtDateOfDeath: false
      }
    },
    revisionData: {
      eligibilityCriteria: {
        dependentChildren: 'true',
        pregnantAtDateOfDeath: 'false'
      }
    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461011',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Change rate of an allowed claim'
        }, {
          esiAttributeTitle: 'dependentChildren',
          esiBeforeImage: 'false',
          esiAfterImage: 'true',
          esiReferenceData: '',
          esiMessageText: 'Change rate of an allowed claim'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  createClaim: {
    messageType: 'createClaim',
    claim: {claimId: '1'},
    revisionData: {
      nino: 'QQ000000A',
      claimId: '1',
      dateOfClaim: '2018-02-02',
      claimantDetails: {
        title: 'Mr',
        fullName: 'John Barnes',
        dateOfBirth: '2018-02-02',
        sex: 'Male'
      },
      partnerDetails: {
        title: 'Ms',
        fullName: 'Jenny',
        nino: 'GG998877A',
        dateOfDeath: '2018-02-02'
      }
    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0460999',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'claimantDetailsTitle',
          esiBeforeImage: '',
          esiAfterImage: 'Mr',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'claimantDetailsName',
          esiBeforeImage: '',
          esiAfterImage: 'John Barnes',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'claimantDetailsDateOfBirth',
          esiBeforeImage: '',
          esiAfterImage: '2018-02-02',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'claimantDetailsSex',
          esiBeforeImage: '',
          esiAfterImage: 'Male',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'partnerDetailsNino',
          esiBeforeImage: '',
          esiAfterImage: 'GG998877A',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'partnerDetailsTitle',
          esiBeforeImage: '',
          esiAfterImage: 'Ms',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'partnerDetailsName',
          esiBeforeImage: '',
          esiAfterImage: 'Jenny',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'partnerDetailsDateOfDeath',
          esiBeforeImage: '',
          esiAfterImage: '2018-02-02',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'dateOfClaim',
          esiBeforeImage: '',
          esiAfterImage: '2018-02-02',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  decideClaim: {
    messageType: 'decideClaim',
    claim: {claimId: '1'},
    revisionData: {
      nino: 'QQ000000A',
      claimId: '1',
      dateOfClaim: '2018-02-02'
    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461006',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Confirm claim details'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  searchClaim: {
    messageType: 'searchClaim',
    claim: {claimId: '1'},
    revisionData: {
      nino: 'QQ000000A',
      claimId: '1',
      numberOfClaimRecords: '1',
      numberOfScheduleRecords: '2',
      dateOfClaim: '2018-02-02'
    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461008',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'nino',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: 'QQ000000A',
          esiMessageText: 'Search for a BSP claim'
        },
        {
          esiAttributeTitle: 'numberOfClaimRecords',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Search for a BSP claim'
        },
        {
          esiAttributeTitle: 'numberOfScheduleRecords',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '2',
          esiMessageText: 'Search for a BSP claim'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  duplicateClaim: {
    messageType: 'createClaim',
    claim: {claimId: '1'},
    revisionData: {
      nino: 'QQ000000A',
      claimId: '1',
      dateOfClaim: '2018-02-02',
      claimantDetails: {
        title: 'Mr',
        fullName: 'John Barnes',
        dateOfBirth: '2018-02-02',
        sex: 'Male'
      },
      partnerDetails: {
        title: 'Ms',
        fullName: 'Jenny',
        nino: 'GG998877A',
        dateOfDeath: '2018-02-02'
      }
    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0460999',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'claimantDetailsTitle',
          esiBeforeImage: '',
          esiAfterImage: 'Mr',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'claimantDetailsName',
          esiBeforeImage: '',
          esiAfterImage: 'John Barnes',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'claimantDetailsDateOfBirth',
          esiBeforeImage: '',
          esiAfterImage: '2018-02-02',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'claimantDetailsSex',
          esiBeforeImage: '',
          esiAfterImage: 'Male',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'partnerDetailsNino',
          esiBeforeImage: '',
          esiAfterImage: 'GG998877A',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'partnerDetailsTitle',
          esiBeforeImage: '',
          esiAfterImage: 'Ms',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'partnerDetailsName',
          esiBeforeImage: '',
          esiAfterImage: 'Jenny',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'partnerDetailsDateOfDeath',
          esiBeforeImage: '',
          esiAfterImage: '2018-02-02',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }, {
          esiAttributeTitle: 'dateOfClaim',
          esiBeforeImage: '',
          esiAfterImage: '2018-02-02',
          esiReferenceData: '',
          esiMessageText: 'Create new BSP Claim'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  stopPay: {
    messageType: 'stopPay',
    claim: {claimId: '1', nino: 'QQ000000A'},
    revisionData: {
      claimId: '1',
      scheduleId: '12',
      effectiveDate: '2018-02-02',
      reason: 'error'
    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461012',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Stop payment schedule'
        },
        {
          esiAttributeTitle: 'scheduleId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '12',
          esiMessageText: 'Stop payment schedule'
        },
        {
          esiAttributeTitle: 'effectiveDate',
          esiBeforeImage: '',
          esiAfterImage: '2018-02-02',
          esiReferenceData: '',
          esiMessageText: 'Stop payment schedule'
        },
        {
          esiAttributeTitle: 'reason',
          esiBeforeImage: '',
          esiAfterImage: 'error',
          esiReferenceData: '',
          esiMessageText: 'Stop payment schedule'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  },
  deleteClaim: {
    messageType: 'deleteClaim',
    claim: {claimId: '1'},
    revisionData: {
      nino: 'QQ000000A',
      claimId: '1',
      dateOfClaim: '2018-02-02'
    },
    expectedOutput: {
      carfVersion: '1.2',
      dataType: 'BUS',
      eventDateAndTime: '10-10-10',
      eventNumber: 'E0461015',
      eventSpecificInformation: {
        eventAttributes: [{
          esiAttributeTitle: 'claimId',
          esiBeforeImage: '',
          esiAfterImage: '',
          esiReferenceData: '1',
          esiMessageText: 'Delete claim details'
        }]
      },
      identifier: '000',
      name: 'Kong',
      nino: 'QQ000000A',
      processInstance: '000999000',
      sourceSubSystem: 'CMS',
      sourceSystem: 'BSP'
    }
  }
});
