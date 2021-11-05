import Vue from 'vue'
import VueRouter from 'vue-router'
import  Login from '../components/Login'
import Home from '../components/Home'
import User from '../components/user/User'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children:[
      {
        path: '/users',
        component: User
      }
    ]
  },
]

const router = new VueRouter({
  routes
})


//路由导航守卫，没有登录则不能进入首页
router.beforeEach((to,from,next)=>{
  if(to.path === '/login') return next()
  //获取token
  const token = window.sessionStorage.getItem('token')
  if(!token) return next('/login')
  //没有return则表示有token的，直接放行
  next()
})
export default router
