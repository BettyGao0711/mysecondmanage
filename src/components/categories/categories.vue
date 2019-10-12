<template>
  <div>
      <bread col1="商品管理" col2="商品分类"></bread>
      <el-button type="success" plain @click="showAdd">商品分类</el-button>
      <!-- 表格--树形数据 -->
      <el-table
      v-loading="loading"
    :data="tableData"
    style="width: 100%;margin-bottom: 20px;"
    row-key="cat_id"
    border
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column
      prop="cat_name"
      label="分类名称"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="cat_level"
      label="级别"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="cat_deleted"
      label="是否有效">
      <template v-slot="scope">
        {{scope.row.cat_deleted?'无效':'有效'}}
      </template>
    </el-table-column>
     <el-table-column
      prop="address"
      label="操作">
       <template v-slot="scope">
              <el-button type="success" icon="el-icon-check" size="mini" plain></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[6, 12, 18, 24]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="分类名称" label-width="120px">
      <el-input v-model="form.cat_name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="分类" label-width="120px">
     <!-- 级联 -->
      <el-cascader
    placeholder="默认添加一级分类"
    clearable
    v-model="value"
    :options="options"
    change-on-select
    :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id' }"
    ></el-cascader>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
export default {
   name:'categories',
   data(){
     return {
       loading:false,//加载数据时是否开启加载动画
       //请求获取到的数据
       totalData:[],
       //表格的数据
       tableData:[],
       //分页的参数
       pagenum:1,
       pagesize:6,
       total:0,
       //对话框的显示
       dialogFormVisible:false,
       form:{
         cat_name:'',
         cat_pid:0,//分类父id
         cat_level:0 //分类层级
       },
       //级联选中的选项
       value:[],
       //级联的数据
      options:[]

     }
   },
   methods:{
     //定义获取分类的数据的方法
     async getData(){
       this.loading=true;
        const res=await this.$axios.get('categories',{
          params:{
            type:3
          }
        });
        // console.log(res)
        if(res.data.meta.status==200){
          this.loading=false;
          function filters(data){
            data.forEach(item=>{
            switch(item.cat_level){
              case 0:item.cat_level='一级';break;
              case 1:item.cat_level='二级';break;
              case 2:item.cat_level='三级';break;
            }
            if(item.children){
              filters(item.children)
            }
          })
          }
          filters(res.data.data)
          this.totalData=res.data.data;
          this.total=res.data.data.length;
          this.sliceData();
        }
     },
     //截取数组
     sliceData(){
         //按照页容量截取数组
           let begin=(this.pagenum-1)*this.pagesize;
           let end=begin+this.pagesize-1;
           this.tableData=this.totalData.slice(begin,end+1);
     },
     //页容量发生变化
     handleSizeChange(size){
       this.pagenum=1;
       this.pagesize=size;
       this.sliceData()
     },
     //当前页码发生变化
     handleCurrentChange(page){
       this.pagenum=page;
       this.getData()
     },
     //显示添加分类的对话框
     showAdd(){
          this.dialogFormVisible=true;
     },
     //添加分类
    async addCate(){
      //请求参数
      //分类父id--级联选中的选项-数组中的最后一个元素
      if(this.value.length==0){
         this.form.cat_pid=0;
      }else {
        this.form.cat_pid=this.value[this.value.length-1];
      }
      //分类层级--数组的长度--0,1,2
      this.form.cat_level=this.value.length;

      const res=await this.$axios.post('categories',this.form);
      // console.log(res)
      if(res.data.meta.status==201){
        this.$message({
          message:res.data.meta.msg,
          ttpe:'success',
          duration:1000
        })
        this.dialogFormVisible=false;
        this.getData() //表格中加载最新的分类数据
        this.getLevel2Data() //级联也要加载最新的
      }else {
        this.$message.error(res.data.meta.msg)
      }
    },

     //获取二级分类的数据--级联
     async getLevel2Data(){
        const res=await this.$axios.get('categories/?type=2');
        // console.log(res)
        if(res.data.meta.status==200){
         
          this.options=res.data.data;
          
        }
     },
   },
   created(){
     //发请求获取分类数据--3级--表格
     this.getData();
    //级联的数据-2级分类
    this.getLevel2Data();
     
   }
}
</script>

<style>

</style>