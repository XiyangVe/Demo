<template>
	<view>
		<!--自定义导航-->
		<u-navbar back-icon-color="#ff6969"  title="" height="50" :border-bottom="false" :background="{background:'#f9f9f900'}">
			<view class="slot-wrap">		
				<u-icon name="list" color="#ff6969" size="50" @click="$refs.modal.running()"></u-icon>
			</view>
		</u-navbar>
		
		<right-top-modal type="weather" ref="modal"></right-top-modal>
		
		<view class="body">
			<!--指示灯-->
			<view class="indicator u-f-ajc">
				<view class="name">重 庆 市 </view>
				<view class="u-f-ajc">
					<block v-for="(item,index) in indexDot" :key="index">
						<view class="dot" :style="{'backgroundColor': index == id ? '#ffffff':'#d2e4f6'}"></view>
					</block>
				</view>
			</view>
			
			<!--滑动选项卡-->
			<swiper  style="width: 100%;height: 100%;" circular :current="id" @change="changeIndex"> 
				<!--滑动内容-->
				<swiper-item class="item" v-for="(item,index) in [1,2,3]" :key="index">
					<!--背景图-->
					<view class="background">
						<image src="../static/weather/background.png" mode="widthFix" style="width:100%;"></image>
					</view>
					<!--主要内容-->
					<view class="content u-f-ajc">
						<view class="number">
							27
							<image src="../static/weather/symbol.png" mode="widthFix" style="width: 50rpx;"></image>
						</view>
						<view class="now-weather">晴</view>
						<view class="now-wind">东北风</view>
					</view>
					<!--天气信息-->
					<view class="info">
						<view class="other-info u-f-ac">
							<view class="air u-f-ac">
								<image src="../static/weather/air.png" mode="widthFix"></image>
								空气良好
							</view>
							<view class="rain u-f-ac">
								<image src="../static/weather/rainfall.png" mode="widthFix"></image>
								降水率56%
							</view>
						</view>
						<view class="future-weather">
							<view class="item u-f-ac" v-for="(item,index) in [1,2,3]" :key="index">
								<view class="item-weather u-f-ac">
									<image src="../static/weather/sun.png" mode="widthFix" style="width: 50rpx;"></image>
									<view>
										今天 雨转晴
										<u-tag text="良" shape="circle" />
									</view>
								</view>
								<view class="item-temperature">
									32°/18°
								</view>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
			
			<!--底部按钮-->
			<view class="weather-button">
				<u-button  class="button" plain shape="circle" @tap="trends">查看最近15日天气</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import rightTopModal from '../../components/commoms/rightTop-modal.vue'
	export default {
		components:{
			rightTopModal
		},
		data() {
			return {
				//列表索引值
				id:0,
				//数据模拟数组
				list:[1,2,3],
			}
		},
		computed:{
			//指示灯数量
			indexDot: function() {
				let dot = []
				for(let i = 0; i < this.list.length; i++){
					dot[i] = i
				}
				return dot
			}
		},
		onHide() {
			this.$refs.modal.hide()
		},
		methods:{	
			//切换城市 指示灯
			changeIndex(event){
				this.id= event.detail.current
			},
			//查看未来15天趋势
			trends(){
				uni.navigateTo({
					url:'./weatherTrends'
				})
			}
		}
	}
</script>

<style lang="less">
	//顶部导航栏
	.slot-wrap{
		display: flex;
		align-items: center;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		flex: 1; 
		/* 如果您想让slot内容与导航栏左右有空隙 */
		padding: 10rpx 40rpx 10rpx 10rpx;
		display: flex;
		justify-content: flex-end;
	}
	//主要内容
	.body{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 100vh;
		color: #FFFFFF;
		//渲染数据
		.item{
			width: 100%;
			height: 100%;
			position: relative;
			.background{
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				z-index: -1;
			}
			.content{
				margin-top: 260rpx;
				flex-flow: column;
				.number{
					font-size: 230rpx;
					position: relative;
					image{
						position: absolute;
						//#ifdef H5
						top: 40rpx;
						//#endif
						//#ifdef APP-PLUS
						top: 70rpx;
						//#endif
						right: -50rpx;
					}
				}
				.now-weather{
					font-size: 50rpx;
				}
				.now-wind{
					margin-top: 20rpx;
					font-size: 40rpx;
				}
			}
			.info{
				width: 690rpx;
				margin: 200rpx 30rpx 0 30rpx;
				font-size: 32rpx;
				font-weight: bold;
				.other-info{
					.air{
						flex: 1;
					}
					.rain{
						flex: 1;
						justify-content: flex-end;
					}
					image{
						width: 32rpx;
						margin-right: 10rpx;
					}
				}
				.future-weather{
					margin-top: 50rpx;
					.item{
						margin-bottom: 30rpx;
						.item-weather{
							flex: 1;
							.u-tag{
								padding: 5rpx 10rpx;
								transform: scale(0.8);
							}
						}
						.item-temperature{
							flex: 1;
							display: flex;
							justify-content: flex-end;
						}
					}
				}
			}
		}
		//指示灯和当前城市
		.indicator{
			position: absolute;
			//#ifdef H5
			top: 70rpx;
			//#endif
			//#ifdef APP-PLUS
			top: 90rpx;
			//#endif
			left: 0rpx;
			right: 0rpx;
			z-index: 9;
			flex-flow: column;
			font-weight: bold;
			font-size: 34rpx;
			.dot{
				width: 15rpx;
				height: 15rpx;
				content: none;
				border-radius: 50%;
				margin: 10rpx;
				background-color: #eeeeef;
			}
		}
		//底部按钮
		.weather-button{
			position: absolute;
			left: 30rpx;
			right: 30rpx;
			bottom: 30rpx;
			font-weight: bold;
			.button{
				background-color: #abd2fc;
				color: #FFFFFF;
			}
		}
	}
</style>
