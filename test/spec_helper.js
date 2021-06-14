var http = require('http'),
  Bluebird = require('bluebird');
http.globalAgent.maxSockets = 1000;

var Docker = require('../lib/docker'),
  fs = require('fs'),
  isWin = require('os').type() === 'Windows_NT';

// For Mac OS X:
// socat -d -d unix-l:/tmp/docker.sock,fork tcp:<docker-host>:4243
// DOCKER_SOCKET=/tmp/docker.sock npm test

// For Windows:
// https://github.com/apocas/dockerode/issues/290#issuecomment-276393388
// socketPath: '//./pipe/docker_engine'

var socket = process.env.DOCKER_SOCKET || isWin ? '//./pipe/docker_engine' : '/var/run/docker.sock';
var isSocket = fs.existsSync(socket) ? fs.statSync(socket).isSocket() : false;
var docker;
var dockert;
var dockerp;

if (!isSocket) {
  console.log('Trying TCP connection...');
  docker = new Docker();
  dockert = new Docker({
    'timeout': 1
  });
  dockerp = new Docker({
    'Promise': Bluebird
  });
} else {
  docker = new Docker({
    'socketPath': socket
  });
  dockert = new Docker({
    'socketPath': socket,
    'timeout': 1
  });
  dockerp = new Docker({
    'socketPath': socket,
    'Promise': Bluebird
  });
}

module.exports = {
  'docker': docker,
  'dockert': dockert,
  'dockerp': dockerp
};
