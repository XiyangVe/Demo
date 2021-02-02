<template>
	<view>
		<view class="hasbind u-f-ac">
			<view>账号已绑定:</view>
			<view class="icon-box">
				<u-icon name="phone-fill" color="#2979ff" size="50"></u-icon>
				<!-- <u-icon name="weixin-fill" color="#51c300" size="58" style="position: relative;top: 5rpx;left: 10rpx;"></u-icon> -->
			</view>
		</view>
		<view class="way">
			<view class="item wx u-f-ac" style="display: none;">
				<view class="title">微信号:</view>
				<view class="content u-f-ac">
					<u-icon name="weixin-fill" color="#51c300" size="58" ></u-icon>
					<text>未绑定</text>
				</view>
				<view class="bind">
					<u-tag text="立即绑定" mode="plain" />
				</view>
			</view>
			<view class="item phone u-f-ac">
				<view class="title">手机号:</view>
				<view class="content">
					<u-icon name="phone-fill" color="#2979ff" size="50"></u-icon>
					<text>{{phone}}</text>
				</view>
				<view class="bind" @click="reBindPhone()">
					<u-tag text="换绑手机" mode="plain" />
				</view>
			</view>
		</view>
		<!-- 更换手机号 -->
		<view class="re-bind-phone" v-if="isShow">
			<view class="item">
				<u-icon name="phone-fill" size="50"></u-icon>
				<input type="text" v-model="newPhone" placeholder="请输入新手机号"/>
				<view class="get-code" @click="getCode()">
					获取验证码
				</view>
			</view>
			<view class="item">
				<u-icon name="chat-fill" size="50"></u-icon>
				<input type="text" v-model="code" placeholder="请输入验证码"/>
			</view>
			<view class="btn-box">
				<view class="btn" @click="okClick()">
					更换手机
				</view>
			</view>
		</view>
	
	</view>
</template>

<script>
	export default{
		data(){
			return{
				phone: '',
				newPhone: '',
				code: '',
				isShow: false
			}
		},
		onLoad(e) {
			this.phone = e.phone
		},
		methods:{
			reBindPhone(){
				this.isShow = true
			},
			getCode(){
				this.$u.api.changePhoneVerifyCode({
					phone: this.newPhone
				}).then(res=>{
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				})
			},
			okClick(){
				this.$u.api.reBindPhone({
					newPhone: this.newPhone,
					code: this.code
				}).then(res=>{
					if(res.code==200){
						this.isShow = false
					}
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.re-bind-phone{
		padding: 20rpx;
		margin-top: 50rpx;
		.item{
			display: flex;
			align-items: center;
			border-bottom: 2rpx solid #CCCCCC;
			padding: 20rpx 0;
			input{
				margin-left: 20rpx;
				width: 66vw;
			}
			.get-code{
				font-size: 20rpx;
			}
		}
		.btn-box{
			display: flex;
			justify-content: center;
			margin-top: 50rpx;
			.btn{
				width: 500rpx;
				height: 100rpx;
				line-height: 100rpx;
				background: #0077FF;
				box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
				border-radius: 50rpx;
				color: #FFFFFF;
				text-align: center;
				font-weight: 600;
			}
		}
	}
	.hasbind{
		margin: 30rpx 20rpx;
		width: 710rpx;
		box-shadow: 1rpx 6rpx 15rpx #d7d7d7;
		border-radius: 15rpx;
		padding: 10rpx;
		font-size: 36rpx;
		color: #888888;
		.icon-box{
			margin-left: 20rpx;
		}
	}
	.way{
		margin: 0 20rpx;
		width: 710rpx;
		box-shadow: 1rpx 1rpx 15rpx #d7d7d7;
		border-radius: 15rpx;
		.item{
			padding: 20rpx;
			.title{
				flex: 2;
				text-align: right;
				color: #888888;
			}
			.content{
				flex: 5;
				padding-left: 20rpx;
				text{
					margin-left: 20rpx;
				}
			}
			.bind{
				flex: 2;
			}
		}
		.wx{
			border-bottom: 1rpx solid #CCCCCC;
		}
	}

</style>
