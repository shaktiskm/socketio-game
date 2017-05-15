let protectedInstance;

class GameManager {

	constructor() {
		this.games = [];
	}

	addGame(game) {
		this.games.push(game);
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
