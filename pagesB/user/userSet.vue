<template>
	<view>
		<view class="pages">
			<view class="content">
				<view class="item" @tap="setAccount">
					<view class="right u-f-ac">
						账号管理
					</view>
					<view class="left">
						<u-icon name="error-circle" color="#fa3534" size="50" style="margin-right: 20rpx;"></u-icon>
						<u-icon name="arrow-right" color="#727c8e" size="20" ></u-icon>
					</view>
				</view>
				<view class="item" @tap="toSetInfo">
					<view class="right u-f-ac">
						个人资料
					</view>
					<view class="left">
						<u-image  :src="`${baseUrl}${myImg}`" shape="circle" style="width:50rpx;height:50rpx;margin-right: 20rpx;"></u-image>
						<u-icon name="arrow-right" color="#727c8e" size="20" ></u-icon>
					</view>
				</view>
				<view class="item" @tap="toAddress">
					<view class="right u-f-ac">
						收货地址管理
					</view>
					<view class="left">
						<u-icon name="arrow-right" color="#727c8e" size="20" ></u-icon>
					</view>
				</view>
				
				<view class="item" @click="toPrivacySetting">
					<view class="right u-f-ac">
						隐私设置
					</view>
					<view class="left">
						<u-icon name="arrow-right" color="#727c8e" size="20" ></u-icon>
					</view>
				</view>
				
				<view class="item">
					<view class="right u-f-ac">
						关于
					</view>
					<view class="left">
						<u-icon name="arrow-right" color="#727c8e" size="20" ></u-icon>
					</view>
				</view>
				<view class="log-out u-f-ajc">
					<u-button :ripple="true" ripple-bg-color="#909399" :hair-line="false" @tap="loginOut">退出登录</u-button>
				</view>
			</view>
			
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				
			}
		},
		methods:{
			//账号管理
			setAccount(){
				uni.navigateTo({
					url:'./set/setAccount'
				})
			},
			//个人资料
			toSetInfo(){
				uni.navigateTo({
					url:'./info/userInfoSet'
				})
			},
			//地址管理
			toAddress(){
				uni.navigateTo({
					url:'./set/address'
				})
			},
			// 隐私设置
			toPrivacySetting(){
				uni.navigateTo({
					url:'./set/privacy'
				})
			},
			loginOut(){
				console.log('退出登录')
				const that = this
				this.$u.debounce(()=>{
					uni.showModal({
					    title: '提示',
					    content: '您确定要退出登录吗',
					    success: function (res){
					        if (res.confirm) {
					            console.log('用户点击确定');
								let res = that.$store.dispatch('login/loginOut').then((res)=>{
									if(res.code === 200){
										that.$refs.uToast.show({
											position:'top',
											title: res.msg,
											type: 'success',
											isTab:true,
											url:'pages/index/index' 
										})
									}
								})			
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
				}, 1000)
			}
		}
	}
</script>

<style lang="less" scoped>
	.pages{
		background-color: #f4f4f5;
		height: 100vh;
		padding-top: 20rpx;
	}
	.content{
		padding: 0rpx 20rpx 0 20rpx;
		background-color: #FFFFFF;
		font-size: 30rpx;
		font-weight: bold;
		.item{
			padding: 20rpx 0;
			display: flex;
			justify-content: center;
			border-bottom: 1rpx solid #f2f2f3;
			.right{
				flex: 10;
			}
			.left{
				flex:4;
				display: flex;
				justify-content: flex-end;
			}
		}
		.log-out{
			position: absolute;
			bottom: 20rpx;
			left: 0;
			right: 0;
			button{
				width: 100%;
			}
		}
	}
</style>
