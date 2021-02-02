import Vue from 'vue'
import App from './App'

// 引入全局uView
import uView from "uview-ui";
Vue.use(uView);

//引入状态管理器
import store from './store'
Vue.prototype.$store = store

// 全局挂载封装的请求(没有用uView-ui的接口请求)
import https from './utils/lib/https.js';
Vue.prototype.$https = https


//创建全局变量并混入vue中
let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);


Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
	...App,
})

// http拦截器，此为需要加入的内容，如果不是写在common目录，请自行修改引入路径
import httpInterceptor from '@/utils/request.js'
// 这里需要写在最后，是为了等Vue创建对象完成，引入"app"对象(也即页面的"this"实例)
Vue.use(httpInterceptor, app)

//接口全局挂载
// http接口API集中管理引入部分 
import httpApi from '@/api/api.js'
Vue.use(httpApi, app)

app.$mount()

 