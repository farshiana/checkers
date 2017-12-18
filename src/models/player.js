module.exports = class Player {

	constructor(options){
		options            = options || {};
		this.id            = options.id;
		this.pieces        = [];
		this.selected_cell = false;
	}

	addPiece(piece){
		piece.player_id = this.id;
		this.pieces.push(piece);
	}
}