import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
console.log('Vue App is starting...');
createApp(App).use(router).mount('#app');


