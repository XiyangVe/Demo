<template>
	<view class="handle u-f-ajc">
		<u-icon name="plus-circle-fill" color="#0077ff" size="80" :class="[show ? 'handle-image-active' : 'handle-image-hidden']" @tap="showAction"></u-icon>
<!-- 		<image src="../../static/friend/handle.png" mode="widthFix" :class="[show ? 'handle-image-active' : 'handle-image-hidden']"
		 @tap="showAction"></image> -->
		<!--打包成app没有过度效果，只有h5有所以舍弃-->
		<!--<transition name="custom-classes-transition"    enter-active-class="animated tada" leave-active-class="animated bounceOutRight">
		</transition> -->
		<view class="handle-item" :class=" show ? 'fade-leave-active':'fade-leave-to'"  v-show="isShowAction">
			<view class="item" :class="{ 'item-active' : isShowAdd }" style="border-bottom: 1rpx solid #CCCCCC;"  @tap="$emit('showAdd')">添加分组</view>
			<view class="item"  @click="toSendAll">分组发送消息</view>
		</view>
	</view>
</template>

<script>
	var setTime = null
	export default {
		props:{
			//添加乘客是否激活
			isShowAdd:Boolean
		},
		data() {
			return {
				//是否开启动画
				show: false,
				//保证动画完美执行
				animationing:false,
				//是否开启操作栏
				isShowAction:false,
			}
		},
		onUnload() {
			clearTimeout(setTime)
		},
		methods:{
			//开启动画同时 是否要显示操作栏
			
			showAction() {			
				if(!this.isShowAction && this.animationing === false){
					//显示操作栏
					this.isShowAction = true
					//开启动画
					this.animationing = true
					//显示的动画帧
					this.show = true
					setTime = setTimeout(()=>{
					//动画关闭
						this.animationing = false
					},500)
				}else if(this.isShowAction && this.animationing === false){
					//开启动画
					this.animationing = true
					//隐藏的动画帧
					this.show = false
					setTime = setTimeout(()=>{
						//动画关闭
						this.animationing = false
						//关闭操作栏目
						this.isShowAction = false
					},500)
				}
			},
			fanfa(){
				
			},
			//前往发送群聊消息
			toSendAll(){
				uni.navigateTo({
					url:'./sendAll'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.handle {
		margin-top: 50rpx;
		flex-flow: column;
		position: relative;
	
		image {
			width: 70rpx;
			border-radius: 50%;
		}
	
		.handle-item {
			margin-top: 20rpx;
			width: 300rpx;
			height: 120rpx;
			border-radius: 20rpx;
			box-shadow: 1rpx 1rpx 15rpx #d8d8d8;
			font-size: 30rpx;
			font-weight: bolder;
			position: absolute;
			top: 80rpx;
			overflow: hidden;
			//选项动画效果
			.item {
				padding: 10rpx 20rpx 10rpx 20rpx;
			}
			.item-active{
				background-color: #007AFF;
				color: #FFFFFF;
			}
		}
		
		.handle-image-active {
			transform: rotate(135deg);
			transition: transform 0.5s;
		}
	
		.handle-image-hidden {
			transform: rotate(0deg);
			transition: transform 0.5s;
		}		

		//手写选项动画帧效果  可以看情况添加
		.fade-leave-active {
			animation: to-show 0.5s;
		}
		.fade-leave-to {
			animation: to-hidden 0.5s;
		}
	
		@keyframes to-show {
			from {
				opacity:0;
				transform: translateY(100rpx);
			}
	
			to {
				opacity:1;
				transform: translateY(0rpx);
			}
		}
	
		@keyframes to-hidden {
			from {
				opacity:1;
				transform: translateY(0rpx);
			}
	
			to {
				opacity:0;
				transform: translateY(100rpx);
			}
		}
	}
</style>
