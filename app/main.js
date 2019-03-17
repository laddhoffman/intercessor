'use strict';

const express = require('express');
const app = express();
const request = require('request');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const cors = require('cors');

const port = 8010;
const dbBaseUrl = 'http://127.0.0.1:5984';
// process.env.COUCHDB_CREDS = username and password separated by a colon
const dbCreds = process.env.COUCHDB_CREDS;

if (!dbCreds) {
  console.error('Set env var COUCHDB_CREDS="username:password"')
  process.exit(1);
}

class CompositePolicy {
  constructor() {
    // default deny
    this.policy = (path, method, srcIp) => false;
  }
  extend(func) {
    let currentPolicy = this.policy
    this.policy = func(currentPolicy);
  }
}

const policy = new CompositePolicy();
policy.extend(currentPolicy => {
});

const databases = [
  {
    names: ['my_database'],
    allow: [
      {
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        ips: [
          '73.32.7.39', // EQ
          '73.166.234.68', // home
          '::1'
        ],
      },
    ]
  },
  {
    names: ['', '_utils', '_all_dbs', '_session', '_uuids', 'favicon'],
    allow: [
      {
        methods: ['GET'],
        ips: [
          '73.32.7.39', // EQ
          '73.166.234.68', // home
          '::1'
        ],
      },
    ]
  },
  {
    names: ['_session'],
    allow: [
      {
        methods: ['POST'],
        ips: [
          '73.32.7.39', // EQ
          '73.166.234.68', // home
          '::1'
        ],
      },
    ]
  },
];

app.set('trust proxy', 'loopback');
app.use(cors());
app.use(cookieParser());

app.use((req, res, next) => {
  // We want to handle some basic authentication stuff before forwarding
  // requests to couchdb.
  // Let's see what database this command is trying to access, and whether
  // we want to allow it.
  // To get started we can create a whitelist.
  // We can whitelist by source address.
  let reqId = uuid.v4().replace(/-/g, '').slice(0, 10);
  console.log(`${reqId} ${req.ip} ${req.method} ${req.path}`);

  let reqPath0 = req.path.split('/')[1];

  // What we can do here is:
  // If the request already comes with some authentication, we can just let it
  // pass through.
  // If the request does not come with any authentication, we can apply our
  // ip address filter; if we determine that the request is authorized, we can
  // add our own authentication credentials to the request.
  let authHeader;
  if (req.headers['authorization'] || req.cookies['AuthSession']) {
    // Pass through unmodified
    console.log(reqId + ' request includes authorization header; passing through unmodified');
  } else {
    // Apply filter
    let thisDb = databases.find(x => x.names.includes(reqPath0));
    if (!thisDb) {
      // Database not found in our whitelist. Assume request is not allowed.
      console.log(reqId + ' request path not found in whitelist');
      res.status(403);
      return res.end();
    }
    let thisAllow = thisDb.allow.find(x => x.ips.includes(req.ip));
    if (!thisAllow) {
      console.log(reqId + ' request ip address not found in whitelist');
      res.status(403);
      return res.end();
    }
    // Is the requested method allowed?
    if (!thisAllow.methods.includes(req.method.toUpperCase())) {
      console.log(reqId + ' request method not found in whitelist');
      res.status(403);
      return res.end();
    }
    // Ok this request looks good
    console.log(reqId + ' request looks good; adding authorization header');
    // Add authentication header
    req.headers['authorization'] = 'Basic ' + Buffer.from(dbCreds).toString('base64');
  }

  let newReq = request({
    url: dbBaseUrl + req.path,
    qs: req.query,
    headers: req.headers,
  });
  req.pipe(newReq).pipe(res);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
