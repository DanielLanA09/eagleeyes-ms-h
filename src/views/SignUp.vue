<template>
    <div class="signup-back h-v-center">
        <el-form ref="signForm" :model="signupModel" label-width="80px" :label-position="'left'" :rules="rules">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="signupModel.name" style="width:200px" placeholder="您的姓名"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="signupModel.username" style="width:200px" placeholder="登陆用户名"></el-input>
            </el-form-item>
            <el-form-item label="电子邮件" prop="email">
                <el-input v-model="signupModel.email" style="width:200px" placeholder="您常用的电子邮件"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="signupModel.password" type="password" style="width:200px" placeholder="登陆密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:200px" @click="onSubmit">注册</el-button>
            </el-form-item>
            <el-form-item>
                <span>已经注册？<a href="#" @click="$router.replace({name:'login'})">现在登陆！</a></span>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import api from "@/utils/api.js";
export default {
  data() {
    return {
      signupModel: {
        name: "",
        username: "",
        email: "",
        password: ""
      },
      rules: {
        name: [
          { required: true, message: "您的姓名不能为空", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "您的名字要在2个字到10个字之间",
            trigger: "blur"
          }
        ],
        username: [
          { required: true, message: "请输入您的登陆用户名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "您的用户名应该在2个字道10个字之间",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入您常用的联系邮箱",
            trigger: "blur"
          },
          { max: 40, message: "您的邮箱地址不能超过40个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入您的登陆密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "您的登陆密码应该在6个字到20个字之间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    onSubmit() {
      this.$refs["signForm"].validate(valid => {
        if (valid) {
          api.signup(this.signupModel);
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.signup-back {
  width: 100%;
  height: 100%;

  background: linear-gradient(342deg, #3ed7b0, #e39f17, #09dbf2);
  background-size: 600% 600%;
  -webkit-animation: AnimationName 41s ease infinite;
  -o-animation: AnimationName 41s ease infinite;
  animation: AnimationName 41s ease infinite;
  .title {
    padding: 40px;
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
