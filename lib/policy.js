'use strict';

const exp = module.exports;
const _ = require('lodash');

const inputsDefinition = [
  ['src', ['ip']],
  ['method'],
  ['path'],
];

const flattenNames = (definitions, _prefix)  => {
  return _.flatMap(definitions, definition => {
    let name = definition.shift();
    let flatName = _.filter([_prefix, name], x => !_.isUndefined(x)).join('.');
    if (!definition.length) {
      return flatName;
    }
    return flattenNames(definition, flatName);
  });
};

const flatInputs = flattenNames(inputsDefinition);

console.log(JSON.stringify(flatInputs, null, 2));


class Policy {
  constructor() {
    this.policy = {};
  }
  loadFile(path) {

  }
  apply(req) {
  }
}


module.exports = {
  Policy
};

