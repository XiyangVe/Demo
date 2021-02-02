import config from '../../utils/config.js'
import Vue from 'vue'
import store from "@/store"
//websocket链接
var socketTask
//用户UID
var uid

//队列消息处理方法(接口获取数据或者本地缓存拉取数据)
function handleMessage(data, way = 'receive') {
	let {
		chatType
	} = data
	if (chatType == 1) {
		//群聊
		//有这条数据就push 到这条消息队列(接口数据data.fromId不为未定义，本地缓存调用的类型不一样)
		let groupId = data.groupId
		let index = state.allGroupChatNewsList.findIndex(v => {
			//我是接收方，要知道谁给我发消息，把对方的id拿过来
			return v.groupId === groupId
		})
		let noMsgNumber
		//判断类型 发送，接收，本地拉取，
		if (data.noMsgNumber) {
			//如果是本读拉取那么信息里就会存在这个对象里就应该属性noMsgNumber
			noMsgNumber = data.noMsgNumber
		} else if (way === 'receive') {
			noMsgNumber = 1
		} else {
			noMsgNumber = 0
		}
		if (index === -1) {
			//如果不存在构建消息队列
			let newsObj = {
				chatType: data.chatType,
				groupId,
				//未读消息
				noMsgNumber,
				newsList: data.fromId ? [data] : data.newsList
			}
			//返回新的消息对象
			return {
				index,
				newsObj
			}
		} else {
			let newsObj = data.fromId ? data : data.newsList
			//返回存在位置，和消息内容
			return {
				index,
				newsObj
			}
		}
	} else {
		//私聊
		//有这条数据就push 到这条消息队列(接口数据data.fromId不为未定义，本地缓存调用的类型不一样)
		let otherId = data.fromId || data.otherId
		let index = state.allNewsList.findIndex(v => {
			//我是接收方，要知道谁给我发消息，把对方的id拿过来
			return v.otherId === otherId
		})
		let noMsgNumber
		//判断类型 发送，接收，本地拉取，
		if (data.noMsgNumber) {
			//如果是本读拉取那么信息里就会存在这个对象里就应该属性noMsgNumber
			noMsgNumber = data.noMsgNumber
		} else if (way === 'receive') {
			noMsgNumber = 1
		} else {
			noMsgNumber = 0
		}
		if (index === -1) {
			//如果不存在构建消息队列
			let newsObj = {
				chatType: data.chatType,
				//对方的id
				otherId,
				//未读消息
				noMsgNumber,
				newsList: data.fromId ? [{
					//如何是接收方id就是从哪里来的
					id: data.fromId,
					createTime: data.createTime,
					msgType: data.msgType,
					content: data.content,
					file: data.file,
					duration: data.duration
				}] : data.newsList
			}
			//返回新的消息对象
			return {
				index,
				newsObj
			}
		} else {
			/* console.log(data) */
			let newsObj = data.fromId ? {
				id: data.fromId,
				createTime: data.createTime,
				msgType: data.msgType,
				content: data.content,
				file: data.file,
				duration: data.duration
			} : data.newsList
			//返回存在位置，和消息内容
			return {
				index,
				newsObj
			}
		}
	}
}


//私聊消息存入本地缓存(当退出当前页面时候触发存入本地缓存)
function setLocalAllNews(data, way = 'receive') {
	//发送和接收
	let localAllNews = uni.getStorageSync(`localAllNewsUID${uid}`) || []
	let otherId = data.fromId || data.otherId
	let index = localAllNews.findIndex(v => {
		//我是接收方，要知道谁给我发消息，把对方的id拿过来
		return v.otherId === otherId
	})
	if (index === -1) {
		//如果不存在构建消息队列
		let newsObj = {
			chatType: data.chatType,
			//对方的id
			otherId,
			noMsgNumber: way !== 'send' ? 1 : 0,
			newsList: data.fromId ? [{
				id: data.fromId,
				createTime: data.createTime,
				msgType: data.msgType,
				content: data.content,
				file: data.file,
				duration: data.duration,
				senderAvatar: data.senderAvatar,
				senderNickname: data.senderNickname,
				receiverAvatar: data.receiverAvatar,
				receiverNickname: data.receiverNickname
			}] : data.newsList
		}
		localAllNews.push(newsObj)
		uni.setStorageSync(`localAllNewsUID${uid}`, localAllNews)
	} else {
		let newsObj = data.fromId ? {
			id: data.fromId,
			createTime: data.createTime,
			msgType: data.msgType,
			content: data.content,
			file: data.file,
			duration: data.duration,
			senderAvatar: data.senderAvatar,
			senderNickname: data.senderNickname,
			receiverAvatar: data.receiverAvatar,
			receiverNickname: data.receiverNickname
		} : data.newsList[0]
		if (way !== 'send') {
			localAllNews[index].noMsgNumber++
		}
		localAllNews[index].newsList.push(newsObj)
		uni.setStorageSync(`localAllNewsUID${uid}`, localAllNews)
	}
}
/**
 * 群聊消息存入本地缓存(当退出当前页面时候触发存入本地缓存)
 */
