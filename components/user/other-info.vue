<template>
	<view class="other-info u-f-ac">
		<view class="release u-f-ajc">
			<view class="number">{{other.dynamicNum}}</view>
			<view class="title">动态</view>
		</view>
		<view>
			<u-divider half-width="20" style="transform: rotate(90deg);" :border-color="type" :use-slot="false" height="1"></u-divider>
		</view>
		<view class="follow u-f-ajc" @tap="toContacts">
			<view class="number">{{other.pocNum}}</view>
			<view class="title">关注</view>
		</view>
		<view>
			<u-divider half-width="20" style="transform: rotate(90deg);" :border-color="type" :use-slot="false" height="1"></u-divider>
		</view>
		<view class="fans u-f-ajc" @tap="toContacts">
			<view class="number">{{other.fansNum}}</view>
			<view class="title">粉丝</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			other:Object,
			type:{
				type:String,
				default:'#ffffff'
			}
		},
		methods:{
			toContacts(){
				uni.navigateTo({
					url:`../../pagesB/user/userContacts?id=${this.other.id}`
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.other-info{
		margin-top: 40rpx;
		color: #82848a;
		.release{
			flex: 1;
			flex-flow: column;
		}
		.follow{
			flex: 1;
			flex-flow: column;
		}
		.fans{
			flex: 1;
			flex-flow: column;
		}
		.number{
			font-size: 30rpx;
			margin-bottom: 5rpx;
		}
		.title{
			font-size: 24rpx;
		}
	}
</style>
