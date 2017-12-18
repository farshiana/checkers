import GameManager from 'Helpers/game_manager';

describe("Game Manager", function() {
	test('init game manager', () => {
		GameManager.init();

		GameManager.board.size        = Constants.BOARD_SIZE;
		GameManager.player_one.id     = Constants.PLAYER_ONE;
		GameManager.player_two.id     = Constants.PLAYER_TWO;
		GameManager.current_player_id = Constants.PLAYER_ONE;
	});

	test('add pieces', () => {
		GameManager.addPieces();

		// Pieces of player 1
		expect(GameManager.player_one.pieces.length).toBe(12);
		expect(GameManager.player_one.pieces[0].x).toBe(1);
		expect(GameManager.player_one.pieces[0].y).toBe(0);

		// Pieces of player 2
		expect(GameManager.player_two.pieces.length).toBe(12);
		expect(GameManager.player_two.pieces[0].x).toBe(6);
		expect(GameManager.player_two.pieces[0].y).toBe(GameManager.board.size - 1);

		// Pieces on board
		expect(GameManager.board.getCellAt(1, 0).piece.player_id).toBe(Constants.PLAYER_ONE);
		expect(GameManager.board.getCellAt(GameManager.board.size - 2, GameManager.board.size - 1).piece.player_id).toBe(Constants.PLAYER_TWO);
	});

	test('returns all available moves', () => {
	});

	test('returns last row', () => {
		expect(GameManager.getLastRow(GameManager.player_one)).toBe(GameManager.board.size - 1);
	});

	test('makes move', () => {
	});

	test('check for victory', () => {
		// One winner
		GameManager.player_one.pieces = [];
		GameManager.player_two.pieces = [];
		let result = GameManager.checkForVictory({toto: 0});
		expect(result.length).toBe(1);
		expect(result[0]).toBe(GameManager.player_two.id);

		// Equality
		GameManager.current_player.pieces = ['test'];
		result = GameManager.checkForVictory({});
		expect(result.length).toBe(2);
		expect(result[0]).toBe(GameManager.player_one.id);
		expect(result[1]).toBe(GameManager.player_two.id);
	});
});