<template>
  <div class='index'>
      <el-container>
  <el-header>
    <el-row>
  <el-col :span="3">
    <img src="../../assets/images/logo.png" alt="">
  </el-col>
  <el-col :span="20">
    <h1>先歌经销商管理后台</h1>
  </el-col>
  <el-col :span="1">
    <a href="#" @click="logout">退出</a>
    </el-col>
   </el-row>
  </el-header>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-main>Main</el-main>
  </el-container>
</el-container>
  </div>
</template>

<script>
export default {
  name:'index',
  data(){
    return {

    }
  },
  methods:{
     logout(e) {
       e.preventDefault();
       
        this.$confirm('您确定要退出吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确定要退出
          //删除token
          localStorage.removeItem('token')
          this.$message({
            type: 'success',
            message: '退出成功!',
            duration:1000
          });
          this.$router.push('/login')

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });          
        });
      }
  }
}
</script>

<style lang="less">
.index {
  height:100%;
}
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    h1 {
      margin:0;
      color:#fff;
    }
    img {
      vertical-align: middle;
    }
    a {
      color:orange;
      font-weight: 700;
    }
  }
  
  .el-aside {
    background-color: #fff;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  .el-container {
    height:100%;
  }
</style>