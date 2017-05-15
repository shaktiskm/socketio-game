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

	setGame(game) {
		this.games = this.games.map(g => {
			if (g.id === game.id) {
				g = game;
			}
			return g;
		});
	}
}

function getGameManagerIns() {
	protectedInstance = protectedInstance || new GameManager();
	return protectedInstance;
}

module.exports = getGameManagerIns;
