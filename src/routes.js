import Home from 'Components/home/Home.vue';

export const routes = [
	{ path: '/', component: Home},
	{ path: '*', redirect: '/'}
];