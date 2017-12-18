import Piece from 'Models/piece';

describe("Piece", function() {

	test('returns if king or not', () => {
		let piece = new Piece();
		expect(piece.isKing()).toBe(false);

		piece = new Piece({type: Constants.PIECE_TYPE_KING});
		expect(piece.isKing()).toBe(true);
	});

});