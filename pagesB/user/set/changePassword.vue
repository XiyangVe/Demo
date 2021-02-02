<template>
	<view class="content-box">
		<view class="item">
			<u-icon name="lock-open" size="50"></u-icon>
			<input type="text" v-model="oldPassword" placeholder="请输入密码"/>
		</view>
		<view class="item">
			<u-icon name="lock-opened-fill" size="50"></u-icon>
			<input type="text" v-model="newPassword" placeholder="请输入新密码"/>
		</view>
		<view class="btn-box">
			<view class="btn" @click="changePassword">
				重置密码
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				oldPassword: '',
				newPassword: ''
			}
		},
		methods:{
			changePassword(){
				this.$u.api.changePassword({
					oldPassword: this.oldPassword,
					newPassword: this.newPassword
				}).then(res=>{
					if(res.code==200){
						this.oldPassword = ''
						this.newPassword = ''
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

<style lang="scss" scoped>
	.content-box{
		padding: 20rpx;
		position: relative;
		top: 0;
		left: 0;
		.item{
			display: flex;
			align-items: center;
			border-bottom: 2rpx solid #CCCCCC;
			padding: 20rpx 0;
			input{
				margin-left: 20rpx;
				width: 90vw;
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
