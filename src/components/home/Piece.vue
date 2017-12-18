<template>
	<div
		:class="[piece.player_id, piece.type]"
		class="piece"
		@click="selectPiece">
		<img
			v-if="isKing"
			src="assets/crown.png">
	</div>
</template>

<script>
	import 'Assets/crown.png';

	export default {
		props: ['piece'],
		methods: {
			selectPiece(){
				this.$emit("selectPiece");
			}
		},
		computed: {
			isKing(){
				return this.piece.type === Constants.PIECE_TYPE_KING;
			}
		}
	}
</script>

<style lang="scss">
	.piece{
		align-self: center;
		display: flex;
		justify-content: center;
		align-items: center;

		border-radius: 50%;
		width: 75%;
		height: 75%;
		&.one{
			background-color: white;
		}
		&.two{
			background-color: burlywood;
		}
		img{
			width: 75%;
			height: 75%;
		}
	}
</style>