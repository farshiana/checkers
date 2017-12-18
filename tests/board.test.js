import Board from 'Models/board';
import Piece from 'Models/piece';

describe("Board", function() {
	test('creates grid', () => {
		const board = new Board();
		const grid  = board.createGrid();

		expect(grid.length).toBe(board.size);
		expect(grid[0].length).toBe(board.size);
	});

	test('sets piece and returns cell at', () => {
		const board = new Board();

		board.setPiece(new Piece({x: 4, y: 4, player_id: Constants.PLAYER_ONE}));
		expect(board.getCellAt(4, 4).piece.player_id).toBe(Constants.PLAYER_ONE);
	});

	test('is valid', () => {
		const board = new Board();

		expect(board.isValid({x: 0, y: 0})).toBe(true);
		expect(board.isValid({x: board.size, y: board.size})).toBe(false);
	});

	test('returns piece at', () => {
		const board = new Board();

		board.setPiece(new Piece({x: 4, y: 4, player_id: Constants.PLAYER_ONE}));
		expect(board.getPieceAt(4, 4).player_id).toBe(Constants.PLAYER_ONE);
	});

	test('removes piece at', () => {
		const board = new Board();

		board.setPiece(new Piece({x: 4, y: 4, player_id: Constants.PLAYER_ONE}));
		board.removePieceAt(4, 4);
		expect(board.getPieceAt(4, 4)).toBe(false);
	});

	test('returns available moves', () => {
		const board = new Board();

		const pieces = [
			new Piece({x: 4, y: 4, player_id: Constants.PLAYER_ONE}),
			new Piece({x: 5, y: 5, player_id: Constants.PLAYER_TWO}),
			new Piece({x: 0, y: 5, player_id: Constants.PLAYER_ONE}),
			new Piece({x: 0, y: 0, player_id: Constants.PLAYER_TWO}),
			new Piece({x: 3, y: 7, player_id: Constants.PLAYER_ONE, type: Constants.PIECE_TYPE_KING})
		];
		pieces.forEach((piece) => {
			board.setPiece(piece);
		});

		// Piece 0 must take piece 1 with one move
		let result = board.getAvailableMoves(pieces[0]);
		expect(result.must_take).toBe(true);
		expect(Object.keys(result.moves).length).toBe(1);
		expect(result.moves['6_6']).toBe('5_5');

		// Piece 1 must take piece 1 with one move
		result = board.getAvailableMoves(pieces[1]);
		expect(result.must_take).toBe(true);
		expect(Object.keys(result.moves).length).toBe(1);
		expect(result.moves['3_3']).toBe("4_4");

		// Piece 2 can only make one move
		result = board.getAvailableMoves(pieces[2]);
		expect(result.must_take).toBe(false);
		expect(Object.keys(result.moves).length).toBe(1);
		expect(result.moves['1_6']).toBe(false);

		// Piece 3 cannot make any move
		result = board.getAvailableMoves(pieces[3]);
		expect(result.must_take).toBe(false);
		expect(Object.keys(result.moves).length).toBe(0);

		// Piece 4 can take piece 1 with two different moves
		result = board.getAvailableMoves(pieces[4]);
		expect(result.must_take).toBe(true);
		expect(Object.keys(result.moves).length).toBe(2);
		expect(result.moves['6_4']).toBe('5_5');
		expect(result.moves['7_3']).toBe('5_5');
	});
});
