import Vue from 'vue'
import App from './App.vue'
//导入初始化样式
import './assets/css/base.css';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

import axios from 'axios'
Vue.prototype.$axios=axios;
//设置基地址
axios.defaults.baseURL="http://localhost:8888/api/private/v1/"
//请求拦截,携带token
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  let token=localStorage.getItem('token');
  if(token){
    config.headers.Authorization=token;
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

//注册面包屑组件--全局
import bread from './components/bread/bread.vue'
Vue.component('bread',bread)
  

//导入路由对象
import router from './router/myrouter'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
