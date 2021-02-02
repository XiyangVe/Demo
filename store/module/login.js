import Vue from 'vue'

try{
	var localToken = uni.getStorageSync('localToken') || ''
}catch(e){
	console.log(e)
}

const state = {
		//token
		token:localToken,
		//登录状态
		loginState:false
	}
const mutations = {
		//登录状态
		SET_LOGIN_STATE(state,data){
			state.loginState = data
		},
		SET_TOkEN(state, data){
			state.token = data
			uni.setStorageSync('localToken',data)
		},
		REMOVE_TOKEN(state){
			state.token = ''
			uni.removeStorageSync('localToken')
		}
		
	}
	//通过actions 可以间接调用 mutations突变方法 
	//actions是个同步方法 这里可以发送请求什么的然后通过返回的值在改变值
const actions = {
	phoneLogin({commit,state},{
		phone,
		code,
	},){
		return new Promise((resolve,reject)=> {
			//调用挂载原型的登录方法
			Vue.prototype.$myMethod.phoneLogin({
				phone,
				code
			}).then(res => {
				// console.log(res) 
				if(res.code === 200) {
					commit('SET_TOkEN',res.data.Authorization)
					let username = res.data.username
					let password = res.data.password
					uni.setStorageSync('accountKey', {username,password})
					//拉取个人信息
					this.dispatch('user/getUserInfo')
				}
				resolve(res)
			})
		})
	},
		//登录
		login({commit},{
			username,
			password,
		},){
			return new Promise((resolve,reject)=> {
				//调用挂载原型的登录方法
				Vue.prototype.$myMethod.login({
					username,
					password
				}).then(res => {
					// console.log(res) 
					if(res.code === 200) {
						commit('SET_TOkEN',res.data)
						uni.setStorageSync('accountKey', {username,password})
						//拉取个人信息
						this.dispatch('user/getUserInfo')
					}
					resolve(res)
				})
			})
		},
		//退出登录
		async loginOut(){
			let res = await Vue.prototype.$myMethod.logOut()
			console.log(res)
			if(res.code === 200){
				this.dispatch('login/hanleLoginOut')
			}
			return res
		},
		//退出方法
		hanleLoginOut({commit,rootState}){
			//清空状态
			/* commit('REMOVE_TOKEN') */
 			this.commit('news/REMOVE_INFO')
			this.commit('friend/FRIEND_LIST',[])
			this.commit('user/REMOVE_USERIINFO')
			commit('SET_LOGIN_STATE',false) 
			//移除本地缓存token&用户
			uni.removeStorageSync('accountKey')
			uni.removeStorageSync('localToken')
			//退出webscket
			this.dispatch('news/closeSocket') 
			// #ifdef APP-PLUS
			// const jyJPush = uni.requireNativePlugin('JY-JPush');
			// jyJPush.deleteJYJPushAlias({
			// //  可以不用传值进去，但是需要配置这项数据
			// }, result=> {
			// 	console.log(result)
			// });
			// #endif
		}
	}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
