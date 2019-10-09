<template>
  <div>
      <!-- 面包屑 -->
      <bread col1="权限管理" col2="权限列表"></bread>
      <!-- 表格 -->
       <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      type="index"
      >
    </el-table-column>
    <el-table-column
      prop="authName"
      label="权限名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="path"
      label="路径"
      width="180">
    </el-table-column>
    <el-table-column
      prop="level"
      label="层级">
      <template v-slot="scope">
          {{scope.row.level | format}}
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
export default {
 name:'rights',
 data(){
     return {
          tableData: []
     }
 },
 filters:{
   format(value){
       switch(value){
           case '0': value="一级";break;
           case '1': value="二级";break;
           case '2': value="三级";break;
       }
       return value;
   }
 },
 created(){
     //发请求获取权限列表
     this.$axios.get('rights/list').then(res=>{
        //  console.log(res);
         if(res.data.meta.status==200){
             this.tableData=res.data.data;
         }
     })
 }
}
</script>

<style>

</style>