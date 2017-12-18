import Vue from 'vue';
import VueRouter from 'vue-router';
import Toasted from 'vue-toasted';
import App from './App.vue';
import { routes } from './routes';
import OfflinePlugin from 'offline-plugin/runtime';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.css';
import 'Source/manifest.json';
import 'Assets/appicon-48.png';
import 'Assets/appicon-144.png';
import 'Assets/appicon-192.png';

Vue.use(Vuetify);
Vue.use(VueRouter);
Vue.use(Toasted);

const router = new VueRouter({
	mode: 'history',
	routes
});

new Vue({
	el: '#app',
	router,
	render: h => h(App)
});

if(ENV !== "dev"){
	// PWA
	OfflinePlugin.install();
}
