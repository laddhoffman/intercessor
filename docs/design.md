# Polices

## Security
### Authentication
### Authorization
### Access Control
## Content
### User
### System

# Notes

## Ideas
Functional style
Dynamic -- let algorithms build new expressions to be evaluated
Provenance -- hash or store value of exrpression used to evaluate something

CouchDB -- document revisions
Document boundaries
Object model
  Semantic boundaries consistent with realistic/expectable operational behaviors
Avoid overcommitting semantics to un-guaranteeable behaviors

---

Interesting possibilities? Storing expressions and their results --
Identifying "results" / "data"
by their provenance
(Only) storing information that is produced by expressions
stored within and executed by the system (though storage may be and probably
should be expungable);
this would suggest that we also need a unique build id of the system as it was
when the expression was evaluated-- how rigorous need this be?
How about a commit hash?!
Can we enforce that the application will only commit data to a database if it's
running from a git commit and its content doesn't vary from that?!
I think so: not that it would be impossible to spoof, but it could be a good
check assuming good intent that is merely fallible. I.e. make it hard to
make a mistake / hard to do wrong.

## Purposes
- Software Modeling
- Financial
- Communication
- Ideation
- Scientific Process
    - Measurement
    - Error
    - Analysis?
    - Reproducibility!
- Community

## Considerations
- Community
- People
- Places
- Things
- Relationships
- Change
    - Time
    - Entropy
- Models
- Predictions
- Algorithms

## Semantics / Syntax

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

### Structured Content

    // type / method
    // properties

### Metadata

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

|| category   || operations                   || tests                         ||
| data        | var, log, method              | missing, missing_some          |
| logic       | and, or, if/elseif            | falsiness `!`, truthiness `!!` |
| numeric     | `+`,`-`,`*`,`/`,`%`, max, min | equality, inequality           |
| array       | map, reduce, filter, merge    | all, none, some, in            |
| string      | cat, substr                   | in                             |

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
rules/plans
take action when something _hasn't_ happened for a certain amount of time
do the right thing at the right time

at some later time, evaluate something and take action accordingly

so how do we want, or do we want, to standardize the way in which a result can
indicate an action to be performed?
how can we, or do we want to, provide for handling the subsequent results
of some actions?
promises?

I worked out a system in a previous project...
return an actions array.
I think the system would have to provide the basic primitives for what types of
action are allowed.

- Send message
- Store data
- Schedule future action

- Request (human) input

Convenience helpers could wrap chains of actions... but possibly that should be
kept to a minimum so as not to make an unwieldy toolset.


---

I want the data to be conveniently editable / expressable in a text editor
as well as a GUI.

I've had success with json-schema and json-schema-editor to auto-generate
form inputs -- see `money` project. It has a (minimal) JS frontend, and a PHP
backend.

---

stacks of functions and operations get unwieldy at some point.
Contrasting with that, the ability to stack things willy-nilly is very useful
especially during the design phase, when you don't yet know what abstractions
will be the most useful.

So I guess that suggests that the thing to do is provide for that transition--
when/if the time comes that some section of a definition can & should be broken
off, made into its own separate thing -- at that time, our tooling should provide
what's needed; and as well, later on when modifications are desired or required--
the system should provide for updating and/or disambiguating among versions.

So we come back to the topic of references.
I guess there can be hard references or soft ones.
Hard references would be more important, like something will not or may not
function correctly without the referenced element.
Soft references could augment the content, could even definitively enhance it,
without having a hard requirement to be present.
The system could more safely expunge older records to which only soft references
are known.

Our data should be modelable as a graph -- i.e. I desire/think it should be so.
The current plan is to use CouchDB for actual storage of info.
This is for easy synchronization between server and client, and among servers.
We can marshall the available data and then do graph computations on it--
graph databases exist and might make things more efficient / easier, and so
should be considered at some point-- but the proposed structure should be
viable, i.e. should perform adequately for a while, and either solution should
yield equally correct results in most circumstances. We should expect subtle
impact due to processing being done in different places in the different proposed
 solutions.

---

Actions
  Send
  Store
  Schedule
  (Chain)
Properties
  Stored Objects
  Messages
  Metadata
    Provenance
Conditions
  Properties -> Actions

"Idea"
  Condition(s) -> Results

Results = Actions

Graph theoretic constructs
hasAncestor

What "context" is available to a particular computation--
i.e. what assumptions can we, or is it safe to, make about the context of a
particular computation?
We need to consider, and possibly include as specifiable, the following:
- present/absent
- partial/compete
It might be good as well to include a notion of expectation--
Which information or result is wanted/expected
What to do if it's not available -- to wait or to proceed without it

---

So, suppose we want a private key per client instance.
This could be used for authentication. It could even be a JWT generated by the
server and encrypted/signed -- this would mean the server needs to do some
key management / secret management, but that's not unreasonable.
The user could authenticate with multiple clients.

It could be nice to store data in encrypted form.
However it would also be nice to be able to (easily) share content with other
users, or publicly. In the case of sharing publicly, it would make sense to upload / store unencrypted. But what about in the case of sharing with other users?

The server can support this, at least to some degree. There may be trade-offs
where we have to choose between security and convenience, but let's see what we
can come up with.

Content can be decrypted with a particular key.
The encryption is an extra safety measure.
Ideally the client should be able to encrypt it such that the server can not read
the content; or at least, this should be an option.
That means the server can not know the encryption/decryption key.
It may be possible to have the server facilitate establishing an end-to-end
encrypted session from one client to another, which can then be used to exchange
a key, or to exchange content directly.

If the client wants to give up a little bit of security by trusting the server
implementation, we could have all encryption/decryption done by the server--
basically this would be a moderate security measure, encrypting data at rest.

I think encryption features should be deferred to a possible future commercial
offering.

---

"What is reasonable?"
"What is desired? For what reasons?"
Questions
  Description
  Implementation(s)
  If multiple implementations,
    Preferred Implementation

Full sentences as identification??

Model
  Word
  Sentence
  Paragraph
  Section
  Document
  Table of Contents
  Index
  Bibliography
  Publication Info
  Title Page
  Introduction, Abstract, Preface, Foreword
    Contextual Information
  Maps
  Geaneologies
  Ontology
  Actors/Dramatis Personae/Cast of Characters
  Acknowledgements

  Binary Representation

  Structured Representation
    Possibly More or Less Direct Translation of Model

---

    ontology
    ---

      object
        has properties
      actions
        is an object

    // An action can "return" information?
    //   Or can it only ever still do one of: send, store. send ->
    //
    // whom though.
    // can a caller assume anything about whether "it" will receive the result?
    // it should instead terminate by indicating followup actions.
    // _That_ is the space in which we reason about our algorithms.
    // "Store"
    // "Send"
    // "Schedule"
    terminateWith: {
      actions, // store/send/schedule : each with expressions -- actions as expressions expressing conditions, and expressions expressing actions.
      data,
      context,
    }

    // So an Actions is _defined_ as a reentrant expression
    // with fun, condition -> fun; or fun -> fun, condition

    //
    //
    // The following is a property that an action can return
    // in order to indicate followup actions
    // in accordance with its algorithm.
    actions:
      - id: '' // (name/type/identifier/id/name)
        name: '' // id?
        description: '' // ?
        text: ''//
        lines: [] // can be functionally derived from text -- that way an implementor of this class
                  // can "override" with their own implementation -- user can make a subclass or they
                  // can modify their instance
        html: {} // model -> structured representation -> html representation
      -
      -

