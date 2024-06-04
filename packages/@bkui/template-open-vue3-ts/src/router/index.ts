import {
  createRouter,
  createWebHistory,
} from 'vue-router';

import {
  rootPath,
  connectToMain
} from '@blueking/sub-saas'

const HomeDemo = () => import(/* webpackChunkName: "HomeDemo" */ '../views/home-demo.vue');

// 由于接入了子路由，path 需要使用相对路径
const appRouter = createRouter({
  history: createWebHistory(window.SITE_URL),
  routes: [
    {
      path: rootPath,
      children: [
        {
          path: '',
          component: HomeDemo,
        }
      ]
    },
  ],
});

connectToMain(appRouter)

export default appRouter
