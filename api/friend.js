// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
/* let hotSearchUrl = '/ebapi/store_api/hot_search';
let indexUrl = '/ebapi/public_api/index'; */

const friend = function(vm) {
	//关注
	const addFriend = (params) => vm.$u.get('chat/addFollow',params)
	//取关
	const removeFriend = (params) => vm.$u.get('chat/unfollow',params)
	
	//查询所有好友列表&&分组
	const getFriendGroupAll = (params) => vm.$u.get('chat/friendGroupAll',params)
	// 获取用户好友列表
	const getFriendList = (params) => vm.$u.get('chat/getFriendList',params)
	
	
	/**
	 * 分组设置
	 */
	//好友列表添加分组
	const addFriendGroup = (params) => vm.$u.post('chat/addFriendGroup',params)
	// 删除好友分组
	const delFriendGroup = (params) => vm.$u.get('chat/delFriendGroup',params)
	// 修改好友分组
	const updateFriendGroup = (params) => vm.$u.post('chat/updateFriendGroup',params)
	// 根据id获取用户信息
	const getFriendInfoById = (params) => vm.$u.get('chat/getFriendInfo',params)
	// 移动好友分组&设置备注
	const mobileFriendsGroup = (params) => vm.$u.post('chat/friendSettings',params)
	// 当前下好友分组的好友列表
	const getFriendByGroupId = (params) => vm.$u.get('chat/friendByGroupId',params)
	
	
	
	
	/**
	 * 群聊相关接口
	 */
	// 获取用户群列表
	const getUserGroup = (params) => vm.$u.get('chat/getUserGroup',params)
	// 创建群接口
	const addGroup = (params) => vm.$u.post('chat/addGroup',params)
	// 修改群接口
	const updateGroup = (params) => vm.$u.post('chat/updateGroup',params)
	// 退出群接口
	const exitGroup = (params) => vm.$u.get('chat/exitGroup',params)
	// 群成员接口
	const getGroupMembers = (params) => vm.$u.get('chat/getGroupMembers',params)
	// 邀请进群
	const inviteIntoTheGroup = (params) => vm.$u.post('chat/inviteIntoTheGroup',params)
	// 群成员设置接口
	const updateGroupMembers = (params) => vm.$u.post('chat/updateGroupMembers',params)
	// 解散群接口
	const disbandGroup = (params) => vm.$u.get('chat/disbandGroup',params)
	
	
	
	//返回接口方法
	return {
		addFriend,
		removeFriend,
		getFriendGroupAll,
		getFriendList,
		addFriendGroup,
		delFriendGroup,
		updateFriendGroup,
		getFriendInfoById,
		mobileFriendsGroup,
		getFriendByGroupId,
		getUserGroup,
		addGroup,
		updateGroup,
		exitGroup,
		getGroupMembers,
		inviteIntoTheGroup,
		updateGroupMembers,
		disbandGroup
		
	}
}

export default friend 