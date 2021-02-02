<template>
	<!--头部区域-->
	<view>
 		<view class="top-row u-f-ac">
			<u-icon name="email" color="#fafafa" size="45"></u-icon>
			<u-icon name="setting-fill" color="#fafafa" size="46" style="margin-left:30rpx; transform: rotate(30deg);" @tap="toSet"></u-icon>
		</view> 
		<view class="background">
			<u-image src="../static/user-background.png" mode="scaleToFill" style="width: 100%;height: 100%;"></u-image>
		</view>
		<view class="head">
			<!--第一栏-->
			<view class="pic u-f-ajs">
				<view class="icon u-f-ac">
					<view style="width: 150rpx; height:150rpx;">
						<u-image  :src="`${baseUrl}${myImg}`" mode="scaleToFill" shape="circle" style="width: 100%;height: 100%;"></u-image>
					</view>
					<text @tap="toUserGrade">{{userInfo.levelName}}</text>
				</view>
				<view class="more u-f-ac" @tap="toUserInfoSet">
					<text>空间</text>
					<u-icon name="arrow-right" color="#ee777f" size="36"></u-icon>
				</view>
			</view>
			<!--第二栏-->
			<view class="main-info">
				<view class="name u-f-ac">
					{{userInfo.nickname}}
					<view style="margin-left: 10rpx;">
						<u-icon v-if="userInfo.sex === 1" name="man" color="#2979ff" size="32"></u-icon>
						<u-icon v-else name="woman" color="#dd6161" size="32"></u-icon> 
					</view>
				</view>
				<view class="introduce">
					我的积分：<text>{{userInfo.leftoverScore}}</text>
				</view>
			</view>
			<!--第三栏-->
			<other-info :other="userInfo"></other-info>
		</view>
	</view>
</template>

<script>
	import otherInfo from './other-info.vue'
	export default {
		props:{
			userInfo:Object,
		},
		components:{
			otherInfo
		},
		methods:{
			//跳转设置
			toSet(){
				uni.navigateTo({
					url:'../../pagesB/user/userSet'
				}) 
			},
			//跳转到个人中心用户数据设置
			toUserInfoSet() {
 				uni.navigateTo({
					/* url:`../../pagesB/user/userSpace?id=4` */
					url:`../../pagesB/user/userSpace?id=${this.myId}`
				}) 
			},
			//跳转到个人中心用户等级
			toUserGrade() {
				uni.navigateTo({
					url:'../../pagesB/user/info/userGrade'
				})
			}
			
		}
	}
</script>

<style lang="less" scoped>
	page{
		font-family:"黑体";
	}
  	.top-row{
		position: absolute;
		top: 70rpx;
		right: 40rpx;
		z-index: 9;
	}
	.background{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 500rpx;
		overflow: hidden;
		z-index: 0;
	}
	.head{
		padding: 100rpx 20rpx 20rpx 20rpx;
		position: relative;
		.pic{
			.icon{
				flex: 11;
				text{
					font-size: 36rpx;
					font-weight: bold;
					margin-left: 20rpx;
					color: #ee777f;
				}
			}
			.more{
				flex: 2;
				text{
					color: #ee777f;
				}
			}
		}
		.main-info{
			margin-top: 30rpx;
			.name{
				font-size: 34rpx;
			}
			.introduce{
				margin-top: 10rpx;
				color: #636e7e;
				text{
					color: #dd4f42;
				}
			}
		}
		
	}
</style>
