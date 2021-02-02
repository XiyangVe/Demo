<template>
	<view>
		<view class="item  u-f-ac">
			<u-icon name="play-right-fill" color="#cecece" size="34"></u-icon>
			<view class="title-wrap">
				<text class="title">{{ title }}</text>
			</view>	
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			title:String
		}
	}
</script>

<style lang="less" scoped>
	.item {
		padding: 30rpx 10rpx;
		border-bottom: 1rpx solid #e0e0e0;
		.title {
			margin-left: 20rpx;
			font-size: 36rpx;
			font-weight: bold;
		}
	}
</style>
