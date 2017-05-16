const Player = require("./Player");

let protectedInstance;

class PlayerManager {
	constructor() {
		this.playerMap = new Map();
	}

	createPlayer(id, name) {
		let newPlayer = new Player(id, name, false);

		this.playerMap.set(id, newPlayer);
	}

	getPlayer(id) {
		let clonnedPlayer = Object.assign(this.playerMap.get(id));

		clonnedPlayer.isReady = false;
		return clonnedPlayer;
	}

}

function getPlayerManagerIns() {
	protectedInstance = protectedInstance || new PlayerManager();
	return protectedInstance;
}

module.exports = getPlayerManagerIns;
