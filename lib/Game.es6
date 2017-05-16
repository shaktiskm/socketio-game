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
		this.players = this.players.filter(p => p.id !== player.id);
	}

	sendMsg(msg) {

	}
}

module.exports = Game;
