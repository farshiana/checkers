import Board from 'Models/board';
import Player from 'Models/player';
import Piece from 'Models/piece';
import Util from 'Helpers/util';

export default {

	init(options = {}) {
		this.board             = new Board(options);
		this.player_one        = new Player({id: Constants.PLAYER_ONE});
		this.player_two        = new Player({id: Constants.PLAYER_TWO});
		this.current_player    = this.player_one;
		this.history           = {moves: [], player_id: false};
	},

	// Add players' pieces to each player and to the board
	addPieces(){
		const self = this;

		// Add pieces to each player
		const number_of_rows = this.board.size / 2 - 1; // Always 2 lines in the middle
		for(let y = 0; y < number_of_rows; y++){
			for(let x = 1 - y%2; x < this.board.size; x += 2){
				this.player_one.addPiece(new Piece({x: x, y: y}));
				this.player_two.addPiece(new Piece({x: this.board.size - x - 1, y: this.board.size - y - 1}));
			}
		}

		// Add pieces to the board
		[this.player_one, this.player_two].forEach((player) => {
			player.pieces.forEach((piece) => {
				self.board.setPiece(piece);
			});
		});
	},

	// Returns available moves in board current player's list of pieces
	getAllAvailableMoves(){
		const self    = this;
		const moves   = [];
		let must_take = false;
		const pieces  = this.current_player.pieces;

		// Check if it is possible to take at least once
		pieces.forEach((piece) => {
			const result = self.board.getAvailableMoves(piece);
			if(Object.keys(result.moves).length > 0){
				moves.push({piece: piece, result: result});
			}
			must_take = must_take || result.must_take;
		});

		// Add all moves or moves for which we can take a piece
		const output = {};
		moves.forEach((obj) => {
			if(!must_take || (must_take && obj.result.must_take)){
				output[obj.piece.getKey()] = obj.result.moves;
			}
		});

		return output;
	},

	getLastRow(player){
		return (player.id === this.player_one.id) ? this.board.size - 1 : 0;
	},

	// Makes a move : change a piece's position to another cell and remove the taken piece
	makeMove(piece, x, y, taken_piece){
		if(this.current_player.id !== this.history.player_id){
			this.history.moves.push([]);
			this.history.player_id = this.current_player.id;
		}
		this.history.moves[this.history.moves.length - 1].push({
			piece      : piece,
			x          : piece.x,
			y          : piece.y,
			taken_piece: taken_piece ? this.board.getPieceAt(Util.getCoordinates(taken_piece)[0], Util.getCoordinates(taken_piece)[1]) : taken_piece
		});

		// Change piece in board
		this.board.removePieceAt(piece.x, piece.y);

		// Change piece's position
		piece.x = x;
		piece.y = y;
		this.board.setPiece(piece);

		// Check if must be made king
		if(!piece.isKing() && y === this.getLastRow(this.current_player)){
			piece.type = Constants.PIECE_TYPE_KING;
			const tmp = this.history.moves[this.history.moves.length - 1];
			tmp[tmp.length - 1].upgraded = true;
		}

		// Remove taken pieces
		if(taken_piece){
			taken_piece = taken_piece.split("_");
			// Remove from board
			this.board.removePieceAt(taken_piece[0], taken_piece[1]);

			// Remove from player's pieces
			const player = (piece.player_id === Constants.PLAYER_ONE) ? this.player_two : this.player_one;
			for(let i = 0; i < player.pieces.length; i++){
				if(player.pieces[i].x === parseInt(taken_piece[0]) && player.pieces[i].y === parseInt(taken_piece[1])){
					player.pieces.splice(i, 1);
					break;
				}
			}

			if(this.board.getAvailableMoves(piece).must_take){
				// Return piece that has to be taken in next move
				return piece;
			}
		}

		this.current_player = (this.current_player.id === this.player_one.id) ? this.player_two : this.player_one;
	},

	checkForVictory(moves){
		const opponent = (this.current_player.id === this.player_one.id) ? this.player_two : this.player_one;
		if(this.current_player.pieces.length === 0){
			return [opponent.id];
		}else if(Object.keys(moves).length === 0){
			return [this.current_player.id, opponent.id];
		}
		return false;
	},

	restore(){
		const self = this;
		if(this.history.moves.length === 0){
			console.error("History is empty..");
			return;
		}

		// Revert moves
		const last_moves = this.history.moves[this.history.moves.length - 1];
		last_moves.reverse().forEach((move) => {
			// Change piece in board
			self.board.removePieceAt(move.piece.x, move.piece.y);

			// Change piece's position
			move.piece.x = move.x;
			move.piece.y = move.y;
			self.board.setPiece(move.piece);

			if(move.taken_piece){
				self.board.setPiece(move.taken_piece);
				self.current_player.addPiece(move.taken_piece);
			}
			if(move.upgraded){
				move.piece.type = Constants.PIECE_TYPE_MAN;
			}
		});
		this.history.player_id = this.current_player.id;
		this.current_player = (this.current_player.id === this.player_one.id) ? this.player_two : this.player_one;

		// Remove moves from history
		this.history.moves.pop();
	}
}