import './assets/base.css';
import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { auth } from '@/utils/firebase';
import VeeValidatePlugin from '@/utils/validation';
import GlobalComponents from '@/utils/global-components';
import i18n from './utils/i18n';
import progressBar from './utils/progress-bar';
import 'nprogress/nprogress.css';

import App from './App.vue';
import router from './router';

progressBar(router);

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(i18n);
    app.use(GlobalComponents);

    app.mount('#app');
  }
});
