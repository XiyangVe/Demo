<template>
	<view>	
		<view class="load u-f-ajc">
			<u-loading :show="loading" mode="circle" color="#1cbf6d" size="60"></u-loading>
		</view>
		<view v-if="isshow" class="content u-f">
			<view class="card" v-for="item in list" :key="item.id" :class="[type]" @click="toDetails(item)">
				<view class="pic u-f-ajc" v-if="item.messType==1">
					<u-image v-if="item.scImg" :src="`${baseUrl}${item.scImg[0]}`" style="width: 100%; height: 100%;" mode="aspectFill"></u-image>
				</view>
				<view class="pic" v-else>
					<u-image :src="`${baseUrl}${item.vidioImg}`" style="width: 100%; height: 100%;" mode="aspectFill"></u-image>
					<view class="video-icon">
						<u-icon name="play-circle" color="#fff" size="80"></u-icon>
					</view>
				</view>
				<view class="info">
					<view class="title u-line-2">
						{{item.title}}
					</view>
					<view class="other-info u-f-ajc">
						<view class="user-pic">
							<u-image :src="`${baseUrl}${item.userHeadImage}`" style="width:50rpx; height:50rpx;" mode="scaleToFill" shape="circle"></u-image>
						</view>
						<view class="name">
							{{item.nickname}}
						</view>
						<view class="store u-f-ajc">
							<u-icon v-if="collectedIds.some(v => v == item.id)" name="star-fill" color="#ff6969" size="30"></u-icon>
							<u-icon v-else name="star-fill" color="#cccccc" size="30"></u-icon>
							<text style="margin-left: 10rpx;">{{item.messCollect}}</text>
						</view>
					</view>
				</view>
			</view>	
		</view>
	</view>
</template>

<script>
	import { mapGetters, } from 'vuex'
	export default {
		props:{
			type:{
				type:String,
				default:"cardIndex"
			},
			list:{
				type:Array,
				default:function(){
					return []
				},
			},
		},
		computed:{
			...mapGetters(['collectedIds']),
			isshow:function(){
				return this.list.length > 0 ? true : false
			},
		},
		data() {
			return {
				loading:false,
			}
		},
		mounted() {
			//获取整个内容的高度实现自适应
			if(this.list.length > 0){
				const query = uni.createSelectorQuery().in(this);
				query.select('.content').boundingClientRect(data => {
					this.$emit('heightAuto',data.height)
				}).exec();
			}
		},
		methods: {
			toDetails(e) {
				if(e.messType==1){
					uni.navigateTo({
						url: `../../pagesA/index/details?id=${e.id}`
					})
				}else{
					uni.navigateTo({
						url: `/pages/Test/Test?id=${e.id}`
					})
				}
				
			}
		}
	}
</script>

<style lang="less" scoped>
	//选项卡样式
	.load{
		margin-top: 20rpx;
	}
	.none{
		margin-top: 20rpx;
		font-weight: bold;
	}
	.content {
		width: 710rpx;
		margin: 0 20rpx;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		.card {
			width: 340rpx;
			padding-bottom: 20rpx;
			border-radius: 15rpx;
			.pic {
				width: 100%;
				height: 500rpx;
				border-bottom: 1rpx solid #CCCCCC;
				display: flex;
				justify-content: center;
				align-items: center;
				.video-icon{
					position: absolute;
				}
				.none{
					position: absolute;
					z-index: 99;
					left: 30%;
					bottom: 20%;
				}
				video{
					width: 100%;
					height: 100%;
				}
			}
		
			.info {
				padding: 10rpx 10rpx 10rpx 10rpx;
				width: 100%;
				max-height: 130rpx;
		
				.title {
					font-size: 24rpx;
				}
				.other-info {
					font-size: 24rpx;
					color: #a4a4a4;
					margin-top: 10rpx;
		
					.user-pic {
						flex: 1;
					}
		
					.name {
						flex: 4;
						overflow: hidden;
						transform: scale(0.9);
					}
		
					.type {
						flex: 2;
						transform: scale(0.9);
					}
		
					.store {
						flex: 2;
						transform: scale(0.9);
					}
				}
			}
		}
		.cardStore{
			margin: -88rpx -53rpx -109rpx -52rpx; 
			transform: scale(0.65);
			box-shadow: 2rpx 10rpx 15rpx #d5d5d5;
		}
		.cardIndex{
			margin: 10rpx 5rpx 10rpx 10rpx;
			box-shadow: 1rpx 1rpx 15rpx #CCCCCC;
		}
	}
</style>
