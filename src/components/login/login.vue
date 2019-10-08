<template>
  <div class='login'>
      <el-form :model="ruleForm" label-position="top" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <h2>用户登录</h2>
  <el-form-item label="用户名" prop="username">
    <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')" style="width:100%">提交</el-button>
  </el-form-item>
</el-form>
  </div>
</template>

<script>
export default {
   name:'login',
   data(){
    return {
       ruleForm: {
          username: '',
          password: ''
        },
        // 校验规则
         rules: {
          username: [
              { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
          ],
          password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur' }
          ]
        }
      };
    },
    methods:{
      //整个表单的验证
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //验证没有问题
            this.$axios.post('login',{
              username:this.ruleForm.username,
              password:this.ruleForm.password
            }).then(res=>{
              // console.log(res)
              if(res.data.meta.status==200){
                  //登录成功,数据中返回一个token,将token保存
                  localStorage.setItem('token',res.data.data.token)
                  this.$message.success(res.data.meta.msg);
                  //跳转到index页面
                  this.$router.push('/index');

              }else {
                this.$message.warning(res.data.meta.msg)
              }
            })
          } else {
            this.$message.warning('输入错误,请检查')
            return false;
          }
        });
      }
    }
   }

</script>

<style scoped lang="less">
@import './login.less';

</style>