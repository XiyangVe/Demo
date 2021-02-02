<template>
	<view>
		<login-head style="margin-top: 200rpx;"></login-head>
		<view class="title u-f-ajc">
			<view>登录后才能看到哦(≧∇≦)/</view>
		</view>
		<view class="content u-f-ac">
			<u-button class="btn" type="primary" @click="toLogin">登录</u-button>
		</view>
		
	</view>
</template>

<script>
	import loginHead from '../login/login-head/login-head.vue'
	export default{
		components:{
			loginHead
		},
		methods:{
			toLogin(){		
				console.log('去登录')
				uni.navigateTo({
					url:'../login/login'
				})		
			}
		}
	}
</script>

<style scoped>
	.title{
		margin: 100rpx 0;
		color: #82848A;
		flex-flow: column;
	}
	.btn{
		width: 200rpx;
	}
</style>
