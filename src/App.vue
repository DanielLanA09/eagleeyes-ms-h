<template>
  <div id="app">
    <div class="route-body">
      <router-view/>
    </div>  
  </div>
</template>
<script>

export default{

}

</script>
<style lang="less">
@import "./assets/style/eagle-system.css";
@import "./assets/style/iconfont.css";
body{
  height: 100vh;
  width: 100vw;
}
#app{
  width: 100%;
  height: 100%;
  display: flex;
}
.route-body{
  width: 100%;
  flex-grow: 2;
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
