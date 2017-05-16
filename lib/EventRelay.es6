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
}

module.exports = EventRelay;
