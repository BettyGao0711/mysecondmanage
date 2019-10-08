<template>
   <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{col1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{col2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  name:'bread',
  props:['col1','col2']
}
</script>

<style scoped>
 .el-breadcrumb {
    line-height: 40px;
    padding-left: 10px;
    background-color: #d3dce6;
  }
</style>
