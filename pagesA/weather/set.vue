<template>
	<view>
		<view class="content">
			<view class="title">设置</view>
			<view class="item u-f-ajc">
				<view class="left"> <text>温度单位</text></view>
				<view class="right" @tap="handle('temperature')">
					<text>摄氏度（℃）</text>
					<u-icon name="arrow-right" color="#ff6969" size="34"></u-icon>
				</view>
			</view>
			<view class="item u-f-ajc">
				<view class="left"> <text>风速单位</text></view>
				<view class="right" @tap="handle('windPower')">
					<text>千米每小时（Km/h）</text>
					<u-icon name="arrow-right" color="#ff6969" size="34"></u-icon>
				</view>
			</view>
		</view>
		<u-popup v-model="show" mode="bottom" border-radius="14">
			<view class="set" v-if="setWay === 'temperature'">
				<view class="title u-f-ajc">温度单位</view>
				<view class="item u-f-ac item-active">
					<view style="flex: 1;">摄氏度（℃）</view>
					<view style="flex: 1; display: flex;justify-content: flex-end;">
						<u-icon name="checkmark" color="#2979ff" size="34"></u-icon>
					</view>			
				</view>
				<view class="item">
					华氏度（°F）
				</view>
			</view>
			<view class="set" v-if="setWay === 'windPower'">
				<view class="title u-f-ajc">风力单位</view>
				<view class="item u-f-ac item-active">
					<view style="flex: 5;">蒲福风力等级（Beaufort scale）</view>
					<view style="flex: 1; display: flex;justify-content: flex-end;">
						<u-icon name="checkmark" color="#2979ff" size="34"></u-icon>
					</view>			
				</view>
				<view class="item">
					<text>千米每小时（Km/s）</text>
				</view>
				<view class="item">
					<text>米每秒（m/s）</text>
				</view>
				<view class="item">
					<text>英里每小时（mph）</text>
					
				</view>
				<view class="item">
					<text>节（Kn）</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:false,
				//设置温度或者风力
				setWay:'temperature',
			}
		},
		methods:{
			handle(val) {
				this.setWay = val
				this.show = true	
			}
		}
	}
</script>

<style lang="less" scoped>
	.content{
		width: 710rpx;
		margin: 20rpx;
		.title{
			font-size: 50rpx;
			margin-bottom: 30rpx;
		}
		.item{
			height: 50rpx;
			padding: 20rpx 0;
			font-size: 34rpx;
			margin-bottom: 20rpx;
			.left{
				flex: 1;
				font-weight: bold;
			}
			.right{
				flex: 2;
				color: #909399;
				display: flex;
				justify-content: flex-end;
			}
		}
	}
	.set{
		padding: 20rpx 0;
		font-weight: bold;
		font-size: 34rpx;
		.title{
			margin-bottom: 50rpx;
		}
		.item{
			margin-bottom: 20rpx;
			padding: 15rpx;
		}
		.item-active{
			background-color: #c5e0ff;
			color: #0c7dff;
		}
	}
</style>
