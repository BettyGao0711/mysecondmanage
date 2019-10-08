<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 输入框 -->
    <el-row>
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="query" @input="getData" @keyup.native.enter="getData" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
        </el-input>
      </el-col>
      <el-col :span="18">
        <el-button type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="姓名" width="200" prop="username"></el-table-column>
      <el-table-column label="邮箱" width="250" prop="email"></el-table-column>
      <el-table-column label="电话" width="180" prop="mobile"></el-table-column>
      <el-table-column label="用户状态" width="180">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row.mg_state,scope.row)" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" plain></el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-delete"></el-button>
           <el-button size="mini" type="warning" plain icon="el-icon-check" @click="showRole(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="当前用户" label-width="120px">
      <span>{{form.username}}</span>
    </el-form-item>
    <el-form-item label="请选择角色" label-width="120px">
      <el-select v-model="form.roleid" placeholder="请选择角色">
        <el-option :label="item.roleName" :value="item.id" v-for="(item,index) in roleList" :key="index"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="changeRole">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
export default {
  name: "users",
  data() {
    return {
      //搜索框
      // val: "",
      //表格的数据源
      tableData: [],
      //查询关键字--搜索框输入的内容
      query:'',
      //当前页码
      pagenum:1,
      //页容量
      pagesize:5,
      //总条数
      total:0,
      //隐藏显示对话框
      dialogFormVisible:false,
      form:{
        username:'',
        roleid:'',
        id:''
      },
      //角色列表
      roleList:[]

    };
  },
  methods:{
    //页容量发生变化
      handleSizeChange(size){
         this.pagenum=1;
         this.pagesize=size;
         this.getData();
      },
        //当前页码发生变化
        handleCurrentChange(page){
         this.pagenum=page;
         this.getData();
        },
        //修改用户的状态
        changeState(state,row){
          this.$axios.put(`users/${row.id}/state/${state}`).then(res=>{
            // console.log(res)
            if(res.data.meta.status==200){
              //设置成功
              //发请求获取最新的用户列表
              this.getData()
            }
          })
        },
        //显示用户的角色
        showRole(row){
            //显示对话框
            this.dialogFormVisible=true;
            this.form.username=row.username;
            this.form.id=row.id;//用户id
            //找到当前用户的角色id,利用角色名字查找,rolelist里有角色名字和角色id
            this.roleList.forEach(item=>{
              if(item.roleName==row.role_name){
                 this.form.roleid=item.id;//找到了对应的id
              }
            })

        },
        //修改用户的角色--分配角色
        changeRole(){
           //当用户修改当前用户的角色的时候,roleid是双向绑定的,可以拿到最新的角色id
            this.$axios.put(`users/${this.form.id}/role`,{
              rid:this.form.roleid
            }).then(res=>{
              // console.log(res);
              if(res.data.meta.status==200){
                //角色设置成功
                this.getData();

                this.dialogFormVisible=false;
              }
            })
        },

      //发请求获取用户列表--复用,封装在函数里面
     getData(){
       //如果是搜索时调用,要排除输入空格,服务器会查出所有匹配关键字的,但是返回的是当前指定的页码,比如第三页,但是匹配的可能只有一页,就只能在第一页显示
       //所以要将页码重置为1
       if(this.query.trim()!=''){
         this.pagenum=1;
       }
       this.$axios.get('users',{
       params:{
         query:this.query,
         pagenum:this.pagenum,
         pagesize:this.pagesize
       }
     }).then(res=>{
      //  console.log(res);
       this.tableData=res.data.data.users;
       this.total=res.data.data.total;
     })
     }

  },
  created(){
    this.getData();
    //获取角色列表
    this.$axios.get('roles').then(res=>{
      // console.log(res);
      if(res.data.meta.status==200){
        this.roleList=res.data.data;
      }
    })
  }
};
</script>

<style lang="less" scoped>
.users {
  .el-breadcrumb {
    line-height: 40px;
    padding-left: 10px;
    background-color: #d3dce6;
  }
  .el-row {
    margin-top: 15px;
  }
}
</style>