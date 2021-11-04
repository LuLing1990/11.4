<template>
  <div class="bg">
      <div class="login-box">
          <div class="img-box">
              <img src="../assets/logo.png" alt="">
          </div>
          <el-form ref="loginForm" :model="form" label-width="0" class="loginForm" :rules="rules">
                <el-form-item prop="username">
                    <!-- prefix-icon:在前面添加阿里巴巴图标 -->
                    <el-input v-model="form.username" prefix-icon="iconfont icon-yonghu" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" prefix-icon="iconfont icon-mima" placeholder="请输入密码" type="password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetForm">重置</el-button>
                </el-form-item>
           </el-form>
      </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                username: '',
                password: ''
            },
            rules:{
                // 失去焦点就需要验证
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ] 
            }
        }
    },
    methods:{
        resetForm: function(){
            // 重置表单
            this.$refs.loginForm.resetFields()
        },
        login: function(){
            this.$refs.loginForm.validate(async valid=>{
                // 账号密码格式输入错误，退出
                if(!valid) return
                //输入正确，向后台发送请求
                //返回的结果是Promise,通过async，await去简化
                const {data:result} = await this.$http.post('login',this.form)
                if (result.meta.status !==200) return this.$message.error('用户名或者密码错误，请重新输入！')
                this.$message.success('登录成功！');

                //后台返回token，将token保存到seccionstorage
                const token = result.data.token
                window.sessionStorage.setItem('token',token)
                //编程时导航跳转到首页
                this.$router.push("./home")

                

            })
            
        }
    }
}
</script>

<style scoped>
.bg{
    background-color: slateblue;
    height: 100%;
}
.login-box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.img-box{
    width: 130px;
    height: 130px;
    border: solid 1px #eee;
    background-color: #fff;
    padding: 10px;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    top:-25%;
    left: 50%;
    transform: translateX(-50%);
    
} 
.img-box img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
}
.loginForm{
    width: 100%;
    position: absolute;
    bottom: 0px;
    padding: 20px;
    padding-bottom: 0px;
    box-sizing: border-box;
}
.btns{
    float: right;
}
</style>