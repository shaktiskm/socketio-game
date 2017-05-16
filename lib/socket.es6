const socketio = require("socket.io"),
  uuid = require("uuid"),
  getUniqueIdServiceInstance = require("./util/UniqueIdService"),
  getGameManagerIns = require("./GameManager"),
  getPlayerManagerIns = require("./PlayerManager"),
  EventRelay = require("./EventRelay");

let io,
  uniqueIdService = getUniqueIdServiceInstance(uuid),
  playerManager = getPlayerManagerIns(),
  gameManager = getGameManagerIns(uniqueIdService),
  eventRelay = new EventRelay(playerManager, gameManager);

function initSocket(server) {
  io = socketio.listen(server);

  io.on("connection", socket => {
    console.log("User Connected ... ");

    socket.emit("msg", {"id": socket.id});

    socket.on("client", msg => {
      console.log("server ack client---> ", msg);
    });

    socket.on("register", eventRelay.register.bind(eventRelay, io));

    socket.on("leaveGame", eventRelay.leave.bind(eventRelay, socket));

    socket.on("joinGame", eventRelay.join.bind(eventRelay, socket));

    socket.on("createGame", eventRelay.createGame.bind(eventRelay, socket));

    socket.on("playGame", eventRelay.playGame.bind(eventRelay, socket));

    socket.on("ready", eventRelay.playerReady.bind(eventRelay, socket));

    socket.on("exitGame", eventRelay.exitGame.bind(eventRelay, socket));

    socket.on("disconnect", () => {
      console.log("User Disconnected ... ");
    });
  });
}

module.exports = initSocket;
