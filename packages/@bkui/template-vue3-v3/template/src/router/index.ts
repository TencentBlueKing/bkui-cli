import {
  createRouter,
  createWebHistory,
} from 'vue-router';

const Entry = () => import(/* webpackChunkName: "MetricsEntry" */ '../views/demo.vue');

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Entry,
    },
  ],
});
