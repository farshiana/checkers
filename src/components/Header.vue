<template>
	<v-toolbar
		dark
		class="teal">
		<img
			class="logo"
			src="assets/logo.png">
		<v-toolbar-title class="white--text">Checkers</v-toolbar-title>
		<v-spacer/>
		<v-btn
			flat
			@click="newGame">New Game</v-btn>
	</v-toolbar>
</template>

<script>
	import 'Assets/logo.png';

	export default {
		methods: {
			newGame(){
				this.$emit("newGame");
			}
		}
	}
</script>

<style lang="scss">
	.logo{
		width : 30px;
		height: 30px;
	}
</style>

