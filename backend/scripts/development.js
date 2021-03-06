'use strict';

const dotenv = require('dotenv');
dotenv.load({ path: '.env.dev' });

process.env.NODE_ENV = 'development';

var nodemon = require('nodemon');
nodemon('--exec babel-node ./src --watch ./src');
