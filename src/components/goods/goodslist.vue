<template>
  <div>
      <!-- 输入框 -->
    <el-row>
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="query" @keyup.enter.native="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click.native="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="18">
        <el-button type="success" plain @click="$router.push('/goods/add')">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
     <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index">
      </el-table-column>
      <el-table-column label="商品名称" prop="goods_name" width="500"></el-table-column>
      <el-table-column label="商品价格(元)" prop="goods_price" width="120"></el-table-column>
       <el-table-column label="商品重量" prop="goods_weight" width="100"></el-table-column>
        <el-table-column label="创建时间" width="200">
            <template v-slot="scope">
                {{scope.row.add_time | dataFormat('YYYY-MM-DD H:mm:ss')}}
            </template>
        </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" plain></el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name:'index',
   data(){
      return {
          tableData:[],
          //查询的关键词
          query:'',
          pagenum:1,
          pagesize:10,
          total:0
      }
  },
  methods:{
      //页容量发生变化
    handleSizeChange(size){
      this.pagenum=1;
      this.pagesize=size;
      this.getGoodsList()
    },
    //当前页码发生变化
    handleCurrentChange(page){
       this.pagenum=page;
       this.getGoodsList()

    },
    //搜索
    search(){
      this.query.trim();
      this.pagenum=1;
      this.getGoodsList();
    },
     //发请求获取商品列表--方法
    getGoodsList(){
       
      this.$axios.get('goods',{
          params:{
          query:this.query,
          pagenum:this.pagenum,
          pagesize:this.pagesize
          }
      }).then(res=>{
          console.log(res);
          if(res.data.meta.status==200){
              this.tableData=res.data.data.goods;
              this.total=res.data.data.total;
          }
      })
    }
  },
  created(){
      //发请求获取商品列表
      this.getGoodsList();
  }
}
</script>

<style>

</style>