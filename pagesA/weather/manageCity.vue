<template>
	<view>
		<view class="search">
			<u-search v-model="keyword" :clearabled="true"></u-search>
		</view>
		<view class="cityList">
			<!--城市列表-->
			<view class="item">
				<scroll-view class="scroll" scroll-x>
					<!--滑动总内容-->
					<view class="content u-f-ac">
						<!--背景图-->
						<view class="background u-f">
							<u-image src="../static/weather/bkgd-rain.png" mode="scaleToFill"></u-image>
			
							<view class="delete u-f-ajc" @click="Test">
								<u-image src="../static/weather/delete.png" mode="widthFix" style="width: 60rpx;"></u-image>
							</view>
						</view>

						<view class="info u-f-ajc">
							<view class="left">
								<view class="u-f-ac">
									<u-image src="../static/weather/address.png" mode="widthFix" style="width: 20rpx;"></u-image>
									<text>昆明市西山区</text>							
								</view>
								<view class="u-f-ac" style="margin-top: 20rpx;">
									<u-image src="../static/weather/air.png" mode="widthFix" style="width: 25rpx;"></u-image>
									<text>良 21~37℃</text>
								</view>
							</view>
							<view class="right">
								<image src="../static/weather/rain-max.png" mode="widthFix" style="width: 80rpx;"></image>
								31°
							</view>
						</view>
					</view>
					
				</scroll-view>
			</view>
			<view class="item">
				<scroll-view class="scroll" scroll-x>
					<!--滑动总内容-->
					<view class="content u-f-ac">
						<!--背景图-->
						<view class="background u-f">
							<!-- <image src=""></image> -->
							<u-image src="../static/weather/bkgd-sunny.png" mode="scaleToFill"></u-image>
			
							<view class="delete u-f-ajc">
								<u-image src="../static/weather/delete.png" mode="widthFix" style="width: 60rpx;"></u-image>
							</view>
						</view>
			
						<view class="info u-f-ajc">
							<view class="left">
								<view class="u-f-ac">
									<u-image src="../static/weather/address.png" mode="widthFix" style="width: 20rpx;"></u-image>
									<text>重庆市渝中区</text>							
								</view>
								<view class="u-f-ac" style="margin-top: 20rpx;">
									<u-image src="../static/weather/air.png" mode="widthFix" style="width: 25rpx;"></u-image>
									<text>良 21~37℃</text>
								</view>
							</view>
							<view class="right">
								<image src="../static/weather/sun-1.png" mode="widthFix" style="width: 80rpx;"></image>
								31°
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			
			<!--搜索列表-->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword:''
			}
		},
		onLoad() {
		},
		methods:{
			Test(){
				console.log('删除')
			}
		}
	}
</script>

<style lang="less" scoped>
	.search{
		width: 710rpx;
		margin: 20rpx;
	}
	.cityList{
		width: 710rpx;
		margin: 50rpx 20rpx;
		.item{
			margin-bottom: 20rpx;
			.scroll{
				width: 100%;
				height: 160rpx;
				border-radius: 25rpx;
				overflow: hidden;
				.content{
					position: relative;
					.background{
						position: absolute;
						top: 0;
						left: 0;
						width: 900rpx;
						// z-index: -1;
						image{
							width: 700rpx;
							height: 150rpx;
						}
						.delete{
							width: 200rpx;
							height: 160rpx;
							background-color: #ff6969;
						}
					}
					.info{
						width: 700rpx;
						height: 160rpx;
						padding: 20rpx;
						color: #FFFFFF;
						z-index: 9;
						.left{
							flex: 11;
							text{
								margin-left: 10rpx;
							}
						}
						.right{
							flex: 2;
							font-size: 50rpx;
							position: relative;
							image{
								position: absolute;
								top: -45rpx;
								right: -35rpx;
							}
						}
					}
				}
			}
		}
	}
</style>
