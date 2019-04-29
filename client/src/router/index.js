import Vue from 'vue'
import Router from 'vue-router'
import Hello from 'vue-router'
import HomePage from '@/components/HomePage'
import Login from '@/components/login'
import Confirmation from '@/components/confirmation'
import Register from '@/components/register'
import Profil from '@/components/profil'
import Search from '@/components/search'
import Messages from '@/components/messages'
import Matchs from '@/components/matchs'
import ChangePassword from '@/components/changePassword'
import ChangeUserInfos from '@/components/changeUserInfos'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: HomePage
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/confirmation/:token',
      name: 'confirmation',
      component: Confirmation
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/profil',
      name: 'profil',
      component: Profil
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/messages',
      name: 'messages',
      component: Messages
    },
    {
      path: '/matchs',
      name: 'matchs',
      component: Matchs
    },
    {
      path: '/changePassword',
      name: 'changePassword',
      component: ChangePassword
    },
    {
      path: '/changeUserInfos',
      name: 'changeUserInfos',
      component: ChangeUserInfos
    }
  ]
})
