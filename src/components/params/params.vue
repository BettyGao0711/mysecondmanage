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
    <el-tabs v-model="activeName" tab-position="top" style="height: 200px;" @tab-click="handleChange">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" size="mini" :disabled="isDisable">添加动态参数</el-button>
        <!-- 表格 -->
        <el-table :data="dynamicData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-tag v-for="(item,index) in props.row.attr_vals" :key="index" closable>{{item}}</el-tag>
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
      isDisable:true

    };
  },
  methods: {
    //级联的选项发生变化的时候
    async handleChange() {
      //只有选中第三级分类才发请求
      if (this.value.length === 3) {
        this.isDisable=false;
        const res = await this.$axios.get(
          `categories/${this.value[2]}/attributes`,
          {
            params: {
              sel: this.activeName
            }
          }
        );
        console.log(res);
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
      }else {
          //不是选中三级分类
          //button要禁用,并且动态参数和静态参数的数据要清空
          this.dynamicData=[];
          this.staticData=[];
          this.isDisable=true;
      }
    },
    //发请求获取商品分类--级联
    async loadCascader() {
      const res = await this.$axios.get("categories");
      //    console.log(res)
      if (res.data.meta.status == 200) {
        this.options = res.data.data;
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
}
</style>