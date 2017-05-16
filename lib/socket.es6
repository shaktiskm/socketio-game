const socketio = require("socket.io"),
  uuid = require("uuid"),
  getUniqueIdServiceInstance = require("./util/UniqueIdService"),
  getGameManagerIns = require("./GameManager"),
  getPlayerManagerIns = require("./PlayerManager"),
  events = require("./eventRegistry/events"),
  EventRelay = require("./EventRelay");

let io,
  uniqueIdService = getUniqueIdServiceInstance(uuid),
  playerManager = getPlayerManagerIns(),
  gameManager = getGameManagerIns(uniqueIdService),
  eventRelay = new EventRelay(playerManager, gameManager, events);

function initSocket(server) {
  io = socketio.listen(server);

  io.on(events.CONNECTION, socket => {
    console.log("User Connected ... ");

    socket.emit(events.MSG, {"id": socket.id});

    socket.on(events.CLIENT, msg => {
      console.log("server ack client---> ", msg);
    });

    socket.on(events.REGISTER, eventRelay.register.bind(eventRelay, io));

    socket.on(events.LEAVEGAME, eventRelay.leave.bind(eventRelay, socket));

    socket.on(events.JOINGAME, eventRelay.join.bind(eventRelay, socket));

    socket.on(events.CREATEGAME, eventRelay.createGame.bind(eventRelay, socket));

    socket.on(events.PLAYGAME, eventRelay.playGame.bind(eventRelay, socket));

    socket.on(events.READY, eventRelay.playerReady.bind(eventRelay, socket));

    socket.on(events.EXITGAME, eventRelay.exitGame.bind(eventRelay, socket));

    socket.on(events.DISCONNECT, () => {
      console.log("User Disconnected ... ");
    });
  });
}

module.exports = initSocket;
