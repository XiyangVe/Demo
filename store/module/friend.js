import Vue from 'vue'

const state = {
	friendList : [],
}
const mutations = {
	FRIEND_LIST(state,data){
		state.friendList = data
	}	
}
const actions = {
	//获取所有好友列表，需要更新所以放在全局
	async getFriendGroupAll({commit}){
		let res = await Vue.prototype.$myMethod.getFriendGroupAll()	
		let itemList = res.data.map(v => {
			return {
				groupId:v.groupId,
				userId:v.userId,
				head:v.groupName,
				friend:v.friend !== null ? v.friend : [],
				length:v.friend.length !== 0 ? `(${v.friend.length})` : '',	
			}
		})
		commit('FRIEND_LIST',itemList)
		return res.code
	}	
}
export default {
	namespaced: true,
	state,
	mutations,
	actions
}