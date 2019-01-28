'use strict';

module.exports = (object, properties = []) => {
  return properties.reduce((safe, prop) => ({...safe,
    [prop]: typeof object[prop] === 'string' ? object[prop].trim() : ''
  }), {});
};
