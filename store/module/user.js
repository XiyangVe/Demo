import Vue from 'vue'

const state = {
	//用户基本信息
	userInfo:{},
	//点赞
	bingoIds:[],
	//收藏
	collectedIds:[],
	//关注
	concernedIds:[],
	
	chat:null
}
const mutations = {
	//存入个人信息
	SET_USER_INFO(state,data){
		state.userInfo = 
		{
			...data.user,
			level:data.level,
			levelName:data.levelName,
			dynamicNum:data.dynamicNum,
			pocNum:data.pocNum,
			fansNum:data.fansNum,
		}
		state.concernedIds = data.concernedIds
		state.collectedIds = data.collectedIds
		state.bingoIds = data.bingoIds
	},
	//退出清空
	REMOVE_USERIINFO(state){
		state.userInfo = {}
		state.bingoIds = []
		state.collectedIds = []
		state.concernedIds = []
	},
	//设置关注
	SET_FLLOW(state,data){
		if(data.type){
			let index = state.concernedIds.findIndex(v =>{
				return v == data.id
			})
			state.concernedIds.splice(index,index+1)
			
		}else{
			state.concernedIds.push(data.id)
		}
	},
	//设置点赞与收藏
	SET_BINGOIDS(state,data){
		if(data.type){
			let index = state.bingoIds.findIndex(v =>{
				return v == data.id
			})
			state.bingoIds.splice(index,index+1)
			
		}else{
			state.bingoIds.push(data.id)
		}
	},
	SET_COLLECTEDIDS(state,data){
		if(data.type){
			let index = state.collectedIds.findIndex(v =>{
				return v == data.id
			})
			state.collectedIds.splice(index,index+1)
			
		}else{
			state.collectedIds.push(data.id)
		}
	},
	
	
		
}
const actions = {
	//获取所有好友列表，需要更新所以放在全局
	async getUserInfo({state,commit,rootState}){
		let res = await Vue.prototype.$myMethod.getUserInfo()
		// console.log(res)
		if(res.code === 200){	
			commit('SET_USER_INFO',res.data)
			//如果登录状态未就绪就拉取信息
			if(!rootState.login.loginState){
				console.log('拉取数据')
				//拉取好友列表
				await this.dispatch('friend/getFriendGroupAll')
				//拉取展示的信息列表
				await this.dispatch('news/getShowNewsList')
				//拉取群聊展示的信息列表
				await this.dispatch('news/getShowGroupList')
				//链接wobsoket
				await this.dispatch('news/connectSocket')
			}
			this.commit('login/SET_LOGIN_STATE',true)	
			// #ifdef APP-PLUS
				// const jyJPush = uni.requireNativePlugin('JY-JPush');
				// jyJPush.setJYJPushAlias({
				// 	userAlias: res.data.user.id
				// 	}, result=> {
				// 		console.log(result)
				// })
			// #endif
		}
		return res
	}
}
export default {
	namespaced: true,
	state,
	mutations,
	actions
}