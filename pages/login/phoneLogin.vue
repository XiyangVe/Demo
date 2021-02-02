<template>
	<view class="">
		<!--头部背景图-->
		<login-head style="margin-bottom: 160rpx;"></login-head>
		<!--输入框-->
		<view class="input-box">
			<view class="item">
				<u-icon name="phone-fill" size="50"></u-icon>
				<input type="text" v-model="phone" placeholder="请输入手机号"/>
				<view class="get-code" @click="getCode" v-if="isShow">
					获取验证码
				</view>
				<view v-else>
					<u-count-down 
						color="#f40"
						:show-hours="false"
						:show-minutes="false"
						@end="timesEnd"
						:timestamp="timestamp">
					</u-count-down>
				</view>
			</view>
			<view class="item">
				<u-icon name="more-circle-fill" size="50"></u-icon>
				<input type="text" v-model="code" placeholder="请输入验证码"/>
			</view>
			<view class="btn-box">
				<view class="btn" @click="phoneLogin">
					登录
				</view>
			</view>
		</view>
		<!--消息提示框-->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import loginHead from '@/components/login/login-head/login-head.vue'
	export default{
		components:{
			loginHead
		},
		data(){
			return{
				phone: '',
				code: '',
				timestamp: 60,
				isShow:true
			}
		},
		methods:{
			timesEnd(){
				console.log('倒计时结束')
				this.isShow = true
			},
			getCode(){
				this.$u.api.loginVerifyCode({
					phone:this.phone
				}).then(res=>{
					if(res.code==200){
						this.isShow = false
					}
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
				})
			},
			phoneLogin(){
				this.$u.throttle(this.handleLogin, 1500)
			},
			async handleLogin(){
				let res = await this.$store.dispatch('login/phoneLogin',{
					phone:this.phone,
					code:this.code
				})
				if(res.code === 200){
					console.log(res.msg)
					this.$refs.uToast.show({
						position:'top',
						mask:true,
						duration:1500,
						title: res.msg,
						type: 'success',
						isTab:true,
						url:'pages/tabBar/index/index'
					})
				}else{
					this.$refs.uToast.show({
						title: res.msg,
						position:'top',
						type: 'warning',
					})			
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.input-box{
		padding: 20rpx;
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
</style>
