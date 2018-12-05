const yargs = require('yargs');
const path = require('path');
const package = require(path.resolve(process.cwd(),'package.json'))
console.log(package.author);