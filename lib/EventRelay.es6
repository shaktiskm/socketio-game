const Player = require("./Player"),
	getGameManagerIns = require("./GameManager");

class EventRelay {

	constructor(playerMap) {
		this.playerMap = playerMap;
	}

	register(io, msg) {
		console.log("server register---> ", msg);
		let {id, name} = msg,
			newPlayer = new Player(id, name);

		this.playerMap.set(id, newPlayer);

		let gameManager = getGameManagerIns(),
			availableGames;

		availableGames = gameManager.getAllGame().filter(game => !game.inProgress);
		console.log("playerMap ..", this.playerMap);
		console.log("available games in register ..", availableGames);
		io.to(id).emit("games available", availableGames);
	}

}

module.exports = EventRelay;
