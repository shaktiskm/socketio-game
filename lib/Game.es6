class Game {

	constructor(id, name, creator) {
		this.id = id;
		this.name = name;
		this.creator = creator;
		this.players = [];
		this.inProgress = false;
	}

	join(player) {
		this.players.push(player);
	}

	leave(player) {
		this.players = this.players.filter(playerIns => playerIns.id !== player.id);
	}

}

module.exports = Game;
