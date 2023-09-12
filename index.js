#!/usr/bin/env node

var fs = require('fs');
var pac = require('pac-resolver');

const PACFile = process.argv[2];
const Url = process.argv[3];

var FindProxyForURL = pac(fs.readFileSync(PACFile));

FindProxyForURL(Url).then((res) => {
  console.log('Connection to', Url, 'will be:', res);
});
