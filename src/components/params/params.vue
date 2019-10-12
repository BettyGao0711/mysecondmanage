<template>
  <div class="params">
    <!-- 面包屑 -->
    <bread col1="商品管理" col2="分类参数"></bread>
    <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
    <!-- 级联 -->
    <span>请选择商品分类:&nbsp;&nbsp;</span>
    <el-cascader
      v-model="value"
      placeholder="请选择商品分类"
      :options="options"
      :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id' }"
      @change="handleChange"
    ></el-cascader>
    <!-- tab栏 -->
    <el-tabs v-model="activeName" tab-position="top" style="height: 200px;" @tab-click="handleChangeType">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" size="mini" :disabled="isDisable" @click="add">添加动态参数</el-button>
        <!-- 表格 -->
        <el-table :data="dynamicData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-tag v-for="(item,index) in props.row.attr_vals" :key="index" closable
              @close="handleClose(item,props.row)">{{item}}</el-tag>
              <!-- 动态编辑的标签 -->
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(props.row)"
                @blur="handleInputConfirm(props.row)">
              </el-input>
             <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="商品参数" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button type="success" icon="el-icon-check" size="mini" plain></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="only">
        <el-button type="primary" size="mini" :disabled="isDisable">添加静态参数</el-button>
        <!-- 表格 -->
         <el-table
      :data="staticData"
      style="width: 100%">
       <el-table-column
       type="index">
      </el-table-column>
      <el-table-column
        prop="attr_name"
        label="属性名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="attr_vals"
        label="属性值"
        width="180">
      </el-table-column>
      <el-table-column label="操作">
            <template v-slot="scope">
              <el-button type="success" icon="el-icon-check" size="mini" plain></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
            </template>
          </el-table-column>
    </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 对话框--添加动态参数 -->
    <el-dialog title="添加动态参数" :visible.sync="dialogFormVisible">
  <el-form :model="form" ref="form" :rules="rules">
    <el-form-item label="动态参数" label-width="120px" prop="attr_name"
     >
      <el-input v-model="form.attr_name" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitAdd('form')">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
export default {
  name: "params",
  data() {
    return {
      activeName: "many",
      value: [],
      options: [],
      //表格的数据
      dynamicData: [],
      staticData:[],
      //是否禁用按钮
      isDisable:true,
      //显示隐藏对话框
      dialogFormVisible:false,
      form:{
        attr_name:''
      },
      rules:{
        attr_name:[
      { required: true, message: '请输入参数名', trigger: 'blur' }
    ]
      },
      //动态编辑的标签
      inputVisible: false,
      inputValue: ''

    };
  },
  methods: {
    //级联的选项发生变化的时候,tab栏切换也可以调用这个方法
    handleChange() {
      //只有选中第三级分类才发请求
      if (this.value.length === 3) {
        this.isDisable=false;
        //发请求获取参数列表
        this.getData();
        
      }else {
          //不是选中三级分类
          //button要禁用,并且动态参数和静态参数的数据要清空
          this.dynamicData=[];
          this.staticData=[];
          this.isDisable=true;
      }
    },
    //tab栏切换的时候,发请求
    handleChangeType(){
       if(this.value.length===3){
         this.getData();//many/only
       }
    },
    //显示添加动态参数的对话框
    add(){
     this.dialogFormVisible=true;
     
    },
    //点击对话框的确定按钮,验证表单,然后发请求
    submitAdd(formName){
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            //验证成功
            //请求参数
            this.form.attr_sel='many'
            const res=await this.$axios.post(`categories/${this.value[2]}/attributes`,this.form);
            console.log(res)
            if(res.data.meta.status==201){
              this.$message.success(res.data.meta.msg);
              this.getData();
              this.dialogFormVisible=false;

            }
          } else {
            // this.$message.warning('请填写参数名')
            return false;
          }
        });

    },
    //动态编辑的tag
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
     //动态编辑--添加属性
      handleInputConfirm(row) {
        let inputValue = this.inputValue;
        if (inputValue) {
          row.attr_vals.push(inputValue);//往动态参数的属性--数组里面添加
           //修改了动态参数的属性值,要发请求去修改数据库里面的数据
           //提交的参数:分类id,参数id,参数名,参数类型many/only,参数值
        this.$axios.put(`categories/${this.value[2]}/attributes/${row.attr_id}`,{
          attr_name:row.attr_name,
          attr_sel:'many',
          attr_vals:row.attr_vals.join()
        }).then(res=>{
          console.log(res);
          if(res.data.meta.status==200){
            this.$message.success(res.data.meta.msg)
            // row.attr_vals=res.data.data.attr_vals.split(',')
          }else {
            this.$message.error(res.data.meta.msg)
          }
        })
        }
        this.inputVisible = false;
        this.inputValue = '';
       
      },
      //删除属性值--动态参数的
       handleClose(item,row) {
        row.attr_vals.splice(row.attr_vals.indexOf(item), 1);//页面上更新
        //更新数据库
         this.$axios.put(`categories/${this.value[2]}/attributes/${row.attr_id}`,{
          attr_name:row.attr_name,
          attr_sel:'many',
          attr_vals:row.attr_vals==[]?'':row.attr_vals.join()
        }).then(res=>{
          console.log(res);
          if(res.data.meta.status==200){
            this.$message.success(res.data.meta.msg)
           
          }else {
            this.$message.error(res.data.meta.msg)
          }
        })

      },
    //发请求获取商品分类--级联
    async loadCascader() {
      const res = await this.$axios.get("categories");
      //    console.log(res)
      if (res.data.meta.status == 200) {
        this.options = res.data.data;
      }
    },
    //发请求获取动态-静态参数,封装成方法,可以重复调用
    async getData(){
      const res = await this.$axios.get(
          `categories/${this.value[2]}/attributes`,
          {
            params: {
              sel: this.activeName
            }
          }
        );
        // console.log(res);
        if (res.data.meta.status == 200) {
            //如果是动态参数
          if(this.activeName=='many'){
              //将返回的数据里的属性attr_vals-字符串 转成数组--可以v-for
              res.data.data.forEach(item=>{
                  item.attr_vals=item.attr_vals==''?[]:item.attr_vals.split(',')
              })
              this.dynamicData=res.data.data;
          }else {
              //静态参数
             this.staticData=res.data.data;
          }
        } else {
          this.$message.error(res.data.meta.msg);
        }
    }
  },
  mounted() {
    this.loadCascader();
  }
};
</script>

<style lang="less" scoped>
.params {
  .el-alert {
    margin: 20px 0;
  }

  .el-tabs {
    margin-top: 30px;
  }
  .el-tag {
      margin-right:20px;
  }
  .el-button {
      margin-bottom:20px;
  }
  //  .el-tag + .el-tag {
  //   margin-left: 10px;
  // }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>