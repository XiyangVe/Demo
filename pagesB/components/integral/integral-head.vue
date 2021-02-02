<template>
	<!--头部-->
	<view class="head">
		<view class="background">
			<image src="../../static/shop/head-background.png" mode="widthFix" style="width:100%"></image>
		</view>
		<view class="user u-f-ac">
			<view class="user-pic" style="width: 70rpx;height: 70rpx;">
				<image :src="`${baseUrl}${myImg}`" mode="scaleToFill" style="width: 100%;height: 100%;border-radius: 50%;"></image>
			</view>
			<view class="text">尊敬的{{userInfo.nickname}}，您好!</view>
		</view>
		<view class="integral">
			<view class="pic">
				<image src="../../static/shop/integral.png" mode="scaleToFill" style="width: 100%;height: 100%;"></image>
			</view>
			<view class="add-up-integral">累计积分：{{userInfo.cumulativeScore}}</view>
			<view class="exist-integral u-f-ajc">
				<image src="../../static/shop/exist-integral.png" mode="widthFix" style="width: 30rpx;margin-right: 20rpx;"></image>
				{{userInfo.leftoverScore}}
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			userInfo:Object
		},
		data(){
			return{
				
			}
		},
		created() {
			
		}
	}
</script>

<style lang="less" scoped>
	.head{
		position: relative;
		height: 400rpx;
		.background{
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			z-index: -99;
		}
		.user{
			padding: 30rpx 25rpx;
			color: #FFFFFF;
			.text{
				margin-left: 15rpx;
				font-size: 24rpx;
			}
		}
		.integral{
			position: relative;
			.pic{
				position: absolute;
				left: 30rpx;
				right: 30rpx;
				top: 0;
				height: 250rpx;
				z-index: -1;
			}
			.add-up-integral{
				padding:  10rpx 40rpx;
				color: #007AFF;
			}
			.exist-integral{
				margin-top: 10rpx;
				color: #ff8a66;
				font-size: 50rpx;
				font-weight: bold;
			}
		}
	}
</style>
