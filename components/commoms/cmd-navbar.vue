<template>
	<view>
		<!--自定义导航栏-->
		<u-navbar :is-back="false" title="" height="50" :border-bottom="false"  :background=" type === 'friend' ? background : {}">
			<view class="slot-wrap u-f-ajc" style="background-color: #FFFFFF;">
				
				<view class="right u-f-ajc" @tap="toWeather">
					<!--图标-->
					<u-image v-if="type === 'index'" width="60rpx" mode="widthFix" :src="'/static/index/weather.png'" :lazy-load="false"></u-image>
					<!--用户头像-->
					<u-image v-if="type === 'friend'" shape="circle" width="60rpx" mode="widthFix" :src="`${baseUrl}${myImg}`" :lazy-load="false"></u-image>
				</view>
				
				<view class="center u-f-ajc">
					<u-input v-model="value" type="text" :border="true" />
				</view>
				
				<view class="left u-f-ajc">
					<u-icon name="search" color="#909399" size="50"></u-icon>
				</view>
				
			</view>
		</u-navbar>
	</view>
</template>

<script>
	export default {
		props:{
			// checkbox的名称
			type: {
				type:String,
				default: ''
			},
		},
		data() {
			return {
				//导航栏输入的内容
				value: 'Hello',
				background:{
					backgroundColor: '#a7c0dc',
				}
			}
		},
		methods:{
			toWeather(){
				uni.navigateTo({
					url:'/pagesA/weather/index'
				})
			}
		}
	}
</script>

<style lang="less">
	//顶部导航栏
	.slot-wrap {
		display: flex;
		align-items: center;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		flex: 1; 
		/* 如果您想让slot内容与导航栏左右有空隙 */
		padding: 30rpx 10rpx 25rpx 10rpx;
		.right{
			flex: 2;
		}
		.center{
			flex: 12;
			.u-input{
				background-color: #eff0f1;
				border-radius:50rpx;
			}
		}
		.left{
			flex: 2;
		}
		.u-image{
			position: relative;
			top: 10rpx;
		}
	}
</style>
