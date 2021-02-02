<template>
	<view class="">
		<!-- 自定义导航 -->
		<u-navbar title="我的余额" title-size="30" title-bold :border-bottom="false" back-icon-color="#0077FF" title-color="#0077FF">
			<view @click="toBalanceDetails" slot="right" class="px-3 py-2" hover-class="bg-light">
				<u-icon name="more-dot-fill" color="#0077FF" size="50"></u-icon>
			</view>
		</u-navbar>
		<view class="flex flex-column align-center justify-center" style="height: 800rpx;">
			<view class="flex justify-center">
				<image src="/static/my/money.png" mode="widthFix" style="width: 120rpx;height: 166rpx;"></image>
			</view>
			<view class="flex flex-column align-center">
				<view class="font-weight-bolder main-text-color">
					<text class="font mr-1">￥</text>
					<text class="font-lg">{{userInfo.balance ? userInfo.balance.toFixed(2) :'0.00'}}</text>
				</view>
			</view>
		</view>
		<!-- 提现 -->
		<view class="px-5 pb-5" v-if="isShow">
			<view class="">
				<view class="py-2">
					<text class="font-sm text-dark">收款人姓名</text>
				</view>
				<view class="flex align-center border-bottom py-2 font-weight-bolder">
					<input v-model="payee" class="font" type="text"
						placeholder-style="color: #CECECE;font-weight: 400;"
						placeholder="请输入真实姓名"/>
				</view>
			</view>
			<view class="">
				<view class="py-2">
					<text class="font-sm text-dark">支付宝账号</text>
				</view>
				<view class="flex align-center border-bottom py-2 font-weight-bolder">
					<input v-model="receivingAccount" class="font" type="text" 
						placeholder-style="color: #CECECE;font-weight: 400;"
						placeholder="请输入支付宝账号"/>
				</view>
			</view>
			<view class="">
				<view class="py-2">
					<text class="font-sm text-dark">提现金额</text>
				</view>
				<view class="flex align-center border-bottom py-2 font-weight-bolder">
					<text class="font-md mr-1">￥</text>
					<input v-model="withdrawalAmount" class="font-lg" type="digit" />
				</view>
			</view>
			<view class="mt-5 flex justify-center">
				<u-button style="width: 600rpx;" @click="$u.debounce(towithdraw,1500)" type="primary" shape="circle" ripple>提现</u-button>
			</view>
		</view>
		<!-- 充值&提现按钮 -->
		<view class="position-fixed" style="bottom: 50rpx;left: 0;right: 0;" v-else>
			<u-button @click="balanceClick('recharge')" style="width: 600rpx;height: 90rpx;margin-bottom: 40rpx;" type="primary" shape="circle" :ripple="true">充值</u-button>
			<u-button @click="balanceClick('withdraw')" style="width: 600rpx;height: 90rpx;" type="primary" shape="circle" :ripple="true" plain>提现</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				isShow: false,
				userInfo: {},
				payee: '',
				receivingAccount: '',
				withdrawalAmount: ''
			}
		},
		onLoad() {
			this.getUserInfo()
			uni.$on('update',(data) => {
				this.getUserInfo()
			})
		},
		onUnload() {
			uni.$off('update')
			console.log('监听页面卸载')
		},
		methods:{
			// 充值
			balanceClick(type){
				if(type==='withdraw'){
					this.isShow = true
				}else{
					uni.navigateTo({
						url: '/pagesB/user/uesrChongzhi'
					})
				}
			},
			// 查看余额明细
			toBalanceDetails(){
				uni.navigateTo({
					url: '/pages/user/balanceDetails'
				})
			},
			// 获取用户信息
			getUserInfo(){
				this.$u.api.getUserInfo().then(res=>{
					if(res.code==200){
						this.userInfo = res.data.user
					}else{
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				})
			},
			// 申请提现
			towithdraw(){
				if(this.payee==''){
					uni.showToast({
						title: '请输入收款人真实姓名',
						icon: 'none'
					})
					return
				}
				if(this.receivingAccount==''){
					uni.showToast({
						title: '请输入支付宝账号',
						icon: 'none'
					})
					return
				}
				if(this.withdrawalAmount==''){
					uni.showToast({
						title: '请输入提现金额',
						icon: 'none'
					})
					return
				}
				this.$https.post('/pay/withdraw',{
					payee: this.payee,
					receivingAccount: this.receivingAccount,
					withdrawalAmount: this.withdrawalAmount,
					withdrawalWay: 1
				}).then(res=>{
					uni.showToast({
						title: '申请提现成功',
					})
					this.getUserInfo()
				})
			}
		}
	}
</script>

<style scoped>
	
</style>
