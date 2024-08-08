import './assets/base.css';
import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { auth } from '@/utils/firebase';
import VeeValidatePlugin from '@/utils/validation';

import App from './App.vue';
import router from './router';

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    app.use(VeeValidatePlugin);

    app.mount('#app');
  }
});
