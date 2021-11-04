import Vue from 'vue'
import App from './App.vue'
import router from './router'

//导入全局样式
import '../src/assets/css/global.css'

//导入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//导入字体图标
import './assets/font/iconfont.css'

//导入axios,设置基础路径
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
