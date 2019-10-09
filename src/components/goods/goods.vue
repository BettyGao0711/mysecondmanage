<template>
  <div>
      <!-- 面包屑 -->
      <bread col1="商品管理" :col2="msg"></bread>
      <router-view></router-view>
      
  </div>
</template>

<script>
export default {
  name:'goods',
  data(){
    return {
      msg:'商品列表'
    }
  },
  watch:{
    '$route'(){
     if(this.$route.path=='/goods/add'){
        this.msg="添加商品"
     }else {
       this.msg="商品列表"
     }
    }
    // '$route'(){
    //  this.msg=this.$route.meta.msg
    // }
  }
}
</script>

<style>

</style>