<template>
	<view>
		<!--当用户无网提示-->
		<u-no-network></u-no-network>
		<view v-if="loginState">
			<!--自定义导航栏-->
			<cmd-navbar  :type="'friend'" ></cmd-navbar>
			<!--好友头部-->
			<view class="head u-f-ajs">
				<view class="title">
					<u-subsection :list="list" 
							active-color="#0077FF"
							@change="sectionChange"
							:current="current">
					</u-subsection>
				</view>
				<view class="icon" @tap="toSetGroup">
					<u-image width="65rpx" mode="widthFix" :src="'../../static/friend/set-friend-list.png'" shape="circle"></u-image>
				</view>
			</view>
			<!-- 好友列表 -->
			<friend-list ref="list" v-if="current==0"></friend-list>
			<!-- 群聊列表 -->
			<view v-else>
				<group-chat-list :groupData="groupChatList"></group-chat-list>
			</view>
		</view>
		<view v-else>	
			<to-login></to-login>
		</view>
	</view>
</template>

<script>
	import cmdNavbar from '../../components/commoms/cmd-navbar.vue'
	import friendList from '../../components/friend/friend-list.vue'
	import groupChatList from '../../components/friend/group-chat-list.vue'
	import toLogin from '../../components/commoms/cmd-toLogin.vue'
	import { mapGetters } from 'vuex';
	export default {
		components: {
			cmdNavbar,
			friendList,
			groupChatList,
			toLogin
		},
		computed:{
			...mapGetters(['friendList']),
		},
		data() {
			return {
				list: [
					{
						name: ' 我的好友'
					}, 
					{
						name: '群聊'
					}
				],
				current: 0,
				// 群聊列表
				groupChatList:[]
			}
		}, 
		onShow() {
			this.getFriendGroupAll()
			this.getUserGroupList()
		},
		methods: {
			// 获取用户群列表
			getUserGroupList(){
				this.$u.api.getUserGroup().then(res=>{
					if(res.code==200){
						this.groupChatList = res.data
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 分段器切换事件
			sectionChange(index) {
				this.current = index;
			},
			//拉取好友列表
			async getFriendGroupAll(){
				await this.$store.dispatch('friend/getFriendGroupAll')
			},
			//设置分组
			toSetGroup(){
				if(this.current==0){
					uni.navigateTo({
						url:'../../pagesB/friend/setGroup'
					})
				}else{
					uni.navigateTo({
						url: '/pagesB/groupChat/createGroup'
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.page{
		background-color: #CCCCCC;
	}
	.head{
		height: 150rpx;
		border-radius:0 0 20rpx 20rpx;
		box-shadow: 1rpx 0 15rpx #CCCCCC;
		padding: 20rpx;
		.title{
			flex: 10;
			font-size: 32rpx;
			color: #717171;
		}
		.icon{
			float: 2;
		}
	}

</style>
