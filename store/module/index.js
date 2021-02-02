const state = {
	// 群信息
	groupInfo:{},
	// 视频id
	videoId: '',
	// 即将修改的通讯录数据
	backupPhoneInfo:{},
	// 视频评论数据
	videoPlList: [],
	// 日程修改数据
	scheduleInfo: {},
	// 资讯富文本数据(test)
	nodes: ''
	
}
const mutations = {
	// 获取资讯富文本数据(test)
	getNewsNodes(state,data){
		state.nodes = data
	},
	// 点击进入群的时候把当前群信息存到VueX
	setGroupInfo(state,data){
		state.groupInfo = data
	},
	// 设置视频id
	setVideoId(state,id){
		state.videoId = id
	},
	// 获取要修改的日历数据
	getScheduleInfo(state,data){
		state.scheduleInfo = data
	}
}
const actions = {
	getvideoPlList({state},data){
		state.videoPlList = data
	},
	// 通讯录修改的数据
	setBackupPhoneInfo({state},data){
		state.backupPhoneInfo = data
	}
}
export default {
	namespaced: true,
	state,
	mutations,
	actions
}