import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import login from './module/login.js'
import index from './module/index.js'
import user from './module/user.js'
import news from './module/news.js'
import friend from './module/friend.js'
import goods from './module/goods.js'
import getters from './getters.js'

const store = new Vuex.Store({
	modules: {
		login,
		index,
		user,
		news,
		friend,
		goods
	},
	getters
})

export default store
