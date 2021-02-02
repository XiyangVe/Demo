<template>
	<view>
		<view style="margin-bottom: 250rpx;">
			<login-head></login-head>
		</view>

		<!--输入组件-->
		<login-input :type="type" :phone="phone" :code="code" :password="password" @setPhone="getPhone" @setCode="getCode"
		 @setPassword="getPassword" @getNewpawd="receiveCode"></login-input>

		<login-button @handle="next" v-if="btnShow">
			<slot>{{text}}</slot>
		</login-button>
		<view v-else class="btn-next">下一步</view>
	</view>
</template>

<script>
	import loginHead from '../../components/login/login-head/login-head.vue';
	import loginInput from '../../components/login/login-input/login-input.vue';
	import loginButton from '../../components/commoms/cmd-button.vue'
	export default {
		components: {
			loginHead,
			loginInput,
			loginButton
		},
		data() {
			return {
				type: 'repawd',
				text: '下一步',
				phone: '',
				code: '',
				password: '',
				btnShow: false
			}
		},
		methods: {
			getPhone(val) {
				this.phone = val
			},
			getCode(val) {
				this.code = val
			},
			getPassword(val) {
				this.password = val
			},
			next() {
				if (this.text === '下一步') {
					this.type = 'newpawd'
					this.text = '确认重置密码'
				} else {
					this.$u.api.resetPassword({
						phone: this.phone,
						code: this.code,
						newPassword: this.password
					}).then(res=>{
						if(res.code==200){
							setTimeout(function() {
								uni.reLaunch({
								    url: './login'
								});
							}, 2000)
						}
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					})
				}
			},
			receiveCode() {
				this.$u.api.getPasswordVerifyCode({
					phone: this.phone
				}).then(res=>{
					if(res.code==200){
						this.btnShow = true
					}
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
				})
			}
		}
	}
</script>

<style scoped lang="less">
	page {
		overflow: hidden;
		width: 100vw;
		.btn-next{
			margin: 40rpx 5vw;
			width: 90vw;
			height: 92rpx;
			line-height: 92rpx;
			background-color: #ccc;
			color: #2C405A;
			font-weight: bold;
			border-radius: 50rpx;
			text-align: center;
		}
	}
</style>
