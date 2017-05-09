"use strict";

// eslint disable no-var

var environmentVariables = require("./environmentVariables"),
  config = {
    "http": {
      "protocol": "http",
      "domain": environmentVariables.SOCKETIO_HOST,
      "port": environmentVariables.SOCKETIO_PORT
    },
    "appName": "socketio-game",
    "environmentVariableChecker": {
      "isEnabled": false
    },
    "urlPrefix": "/v1"
  };

module.exports = config;

// eslint enable no-var
