# Ideas

Functional style
Dynamic -- let algorithms build new expressions to be evaluated
Provenance -- hash or store value of exrpression used to evaluate something

CouchDB -- document revisions
Document boundaries
Object model
  Semantic boundaries consistent with realistic/expectable operational behaviors
Avoid overcommitting semantics to un-guaranteeable behaviors

# Intent

## Software Modeling
## Financial
## Communication
## Ideation
## Scientific Process
### Measurement
### Error
### Analysis?
### Reproducibility!
## Community

# Considerations

## Community

## People

## Places

## Things

## Relationships

## Change

### Time

### Entropy

## Models

## Predictions

## Algorithms

# Semantics / Syntax

    {
      "": {
      }
    }

    {
      "": [
      ]
    }

    [{
      "": {}
    }, {
      "": {}
    }]

    [
      {
        "": {}
      },
    ]

    {
      "a": {
        "b": {
        }
      }
    }

    {
      "a.b": {
      }
    }

    const applyFun = (fun, obj) => new Object(fun(obj));

    const exampleFun = obj => {};

## Structured Content

    // type / method
    // properties

## Metadata

    owner
    policy
      access control
      authorization
    version
    reference / unique id
    history
    provenance

## General Notes

We have a good starting point with expressions using `json-logic-js`.
This supports the following operations and tests:

|| category   || operations                   || tests                ||
| data        | var, log, method              | missing, missing_some |
| logic       | and, or, if/elseif            | `!`, `!!`             |
| numeric     | `+`,`-`,`*`,`/`,`%`, max, min | equality, inequality  |
| array       | map, reduce, filter, merge    | all, none, some, in   |
| string      | cat, substr                   | in                    |

`json-logic-js` also supports importing functions or modules and calling as
operations.

So-- now that we have this "expression" data structure -- which addresses (at
least part of) the syntax question --  we can give some more thought to the
semantics! What should be the significance and use of these expressions?

We want to be able to express--
relationships
patterns?
ideas?
context
information
intentions -- requested actions, planned actions

