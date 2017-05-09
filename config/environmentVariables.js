"use strict";

// eslint disable no-var

var environmentVariables = {
  "SOCKETIO_HOST": process.env.SOCKETIO_HOST || "127.0.0.1",
  "SOCKETIO_PORT": process.env.SOCKETIO_PORT || 8050
};

module.exports = environmentVariables;

// eslint enable no-var
