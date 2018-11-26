const serve = require('webpack-serve');
const openBrowser = require('./openBrowser');
const devConfig = require('./webpack.dev.js');
const merge = require('webpack-merge');
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.on('unhandledRejection', err => {
  throw err;
});
let serverPort = 8000;
let config  =merge(devConfig,{
    serve:{
        port:serverPort
    }    
})
serve({},{config}).then((server) => {
  openBrowser(`http://localhost:${serverPort}/`);  
});