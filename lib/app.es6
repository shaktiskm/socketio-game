const http = require("http"),
  express = require("express"),
  socketio = require("socket.io"),
  mwErrorHandler = require("./middleware_services/mwErrorHandler"),
  checkEnvironmentVariables = require("./util/checkEnvironmentVariables"),
  uuid = require("uuid"),
  UniqueIdService = require("./util/UniqueIdService"),
  Game = require("./Game"),
  Player = require("./Player"),
  getGameManagerIns = require("./GameManager");

let {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../config/" + nodeEnv)),
  app = express(),
  server = http.createServer(app),
  io = socketio.listen(server),
  urlPrefix = config.urlPrefix,
  environmentVariables = require("../config/environmentVariables"),
  playerMap = new Map(),
  socket;

io.on("connection", sock => {
  console.log("User Connected ... ");

  socket = sock;

  socket.emit("msg", {"id": socket.id});

  socket.on("client", msg => {
    console.log("server ack client---> ", msg);
  });

  socket.on("register", register);

  socket.on("leaveGame", leave);

  socket.on("joinGame", join);

  socket.on("createGame", createGame);
  
  socket.on("playGame", playGame);

  socket.on("exitGame", exitGame);

  socket.on("disconnect", () => {
    console.log("User Disconnected ... ");
  });
});

function register(msg) {
  console.log("server register---> ", msg);
  let {id, name} = msg,
    newPlayer = new Player(id, name);

  playerMap.set(id, newPlayer);

  let gameManager = getGameManagerIns(),
    availableGames;

  availableGames = gameManager.getAllGame();
  console.log("playerMap ..", playerMap);
  console.log("available games in register ..", availableGames);
  socket.emit("games available", availableGames);
}

function createGame(msg) {
  console.log("server createGame --->", msg);
  let {name, creatorId} = msg,
    newGame = new Game(name, creatorId),
    gameManager = getGameManagerIns(),
    availableGames,
    uniqueIdServ;

  uniqueIdServ = new UniqueIdService(uuid);
  newGame.id = uniqueIdServ.createUniqueId();
  console.log("new play--------", playerMap.get(creatorId));
  newGame.players.push(playerMap.get(creatorId));

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
    player = playerMap.get(playerId),
    game = availableGames.filter(game => game.id === gameId);

  game[0].join(player);

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
