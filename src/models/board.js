import Util from 'Helpers/util';
import Cell from 'Models/cell';
import Piece from 'Models/piece';

module.exports = class Board {

	constructor(options = {}) {
		this.size = options.size || Constants.BOARD_SIZE;
		this.grid = this.createGrid();
	}

	// Create an empty size x size grid
	createGrid(){
		const grid = [];

		for(let i = 0; i < this.size; i++){
			const row = [];

			for(let j = 0; j < this.size; j++){
				row.push(new Cell());
			}
			grid.push(row);
		}

		return grid;
	}

	// Adds a piece to a cell if possible
	setPiece(piece){
		if(!this.isValid(piece)){
			console.error("[setPiece] Position isn't valid");
		}else if(this.getCellAt(piece.x, piece.y).piece){
			console.error("[setPiece] Cell is already occupied");
		} else {
			this.getCellAt(piece.x, piece.y).piece = piece;
		}
	}

	// Check if a cell exist (e.g. if it has valid coordinates)
	isValid(cell){
		return cell.x >= 0 && cell.x < this.size && cell.y >= 0 && cell.y < this.size;
	}

	// Returns the piece at these coordinates
	getPieceAt(x, y){
		return this.getCellAt(x, y).piece;
	}

	// Returns coordinates' cell
	getCellAt(x, y){
		return this.grid[y][x];
	}

	// Remove coordinates' piece
	removePieceAt(x, y){
		this.getCellAt(x, y).piece = false;
	}

	// Returns available moves for a piece
	getAvailableMoves(piece, has_taken = false){
		const self               = this;
		const dir                = (piece.player_id === Constants.PLAYER_ONE) ? 1: -1;
		let must_take            = false;
		const moves_with_take    = {};
		const moves_without_take = {};
		const shifts             = [
			{dx: +1, dy: +dir, forward: true, 	has_taken: false, 	length: 1},
			{dx: +1, dy: -dir, forward: false, 	has_taken: false, 	length: 1},
			{dx: -1, dy: +dir, forward: true, 	has_taken: false, 	length: 1},
			{dx: -1, dy: -dir, forward: false, 	has_taken: false, 	length: 1}
		];

		for(let i = 0; i < shifts.length; i++){
			const shift      = shifts[i];
			const shift_cell = {x: piece.x + shift.length*shift.dx, y: piece.y + shift.length*shift.dy};

			if(self.isValid(shift_cell)){
				// If the coordinates of the cell are valid, get the cell's piece
				const shift_piece = self.getPieceAt(shift_cell.x, shift_cell.y);
				const shift_neighbour_cell = {x: shift_cell.x + shift.dx, y: shift_cell.y + shift.dy};

				if(((!must_take || shift.has_taken) && (piece.isKing() || shift.forward) && !shift_piece)){
					// Empty cell while going forward or king, we can just move to this cell
					if(shift.has_taken){
						if(self.isValid(shift_cell)){
							moves_with_take[shift.taken_piece.getKey()].push(shift_cell);
						}
					}else{
						moves_without_take[Util.getKey(shift_cell)] = false;
					}

					if(piece.isKing()){
						// If it's a king, we continue in the same direction
						var new_shift     = Object.assign({}, shift);
						new_shift.length += 1;
						shifts.push(new_shift);
					}
				}else if(!shift.has_taken && shift_piece && shift_piece.player_id !== piece.player_id){
					// Cell is occupied by opponent
					if(self.isValid(shift_neighbour_cell) && !self.getPieceAt(shift_neighbour_cell.x, shift_neighbour_cell.y)){
						// Next cell - after the piece - is empty, we can just take the piece and move to this cell
						if(!moves_with_take[shift_piece.getKey()]){
							moves_with_take[shift_piece.getKey()] = [];
						}
						moves_with_take[shift_piece.getKey()].push(shift_neighbour_cell);
						must_take = true;

						if(piece.isKing()){
							// If it's a king, we continue in the same direction
							new_shift             = Object.assign({}, shift);
							new_shift.length      += 1;
							new_shift.has_taken   = true;
							new_shift.taken_piece = shift_piece;
							shifts.push(new_shift);
						}
					}
				}
			}
		}

		if(has_taken){
			return must_take;
		}

		if(!must_take){
			// If there isn't any piece to take, we can make any of these moves
			return {moves: moves_without_take, must_take: false};
		}

		const all_moves = {};

		// For each piece that can been taken
		Object.keys(moves_with_take).forEach((take_piece) => {

			// Check all the moves for which we can take this piece
			const moves = moves_with_take[take_piece];
			if(moves.length > 1){
				const removed_piece = self.getPieceAt(take_piece.split("_")[0], take_piece.split("_")[1]);
				self.removePieceAt(removed_piece.x, removed_piece.y);

				// We check if we can take another piece after
				const must_take = [];
				moves.forEach((move) => {
					// Piece with new coordinates after having taken a piece
					const piece_after_take = new Piece({x: move.x, y: move.y, player_id: piece.player_id, type: piece.type});
					if(self.getAvailableMoves(piece_after_take, true)){
						must_take.push(move);
					}
				});

				if(must_take.length === 0){
					// We cannot take another piece so all the moves are available
					moves.forEach((move) => {
						all_moves[Util.getKey(move)] = take_piece;
					});
				}else{
					// We have at least one opportunity to another piece,
					// so we only keep moves for which we can take another piece
					must_take.forEach((move) => {
						all_moves[Util.getKey(move)] = take_piece;
					});
				}
				self.setPiece(removed_piece);
			}else{
				// There is only one move possible
				all_moves[Util.getKey(moves[0])] = take_piece;
			}
		});

		return {moves: all_moves, must_take: true};
	}
}