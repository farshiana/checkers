import Player from 'Models/player';
import Piece from 'Models/piece';

describe("Player", function() {

	test('adds piece', () => {
		const player = new Player();
		const piece  = new Piece({x: 4, y: 5});

		player.addPiece(piece);
		expect(player.pieces[0].x).toBe(4);
		expect(player.pieces[0].y).toBe(5);
	});

});