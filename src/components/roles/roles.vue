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
              <el-tag closable type>
            {{item.authName}}
            </el-tag>
             </el-col>
               <el-col :span="18">
               <el-row v-for="(subitem) in item.children" :key="subitem.id">
                 <el-col :span="8">
                   <el-tag closable type="success">
               {{subitem.authName}}
                </el-tag>
                 </el-col>
                 <el-col :span="16">
                   <el-tag
                v-for="(isubitem) in subitem.children"
                :key="isubitem.id"
                closable
                type="warning"
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
          <el-button size="mini" type="warning" plain icon="el-icon-check" @click="showRights"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 树形控件--放在对话框里 -->
<el-dialog title="权限分配" :visible.sync="dialogFormVisible">
   <el-tree
  :data="data"
  show-checkbox
  default-expand-all
  node-key="id"
  ref="tree"
  highlight-current
  :props="defaultProps">
</el-tree>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
export default {
  name: "roles",
  data() {
    return {
      tableData: [],
      //隐藏显示对话框
      dialogFormVisible:false,
       data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
    };
  },
  methods:{
    //显示树形控件-角色的所有权限
  showRights(){
    this.dialogFormVisible=true;
  }
  },
  created() {
    //发请求获取角色列表,每个角色都有对应的权限
    this.$axios.get("roles").then(res => {
      // console.log(res);
      this.tableData = res.data.data;
    });
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