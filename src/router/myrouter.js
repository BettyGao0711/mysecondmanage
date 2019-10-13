import Vue from 'vue';
import VueRouter from 'vue-router';
//vue-router 3.1.x版本,路由跳转重复点击会报错(路由跳转用的是promise),可以用如下代码解决;或者换版本,用vue-router 3.0.x版本
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter);
import axios from 'axios';

//导入组件
import login from '../components/login/login.vue'
import index from '../components/index/index.vue'
//index嵌套路由的组件
import users from '../components/users/users.vue'
import roles from '../components/roles/roles.vue'
import rights from '../components/rights/rights.vue'
import goods from '../components/goods/goods.vue'
import goodslist from '../components/goods/goodslist.vue'
import add from '../components/goods/add.vue'
import params from '../components/params/params.vue'
import categories from '../components/categories/categories.vue'
import reports from '../components/reports/reports.vue'

//设置路由规则
const routes=[
    {path:'',redirect:'/index'},
    {path:'/login',component:login},
    {path:'/index',component:index,meta:{isLogin:true},children:[
        {path:'/users',component:users},
        {path:'/roles',component:roles},
        {path:'/rights',component:rights},
        {path:'/goods',component:goods,children:[
            {path:'',redirect:'list'},
            {name:'goodslist',path:'list',component:goodslist,meta:{msg:'商品列表'}},
            {path:'add',component:add,meta:{msg:'添加商品'}},
        ]},
        {path:'/params',component:params},
        {path:'/categories',component:categories},
        {path:'/reports',component:reports},
    ]}
]
//实例化路由对象
const router=new VueRouter({
    routes
})


//全局前置导航守卫
router.beforeEach((to,from,next)=>{
  if(to.meta.isLogin){
      //判断是否有token,token是否对的,是否有过期--发请求去服务器,让服务器验证
      axios.get('users').then(res=>{
        //   console.log(res);
          if(res.data.meta.msg=='无效token'&&res.data.meta.status==400){
              console.log(1212)
              Vue.prototype.$message.warning('您没有登录,请先登录')
              router.push('/login')
          }else {
              next()
          }
      })
  }else {
      next()
  }
})

//将路由对象挂载到实例化的Vue对象上
//暴露路由对象
export default router;