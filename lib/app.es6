const http = require("http"),
  express = require("express"),
  mwErrorHandler = require("./middleware_services/mwErrorHandler"),
  checkEnvironmentVariables = require("./util/checkEnvironmentVariables"),
  initSocket = require("./socket");

let {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../config/" + nodeEnv)),
  app = express(),
  server = http.createServer(app),
  urlPrefix = config.urlPrefix,
  environmentVariables = require("../config/environmentVariables");

// Checks the required environment variables
if (config.environmentVariableChecker.isEnabled) {
  checkEnvironmentVariables(environmentVariables);
}

// Sets the relevant config app-wise
app.set("port", config.http.port);

app.get(`${urlPrefix}/healthcheck`, (req, res) => {
  res.send({"msg": "OK"});
});

// Initialize the websocket connection
initSocket(server);

app.get("/", (req, res) => {
  res.sendFile("index.html", {"root": "."});
});

app.use(mwErrorHandler);

// Starts the app
server.listen(app.get("port"), () => {
  console.log(`Server has started at ${new Date()} and is listening on port: ${app.get("port")}`);
});

module.exports = server;
