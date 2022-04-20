import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/Index';
import Game from '@/components/Game';
import Donate from '@/components/Donate';

Vue.use(Router);

export default new Router({
  routes: [
    {
    	path: '/',
    	name: 'Index',
    	component: Index
    },
    {
    	path: '/game',
    	name: 'Game',
    	component: Game
    },
    {
      path: '/donate',
      name: 'Donate',
      component: Donate
    }
  ],
  mode: 'history'
});
