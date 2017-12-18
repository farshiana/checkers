<template>
	<div class="content">
		<app-header @newGame="newGame"/>
		<div class="wrapper">
			<div class="subwrapper">
				<div class="grid">
					<template v-for="(row, y) in game.board.grid">
						<app-cell
							v-for="(cell, x) in row"
							:key="x+'-'+y"
							:x="x"
							:y="y"
							:cell="cell"
							:moves="cell.piece ? moves[cell.piece.getKey()] : {}"
							:size="getSize"
							@selectPiece="selectPiece"
							@selectCell="selectCell"/>
					</template>
				</div>
			</div>
		</div>
		<v-btn
			class="teal"
			fab
			fixed
			bottom
			right
			v-if="game.history.moves.length > 0"
			@click="restore">
				<v-icon color="white">restore</v-icon>
		</v-btn>
	</div>
</template>

<script>
	import Header from 'Components/Header.vue';
	import Cell from 'Components/home/Cell.vue';
	import GameManager from 'Helpers/game_manager';

	export default {
		components: {
			appHeader: Header,
			appCell: Cell
		},
		data(){
			GameManager.init();
			GameManager.addPieces();

			return {
				game           : GameManager,
				moves          : GameManager.getAllAvailableMoves(),
				targeted_cells : [],
				selected_piece : false,
				available_moves: {}
			}
		},
		computed: {
			getSize(){
				return "0 0 " + 100/this.game.board.size + "%";
			}
		},
		methods: {
			clearTargetedCells(){
				this.targeted_cells.forEach((key) => {
					GameManager.board.getCellAt(key[0], key[1]).targeted = false;
				});
				this.targeted_cells = [];
			},
			selectPiece(piece, moves){
				// Untarget previous cells
				this.clearTargetedCells();

				if(this.selected_piece && this.selected_piece.x === piece.x && this.selected_piece.y === piece.y){
					// If already selected, just clear selected piece
					this.selected_piece = false;
					return;
				}

				const self           = this;
				this.available_moves = moves;
				this.selected_piece  = piece;

				// Target new cell
				if(moves){
					Object.keys(moves).forEach((key) => {
						key = key.split("_");
						self.targeted_cells.push([key[0], key[1]]);
						GameManager.board.getCellAt(key[0], key[1]).targeted = true;
					});
				}
			},
			selectCell(x, y){
				const self  = this;
				const piece = GameManager.makeMove(this.selected_piece, x, y, this.available_moves[x + "_" + y]);

				const winners = GameManager.checkForVictory(this.moves);
				if(winners){
					const message = winners.length > 1 ? "Equality!" : "Player #" + winners[0] + " won the game!";
					this.$toasted.show(message, {
						theme   : "outline",
						icon    : "stars",
						position: "top-center",
						duration: 5000,
						action : {
						text : 'Play again?',
							onClick : (e, toastObject) => {
								toastObject.goAway(0);
								self.newGame();
							}
						},
					});
					return;
				}

				this.clearTargetedCells();
				this.moves = GameManager.getAllAvailableMoves();
				if(piece){
					this.selected_piece = false;
					this.selectPiece(piece, this.moves[piece.getKey()]);
				}

			},
			newGame(){
				GameManager.init();
				GameManager.addPieces();
				this.moves = GameManager.getAllAvailableMoves();
			},
			restore(){
				GameManager.restore();
				this.clearTargetedCells();
				this.moves = GameManager.getAllAvailableMoves();
			}
		}
	}
</script>

<style lang="scss">
	.content{
		height: 100vh;

		.wrapper{
			display: flex;
			width: 100%;
			height: calc(100% - 64px);
			align-items: center;

			.subwrapper{
				display: flex;
				justify-content: center;

				width: 100%;
				.grid{
					display  : flex;
					flex-wrap: wrap;

					width: 100%;
					border: 2px solid black;
					@media (min-width: 1020px){
						max-width: 750px;
					}
				}
			}
		}
	}
</style>