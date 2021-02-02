<template>
	<view class="page">
		<!--当用户无网提示-->
		<u-no-network></u-no-network>

		<view style="height: 60upx;"></view>
		<view v-if="loginState">
			<view style="display: flex;background: #F6F6F6;line-height: 80upx;margin-bottom: 10upx;">
				<view :class="current==index?'navbar1':'navbar'" @click="changeNav(index)" v-for="(item,index) in navList">
					{{item.lable}}
					<u-badge size="mini" type="error" :count="item.value" :offset="[20,40]"></u-badge>
				</view>

				<view class="">
					<u-icon name="plus" style="margin-right: 30rpx;" color="#0077FF" size="40" @click="$refs.modal.running()"></u-icon>
				</view>
			</view>
			<right-top-modal type="weather" ref="modal"></right-top-modal>
			<view class="" v-if="current==0">
				<!-- <view class="list" @tap="toGroupList">
					<image src="../../static/friend/groups.png" mode="" class="images"></image>
					<text class="nickname">群聊</text>
				</view> -->
				<view class="list" @click="toFenList">
					<image src="../../static/friend/groups.png" mode="" class="images"></image>
					<text class="nickname">分组</text>
				</view>
				<view class="list" @click="getUserPhone">
					<image src="../../static/tel.png" mode="" class="images"></image>
					<text class="nickname">手机通讯录</text>
				</view>
				<block v-for="(item,key) in list" :key="key">
					<view>
						<view class="py-2 px-3 bg-light">
							<!-- <text class="font-md text-dark">{{item.length}}</text> -->
							<text class="font-md text-dark">{{key}}</text>
						</view>

						<view class="list" v-for="(item2,index2) in list[key]" :key="index2" :data-toId="item2.friendId" :data-toName="item2.nickname"
						 :data-toImg="item2.friendsAvatar" :data-toSigna="item2.signature" @tap="toChat">
							<block>
								<image :src="`${baseUrl}${item2.friendsAvatar}`" mode="" class="images"></image>
								<text class="nickname font-md text-dark">{{item2.nickname}}</text>
								<!-- <text class="font-md text-dark"></text> -->
								<!-- <free-list-item :title="item2" cover="/static/images/avatar.jpg"></free-list-item> -->
							</block>
						</view>

					</view>
				</block>
			</view>
			<view v-else-if="current==1">
				<view class="" v-if="syList.length!=0">
					<view class="title">
						<text style="margin-left: 20upx;">商业群</text>
					</view>
					<view class="list" v-for="item in syList" @click="toGroupChat(item)">
						<image :src="`${baseUrl}${item.groupHeadImage}`" mode="" class="images"></image>
						<text class="nickname">{{item.groupName}}</text>
					</view>
				</view>
				<view class="">
					<view class="list">
						<image src="../../static/connect.png" mode="" class="images"></image>
						<text class="nickname" @click="toConnect">与我相关的消息</text>
					</view>
					<view class="title">
						<text style="margin-left: 20upx;">创业群</text>
					</view>
					<view class="list">
						<image :src="`${baseUrl}${this.myImg}`" mode="" class="images"></image>
						<text class="nickname">我的创业群</text>
						<text class="nickname1">我创建的创业群</text>
					</view>
					<view class="list" v-if="myRecommend=='{}'">
						<image :src="`${baseUrl}${myRecommend.userHeadImage}`" mode="" class="images"></image>
						<text class="nickname">{{myRecommend.nickname}}</text>
						<text class="nickname1">我的推荐人</text>
					</view>
				</view>
				<view class="">
					<view class="title">
						<text style="margin-left: 20upx;">普通群</text>
					</view>
					<view class="list" v-for="item in commonList" @click="toGroupChat(item)">
						<image :src="`${baseUrl}${item.groupHeadImage}`" mode="" class="images"></image>
						<text class="nickname">{{item.groupName}}</text>
					</view>
				</view>
			</view>

		</view>
		<view v-else>
			<to-login></to-login>
		</view>
	</view>
