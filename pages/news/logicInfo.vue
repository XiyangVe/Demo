<template>
	<view class="page">
		<!-- <scroll-view scroll-y="true"> -->
		<!-- :style="{height:height}" -->
		<view style="height: 10upx;">

		</view>
		<view class="boxes" v-for="item in list">
			<view class="notice">
				2020-07-08 08:00:08
			</view>
			<view class="box">
				<view class="title">
					<image class="imgs" src="../../static/images/Avatar-1.png" mode=""></image>
					<text style="line-height: 60upx;">华润富农旗舰店</text>
				</view>
				<view class="details">
					<view>
						<image class="imgs1" src="../../static/index/1.png" mode=""></image>
					</view>
					<view>
						<view class="titles">
							您的订单已到重庆市
						</view>
						<view class="content">
							您购买的山东烟台红富士苹果现已经发出，请注意物流信息，点击查看物流信息法西斯家蝇是是加法即将覅按实际
						</view>
					</view>

				</view>
			</view>
		</view>
		<!-- </scroll-view> -->


	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [1, 2, 1, 1, 1],
				height: 0,
			}
		},
		methods: {

		}
	}
</script>

<style scoped>
	.page {
		background-color: #F6F6F6;
		height: 100%;
		min-height: 100vh;
	}

	.notice {
		text-align: center;
		font-size: 24upx;
		color: #979797;
	}

	.imgs {
		width: 40upx;
		height: 40upx;
		vertical-align: middle;
		margin: 0 20upx;
	}

	.imgs1 {
		width: 120upx;
		height: 120upx;
		padding: 0 10upx 10upx 10upx;
	}

	.box {
		width: 90%;
		height: auto;
		/* padding: 20upx; */
		border-radius: 10px;
		background: white;
		margin: 0 auto;
	}

	.content {
		color: #979797;
		font-size: 28upx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		display: -moz-box;
		-moz-line-clamp: 2;
		-moz-box-orient: vertical;
		word-wrap: break-word;
		word-break: break-all;
		white-space: normal;
	}

	.boxes {
		margin-bottom: 20upx;
	}

	.titles {
		height: auto;
		/* padding: 10upx; */
		font-weight: bolder;
		color: #000000;
		font-size: 30upx;
	}

	.title {
		font-size: 32upx;
		line-height: 80upx;
		color: #000000;
		font-weight: 400;
		border-bottom: 1px solid #f0f0f0;
	}

	.details {
		color: #979797;
		font-size: 28upx;
		display: flex;
		padding: 10upx 0;
	}
</style>
