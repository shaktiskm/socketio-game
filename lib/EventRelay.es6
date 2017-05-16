class EventRelay {

	constructor(playerManager, gameManager, events) {
		this.playerManager = playerManager;
		this.gameManager = gameManager;
		this.events = events;
	}

	register(io, msg) {
		console.log("server register---> ", msg);
		let {id, name} = msg,
			availableGames;

		this.playerManager.createPlayer(id, name);
		availableGames = this.gameManager.getNotInProgressGames();
		console.log("available games in register ..", availableGames);
		io.to(id).emit(this.events.GAMES_AVAILABLE, availableGames);
	}

	leave(socket, msg) {
		console.log("server leaveGame---> ", msg);
		let {gameId, playerId} = msg,
			game;

		game = this.gameManager.leaveGame(gameId, playerId);
		socket.emit(this.events.PLAYERS_AVAILABLE, game);
		socket.broadcast.emit(this.events.PLAYERS_AVAILABLE, game);
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
		socket.emit(this.events.GAMES_AVAILABLE, Array.of(newGame));
		socket.broadcast.emit(this.events.GAMES_AVAILABLE, Array.of(newGame));
	}

	exitGame(socket, msg) {
		console.log("server exitGame---> ", msg);

		let {gameId} = msg,
			games;

		games = this.gameManager.removeAndGetGames(gameId);
		console.log("game after exit", games);
		socket.emit(this.events.GAMES_AFTER_EXIT, games);
		socket.broadcast.emit(this.events.GAMES_AFTER_EXIT, games);
	}

	join(socket, msg) {
		console.log("server join---> ", msg);
		let {playerId, gameId} = msg,
			player,
			game,
			message;

		player = this.playerManager.getPlayer(playerId);
		game = this.gameManager.getGameById(gameId);
		game[0].join(player);

		console.log("game------", game);

		message = {
			"player": player,
			"gameId": game[0].id,
			"creatorId": game[0].creator
		};

		console.log("game msg", message);

		socket.emit(this.events.PLAYER_JOINED, message);
		socket.broadcast.emit(this.events.PLAYER_JOINED, message);
	}

	playGame(socket, msg) {
		let {gameId} = msg;

		this.gameManager.makeGameInProgress(gameId);

		socket.emit(this.events.GAME_IN_PROGRESS, {"gameId": gameId});
		socket.broadcast.emit(this.events.GAME_IN_PROGRESS, {"gameId": gameId});
	}

	playerReady(socket, msg) {

		console.log("playerReady ---> ", msg);

		let {playerId, gameId} = msg,
			game,
			playerReadyCount,
			message;

		this.gameManager.makePlayerReadyForGame(gameId, playerId);
		game = this.gameManager.getGameById(gameId);
		playerReadyCount = this.gameManager.getReadyPlayerCountForGame(game[0]);

		console.log("ready game ---> ", game[0]);
		console.log("ready count ---> ", playerReadyCount);

		message = {
			"creatorId": game[0].creator,
			"gameId": gameId,
			"playerId": playerId
		};

		if (playerReadyCount >= 2) {
			console.log("in game count ---> ", message);

			if (playerReadyCount >= 4) {
				socket.emit(this.events.GAME_IN_PROGRESS, {"gameId": gameId});
				socket.broadcast.emit(this.events.GAME_IN_PROGRESS, {"gameId": gameId});
			} else {
				socket.emit(this.events.PLAYER_READY, message);
				socket.broadcast.emit(this.events.PLAYER_READY, message);
			}
		}
	}
}

module.exports = EventRelay;
