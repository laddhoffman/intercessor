'use strict';
const _ = require('lodash');
const exp = module.exports;
const jsonLogic = require('json-logic-js');
const YAML = require('yamljs');

// polymorphic: first arg (title) is optional
exp.logJson = (title, obj = {}, opts = {}, optsObj = {}) => {
  if (!_.isString(title)) {
    // assume title not provided, shift args accordingly
    optsObj = opts;
    opts = obj;
    obj = title;
  }
  // BEGIN OPTIONS PARSING
  // a single string is allowed
  if (_.isString(opts)) {
    opts = [opts];
  }
  // a number is allowed
  if (_.isNumber(opts)) {
    opts = {
      titles: opts
    };
  }
  // an array of strings is allowed
  if (_.isArray(opts)) {
    let optsArray = opts;
    opts = {};
    optsArray.forEach(opt => {
      switch (opt) {
        case 'titles':
          opts.titles = 1;
          break;
        default:
          throw new Error('unrecognized option ' + opt);
      }
    });
  }
  // an object is allowed
  // also both string/array and object can be provided.
  _.merge(opts, optsObj);
  // apply default options
  _.defaultsDeep(opts, {
    titles: 0,
    condenseArrays: true,
    prefixArrayItems: false,
  });
  // Apply title if provided
  if (typeof title === 'string') {
    opts.titles++;
    obj = {[title]: obj};
  }
  // END OPTIONS PARSING. Now we can use the options.
  //
  let recurseArrays = arr => {
    for (let key in arr) {
      let obj = arr[key];
      if (_.isArray(obj)) {
        let newObj = exp.arrayToObj(
          _.flatMap(obj, (os, i) => _(os).keys().map(key => {
              let name = opts.prefixArrayItems ? `[${i}] ${key}` : key;
              return {[name]: os[key]};
            }).value())
          );
        arr[key] = newObj;
      } else if (_.isObject(obj)) {
        recurseArrays(obj[key]);
      }
    }
  };
  
  if (opts.condenseArrays === true) {
    recurseArrays(obj);
  }
  
  let recurseTitle = (obj, depth = 0) => {
    if (depth >= opts.titles) {
      return JSON.stringify(obj);
    }
    if (_.isArray(obj)) {
      // return [''].concat(obj.map(o => recurseTitle(o, depth))).join("\n" +
      //   ' '.repeat(2 * depth));
      let newObj = exp.arrayToObj(
        _.flatMap(obj, (os, i) => _(os).keys().map(key => {
            return {[`[${i}] ${key}`]: os[key]};
          }).value())
        );
      obj = newObj;
    } else if (_.isObject(obj)) {
      return [''].concat(_.keys(obj)
          .map(key => `${key}: ` + recurseTitle(obj[key], depth + 1)))
        .join("\n" + ' '.repeat(2 * depth));
    } else {
      return JSON.stringify(obj);
    }
  };

  let text = recurseTitle(obj);
  console.log(text);
}

// exp.returnBool = value => new Object({type: 'boolean', value});
// exp.applyFun = (fun, obj) => new Object(fun(obj));

exp.evalExpr = (expr = {}, obj = {}, opts = {}) => {
  let res = {};
  if (opts.brief !== true) {
    Object.assign(res, {
      expr,
      obj,
    });
  }
  res.result = jsonLogic.apply(expr, obj);
  return res;
};

exp.genExprEvaluator = obj => (expr, opts) => exp.evalExpr(expr, obj, opts);

exp.genObjEvaluator = expr => (obj, opts) => exp.evalExpr(expr, obj, opts);

exp.arrayToObj = array => _.spread(Object.assign)([{}].concat(array));
