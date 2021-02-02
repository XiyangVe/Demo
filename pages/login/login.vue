<template>
	<view>
		<!--头部背景图-->
		<login-head style="margin-bottom: 160rpx;"></login-head>
		
		<!--输入内容-->
		<login-input :type="'login'" :user="user" :password="password" @setUser="getUser" @setPassword="getPassword"></login-input>
		
		<!--按钮-->
		<login-button @handle="toLogin">
			<slot>登 录</slot>
		</login-button>
		
		<!--忘记密码-->
		<view class="forget u-f-ajc" @click="resetPassword">
			忘记密码
		</view>
		
		<!--注册三方登录-->
		<view class="other u-f-ajc">
			<view class="content u-f-ajs">
				<view class="register">
					还没有账号？去<text style="color: red;" @tap="toRegister">注册</text>
				</view>
				<view class="wx u-f-ac" @click="toPlogin()">
					<u-icon margin-right="10rpx" name="phone-fill"  size="35" ></u-icon>
					验证码登录
				</view>
				<view class="phone u-f-ac" @click="wxLogin()">
					<u-icon margin-right="10rpx" name="weixin-fill" color="#51c300" size="38" ></u-icon>
					微信登录
				</view>
			</view>
		</view>
		<!--消息提示框-->
		<u-toast ref="uToast" />
		
	</view>
</template>

<script>
	import loginHead from '../../components/login/login-head/login-head.vue'
	import loginInput from '../../components/login/login-input/login-input.vue'
	import loginButton from '../../components/commoms/cmd-button.vue'
	export default {
		components:{
			loginHead,
			loginInput,
			loginButton
		},
		data() {
			return {
				user:'dddddd',
				password:'333333'
			}
		},
		onLoad() {
			/* console.log(this.$store.state.login.token) */
		},
		methods: {
			// 微信登录
			wxLogin(){
				var that = this
				uni.login({
					provider: 'weixin',
					success:function(res){
						console.log(res)
						uni.getUserInfo({
							provider: 'weixin',
							success(info) {
								console.log(info)
							}
						})
					}
				})
			},
			// 忘记密码
			resetPassword(){
				uni.navigateTo({
					url: 'retrievePassword'
				})
			},
			//回调事件
			getUser(val){
				this.user = val
			},
			getPassword(val){
				this.password = val
			},	
			//登录
			toLogin(){
				this.$u.throttle(this.handleLogin, 1500)
			},
			async handleLogin(){
				let res = await this.$store.dispatch('login/login',{
					username:this.user,
					password:this.password
				})
				if(res.code === 200){
					if(res.firstLoginStatus == 1){
						this.$refs.uToast.show({
							position:'top',
							mask:true,
							duration:1500,
							title: res.msg,
							type: 'success',
							url:'pages/login/setUser'
						})
					}else{
						this.$refs.uToast.show({
							position:'top',
							mask:true,
							duration:1500,
							title: res.msg,
							type: 'success',
							isTab:true,
							url:'pages/tabBar/index/index'
						})
					}
				}else{
					// this.$refs.uToast.show({
					// 	title: res.msg,
					// 	position:'top',
					// 	type: 'warning',
					// })			
				}
			},
			//去注册
			toRegister(){
				uni.navigateTo({
					url:'./register'
				})
			},
			// 手机登录
			toPlogin(){
				uni.navigateTo({
					url: './phoneLogin'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	page{
		overflow: hidden;
	}
	
	.forget{
		margin: 20rpx 0;
		font-size: 24rpx;
		transform:scale(0.8);
	}
	.other{
		.content{
			width: 680rpx;
			font-size: 24rpx;
			.register{
				flex: 3;
			}
			.wx{
				flex: 2;
			}
			.phone{
				flex: 2;
			}
		}
	}
</style>
