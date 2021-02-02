<template>
	<view>
		<view class="user-info-box">
			<image class="avatar" :src="`${baseUrl}${userInfo.userHeadImage}`" mode="aspectFill"></image>
			<view class="user-name">{{userInfo.nickname}}</view>
		</view>
		<view class="check-btn-box">
			<view class="btn" @click="toApply()">
				开通企业用户
			</view>
			<view class="btn" @click="toJoin()">
				加入企业
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				
			};
		},
		computed:{
			...mapGetters(['userInfo'])
		},
		onLoad() {
		},
		methods:{
			// 去申请企业用户
			toApply(){
				uni.navigateTo({
					url: '/pagesB/user/firm/register',
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			// 加入企业
			toJoin(){
				uni.navigateTo({
					url: '/pagesB/user/firm/Join'
				})
			}
		}
	}
</script>

<style lang="scss">
	.user-info-box{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 50rpx 0;
		.avatar{
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			border: 2rpx solid #eee;
		}
		.user-name{
			font-weight: bold;
			font-size: 32rpx;
			padding: 20rpx 0;
		}
	}
	.check-btn-box{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.btn{
			color: #FFFFFF;
			width: 710rpx;
			height: 76rpx;
			line-height: 76rpx;
			text-align: center;
			background: #0077FF;
			border-radius: 40rpx;
			margin: 30rpx 0;
		}
	}
</style>
