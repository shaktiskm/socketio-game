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

    socket.on("joinGame", join);

    socket.on("createGame", eventRelay.createGame.bind(eventRelay, socket));

    socket.on("playGame", playGame);

    socket.on("ready", playerReady);

    socket.on("exitGame", exitGame);

    socket.on("disconnect", () => {
      console.log("User Disconnected ... ");
    });
  });
}

function exitGame(msg) {
  console.log("server exitGame---> ", msg);

  let {gameId} = msg,
    gameManager = getGameManagerIns(),
    availableGames;

  availableGames = gameManager.getAllGame();

  let games = availableGames.filter(game => game.id !== gameId);

  gameManager.setAllGame(games);

  console.log("game after exit", games);

  socket.emit("games after exit", games);
  socket.broadcast.emit("games after exit", games);
}

function join(msg) {
  console.log("server join---> ", msg);
  let {playerId, gameId} = msg,
    gameManager = getGameManagerIns(),
    availableGames = gameManager.getAllGame(),
    player,
    clonnedPlayer,
    game;

  player = playerMap.get(playerId),
    game = availableGames.filter(game => game.id === gameId);
  clonnedPlayer = Object.assign(player);
  clonnedPlayer.isReady = false;
  game[0].join(clonnedPlayer);

  console.log("game------", game);

  let message = {
    "player": player,
    "gameId": game[0].id,
    "creatorId": game[0].creator
  };

  console.log("game msg", message);

  socket.emit("player joined", message);
  socket.broadcast.emit("player joined", message);
}

function playGame(msg) {
  let {gameId} = msg,
    gameManager = getGameManagerIns(),
    availableGames = gameManager.getAllGame();

  availableGames = availableGames.map(game => {
    if (game.id === gameId) {
      game.inProgress = true;
    }
    return game;
  });

  let message = {
    "gameId": gameId
  };

  socket.emit("game in progress", message);
  socket.broadcast.emit("game in progress", message);
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
