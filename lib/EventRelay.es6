class EventRelay {

	constructor(playerManager, gameManager) {
		this.playerManager = playerManager;
		this.gameManager = gameManager;
	}

	register(io, msg) {
		console.log("server register---> ", msg);
		let {id, name} = msg,
			availableGames;

		this.playerManager.createPlayer(id, name);
		availableGames = this.gameManager.getNotInProgressGames();
		console.log("available games in register ..", availableGames);
		io.to(id).emit("games available", availableGames);
	}

	leave(socket, msg) {
		console.log("server leaveGame---> ", msg);
		let {gameId, playerId} = msg,
			game;

		game  = this.gameManager.leaveGame(gameId, playerId);
		socket.emit("players available", game);
		socket.broadcast.emit("players available", game);
	}

	createGame(socket, msg) {
		console.log("server createGame --->", msg);
		let {name, creatorId} = msg,
			newGame,
			player;

		newGame = this.gameManager.createNewGame(name, creatorId);
		player = this.playerManager.getPlayer(creatorId);
		newGame.players.push(player);
		this.gameManager.addGame(newGame);

		console.log("available games..", Array.of(newGame));
		socket.emit("games available", Array.of(newGame));
		socket.broadcast.emit("games available", Array.of(newGame));
	}

	exitGame(socket, msg) {
		console.log("server exitGame---> ", msg);

		let {gameId} = msg,
			games;

		games = this.gameManager.removeAndGetGames(gameId);
		console.log("game after exit", games);
		socket.emit("games after exit", games);
		socket.broadcast.emit("games after exit", games);
	}

	join(socket, msg) {
		console.log("server join---> ", msg);
		let {playerId, gameId} = msg,
			player,
			game;

		player = this.playerManager.getPlayer(playerId);
		game = this.gameManager.getGameById(gameId);
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
}

module.exports = EventRelay;
