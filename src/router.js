import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from "./views/Login.vue"
import Signup from "./views/SignUp.vue"
import ActicleList from "./views/home/ArticleList.vue"
import AddPost from "./views/workbentch/AddPost.vue"
import ModuleManage from "./views/moduleSet/ModuleManage.vue"
import ModuleParams from "./views/moduleSet/ModuleParams.vue"
import TagManage from "./views/moduleSet/TagManage.vue"
import FilterQuestionSet from "./views/miniProgram/FilterQuestionsSet.vue"
import WxArticle from "./views/miniProgram/ArticleLinkSet.vue"
import AnswerQuestion from "./views/miniProgram/AnswerQuestion.vue"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup
    },
    {
      name: 'textpost',
      path: '/textpost',
      component: () => import('@/views/workbentch/CustomePost.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'articles',
          component: ActicleList
        },
        {
          name: 'addpost',
          path: "addpost",
          component: AddPost
        },
        {
          name: 'addtextpost',
          path: "addtextpost",
          component: () => import('@/views/workbentch/AddTextPost.vue')
        },
        {
          name: 'textpostlist',
          path: "textpostlist",
          component: () => import('@/views/workbentch/CustomPostList.vue')
        },
        {
          path: "modulemanage",
          component: ModuleManage
        },
        {
          path: "moduleparams",
          component: ModuleParams
        },
        {
          path: "tagmanage",
          component: TagManage
        }, 
        {
          path:"questionset",
          component:FilterQuestionSet
        },
        {
          path:"wxarticle",
          component:WxArticle
        },
        {
          path:"answerquestion",
          component:AnswerQuestion
        }
      ]
    },
  ]
})
