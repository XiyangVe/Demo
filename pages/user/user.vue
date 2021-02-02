<template>
	<view>
		<view v-if="loginState">
			<!--头部-->
			<user-head :userInfo="userInfo"></user-head>
			<!--我的功能-->
			<view class="my-row u-f-ac">
				<view class="store flex align-center" @tap="toBalance">
					<u-icon name="rmb-circle-fill" color="#dd6161" size="45"></u-icon>
					<view class="title">
						<text class="font-sm text-dark">{{userInfo.balance.toFixed(2)}}</text>
					</view>
				</view>
				<view class="release u-f-ajc" @tap="toRelease">
					<u-icon name="gift-fill" color="#f0085a" size="45"></u-icon>
					<view class="title">积分商城</view>
				</view>
				<view class="schedule u-f-ajc" @tap="toSchedule">
					<u-icon name="bookmark-fill" color="#fcbd71" size="45"></u-icon>
					<view class="title">我的日程</view>
				</view>
			</view> 
			<!--功能列表-->
			<user-list></user-list>
		</view>
		<view v-else>
			<to-login></to-login>
		</view>
	</view>
</template>
 
<script>
	import userHead from '../../components/user/user-head.vue'
	import userList from '../../components/user/user-list.vue'
	import toLogin from '../../components/commoms/cmd-toLogin.vue'
	import { mapGetters } from 'vuex'
	export default {
		components: {
			userHead,
			userList,
			toLogin
		},
		data() {
			return {
			}
		},
		computed:{
			...mapGetters(['userInfo'])
		},
		onShow() {
			let accountKey = {username:'',password:''}
			try {
				accountKey =  uni.getStorageSync('accountKey') || {}
			}catch(e){
				console.log(e)
			}
			if(accountKey.username){
				this.getUserInfo()
			}
		},
		methods: {
			// 获取用户信息
			getUserInfo(){
				this.$u.api.getUserInfo().then(res=>{
					if(res.code==200){
						this.$store.commit("user/SET_USER_INFO",res.data)
					}else{
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				})
			},
			// 我的余额
			toBalance(){
				uni.navigateTo({
					url: '/pages/user/balance'
				})
			},
			// 积分商城
			toRelease(){
				uni.navigateTo({
					url: '/pagesB/integral/index'
					// url:'../../pagesB/user/release/list'
				})
			},
			//日程
			toSchedule(){
				uni.navigateTo({
					url:'../../pagesB/user/schedule/list'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.my-row{
		margin:20rpx 0;
		.store{
			flex: 1;
			flex-flow: column;
		}
		.release{
			flex: 1;
			flex-flow: column;
		}
		.schedule{
			flex: 1;
			flex-flow: column;
		}
		.title{
			margin-top: 10rpx;
		}
	}
</style>
