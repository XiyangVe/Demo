<template>
	<view>
		<u-navbar  title="账号安全" back-icon-color="#ffffff" title-color="#ffffff" :background="{backgroundColor:'#12b8f6'}" :border-bottom="false"></u-navbar>
		<view class="container">
			<view class="background">
				<image src="../../static/user/fate.jpg" mode="widthFix" style="width: 100%;"></image>
			</view>
			<!--头部-->
			<view class="content">
				<view class="item bind u-f-ajc ">
					<view class="left" >
						当前账号
					</view>
					<view class="right">
						{{userInfo.username}}
						<u-icon style="margin-left: 20rpx;" name="arrow-right"  size="26"></u-icon>
					</view>
				</view>
				<view class="item bind u-f-ajc ">
					<view class="left" >
						账号安全等级
					</view>
					<view class="right">
						5
						<u-icon name="star-fill" color="#ffcd43"></u-icon>
						<u-icon style="margin-left: 20rpx;" name="arrow-right"  size="26"></u-icon>
					</view>
				</view>
				<view class="item bind u-f-ajc" @tap="toChangePassword()">
					<view class="left" >
						登录密码
					</view>
					<view class="right">
						去设置
						<u-icon style="margin-left: 20rpx;" name="arrow-right"  size="26"></u-icon>
					</view>
				</view>
				<!-- <view class="item u-f-ajc" @tap="toBind">
					<view class="left" >
						微信绑定：
					</view>
					<view  class="right">
						<view class="u-f-ajc">
							未绑定
							<u-icon style="margin-left: 20rpx;" color="#18b566" name="weixin-fill" size="48"></u-icon>
						</view>
						<view>
							<u-icon style="margin-left: 20rpx;" name="arrow-right" size="26"></u-icon>
						</view>
					</view>
				</view>
				<view class="item u-f-ajc" @tap="toBind">
					<view class="left" >
						邮箱绑定：
					</view>
					<view  class="right">
						<view class="u-f-ajc">
							未绑定
							<u-icon style="margin-left: 20rpx;" color="#ff9d0b" name="email" size="45"></u-icon>
						</view>
						<view>
							<u-icon style="margin-left: 20rpx;" name="arrow-right" size="26"></u-icon>
						</view>
					</view>
				</view> -->
				<view class="item u-f-ajc" @tap="toBind(userInfo.phone)">
					<view class="left" >
						手机绑定：
					</view>
					<view  class="right">
						<view class="u-f-ajc">
							{{userInfo.phone}}
							<u-icon style="margin-left: 20rpx; position: relative;top: -5rpx;" color="#2979ff" name="phone-fill" size="45"></u-icon>
						</view>
						<view>
							<u-icon style="margin-left: 20rpx;" name="arrow-right" size="26"></u-icon>
						</view>
					</view>
				</view>
			</view>
			<!--提示-->
			<view class="warn u-f-ac u-skeleton-fillet">
				为了保证账号安全，建议绑定微信号
			</view>	
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				userInfo:''
			}
		},
		onLoad() {
			this.userInfo = this.$store.state.user.userInfo
		},
		methods:{
			toBind(phone){
				this.$u.route('/pagesB/user/info/urerBind', {
					phone: phone
				})
			},
			// 去重置密码页面
			toChangePassword(){
				uni.navigateTo({
					url: './changePassword'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.container{
		background-color: #f4f4f4;
		height: 100vh;
		padding: 0 !important;
		.background{
			margin-bottom: 20rpx;
		}
		.content{
			width: 710rpx;
			margin: 0rpx 20rpx;
			background-color: #FFFFFF;
			box-shadow: 1rpx 1rpx 25rpx #e8e8e8;
			border-radius: 15rpx;
			color: #acacac;
			.item{
				height: 80rpx;
				padding: 0 10rpx;
				border-bottom: 1rpx solid #acacac;
				.left{
					flex: 1;
				}
				.right{
					flex: 3; 
					display: flex;
					
					justify-content: flex-end;
				}
			}
			.item:last-child{
				border-bottom:none
			}
		}
		.warn{
			width: 710rpx;
			height: 80rpx;
			margin: 30rpx 20rpx;
			background-color: #fdf2dc;
			border-radius: 15rpx;
			color: #fe7b78;
			font-size: 24rpx;
			padding-left: 20rpx;
		}
	}
</style>
