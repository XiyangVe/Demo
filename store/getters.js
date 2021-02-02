const getters = {
	
	//个人基本信息
	userInfo: start => start.user.userInfo,
	//关注
	concernedIds: start => start.user.concernedIds,
	//收藏
	collectedIds: start => start.user.collectedIds,
	//点赞
	bingoIds: start => start.user.bingoIds,
	
	
	//聊天模块
	
	//所有本地消息模块
	allNewsList:state => state.news.allNewsList,
	//群聊
	allGroupChatNewsList:state => state.news.allGroupChatNewsList,
	//需要展示的聊天页面的uid
	showNewsListId:state => state.news.showNewsListId,
	//需要展示的聊天页面的群id
	showGroupListId:state => state.news.showGroupNewsListId,
	
	//所有的好友头像与昵称数组
	friends: start =>{
		let list = []
		start.friend.friendList.forEach(v => {
			let obj = v.friend.map(v =>{
				return {
					id:v.id,
					nickname:v.nickname,
					userHeadImage:v.userHeadImage
				}
			})
			list = [...list,...obj]
		})
		return list
	},
	//格式好的好友列表
	friendList: state => state.friend.friendList,
	//分组管理
	friendGroup:state => {
		let groupList = state.friend.friendList.map( v =>{
			return {
				groupId:v.groupId,
				userId:v.userId,
				head:v.head,
				length:v.friend.length !== 0 ? `(${v.friend.length})` : '',
				show: false
			}
		})
		return groupList 
	},
}
export default getters