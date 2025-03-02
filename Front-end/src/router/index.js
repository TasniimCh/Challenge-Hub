import { createRouter, createWebHistory } from 'vue-router';
import SignIn from '../components/SignIn.vue';
import SignUp from '../components/SignUp.vue';
import create from '../components/create.vue'

const routes = [
  { path: '/', redirect: '/signin' }, // Redirects "/" to "/signin"
  { path: '/signin', component: SignIn },
  { path: '/signup', component: SignUp },
  {path:'/create',component:create}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
