const socketio = require("socket.io"),
  uuid = require("uuid"),
  getUniqueIdServiceInstance = require("./util/UniqueIdService"),
  Game = require("./Game"),
  Player = require("./Player"),
  getGameManagerIns = require("./GameManager"),
  getPlayerManagerIns = require("./PlayerManager"),
  EventRelay = require("./EventRelay");

let io,
  playerMap = new Map(),
  socket,
  uniqueIdService = getUniqueIdServiceInstance(uuid),
  playerManager = getPlayerManagerIns(),
  gameManager = getGameManagerIns(uniqueIdService),
  eventRelay = new EventRelay(playerManager, gameManager);

function initSocket(server) {
  io = socketio.listen(server);

  io.on("connection", sock => {
    console.log("User Connected ... ");

    socket = sock;

    socket.emit("msg", {"id": socket.id});

    socket.on("client", msg => {
      console.log("server ack client---> ", msg);
    });

    socket.on("register", eventRelay.register.bind(eventRelay, io));

    socket.on("leaveGame", eventRelay.leave.bind(eventRelay, socket));

    socket.on("joinGame", eventRelay.join.bind(eventRelay, socket));

    socket.on("createGame", eventRelay.createGame.bind(eventRelay, socket));

    socket.on("playGame", eventRelay.playGame.bind(eventRelay, socket));

    socket.on("ready", playerReady);

    socket.on("exitGame", eventRelay.exitGame.bind(eventRelay, socket));

    socket.on("disconnect", () => {
      console.log("User Disconnected ... ");
    });
  });
}

function playerReady(msg) {

  console.log("playerReady ---> ", msg);

  let {playerId, gameId} = msg,
    gameManager = getGameManagerIns(),
    game;

  game = gameManager.getAllGame().filter(game => game.id === gameId);

  console.log("game ---> ", game);

  game[0].players.forEach(p => {
    if (p.id === playerId) {
      p.isReady = true;
    }
  });

  gameManager.setGame(game[0]);

  let playerReadyCount = game[0].players.filter(p => p.isReady).length;
  console.log("red game count ---> ", game[0]);
  console.log("red count ---> ", playerReadyCount);

  let message = {
    "creatorId": game[0].creator,
    "gameId": gameId,
    "playerId": playerId
  };

  if (playerReadyCount >= 2) {
    console.log("in game count ---> ", message);
    if (playerReadyCount >= 4) {
      let gameAutoStart = {
        "gameId": gameId
      };

      socket.emit("game in progress", gameAutoStart);
      socket.broadcast.emit("game in progress", gameAutoStart);
    } else {
      socket.emit("player ready", message);
      socket.broadcast.emit("player ready", message);
    }
  }
}

module.exports = initSocket;
