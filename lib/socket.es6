const socketio = require("socket.io"),
  uuid = require("uuid"),
  UniqueIdService = require("./util/UniqueIdService"),
  Game = require("./Game"),
  Player = require("./Player"),
  getGameManagerIns = require("./GameManager"),
  EventRelay = require("./EventRelay");

let io,
  playerMap = new Map(),
  socket,
  eventRelay = new EventRelay(playerMap);

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

    socket.on("leaveGame", leave);

    socket.on("joinGame", join);

    socket.on("createGame", createGame);

    socket.on("playGame", playGame);

    socket.on("ready", playerReady);

    socket.on("exitGame", exitGame);

    socket.on("disconnect", () => {
      console.log("User Disconnected ... ");
    });
  });
}

function createGame(msg) {
  console.log("server createGame --->", msg);
  let {name, creatorId} = msg,
    newGame = new Game(name, creatorId),
    gameManager = getGameManagerIns(),
    availableGames,
    uniqueIdServ,
    player;

  uniqueIdServ = new UniqueIdService(uuid);
  newGame.id = uniqueIdServ.createUniqueId();
  player = playerMap.get(creatorId);
  console.log("new play--------", player);
  let clonnedPlayer = Object.assign(player);
  clonnedPlayer.isReady = false;
  newGame.players.push(clonnedPlayer);

  gameManager.addGame(newGame);
  availableGames = gameManager.getAllGame();
  console.log("available games..", Array.of(newGame));
  socket.emit("games available", Array.of(newGame));
  socket.broadcast.emit("games available", Array.of(newGame));
}

function leave(msg) {
  console.log("server leaveGame---> ", msg);

  let {gameId, playerId} = msg,
    gameManager = getGameManagerIns(),
    availableGames;

  availableGames = gameManager.getAllGame();

  availableGames.forEach(game => {
    if (game.id === gameId) {
      game.players = game.players.filter(p => p.id !== playerId);
      socket.emit("players available", game);
      socket.broadcast.emit("players available", game);
    }
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
