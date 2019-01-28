'use strict';

const test = require('ava');
const reviseVerification = require('../../src/utils/revise-verification');

test('should export a function', t => {
  t.is(typeof reviseVerification, 'function');
});

test('should throw an if claim is not an object', t => {
  const error = t.throws(() => reviseVerification('not an object', 'age'), TypeError);
  t.is(error.message, 'Claim must be an object');
});

test('should throw an error if verificationList is not an Array', t => {
  const claim = {
    fullName: 'Hammond Eggs',
    verificationList: 'not an array'
  };
  const error = t.throws(() => reviseVerification(claim, 'age'), TypeError);
  t.is(error.message, 'Can\'t revise verifications, verificationList must be an Array');
});

test('should add verificationList array if it does not exist', t => {
  const claim = {
    fullName: 'Hammond Eggs'
  };

  const newVerification = {
    category: 'height',
    verificationAttributeList: [
      {
        attributeName: 'height',
        attributeValue: '6ft'
      }
    ]
  };

  const expectedOutput = {
    fullName: 'Hammond Eggs',
    verificationList: [
      {
        category: 'height',
        verificationAttributeList: [
          {
            attributeName: 'height',
            attributeValue: '6ft'
          }
        ]
      }
    ]
  };

  const output = reviseVerification(claim, newVerification);
  t.deepEqual(output, expectedOutput);
});

test('should add a new verification to the verificationList', t => {
  const claim = {
    fullName: 'Hammond Eggs',
    verificationList: [{
      category: 'age',
      verificationAttributeList: [
        {
          attributeName: 'dateOfBirth',
          attributeValue: '2017-10-20'
        }
      ]
    }]
  };

  const newVerification = {
    category: 'height',
    verificationAttributeList: [
      {
        attributeName: 'height',
        attributeValue: '6ft'
      }
    ]
  };

  const expectedOutput = {
    fullName: 'Hammond Eggs',
    verificationList: [
      {
        category: 'age',
        verificationAttributeList: [
          {
            attributeName: 'dateOfBirth',
            attributeValue: '2017-10-20'
          }
        ]
      },
      {
        category: 'height',
        verificationAttributeList: [
          {
            attributeName: 'height',
            attributeValue: '6ft'
          }
        ]
      }
    ]
  };

  const output = reviseVerification(claim, newVerification);
  t.deepEqual(output, expectedOutput);
});

test('should replace existing verification with the same category at the start', t => {
  const claim = {
    fullName: 'Hammond Eggs',
    verificationList: [
      {
        category: 'age',
        verificationAttributeList: [
          {
            attributeName: 'dateOfBirth',
            attributeValue: '2017-10-20'
          }
        ]
      },
      {
        category: 'height',
        verificationAttributeList: [
          {
            attributeName: 'height',
            attributeValue: '6ft'
          }
        ]
      }
    ]
  };

  const newVerification = {
    category: 'age',
    verificationAttributeList: [
      {
        attributeName: 'dateOfBirth',
        attributeValue: '1999-02-01'
      }
    ]
  };

  const expectedOutput = {
    fullName: 'Hammond Eggs',
    verificationList: [
      {
        category: 'age',
        verificationAttributeList: [
          {
            attributeName: 'dateOfBirth',
            attributeValue: '1999-02-01'
          }
        ]
      },
      {
        category: 'height',
        verificationAttributeList: [
          {
            attributeName: 'height',
            attributeValue: '6ft'
          }
        ]
      }
    ]
  };

  const output = reviseVerification(claim, newVerification);
  t.deepEqual(output, expectedOutput);
});

test('should replace existing verification with the same category at the end', t => {
  const claim = {
    fullName: 'Hammond Eggs',
    verificationList: [
      {
        category: 'age',
        verificationAttributeList: [
          {
            attributeName: 'dateOfBirth',
            attributeValue: '2017-10-20'
          }
        ]
      },
      {
        category: 'height',
        verificationAttributeList: [
          {
            attributeName: 'height',
            attributeValue: '6ft'
          }
        ]
      }
    ]
  };

  const newVerification = {
    category: 'height',
    verificationAttributeList: [
      {
        attributeName: 'height',
        attributeValue: '7ft'
      }
    ]
  };

  const expectedOutput = {
    fullName: 'Hammond Eggs',
    verificationList: [
      {
        category: 'age',
        verificationAttributeList: [
          {
            attributeName: 'dateOfBirth',
            attributeValue: '2017-10-20'
          }
        ]
      },
      {
        category: 'height',
        verificationAttributeList: [
          {
            attributeName: 'height',
            attributeValue: '7ft'
          }
        ]
      }
    ]
  };

  const output = reviseVerification(claim, newVerification);
  t.deepEqual(output, expectedOutput);
});

test('should replace existing verification with the same category somewhere in the middle', t => {
  const claim = {
    fullName: 'Hammond Eggs',
    verificationList: [
      {
        category: 'age',
        verificationAttributeList: [
          {
            attributeName: 'dateOfBirth',
            attributeValue: '2017-10-20'
          }
        ]
      },
      {
        category: 'height',
        verificationAttributeList: [
          {
            attributeName: 'height',
            attributeValue: '6ft'
          }
        ]
      },
      {
        category: 'marriage',
        verificationAttributeList: [
          {
            attributeName: 'seenCertificate',
            attributeValue: 'no'
          }
        ]
      },
      {
        category: 'death',
        verificationAttributeList: [
          {
            attributeName: 'seenCertificate',
            attributeValue: 'no'
          }
        ]
      }
    ]
  };

  const newVerification = {
    category: 'marriage',
    verificationAttributeList: [
      {
        attributeName: 'seenCertificate',
        attributeValue: 'yes'
      }
    ]
  };

  const expectedOutput = {
    fullName: 'Hammond Eggs',
    verificationList: [
      {
        category: 'age',
        verificationAttributeList: [
          {
            attributeName: 'dateOfBirth',
            attributeValue: '2017-10-20'
          }
        ]
      },
      {
        category: 'height',
        verificationAttributeList: [
          {
            attributeName: 'height',
            attributeValue: '6ft'
          }
        ]
      },
      {
        category: 'marriage',
        verificationAttributeList: [
          {
            attributeName: 'seenCertificate',
            attributeValue: 'yes'
          }
        ]
      },
      {
        category: 'death',
        verificationAttributeList: [
          {
            attributeName: 'seenCertificate',
            attributeValue: 'no'
          }
        ]
      }
    ]
  };

  const output = reviseVerification(claim, newVerification);
  t.deepEqual(output, expectedOutput);
});

test('should not mutate original input', t => {
  const claim = {
    fullName: 'Hammond Eggs',
    verificationList: [
      {
        category: 'age',
        verificationAttributeList: [
          {
            attributeName: 'dateOfBirth',
            attributeValue: '2017-10-20'
          }
        ]
      },
      {
        category: 'height',
        verificationAttributeList: [
          {
            attributeName: 'height',
            attributeValue: '6ft'
          }
        ]
      }
    ]
  };

  const newVerification = {
    category: 'height',
    verificationAttributeList: [
      {
        attributeName: 'height',
        attributeValue: '7ft'
      }
    ]
  };

  const output = reviseVerification(claim, newVerification);
  t.notDeepEqual(output, claim);
});
