let protectedInstance;

class GameManager {

	constructor() {
		this.games = [];
	}

	addGame(game) {
		this.games.push(game);
	}

	getGameById(gameId) {
		return this.games.filter(id => id === gameId);
	}

	getAllGame() {
		return this.games;
	}

	setAllGame(games) {
		this.games = games;
	}

}

function getGameManagerIns() {
	protectedInstance = protectedInstance || new GameManager();
	return protectedInstance;
}

module.exports = getGameManagerIns;
