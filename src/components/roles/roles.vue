<template>
  <div class="roles">
    <!-- 面包屑 -->
    <bread col1="权限管理" col2="角色列表"></bread>
    <el-button>添加角色</el-button>
    <!-- 可展开的表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <span v-if="props.row.children.length==0">暂无分配权限</span>
          <!-- 展开的内容--显示每个角色的权限列表:一级-二级-三级权限-->
           <el-row v-for="(item) in props.row.children" :key="item.id" >
            <el-col :span="6">
              <el-tag closable @close="delRight(props.row,item.id)">
            {{item.authName}}
            </el-tag>
             </el-col>
               <el-col :span="18">
               <el-row v-for="(subitem) in item.children" :key="subitem.id">
                 <el-col :span="8">
                   <el-tag closable type="success" @close="delRight(props.row,subitem.id)">
               {{subitem.authName}}
                </el-tag>
                 </el-col>
                 <el-col :span="16">
                   <el-tag
                v-for="(isubitem) in subitem.children"
                :key="isubitem.id"
                closable
                type="warning"
                @close="delRight(props.row,isubitem.id)"
              >{{isubitem.authName}}</el-tag>
                 </el-col>
               </el-row>
             </el-col>
            </el-row>
          
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名字" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" plain></el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-delete"></el-button>
          <el-button size="mini" type="warning" plain icon="el-icon-check" @click="showRights(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 树形控件--放在对话框里 -->
<el-dialog title="权限分配" :visible.sync="dialogFormVisible">
   <el-tree
  :data="dataList"
  show-checkbox
  default-expand-all
  node-key="id"
  ref="tree"
  highlight-current
  :props="defaultProps">
</el-tree>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRights">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
export default {
  name: "roles",
  data() {
    return {
      // 表格数据
      tableData: [],
      //隐藏显示对话框
      dialogFormVisible:false,
      //树形控件的数据:每个角色对应的所有权限数据
      dataList:[],
      defaultProps: {
          children: 'children',
          label: 'authName'
        },
        //角色id
        roleId:''
    };
  },
  methods:{
    //删除权限--传入角色id和权限id
    delRight(row,rightId){
        this.$axios.delete(`roles/${row.id}/rights/${rightId}`).then(res=>{
          console.log(res);
          if(res.data.meta.status==200){
            //删除成功
            //重新发请求获取最新的数据,但是此时返回的数据里面有最新的数据,是一个数组,所有的权限--更新了的权限,所以可以不用发请求,直接将最新的数据赋值给当前的这一行对应的数据
            row.children=res.data.data;

          }
        })
    },
    //显示树形控件-包含所有权限--勾选当前角色的所有权限
  showRights(row){
    this.dialogFormVisible=true;
    this.roleId=row.id;//保存这个角色的id
    //row.children;//当前这个角色的所有权限
    //获取所有的三级权限的id
    //用递归
    let aIds=[];
    function getIds(arr){
        for(var i=0;i<arr.length;i++){
        if(arr[i].children){
          getIds(arr[i].children)
        }else {
          aIds.push(arr[i].id)
        }
      }
    }
    getIds(row.children);
    
    //选中这些权限
    this.$nextTick(()=>{
       this.$refs.tree.setCheckedKeys(aIds) //传入所有的权限的id,只能传入三级权限的id,因为勾选一级,全部的二级都被勾选,勾选二级,全部的三级都被勾选,如果我们只设置三级,对应的二级和一级会被半选
    }
    )

      
  },
  //设置权限
  setRights(){
    //获取所有勾选的权限,然后发请求
    let arr1=this.$refs.tree.getCheckedKeys()//获取所有选中的,全选
    let arr2=this.$refs.tree.getHalfCheckedKeys()
    let arr=[...arr1,...arr2]
    let rids=arr.join();//将数组里面的元素拼接成字符串,默认以逗号,隔开
    this.$axios.post(`roles/${this.roleId}/rights`,{
        rids
    }).then(res=>{
      // console.log(res)
      if(res.data.meta.status==200){
        this.$message.success('设置成功!')
        this.dialogFormVisible=false;
        this.getRoleList();
      }
    })
  },
  getRoleList(){
    //发请求获取角色列表,每个角色都有自己对应的权限
    this.$axios.get("roles").then(res => {
      // console.log(res);
      this.tableData = res.data.data;
    });
  }
  },
  created() {
    //发请求获取角色列表,
    this.getRoleList();
    //发请求获取所有的权限--展示在树形控件里面
    this.$axios.get('rights/tree').then(res=>{
      // console.log(res)
      this.dataList=res.data.data;
    })

  }
};
</script>

<style lang="less" scoped>
.roles {
  .el-tag {
    margin-bottom:10px;
    margin-left:10px;
  }
}
</style>