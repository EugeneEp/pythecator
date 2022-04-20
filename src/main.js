// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'bootstrap/dist/css/bootstrap.css';
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import Meta from 'vue-meta';
import VueAnalytics from 'vue-analytics';

Vue.use(Vuex);
Vue.use(Meta);
Vue.use(VueAnalytics, {
  id: 'UA-181337366-1'
})

export const store = new Vuex.Store({
	state: {
  		user: {
  			authenticated: false,
  			token: '',
  			email: ''
  		}
  	}
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