function setLocalAllGroup(data, way = 'receive') {
	//发送和接收
	let localAllNews = uni.getStorageSync(`localAllGroupUID${uid}`) || []
	let groupId = data.groupId
	let index = localAllNews.findIndex(v => {
		//我是接收方，要知道谁给我发消息，把对方的id拿过来
		return v.groupId === groupId
	})
	if (index === -1) {
		//如果不存在构建消息队列
		let newsObj = {
			chatType: data.chatType,
			//对方的id
			groupId,
			noMsgNumber: way !== 'send' ? 1 : 0,
			newsList: data.fromId ? [data] : data.newsList
		}
		localAllNews.push(newsObj)
		uni.setStorageSync(`localAllGroupUID${uid}`, localAllNews)
	} else {
		if (way !== 'send') {
			localAllNews[index].noMsgNumber++
		}
		localAllNews[index].newsList.push(data.fromId ? data : data.newsList)
		uni.setStorageSync(`localAllGroupUID${uid}`, localAllNews)
	}
}
/**
 * 群聊拉取本地缓存
 */
function getLocalGroupNews(groupId) {
	let localAllNews = uni.getStorageSync(`localAllGroupUID${uid}`) || []
	let index = localAllNews.findIndex(v => {
		return v.groupId === groupId
	})
	if (index === -1) {
		//查询不到对象返回空
		return null
	} else {
		//vuex 全部聊天列表里是否存在该聊天对象
		let vuex_index = state.allGroupChatNewsList.findIndex(v => {
			return v.groupId == groupId
		})
		let chatType = localAllNews[index].chatType
		// let groupId = localAllNews[index].groupId
		let noMsgNumber = localAllNews[index].noMsgNumber
		if (vuex_index === -1) {
			//不存在 直接拉取20条
			//因为-1 不代表最后一个元素的下标，所以我只能以长度单位为最后一个单位下标了
			let length = localAllNews[index].newsList.length
			return {
				chatType,
				groupId,
				noMsgNumber,
				//截取后20条数据
				newsList: localAllNews[index].newsList.slice(-15, length)
			}
		} else {
			//存在,判断vuex中对应newsObj 消息数组长度
			let length = state.allGroupChatNewsList[vuex_index].newsList.length
			return {
				chatType,
				groupId,
				noMsgNumber,
				//追加消息从该长度往后拉20条
				newsList: localAllNews[index].newsList.slice(-(length + 5), -length)
			}
		}
	}
}


/**
 * 私聊拉取本地缓存
 */
