<template>
  <div class="add">
        <el-alert
    title="添加商品信息"
    type="info"
    center
    show-icon>
  </el-alert>

   <!-- 步骤条 -->
  <el-steps :space="200" :active="+activeTabName" finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
</el-steps>

 <el-form :model="ruleForm" label-position="top" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
<!-- tab栏切换 -->
<el-tabs v-model="activeTabName" tab-position="left" style="height: auto; margin-top:30px" @tab-click="handleTabClick">
    <el-tab-pane label="基本信息" name="0">
      <!-- 表单 -->
  <el-form-item label="商品名称" prop="goods_name">
    <el-input v-model="ruleForm.goods_name"></el-input>
  </el-form-item>
  <el-form-item label="商品价格" prop="goods_price">
    <el-input v-model="ruleForm.goods_price"></el-input>
  </el-form-item>
  <el-form-item label="商品重量" prop="goods_weight">
    <el-input v-model="ruleForm.goods_weight"></el-input>
  </el-form-item>
  <el-form-item label="商品数量" prop="goods_number">
    <el-input v-model="ruleForm.goods_number"></el-input>
  </el-form-item>
  <el-form-item label="商品分类" prop="goods_cat">
     <!-- 级联选择器 -->
      <el-cascader
      clearable
    v-model="ruleForm.goods_cat"
    :options="options"
    :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id'}"
    @change="handleChange"></el-cascader>
  </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1">
      <!-- 复选框组 -->
     <el-form-item v-for="(item) in dymanicParams" :key="item.attr_id" :label="item.attr_name">
      <el-checkbox-group v-model="item.attr_vals" size="small">
      <el-checkbox v-for="(val,index) in item.attr_vals" :key="index" :label="val" border></el-checkbox>
    </el-checkbox-group>
     </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="2">
      <el-form-item v-for="(item) in staticParams" :key="item.attr_id" :label="item.attr_name">
        <el-input v-model="item.attr_vals"></el-input>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
      <!-- 上传图片 -->
      <el-upload
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  multiple
  list-type="picture"
  >
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
    </el-tab-pane>
     <el-tab-pane label="商品内容" name="4">
       <el-button type="primary">添加商品</el-button>
       <!-- 富文本编辑器 -->
        <quill-editor v-model="ruleForm.goods_introduce">
       </quill-editor>
     </el-tab-pane>
  </el-tabs>
  </el-form>


  </div>

</template>

<script>
//富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
 name:'add',
 components: {
    quillEditor
  },
 data(){
   return {
     activeTabName:'0',
     //表单绑定的对象
     ruleForm:{
      goods_name:'',
      goods_price:'',
      goods_weight:'',
      goods_number:'',
      goods_cat:[],
      pic:[], //上传的图片的临时路径
      //富文本编辑器双向绑定的数据--输入的内容
      goods_introduce:'',

     },
     //级联的数据源
     options:[],
     //表单绑定的规则
     rules:{
      goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
      goods_price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' }
          ],
      goods_weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' }
          ],
      goods_number: [
            { required: true, message: '请输入商品数量', trigger: 'blur' }
          ],
      goods_cat: [
            { required: true, message: '请输入商品分类', trigger: 'blur' }
          ],
     },
     //动态参数
     dymanicParams:[],
     //静态参数
     staticParams:[],
     
   }
 },
 methods:{
   //级联选项发生变化的时候
   handleChange(){
      //必须选中第三个类别
      // console.log(this.ruleForm.goods_cat);
      if(this.ruleForm.goods_cat.length!==3){
        this.ruleForm.goods_cat=[];//不在级联里面显示这些选项
      }
   },
   //tab栏点击每个选项卡时触发
   async handleTabClick(tab){
    //  console.log(this.activeTabName)
    // 点击tabItem的时候，判断当前的activeTabName是不是 商品参数1 和 商品属性2
    if(this.activeTabName==="1"||this.activeTabName==="2"){
       //判断是否有选择商品分类,没有选择的话,级联的goods_cat就是空数组
       if(this.ruleForm.goods_cat.length===0){
         return this.$message.error('您没有选择商品分类,请选择!')
       }
       //选择了分类,就去发请求获取商品的参数--动态参数many/静态属性only
       const res=await this.$axios.get(`categories/${this.ruleForm.goods_cat[2]}/attributes`,{
         params:{
           sel:this.activeTabName==='1'?'many':'only'
         }
       })
       console.log(res)
       //如果获取失败,提示用户
       if(res.data.meta.status==200){
          //判断获取的数据是动态参数还是静态属性
          if(this.activeTabName=='1'){
            //动态参数
            res.data.data.forEach(item=>{
              //把item.attr_vals转成数组
              item.attr_vals=item.attr_vals.trim()==''?[]:item.attr_vals.trim().split(',')
            })
            this.dymanicParams=res.data.data;//动态参数
          }else {
            //静态属性
            this.staticParams=res.data.data;
          }
       }else {
          this.$message.error('获取参数失败')
       }
       
       
    }
   }
 },
 created(){
   this.$axios.get('categories',{
     params:{
       type:3
     }
   }).then(res=>{
    //  console.log(res)
     if(res.data.meta.status==200){
       this.options=res.data.data;
     }
   })
 }

}
</script>

<style lang="less" scoped>
.add {
  .el-alert {
      margin-top:20px;
      margin-bottom:20px;
  }
  .el-step /deep/ .el-step__title {
    font-size: 12px;
  }
  .quill-editor /deep/ .ql-container {
    height:400px;
  }
}
</style>