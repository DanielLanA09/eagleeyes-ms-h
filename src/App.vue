<template>
  <div id="app">
    <div class="route-body">
      <router-view/>
    </div>
    <div class="app-footer h-v-center">
      <span>EagleShing Software Entertainment Presentation</span>
    </div>    
  </div>
</template>
<script>

export default{

}

</script>
<style lang="less" scoped>
@import "./assets/style/eagle-system.css";
@import "./assets/style/iconfont.css";
#app{
  width: 100vw;
  height: 100vh;
}
.route-body{
  width: 100%;
  height: 98vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.app-footer{
  font-size: 12px;
  font-weight: 100;
  height: 2vh;
  width: 100vw;
  // display: flex;
  // justify-content: center;
  // align-items: center;
}

</style>
