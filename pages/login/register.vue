<template>
	<view>
		<!--头部图片-->
		<view v-if="step <= 2">
			<login-head style="margin-bottom: 100rpx;"></login-head>
		</view>
		
		<!--注册成功头部画面-->
 		<view v-if="step === 3" class="register-success u-f-ajc">
			<image src="../../static/login/register.png" mode="widthFix" style="width: 250rpx;"></image>
			<view style="margin-top: 100rpx; font-size: 38rpx;">恭喜注册成功,请完善基本信息</view>
		</view>
		
		<!--提示-->
		<view v-if="step === 2" class="title">
			<view style="font-size: 32rpx;">验证码已发送至{{phone}}</view>
			<view style="font-size: 24rpx;">
				<text v-if="time">{{time}}秒后可</text>
				<text style="color:#4099ff;" @tap="again">重新发送</text>
			</view>
		</view>
		
		<!--输入内容-->
		<block v-if="step <= 2">
			<login-input :type="type" :phone="phone" :user=user :password="password" :friendCode="friendCode" :code="code"
			@setPhone="getPhone" @setUser="getUser" @setPassword="getPassword" @setFriend="getFriend" @setCode="getCode"></login-input>
		</block>
		
		
		<!--按钮-->
		<login-button @handle="next"  v-show="step <= 2 ">
			<slot>{{text}}</slot>
		</login-button>
		
		<view class="xz u-f-ajc" >
			注册后即代表您已阅读并同意如下协议
			<view style="color:red;">
				<text @click="toUserXieyi">《用户服务协议》</text>
				<text @click="toYinsiXieyi">《隐私政策》</text>
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
	//定时器
	var timer = null;
	export default {
		components: {
			loginHead,
			loginInput,
			loginButton,
		},
		data() {
			return {
				phone:'',
				user:'',
				password:'',
				friendCode:'',
				code:'',
				//输入类型
				type:'register',
				//倒计时
				time:59,
				//步骤控制
				step: 1,
				text:'下一步',
			}
		},
		onLoad() {
			clearTimeout(timer)
			this.$u.api.getRecommendCodeByIp().then(res => {
				this.friendCode = res.data
			})
		},
		methods: {
			// 去用户相关协议页面
			toUserXieyi(){
				uni.navigateTo({
					url: 'protocol/userProtocol'
				})
			},
			toYinsiXieyi(){
				uni.navigateTo({
					url: 'protocol/privacyProtocol'
				})
			},
			//5条步骤 
			getPhone(val){
				this.phone = val
			},
			getUser(val){
				this.user = val
			},
			getPassword(val){
				this.password = val
			},
			getFriend(val){
				this.friendCode = val
			},
			//最后的验证码
			getCode(val){
				this.code = val
			},
			//当前验证码倒计时
			countTime: function() {	
				//获取当前时间
				if(this.time > 0){
					this.time-- 
					//递归每秒调用countTime方法，显示动态时间效果
					timer = setTimeout(this.countTime, 1000)	
				}else{
					clearTimeout(timer)
				}
			},
			tips(type,title){
				this.$refs.uToast.show({
					position:'top',
					title,
					type,
				})
			},
			//按钮执行下一步操作
			async next(){
				//验证
				let err = []
				for(let i = 0; i < 3; i++){
					if(i === 0){
						err.push({
							text:this.$u.test.mobile(this.phone) ? '' : '请输入正确的手机号'
						})
					}else if(i === 1){
						const Regexp = /^[a-z0-9A-Z\u4e00-\u9fa5]{6,18}$/
						let check = Regexp.test(this.user);
						err.push({
							text: check ? '' : '请输入6-10位由中文,数字和字母组成的账号名' 
						})
					}else if(i === 2){
						err.push({
							text:this.$u.test.enOrNum(this.password) && this.$u.test.rangeLength(this.password, [6, 12]) ? '' : '请输入6-12位数字和字母组成的密码' 
						})
					}
				}
				let index = err.findIndex( v => {
					return v.text !== ''
				})
				if(index !== -1){
					this.tips('error',err[index].text)
					return 
				}
				
				let step = this.step
				switch(step) {
					case 1:
						//发送验证码
 						let res1 = await this.$u.api.getCode({
							phone:this.phone,
						})
						if(res1.code === 200){
							this.type = 'code'
							this.text = '立即注册'
							//开启倒计时
							this.countTime()
							this.step++
						}else if(res1.code !== 200){
							this.tips('error',res1.msg)
						} 
					break;
					case 2:
						//验证码校核
						//取消定时器
						clearTimeout(timer) 
						//注册接口
						this.$u.api.register({
							username : this.user,
							password : this.password,
							phone : this.phone,
							code : this.code,
							recommendCode : this.friendCode
						}).then(res2 => {
							if(res2.code === 200){
								this.$refs.uToast.show({
									position:'top',
									title: res2.msg,
									type: 'success',
									duration:4000,
									url: 'pages/login/login'
								})	
							}else{
								this.tips('error',res2.msg) 
							}
						})
					break;
				}
			},
			//重新发送验证码
			again(){
				if( this.time === 0 ){
					this.time = 0
					this.countTime()
				}else{
					uni.showToast({
						icon:'none',
						title:`请在${this.time}秒后重新发送验证码`
					})
				}
			},
			//注册
			toRegister(){
				console.log("开始注册")
			}
			
		}
	}
</script>

<style scoped lang="less">
	page{
		overflow: hidden;
	}
	.title{
		margin: 0 0 100rpx 50rpx ;
	}
	.xz{
		margin: 0 10rpx;
		font-size: 24rpx;
		transform:scale(0.9);
		flex-flow: column;
	}
	.register-success{
		margin:50rpx 0 100rpx 0;
		flex-flow: column;
	}
</style>
