<template>
	<view>
		<!--头部-->
		<integral-head :userInfo="userInfo"></integral-head>
		<view class="input">
			<input v-model="friend" placeholder="请输入你要赠送的好友账号" placeholder-style="font-size: 24rpx;"/>
			<input v-model="number" placeholder="请输入你要赠送的积分值" placeholder-style="font-size: 24rpx;"/>
		</view>
		<cmd-button @handle="give">
			<slot>确认赠送</slot>
		</cmd-button>
	</view>
</template>

<script>
	import integralHead from '../components/integral/integral-head.vue'
	import cmdButton from '../../components/commoms/cmd-button.vue'
	export default {
		components:{
			integralHead,
			cmdButton
		},
		data() {
			return{
				friend:'',
				number:'',
				userInfo:{}
			}
		},
		onLoad() {
			this.userInfo = this.$store.state.user.userInfo
		},
		methods: {
			give(){
				if(this.friend==""){
					uni.showToast({
						title: '请输入赠送账号',
						icon: 'none'
					})
					return;
				}
				if(this.number==""){
					uni.showToast({
						title: '请输入要赠送的积分值',
						icon: 'none'
					})
					return;
				}
				this.$u.api.giveIntegral({
					otherUserName: this.friend,
					scoreNum: this.number
				}).then(res=>{
					if(res.code==200){
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						setTimeout(function(){
							uni.navigateBack({
								delta: 2
							})
						},2000)
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.input{
		margin: 30rpx;
		width: 690rpx;
		input{
			padding: 10rpx;
			box-shadow: 1rpx 1rpx 15rpx #C0C0C0;
			border-radius: 15rpx;
			margin: 30rpx 0;
		}
	}
</style>
