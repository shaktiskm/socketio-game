const http = require("http"),
  express = require("express"),
  socketio = require("socket.io"),
  mwErrorHandler = require("./middleware_services/mwErrorHandler"),
  checkEnvironmentVariables = require("./util/checkEnvironmentVariables");

let {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../config/" + nodeEnv)),
  app = express(),
  server = http.createServer(app),
  io = socketio.listen(server),
  urlPrefix = config.urlPrefix,
  environmentVariables = require("../config/environmentVariables");

io.on("connection", socket => {
  console.log("User Connected ... ");

  socket.emit("msg", {"id": socket.id});

  socket.on("client", msg => {
    console.log("server ack client---> ", msg);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected ... ");
  });
});

// Checks the required environment variables
if (config.environmentVariableChecker.isEnabled) {
  checkEnvironmentVariables(environmentVariables);
}

// Sets the relevant config app-wise
app.set("port", config.http.port);

app.get(`${urlPrefix}/healthcheck`, (req, res) => {
  res.send({"msg": "OK"});
});

app.get("/", (req, res) => {
  res.sendFile("index.html", {"root": "."});
});

app.use(mwErrorHandler);

// Starts the app
server.listen(app.get("port"), () => {
  console.log(`Server has started at ${new Date()} and is listening on port: ${app.get("port")}`);
});

module.exports = server;