function getLocalNews(id) {
	/* console.log(id) */
	let localAllNews = uni.getStorageSync(`localAllNewsUID${uid}`) || []
	let index = localAllNews.findIndex(v => {
		return v.otherId === id
	})
	/* console.log(index) */
	if (index === -1) {
		//查询不到对象返回空
		return null
	} else {
		//vuex 全部聊天列表里是否存在该聊天对象
		let vuex_index = state.allNewsList.findIndex(v => {
			return v.otherId === id
		})
		let chatType = localAllNews[index].chatType
		let otherId = localAllNews[index].otherId
		let noMsgNumber = localAllNews[index].noMsgNumber
		if (vuex_index === -1) {
			//不存在 直接拉取20条
			//因为-1 不代表最后一个元素的下标，所以我只能以长度单位为最后一个单位下标了
			let length = localAllNews[index].newsList.length
			return {
				chatType,
				otherId,
				noMsgNumber,
				//截取后20条数据
				newsList: localAllNews[index].newsList.slice(-15, length)
			}
		} else {
			//存在,判断vuex中对应newsObj 消息数组长度
			let length = state.allNewsList[vuex_index].newsList.length
			return {
				chatType,
				otherId,
				noMsgNumber,
				//追加消息从该长度往后拉20条
				newsList: localAllNews[index].newsList.slice(-(length + 5), -length)
			}
		}
	}
}
// 私聊未读消息清空
function clearNoMsgNumber(toId) {
	let localAllNews = uni.getStorageSync(`localAllNewsUID${uid}`) || []
	let index = localAllNews.findIndex(v => toId === v.otherId)
	if (index !== -1) localAllNews[index].noMsgNumber = 0;
	uni.setStorageSync(`localAllNewsUID${uid}`, localAllNews)
}
// 群聊未读消息清空
function clearGroupNoMsgNumber(groupToId) {
	let localAllGroupNews = uni.getStorageSync(`localAllGroupUID${uid}`) || []
	let index = localAllGroupNews.findIndex(v => groupToId === v.groupId)
	if (index !== -1) localAllGroupNews[index].noMsgNumber = 0;
	uni.setStorageSync(`localAllGroupUID${uid}`, localAllGroupNews)
}
//追加标记发送失败标记
function failsend() {

}

