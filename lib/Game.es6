class Game {

	constructor(name, creator) {
		this.name = name;
		this.creator = creator;
		this.players = [];
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
