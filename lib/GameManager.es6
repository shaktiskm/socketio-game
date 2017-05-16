const Game = require("./Game");

let protectedInstance;

class GameManager {

	constructor(uniqueIdService) {
		this.games = [];
		this.uniqueIdService = uniqueIdService;
	}

	createNewGame(name, creatorId) {
		let uniqueGameId = this.uniqueIdService.createUniqueId(),
			newGame = new Game(uniqueGameId, name, creatorId);

		return newGame;
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

	getNotInProgressGames() {
		return this.games.filter(game => !game.inProgress);
	}

	leaveGame(gameId, playerId) {
		let filteredGame = this.games.filter(game => game.id === gameId);

		filteredGame.players = filteredGame.players.filter(player => player.id !== playerId);
		return filteredGame;
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

function getGameManagerIns(uniqueIdService) {
	protectedInstance = protectedInstance || new GameManager(uniqueIdService);
	return protectedInstance;
}

module.exports = getGameManagerIns;
