<template>
    <div class="login-back h-v-center">
        <div class="title h-v-center">
            软胜鹰眼分析系统软件V1.0
        </div>
        <div class="login-block">
            <el-form ref="loginForm" :model="loginModel" label-width="70px" :label-position="'left'" :rules="rules">
                <el-form-item prop="usernameOrEmail">
                    <span slot="label" style="color:white">用户名:</span>
                    <el-input v-model="loginModel.usernameOrEmail" style="width:200px" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <span slot="label" style="color:white">密码:</span>
                    <el-input v-model="loginModel.password" type="password" style="width:200px" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width:200px" @click="onSubmit">点击登陆</el-button>
                </el-form-item>
                <el-form-item>
                    <!-- <span><a href="#" @click="$router.replace({name:'signup'})">用户注册</a></span> -->
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import api from "@/utils/api.js";

export default {
  data: () => ({
    loginModel: {
      usernameOrEmail: "",
      password: ""
    },
    rules: {
      usernameOrEmail: [
        { required: true, message: "请输入您的用户名", trigger: "blur" }
      ],
      password: [
        { required: true, message: "请输入您的登陆密码", trigger: "blur" }
      ]
    }
  }),
  methods: {
    onSubmit() {
      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          localStorage.clear();
          api
            .signin(this.loginModel, res => {
              if (res.success) {
                api.getUserInfo(this.loginModel.usernameOrEmail);
                this.$router.push({ name: "home" });
              } else {
                this.$alert("用户名或密码错误", "登陆错误", {
                  confirmButtonText: "返回重试"
                });
              }
            })
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login-back {
  width: 100%;
  height: 100%;

  background: linear-gradient(342deg, #3ed7b0, #e39f17, #09dbf2);
  background-size: 600% 600%;
  -webkit-animation: AnimationName 41s ease infinite;
  -o-animation: AnimationName 41s ease infinite;
  animation: AnimationName 41s ease infinite;
  .title {
    color: white;
    font-size: 20px;
    font-weight: 100;
    padding: 100px;
  }
  .login-block {
    color: white;
  }
}
@-webkit-keyframes AnimationName {
  0% {
    background-position: 0% 10%;
  }
  50% {
    background-position: 100% 91%;
  }
  100% {
    background-position: 0% 10%;
  }
}
@-o-keyframes AnimationName {
  0% {
    background-position: 0% 10%;
  }
  50% {
    background-position: 100% 91%;
  }
  100% {
    background-position: 0% 10%;
  }
}
@keyframes AnimationName {
  0% {
    background-position: 0% 10%;
  }
  50% {
    background-position: 100% 91%;
  }
  100% {
    background-position: 0% 10%;
  }
}
</style>
