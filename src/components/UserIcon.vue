<template>
    <div class="header-back">
        <div class="user-info h-left">
            <div class="header-icon h-v-center">
              <span>{{firstLetter}}</span>
              
            </div>
            <div class="info">
                <div class="username">
                    <span>{{name}}</span><span style="margin-left:10px;color:#DCDCDC" v-if="userName!=''">@{{userName}}</span>
                </div>  
                <div class="email"> 
                    <span>{{email}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    userName: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      default: ""
    },
    firstLetter: ""
  },
  data() {
    return {
      
    };
  },
  mounted() {
    
  }
};
</script>

<style lang="less" scoped>
.user-info {
  height: 100%;
  width: 300px;
  .header-icon {
    height: 40px;
    width: 40px;
    background: #cd5c5c;
    border-radius: 100%;
  }
  .header-icon:hover{
    cursor: pointer;
  }
  .info {
    margin-left: 10px;
    .username {
      font-weight: 100;
      font-size: 12px;
      color: #fcfcfc;
    }
    .email {
      font-weight: 300px;
      font-size: 14px;
      color: #fcfcfc;
    }
  }
}
</style>
