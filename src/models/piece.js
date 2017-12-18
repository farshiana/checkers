import Util from 'Helpers/util';
module.exports = class Piece {

	constructor(options){
		options        = options || {};
		this.player_id = options.player_id;
		this.type      = options.type || Constants.PIECE_TYPE_MAN;
		this.x         = options.x;
		this.y         = options.y;
	}

	isKing(){
		return this.type === Constants.PIECE_TYPE_KING;
	}

	getKey(){
		return Util.getKey(this);
	}

}