</template>

<script>
	// import cmdNavbar from '../../components/commoms/cmd-navbar.vue'
	// import friendList from '../../components/friend/friend-list.vue'
	// import groupChatList from '../../components/friend/group-chat-list.vue'
	import rightTopModal from '@/components/commoms/rightTop-modal1.vue'
	import freeListItem from '@/components/friend/free-list-item.vue';
	import toLogin from '../../components/commoms/cmd-toLogin.vue'
	import $https from '@/utils/lib/https.js';
	import config from '@/utils/config.js'

	import {
		mapGetters
	} from 'vuex';
	export default {
		components: {
			// cmdNavbar,
			// friendList,
			// groupChatList,
			rightTopModal,
			toLogin
		},
		computed: {
			...mapGetters(['friendList']),
		},
		data() {
			return {
				list: [],
				navList: [{
					lable: '朋友',
					value: 0
				}, {
					lable: '社群',
					value: 0
				}, {
					lable: '动态',
					value: 0
				}, ],
				current: 0,
				commonList: [],
				syList: [],
				recommendList: [], //我推荐的人
				myRecommend: {}, //推荐我的人
			}
		},
		onLoad() {
			this.getNoreadNum()
		},
		onShow() {
			this.getUserUserList()
			this.getUserGroupList()
		},
		watch: {
			listCount(val) {
				this.getNoreadNum()
			}

		},
		computed: {
			listCount() {
				console.log(this.$store.state.news.counts)
				return this.$store.state.news.counts;
			}
		},
		methods: {
			toFenList(){
				uni.navigateTo({
					url:'friend'
				})
			},
			//获取未读消息数
			getNoreadNum() {
				var list = uni.getStorageSync(`LocalShowNewsListIdUID${this.myId}`)
				console.log(list)
				// let count=0
				// let count1=0
				// for(var i=0;i<list.length;i++){
				// 	if(list[i].type==0){
				// 		count=count+list[i].unreadCount
				// 	}else if(list[i].type==1){
				// 		count1=count1+list[i].unreadCount
				// 	}
				// }
				// this.navList[0].value=count
				// this.navList[1].value=count1
				console.log(this.navList)
			},
			//获取手机通讯录
			getUserPhone() {
				var that = this
				// 获取通讯录对象  
				plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function(addressbook) {
					// 查找联系人  
					addressbook.find(["displayName", "phoneNumbers"], function(contacts) {
						that.data = contacts
						console.log(contacts)

						$https.post('/chat/addressBook', contacts).then(res => {
							console.log(res)
							uni.setStorageSync('bookAddress', res.data)
							console.log('跳转')
							// uni.navigateTo({
							// 	url:'bookAddress'
							// })
							uni.navigateTo({
								url: 'bookAddress'
							})
						})
					}, function() {
						uni.showToast({
							title: '获取联系人失败',
							icon: 'none',
							duration: 2000
						})
					}, {
						multiple: true
					});
				}, function(e) {
					uni.showToast({
						title: '获取通讯录对象失败:' + e.message,
						icon: 'none',
						duration: 2000
					})
				});
			},
			//清空未读消息
			clearNoMessage() {
				let list = uni.getStorageSync(`LocalShowNewsListIdUID${this.myId}`)
				for (var i = 0; i < list.length; i++) {
					if (list[i].type == 0) {
						count = count + list[i].unreadCount
					} else if (list[i].type == 1) {
						count1 = count1 + list[i].unreadCount
					}
				}
				uni.setStorageSync(`LocalShowNewsListIdUID${this.myId}`, list)
			},
			changeNav(index) {
				this.current = index
				// let list = uni.getStorageSync(`LocalShowNewsListIdUID${this.myId}`)
				if (index == 0) {
					this.getUserGroupList()
					// this.navList[0].value=0
					// for(var i=0;i<list.length;i++){
					// 	if(list[i].type==0){
					// 		list[i].unreadCount=0
					// 	}
					// }
				} else if (index == 1) {
					this.getGroups()
					// this.navList[1].value=0
					// for(var i=0;i<list.length;i++){
					// 	if(list[i].type==1){
					// 		list[i].unreadCount=0
					// 	}
					// }
				}
				// uni.setStorageSync(`LocalShowNewsListIdUID${this.myId}`, list)
			},
			// 获取用户列表
			getUserUserList() {
				$https.get('/chat/sortFriendsByFirstLetter').then(res => {
					this.list = res.data
					console.log(this.list)
				})
			},
			toGroupList() {
				uni.navigateTo({
					url: 'groupChat'
				})
			},
			//与我相关消息
			toConnect() {
				uni.navigateTo({
					url: 'myconnect'
				})
			},
			getGroups() {
				//获取普通群列表
				$https.get('/chat/getUserGroup?groupType=0').then(res => {
					console.log(res)
					this.commonList = res.data
				})
				//获取商业群列表
				$https.get('/chat/getUserGroup?groupType=1').then(res => {
					console.log(res)
					this.syList = res.data
				})
				//我推荐的人
				$https.get('/chatGroup/personIRecommend').then(res => {
					console.log(res)
					this.recommendList = res.data
				})
				//推荐我的人
				// $https.get('/chatGroup/myReferrer').then(res => {
				// 	console.log(res)
				// 	if (res.code == 200) {
				// 		this.myRecommend = res.data
				// 	}
				// })
				console.log(config)
				uni.request({
					url: config.baseUrl + '/chatGroup/myReferrer', //请求接口
					header: {
						'Content-Type': 'application/json;charset=UTF-8', //自定义请求头信息
						'Authorization': uni.getStorageSync('localToken')
					},
					success: (res) => { //请求成功后返回
						// 请求成功之后将幻灯片数据赋值给homeSlide
						console.log(res)
						if (res.code == 200) {
							this.myRecommend = res.data
						}
					}
				});
			},
			//获取用户列表
			getUserGroupList() {
				$https.get('/chat/getUserGroup').then(res => {
					console.log(res)
				})
			},
			toGroupChat(item) {
				// console.log(item)
				// 把选择的群信息放在VueX
				this.$store.commit('index/setGroupInfo', item)
				this.$u.route('/pagesB/groupChat/groupChat', {
					groupName: item.groupName,
					groupId: item.id
				})
			},
			//前往聊天页面
			toChat(e) {
				let toId = e.currentTarget.dataset.toid
				let toName = e.currentTarget.dataset.toname
				let toImg = e.currentTarget.dataset.toimg
				let toSigna = e.currentTarget.dataset.tosigna
				uni.navigateTo({
					url: `../../pagesA/news/chat?toId=${toId}&toName=${toName}&toImg=${toImg}&toSigna=${toSigna}`
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.navbar {
		width: 33%;
		text-align: center;
		font-size: 32upx;
		color: black;
		position: relative;
	}

	.navbar1 {
		width: 33%;
		text-align: center;
		font-size: 32upx;
		color: #0077FF;
		position: relative;
	}

	.messages {
		font-size: 32upx;
		font-weight: 400;
		line-height: ;
		margin: 0 30upx;
		line-height: 80upx;
	}

	.page {
		background-color: #FFFFFF;
		// height: 100%;
		// min-height: 100vh;
	}

	.list {
		display: flex;
		height: 100upx;
		border-bottom: 1px solid #f0f0f0;
	}

	.list1 {
		display: flex;
		height: 100upx;
	}

	.images {
		width: 64upx;
		height: 64upx;
		margin: 18upx 20upx;
	}

	.nicknames {
		width: 200upx;
	}

	.nickname {
		line-height: 100upx;
		font-size: 32upx;
		color: #000000;
	}

	.nickname1 {
		position: absolute;
		right: 20upx;
		margin-top: 25upx;
	}

	.title {
		background: #f3f3f3;
		line-height: 80upx;
		font-size: 24upx;
		color: #979797;
	}
</style>
