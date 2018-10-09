import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ACCESS_TOKEN:"",
    USER:{
      userName:"",
      name:"",
      email:"",
      role:""
    },
    COVER:{
      
    },
    CURRENT_NAV:"0"
  },
  mutations: {
    SIGN_IN(state,token){
      state.ACCESS_TOKEN = token;
    },
    LOG_OUT(state){
      state.ACCESS_TOKEN = "";
    },
    SET_USER(state,user){
      state.USER = user;
    },
    EDIT_COVER(state,cover){
      cover.devisions.map(devision=>{
        devision.moduleList.map(module=>{
          if(module.jsonContent!=""){
            module.content=JSON.parse(module.jsonContent);
          }
         
        })
      })
      state.COVER = cover;
    },
    SET_CURRENT_NAV(state,nav){
      state.CURRENT_NAV=nav;
    },
    CLEAN_COVER(state){
      state.COVER = {};
    }
  },
  actions: {

  }
})
