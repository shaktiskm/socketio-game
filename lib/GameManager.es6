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

	removeAndGetGames(gameId) {
		this.games = this.games.filter(game => game.id !== gameId);
		return this.games;
	}

	getGameById(gameId) {
		return this.games.filter(game => game.id === gameId);
	}

	getAllGame() {
		return this.games;
	}

	getNotInProgressGames() {
		return this.games.filter(game => !game.inProgress);
	}

	leaveGame(gameId, playerId) {

		for (let game of this.games) {
			if (game.id === gameId) {
				game.players = game.players.filter(player => player.id !== playerId);
				return game;
			}
		}
	}

	// setAllGame(games) {
	// 	this.games = games;
	// }

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
