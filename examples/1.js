'use strict';

const _ = require('lodash');

const {
  evalExpr,
  genExprEvaluator,
  genObjEvaluator,
  logJson,
  arrayToObj,
} = require('../lib/util');

let myObj = {"one": true};

let myExpr = {
  "!!": {"var": "one"}
};

let myExpr2 = {
  "if": [myExpr, true, "failed"]
}

let getResults = (brief = false) => {
  let exprEvaluator = genExprEvaluator(myObj);
  let objEvaluator = genObjEvaluator(myExpr);

  let exprRes = evalExpr(myExpr, myObj, {brief});
  let exprRes2 = exprEvaluator(myExpr2, {brief});
  let exprRes3 = objEvaluator(myObj, {brief});

  return [{exprRes}, {'so cool!': exprRes2}, {'some super fancy stuff': exprRes3}];
};

logJson('results', getResults(), 2);
logJson('results(brief)', getResults(true), 1);
