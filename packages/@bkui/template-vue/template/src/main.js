import Vue from 'vue';
import App from './App.vue';
import router from './router';
<$ if (features.includes('Vuex')) { $>import store from './store';
<$ } $><$ if (features.includes('Axios')) { $>import './api';
<$ } $>
// import bk-magic-vue
import 'bk-magic-vue/dist/bk-magic-vue.min.css';
import bkMagic from 'bk-magic-vue';
Vue.use(bkMagic);

Vue.config.productionTip = false;

new Vue({
  router,<$ if (features.includes('Vuex')) { $>
  store,<$ } $>
  render: h => h(App),
}).$mount('#app');
