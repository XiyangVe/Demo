<template>
	<view>
		<view class="font-md text-dark p-2">收费规则</view>
		<view class="bg-light p-2" style="height: 300rpx;">
			<view class="">
				<text>No</text>
				<text>{{info.namingSerialNumber}}</text>
			</view>
			<view class="">
				<text>总金额</text>
				<text>￥{{info.namingPrice}}</text>
			</view>
			<view class="">
				<text>￥{{info.namingPriceOnce}}</text>
				<text>一次</text>
			</view>
		</view>
		<view class="font-md text-dark p-2">广告充值金额</view>
		<view class="flex">
			<view v-for="(item,index) in list" :key="index"
			class="rounded flex align-center justify-center m-2" 
			style="width: 160rpx;height: 88rpx;border: 2rpx solid #0077FF;"
			:class="index===activation ? 'main-bg-color' : ''"
			@click="eventClick(item,index)">
				<text class="font-md" :class="index===activation ? 'text-white' : 'text-dark'">{{item.namingPrice}}</text>
			</view>
		</view>
		<view class="flex justify-center align-center" style="height: 500rpx;">
			<view class="main-bg-color rounded-circle flex align-center justify-center" 
				hover-class="hover-class"
				style="width: 700rpx;height: 100rpx;"
				@click="aliPay()">
				<text class="text-white font-md">立即充值</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				messTypeId: null,
				list: [],
				activation: 0,
				info: {},
				// 消息id
				id: null
			}
		},
		onLoad(e) {
			this.messTypeId = e.messTypeId
			this.id = e.id
			this.getBidding()
		},
		methods:{
			async getBidding(){
				const res = await this.$https.get('/naming/namingByMessTypeId',{messTypeId: this.messTypeId})
				this.list = res.data
				this.info = res.data[0]
			},
			eventClick(item,index){
				this.activation = index
				this.info = item
			},
			aliPay(){
				this.$https.get('/pay/payNaimgPrice',{
					namingSerialNumber: this.info.namingSerialNumber,
					messTypeId:  this.messTypeId,
					namingPrice:  (this.info.namingPrice).toFixed(2),
					namingPriceOnce:  (this.info.namingPriceOnce).toFixed(2),
					messPublishId: this.id
				}).then( res =>{
					uni.requestPayment({
					    provider: 'alipay',
						// 支付宝订单数据
					    orderInfo: res.data,
					    success: (res) => {
							uni.showToast({
								title: "支付成功"
							})
							uni.$emit('update',{msg:'充值成功'})
					    },   
					    fail: (err) => {
							uni.showToast({
								title: "支付失败",
								icon: "none"
							})
					    }
					});
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hover-class{
		background-color: #0000FF !important;
	}
</style>