const state = {
	//当前聊天用户
	toId: '',
	//当前需要显示的消息列表id集合
	showNewsListId: [],
	//vuex所有消息消息列表，每次拉取所有好友的聊天记录18条
	allNewsList: [],
	// 当前聊天群
	groupToId: '',
	//群聊消息
	allGroupChatNewsList: [],
	// 当前需要显示的群聊列表id集合
	showGroupNewsListId: [],

	/**
	 * 后面修改的
	 */
	//链接是否打开了
	IsOpen: false,
	// SocketTask
	GroupSocketTask: null,
	//绑定的fd
	bindFd: null,
	// 当前聊天对象（进入聊天页面获取）
	Network: true,
	//断线重连定时器
	timer: null,
	//心跳间隔
	timeout: 10000,
	//心跳事件
	interval: null,
	// 当前重连次数
	connectNum: 0,
	//<--微信聊天改造-->
	//监听消息变化
	counts: 0,
}
const mutations = {
	//改变链接状态
	WEBSOCKET_STATE(state, data) {
		state.friendList = data
	},
	//清空所有状态
	REMOVE_INFO(state) {
		state.toId = ''
		state.showNewsListId = []
		state.allNewsList = []
	},
	// 私聊切换当前聊天对象
	SET_TOID(state, data) {
		state.toId = data
	},
	// 群聊切换当前聊天对象
	SET_GROUP_TOID(state, data) {
		state.groupToId = data
	},
	//私聊初始化要展示的id表
	CREATE_SHOW_NEW_LISTID(state, data) {
		state.showNewsListId = data
	},
	//群聊初始化要展示的id表
	CREATE_SHOW_GROUP_LISTID(state, data) {
		state.showGroupNewsListId = data
	},
	//监听消息变化
	changMessage(state) {
		state.counts = state.counts + 1
		console.log(state.counts)
	},
	/**
	 * 私聊设置需要展示的消息列表成员
	 */
	SET_SHOW_NEW_LISTID(state, data) {
		if (data.way === 'add') {
			/* console.log('添加') */
			if (state.showNewsListId.findIndex(v => v === data.id) === -1) {
				console.log(data.id)
				state.showNewsListId.push(data.id)
				uni.setStorageSync(`LocalShowNewsListIdUID${uid}`, state.showNewsListId)
			}
		} else if (data.way === 'top') {
			/* console.log('置顶') */
			let index = state.showNewsListId.findIndex(v => v === data.id)
			let id = state.showNewsListId[index]
			state.showNewsListId.splice(index, index + 1)
			state.showNewsListId.unshift(id)
			uni.setStorageSync(`LocalShowNewsListIdUID${uid}`, state.showNewsListId)

		} else if (data.way === 'delete') {
			/* console.log('删除') */
			let index = state.showNewsListId.findIndex(v => v === data.id)
			state.showNewsListId.splice(index, index + 1)
			uni.setStorageSync(`LocalShowNewsListIdUID${uid}`, state.showNewsListId)
		}
	},
	/**
	 * 群聊设置需要展示的消息列表群
	 */
	setShowGroupListId(state, data) {
		if (data.way === 'add') {
			if (state.showGroupNewsListId.findIndex(v => v === data.id) === -1) {
				console.log(data.id)
				state.showGroupNewsListId.push(data.id)
				uni.setStorageSync(`LocalShowGroupListIdUID${uid}`, state.showGroupNewsListId)
			}
		} else if (data.way === 'top') {
			let index = state.showGroupNewsListId.findIndex(v => v === data.id)
			let id = state.showGroupNewsListId[index]
			state.showGroupNewsListId.splice(index, index + 1)
			state.showGroupNewsListId.unshift(id)
			uni.setStorageSync(`LocalShowGroupListIdUID${uid}`, state.showGroupNewsListId)

		} else if (data.way === 'delete') {
			let index = state.showGroupNewsListId.findIndex(v => v === data.id)
			state.showGroupNewsListId.splice(index, index + 1)
			uni.setStorageSync(`LocalShowGroupListIdUID${uid}`, state.showGroupNewsListId)
		}
	},

	//push到聊天总数据
	PUSH_NEWLIST(state, data) {
		// console.log(data) 
		//空数组第一条为零
		if (data.index > -1) {
			//判断是否为数组(发送信息和)
			if (Array.isArray(data.newsObj)) {
				//本地缓存和信息发送是将对象存入一个数组，所以要解构数组成一个个消息
				if (data.way === 'push') {
					//发送信息push到底部
					state.allNewsList[data.index].newsList.push(...data.newsObj) //发送信息缓存
				} else {
					//拉取信息到头部
					state.allNewsList[data.index].newsList.unshift(...data.newsObj) //本地缓存拉取
				}
			} else {
				state.allNewsList[data.index].newsList.push(data.newsObj) //存接收信息
			}
		}
		//创建对象
		else {
			state.allNewsList = [...state.allNewsList, data.newsObj]
		}
	},

	/**
	 * push到群聊总数据
	 */
	pushGroupNewsList(state, data) {
		// console.log(data) 
		//空数组第一条为零
		if (data.index > -1) {
			//判断是否为数组(发送信息和)
			if (Array.isArray(data.newsObj)) {
				//本地缓存和信息发送是将对象存入一个数组，所以要解构数组成一个个消息
				if (data.way === 'push') {
					//发送信息push到底部
					state.allGroupChatNewsList[data.index].newsList.push(...data.newsObj) //发送信息缓存
				} else {
					//拉取信息到头部
					state.allGroupChatNewsList[data.index].newsList.unshift(...data.newsObj) //本地缓存拉取
					console.log(state.allGroupChatNewsList)
				}
			} else {
				state.allGroupChatNewsList[data.index].newsList.push(data.newsObj) //存接收信息
			}
		}
		//创建对象
		else {
			state.allGroupChatNewsList = [...state.allGroupChatNewsList, data.newsObj]
		}
	},

	// 私聊添加未读消息条数
	ADD_NO_MSG_NUMBER(state, data) {
		state.allNewsList[data].noMsgNumber++
	},
	// 群聊添加未读消息条数
	addGroupNoMsgNumber(state, data) {
		state.allGroupChatNewsList[data].noMsgNumber++
	},
	// 私聊清空未读消息
	CLEAR_NO_MSGNUMBER(state, data) {
		//清空vuex的
		let index = state.allNewsList.findIndex(v => state.toId === v.otherId)
		/* console.log(index) */
		if (index !== -1) state.allNewsList[index].noMsgNumber = 0;

		clearNoMsgNumber(state.toId)
	},
	// 群聊清空未读消息
	CLEAR_GROUP_NO_MSGNUMBER(state, data) {
		//清空vuex的
		let index = state.allGroupChatNewsList.findIndex(v => state.groupToId === v.groupId)
		if (index !== -1) state.allGroupChatNewsList[index].noMsgNumber = 0;
		clearGroupNoMsgNumber(state.groupToId)
	},
	//标记发送失败消息
	FAIL_SEND(state, data) {
		let index1 = state.allNewsList.findIndex(v => v.otherId === data.otherId)
	}
	//<--微信聊天改造-->
	//获取消息列表
	// getNewsList1(state,data){
	// 	if(state.newsList1.length!=0){
	// 		for(let i=0;i<state.newsList1.length;i++)
	// 		if(data.fromId==state.newsList1[i].fromId){

	// 		}
	// 	}else{
	// 		state.newsList1=state.newsList1.push(data)
	// 	}

	// }

}
const actions = {
	//连接websocket
	connectSocket({
		commit,
		state,
		rootState
	}) {
		if (state.IsOpen) return; // 防止重复连接
		const _this = this;
		// 连接
		uid = rootState.user.userInfo.id
		// let result
		socketTask = uni.connectSocket({
			//取地址和token
			url: `ws:${config.baseUrl.slice(5)}/websocket/${rootState.login.token}`,
			method: 'GET',
			success() {
				console.log('WebSocket链接成功')
			},
			fail: function() {
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '聊天信息链接失败'
				});
			}
		})
		// 监听WebSocket连接打开事件。
		socketTask.onOpen(res => {
			console.log('第一次打开链接成功')
			// 将连接状态设为已连接
			state.IsOpen = true;
			//开启心跳
			if (state.interval != null) {
				clearInterval(state.interval);
			}
			state.interval = setInterval(() => {
				//发送心跳
				// console.log('发送心跳')
				var u = {
					type: "0",
					content: "ping"
				}
				uni.sendSocketMessage({
					data: JSON.stringify(u),
					fail: function(e) {
						console.log('心跳发送失败了 ...执行重连');
						// uni.showToast({
						// 	 title: '正在尝试重新链接第'+state.connectNum+'次',
						// 	 icon:"none",                                       
						// });
						state.IsOpen = false;
						//执行重连
						_this.dispatch('news/reConnect');
					}
				})
			}, state.timeout)

			commit('WEBSOCKET_STATE', true)

			/**
			 * 接收离线消息 后面没用了
			 */
			//Vue.prototype.$myMethod.getSocketMessage().then(res => {
			// 	/* console.log(res) */ 
			// 	res.data.forEach(async (v,index)=> {
			// 		/* console.log(v) */
			// 		let handleData = await handleMessage(v)
			// 		commit('PUSH_NEWLIST',handleData)		
			// 		if(handleData.index > -1){
			// 			//添加未读消息
			// 			commit('ADD_NO_MSG_NUMBER',handleData.index)
			// 		}
			// 		commit('SET_SHOW_NEW_LISTID',{id:v.fromId,way:'add'})
			// 		setLocalAllNews(v) 
			// 	})
			// }).catch(rej=>{
			// 	console.log(rej)
			// }) 
		})
		//链接实时接受数据(监听信息)
		socketTask.onMessage(res => {
			// console.log('开始链接数据')
			let data = JSON.parse(res.data)
			// console.log(data)
			if (data.msgType == 5) {
				data.content = JSON.parse(data.content)
			}
			// 群聊消息接收
			if (data.type == '0') {
				if (data.type != '-1') {
					// 给服务器发数据
					let uResult = {
						type: "1",
						content: data.messageId
					}
					uni.sendSocketMessage({
						data: JSON.stringify(uResult)
					})
					// commit('getNewsList1',data)
				}
				if (data.chatType == '1') {
					let handleData = handleMessage(data)
					commit('pushGroupNewsList', handleData)
					if (handleData.index > -1) {
						//添加未读消息
						commit('addGroupNoMsgNumber', handleData.index)
					}
					//存入群id到显示列表
					commit('setShowGroupListId', {
						id: data.groupId,
						way: 'add'
					})
					// console.log(data)
					commit('changMessage')
					//存入缓存
					setLocalAllGroup(data)
				}

				// 私聊&&分组群发消息接收
				if (data.chatType == '0' || data.chatType == '2') {
					let handleData = handleMessage(data)
					//存入vuex 在此判断是否需要添加未读条数
					commit('PUSH_NEWLIST', handleData)
					//接收数据需要判断是否添加标记
					if (handleData.index > -1) {
						/* console.log(state.allNewsList) */
						//添加未读消息
						commit('ADD_NO_MSG_NUMBER', handleData.index)
						/*console.log(state.allNewsList) */
					}
					//存入用户id到显示列表
					commit('SET_SHOW_NEW_LISTID', {
						id: data.fromId,
						way: 'add'
					})
					commit('changMessage')
					//存入缓存
					setLocalAllNews(data)
				}
			}
		})
		//监听关闭
		socketTask.onClose(() => {
			console.log('WebSocket 已关闭')
			state.IsOpen = false;
		})
		// 监听错误
		socketTask.onError((e) => {
			console.log('WebSocket连接打开失败，请检查！')
			state.IsOpen = false
		})

	},
	// 重连
	reConnect({
		commit,
		state
	}) {
		if (state.connectNum < 20) {
			state.timer = setTimeout(() => {
				this.dispatch('news/connectSocket')
			}, 3000)
			state.connectNum += 1;
		} else if (state.connectNum < 50) {
			state.timer = setTimeout(() => {
				this.dispatch('news/connectSocket')
			}, 10000)
			state.connectNum += 1;
		} else {
			state.timer = setTimeout(() => {
				this.dispatch('news/connectSocket')
			}, 450000)
			state.connectNum += 1;
		}
	},

	//关闭 WebSocket
	closeSocket({
		commit,
		state
	}) {
		console.log('执行关闭webscket')
		try {
			socketTask.close()
			//清除定时器
			clearInterval(state.interval);
			state.interval = null
		} catch (e) {
			console.log(e)
		}
	},
	//处理发送数据
	handleSend({
		state,
		commit
	}, data) {
		if (data.chatType == 0) {
			let handleData = handleMessage(data, 'send')
			//存入vuex里
			commit('PUSH_NEWLIST', { ...handleData,
				way: 'push'
			})
			//为展示列表添加成员
			commit('SET_SHOW_NEW_LISTID', {
				id: data.otherId,
				way: 'add'
			})
			/* console.log(state.allNewsList) */
			//存入缓存里
			setLocalAllNews(data, 'send')
		}
		if (data.chatType == 1) {
			let handleData = handleMessage(data, 'send')
			//存入vuex里
			commit('pushGroupNewsList', { ...handleData,
				way: 'push'
			})
			//为展示列表添加群
			commit('setShowGroupListId', {
				id: data.groupId,
				way: 'add'
			})
			//存入缓存里
			setLocalAllGroup(data, 'send')
		}

	},
	/**
	 * 私聊查询聊天内容,如果vuex里有，就返回否则从本地缓存拉取
	 */
	queryAllNewsList({
		commit
	}, data) {
		let newsObj = getLocalNews(data)
		//拉取的消息不为空且返回的消息队列长度大于零
		if (newsObj && newsObj.newsList.length) {
			/* console.log(newsObj) */
			let handleData = handleMessage(newsObj, 'local')
			commit('PUSH_NEWLIST', handleData)
			return '查询成功'
		} else {
			return '没有更多消息了~'
		}
	},
	/**
	 * 群聊查询聊天内容,如果vuex里有，就返回否则从本地缓存拉取
	 */
	queryAllGroupNewsList({
		commit
	}, data) {
		let newsObj = getLocalGroupNews(data)
		//拉取的消息不为空且返回的消息队列长度大于零
		if (newsObj && newsObj.newsList.length) {
			let handleData = handleMessage(newsObj, 'local')
			commit('pushGroupNewsList', handleData)
			return '查询成功'
		} else {
			return '没有更多消息了~'
		}
	},
	//私聊将需要展示消息队列从本地拉取出来
	getShowNewsList({
		commit,
		rootState
	}) {
		uid = rootState.user.userInfo.id
		const showNewsListId = uni.getStorageSync(`LocalShowNewsListIdUID${uid}`) || []
		commit('CREATE_SHOW_NEW_LISTID', showNewsListId)
		showNewsListId.forEach(v => {
			this.dispatch('news/queryAllNewsList', v)
		})
	},
	//群聊将需要展示消息队列从本地拉取出来
	getShowGroupList({
		commit,
		rootState
	}) {
		uid = rootState.user.userInfo.id
		const showGroupListId = uni.getStorageSync(`LocalShowGroupListIdUID${uid}`) || []
		commit('CREATE_SHOW_GROUP_LISTID', showGroupListId)
		showGroupListId.forEach(v => {
			this.dispatch('news/queryAllGroupNewsList', v)
		})
	},
	//发送失败消息标记
	signFailSend({
		commit
	}, data) {
		commit('FAIL_SEND', data)
		failsend(data)
	}
}
export default {
	namespaced: true,
	state,
	mutations,
	actions
}
