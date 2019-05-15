<template>
  <el-container class="home-back">
    <el-aside width="200px" class="home-aside">
      <el-menu :default-active="setActivedNav" background-color="#545c64" text-color="#fff" active-text-color="#ffd046" @select="handleSelect">
        <el-menu-item index="0">
          <i class="el-icon-menu"></i>
          <span slot="title">文章列表</span>
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-tickets"></i>
            <span>工作台</span>
          </template>
          <el-menu-item index="1-1">添加新文章</el-menu-item>
          <!-- <el-menu-item index="1-2">文章审核</el-menu-item> -->
          <!-- <el-menu-item index="1-3">自定义文章</el-menu-item>       -->
          <el-menu-item index="1-4">自定义列表</el-menu-item>      
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>文章设置</span>
          </template>
          <el-menu-item index="2-1">栏目设置</el-menu-item>
          <el-menu-item index="2-2">模块参数</el-menu-item>
          <!-- <el-menu-item index="2-3">添加名词</el-menu-item> -->
          <!-- <el-menu-item index="2-4">添加公交</el-menu-item> -->
          <el-menu-item index="2-5">标签设置</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-star-off"></i>
            <span>小程序</span>
          </template>
          <el-menu-item index="3-1">首页文章</el-menu-item>
          <el-menu-item index="3-2">回答用户问题</el-menu-item>
          <el-menu-item index="3-4">筛选问题设置</el-menu-item>
        </el-submenu>
        <!-- <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-service"></i>
            <span>权限管理</span>
          </template>
          <el-menu-item index="4-1">模块权限</el-menu-item>
          <el-menu-item index="4-2">角色权限</el-menu-item>
          <el-menu-item index="4-3">用户管理</el-menu-item>
        </el-submenu> -->
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="current-location">
          <location></location>
        </div>
        <div class="user-settings">
          
        </div>
      </el-header>
      <el-main>
        <div class="nested-view">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import articleList from "@/views/home/ArticleList.vue";
import location from "@/components/Location";
export default {
  components: {
    articleList,
    location
  },
  data: () => ({}),
  computed: {
    setActivedNav() {
      return this.$store.state.CURRENT_NAV;
    }
  },
  methods: {
    handleSelect(index) {
      if (this.$store.state.CURRENT_NAV == "1-1") {
        this.$confirm("即将离开当前页面，是否继续？", "警告", {
          confirmButtonText: "继续",
          cancelButtonText: "不",
          type: "warning"
        }).then(() => {
          this.navTo(index);
        });
      }else{
        this.navTo(index);
      }
      
    },
    navTo(index) {
      switch (index) {
        case "0": {
          this.nestedMapping("/home/articles");
          break;
        }
        case "1-1": {
          this.$store.commit("CLEAN_COVER");
          this.nestedMapping("/home/addpost");
          break;
        }
        case "1-3": {
          this.nestedMapping("/home/addtextpost");
          break;
        }
        case "1-4": {
          this.nestedMapping("/home/textpostlist");
          break;
        }
        case "2-1": {
          this.nestedMapping("/home/modulemanage");
          break;
        }
        case "2-2": {
          this.nestedMapping("/home/moduleparams");
          break;
        }
        case "2-5": {
          this.nestedMapping("/home/tagmanage");
          break;
        }
        case "3-1":{
          this.nestedMapping("/home/wxarticle");
          break;
        }
        case "3-2":{
          this.nestedMapping("/home/answerquestion");
          break;
        }
        case "3-4":{
          this.nestedMapping("/home/questionset");
          break;
        }
      }
      this.$store.commit("SET_CURRENT_NAV", index);
    },
    nestedMapping(path) {
      this.$router.replace({ path: path });
    }
  },
  created() {
    // this.nestedMapping("/home/articles");
  },
  mounted() {
    
  }
};
</script>

<style lang="less" scoped>
.home-back {
  width: 100%;
  height: 100%;
}
.home-header {
  // background:
}
.home-aside {
  background: #545c64;
}
.home-main {
}
.nested-view {
  height: 100%;
}
</style>
