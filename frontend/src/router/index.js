import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/vending',
      name: 'vending',
      component: () => import('../views/VendingMachine.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/User.vue')
    },
  ]
});

export default router;
