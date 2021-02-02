<template>
	<view class="">
		<!-- 头部地址确认 -->
		<view class="flex align-center justify-between py-2 px-3 rounded-bottom" 
			style="border-bottom: 20rpx solid #EEEEEE;"
			@click="toUserAddress"
			hover-class="bg-light">
			<view class="flex-5" v-if="isAddr">
				<view class="font-weight-bolder">
					<text>{{userAddress.recPerson}}</text>
					<text class="ml-2">{{userAddress.recPersonPhone}}</text>
				</view>
				<view class="py-1">
					<text class="bg-taobao-red text-white font-small rounded p" v-if="userAddress.isDefaultAddr==1">默认</text>
					<text class="bg-primary text-white font-small rounded p mx-1">{{userAddress.addrTag}}</text>
					<text class="font-sm">{{userAddress.region}}</text>
				</view>
				<view class="">
					<text class="font-sm">{{userAddress.addrDetail}}</text>
				</view>
			</view>
			<view class="py-2" v-else>
				设置收货地址
			</view>
			<view class="flex-1 text-right">
				<u-icon name="arrow-right"></u-icon>
			</view>
			
		</view>
		<!-- 商品订单信息区域 -->
		<block v-for="(item,index) in orderList" :key="index">
			<view class="">
				<view class="flex align-center p-2">
					<u-icon name="bag"></u-icon>
					<text class="px-1">{{item.shopName}}</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
				<block v-for="(citem,cindex) in item.orderDetails" :key="cindex">
					<view class="border-top p-2 flex">
						<view class="flex-2">
							<u-image width="200rpx" height="200rpx" :src="citem.recommendImage ? `${baseUrl}${citem.recommendImage}` : ''"></u-image>
						</view>
						<view class="flex-4">
							<view class="text-ellipsis-2">
								{{citem.productName}}
							</view>
							<view class="my-2 font-sm">
								{{citem.specification}}
							</view>
							<view class="">
								<text class="text-tb-danger">￥{{citem.productPrice}}</text>
								<text class="ml-2">X{{citem.num}}</text>
							</view>
						</view>
					</view>
				</block>
			</view>
			<!-- 其他信息区域 -->
			<view class="p-2" style="border-bottom: 20rpx solid #EEEEEE;">
				<view class="flex align-center justify-between py-1">
					<text>快递费用</text>
					<text>￥{{item.payPostage}}</text>
				</view>
				<view class="flex align-center py-1">
					<text class="flex-1">备注信息</text>
					<view class="flex-4">
						<input v-model="item.remarks" type="text" @click="focus(item.commercialId)" placeholder="选填备注信息"/>
					</view>
				</view>
			</view>
		</block>
		<!-- 支付方式 -->
		<view class="p-2" style="padding-bottom: 110rpx;">
			<text>支付方式</text>
			<radio-group @change="radioChange">
				<view class="flex align-center justify-between py-2">
					<view class="flex align-center">
						<u-icon name="zhifubao-circle-fill" color="#2b85e4" size="50"></u-icon>
						<text class="ml-2">支付宝支付</text>
					</view>
					<view class="">
						<radio value="1" checked="1"></radio>
					</view>
				</view>
				<view class="flex align-center justify-between py-2">
					<view class="flex align-center">
						<u-icon name="weixin-circle-fill" color="#19be6b" size="50"></u-icon>
						<text class="ml-2">微信支付</text>
					</view>
					<view class="">
						<radio value="0"></radio>
					</view>
				</view>
			</radio-group>
		</view>
		<!-- 底部结算订单区域 -->
		<view style="height: 110rpx;"
			class="p-2 flex align-center justify-between fixed-bottom bg-white">
			<view class="">
				<text class="font-sm">合计:</text>
				<text class="text-tb-danger">￥{{totalPrice}}</text>
			</view>
			<view class="">
				<button size="mini"
				hover-class="bg-danger"
				class="rounded-circle bg-taobao-red text-white"
				@click="toOrderList"
				>立即结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	export default {
		computed:{
			...mapState({
				cartIds:state=>state.goods.cartIds,
				addrId: state => state.goods.addrId
			})
		},
		data(){
			return{
				// 用户地址
				userAddress:{},
				// 是否设置了收货地址
				isAddr: null,
				// 订单详情列表
				orderList: [],
				// 支付总价格
				totalPrice: 0,
				// 支付方式
				payMethod: 1,
				// 生成的订单号
				orderNo: ''
			}
		},
		onLoad() {
			this.getAddress()
		},
		onShow() {
			
		},
		methods:{
			// 获取用户收货地址
			getAddress(){
				this.$u.api.getAddress().then(res=>{
					if(res.data.length === 0){
						return this.isAddr = false
					}else{
						this.isAddr = true
					}
					res.data.forEach(item=>{
						if(this.addrId==null){
							if(item.isDefaultAddr==1){
								this.userAddress = item
								this.getConfirmOrderInfo()
								return;
							}
						}else{
							if(this.addrId == item.id){
								this.userAddress = item
								this.getConfirmOrderInfo()
								return;
							}
						}
					})
				})
			},
			// 去用户收货地址管理界面
			toUserAddress(){
				uni.navigateTo({
					url: '/pagesB/user/set/address?type=' + 'mall'
				})
			},
			// 选择支付方式
			radioChange(e){
				this.payMethod = parseInt(e.detail.value)
			},
			// 确认订单金额相关信息
			getConfirmOrderInfo(){
				this.$https.post('/shopping/check',{
					addrId: this.userAddress.id,
					cartIds: this.cartIds,
					isIntegralMall: 0
				}).then(res=>{
					this.orderList = res.data
					var num = []
					res.data.map(item=>{
						num.push(item.practicalPrice)
					})
					this.totalPrice = eval(num.join("+"))
				}).catch(err=>{
					console.log(err)
				})
			},
			// 备注信息
			focus(id){
				console.log(id)
				console.log(this.orderList)
			},
			// 下单
			toOrderList(){
				var that = this;
				this.$https.post('/shopping/placeAnOrder',{
					addrId: this.userAddress.id,
					cartIds: this.cartIds,
					couponId: null,
					remarks:{
						
					}
				}).then(res=>{
					that.orderNo = res.data[0].orderSoleId
					this.$https.get('/pay/payOrder',{
						orderNo: res.data[0].orderSoleId,
						payMethod: this.payMethod,
					}).then(res=>{
						if(this.payMethod==1){
							uni.requestPayment({
							    provider: 'alipay',
							    orderInfo: res.data, //支付宝订单数据
							    success: function (res) {
							        uni.showToast({
							        	title: '支付成功',
							        })
									setTimeout(()=>{
										uni.redirectTo({
											url: '/pagesC/order/index'
										})
									},2000)
							    },
							    fail: function (err) {
							        uni.showToast({
							        	title: '支付失败',
							        	icon: 'none'
							        })
									that.$https.get('/pay/splitOrder',{
										orderNo: that.orderNo
									}).then(res=>{
										setTimeout(()=>{
											uni.redirectTo({
												url: '/pagesC/order/index'
											})
										},2000)
									})
							    }
							});
						}else{
							uni.showToast({
								title: '微信支付开发中',
								icon: 'none'
							})
						}
					}).catch(err=>{
						that.$https.get('/pay/splitOrder',{
							orderNo: that.orderNo
						}).then(res=>{
							setTimeout(()=>{
								uni.redirectTo({
									url: '/pagesC/order/index'
								})
							},2000)
						})
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
