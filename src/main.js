import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import particles from 'particles.vue3';
import './util/axios.config'
import 'element-plus/dist/index.css';

createApp(App)
  .use(particles)
  .use(ElementPlus)
  .use(store)
  .use(router)
  .mount('#app')
