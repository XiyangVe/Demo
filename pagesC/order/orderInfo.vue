<template>
	<view class="">
		<!-- 退款失败提示区域 -->
		<view class="p-2 flex align-center tips-icon" v-if="orderInfo.refundStatus==2">
			<u-icon name="info-circle" color="#fff" size="50"></u-icon>
			<text class="font-sm text-white ml-2">{{orderInfo.refundNotCause}}</text>
		</view>
		<!-- 头部收货地址 -->
		<view class="flex align-center p-2" style="border-bottom: 18rpx solid #EEEEEE;">
			<view>
				<u-icon name="map-fill" color="#f40" size="50"></u-icon>
			</view>
			<view class="ml-2">
				<view class="mb-1">
					<text class="mr-2">{{orderInfo.userName}}</text>
					<text class="text-muted font-sm">{{orderInfo.userPhone}}</text>
				</view>
				<view>
					<text class="font-sm">{{orderInfo.orderAddr}}</text>
				</view>
			</view>
		</view>
		
		<!-- 商品数据区域 -->
		<view class="p-2" style="padding-bottom: 100rpx;">
			<view class="flex align-center" @click="toShop(orderInfo)">
				<u-icon name="home" size="30" color="rgb(94,94,94)"></u-icon>
				<view class="mx-1 font-weight-bolder">{{orderInfo.shopName}}</view>
				<u-icon name="arrow-right" color="rgb(203,203,203)" size="26"></u-icon>
			</view>
			<block v-for="(item,index) in orderInfo.orderDetails">
				<view class="flex justify-between" @click="toGoodsDetails(item.goodsId)">
					<view class="py-2 flex flex-3">
						<view class="flex-1">
							<u-image width="150rpx" height="150rpx" :src="`${baseUrl}${item.recommendImage}`"></u-image>
						</view>
						<view class="ml-1 flex-2">
							<view class="font-sm font-weight-bolder text-ellipsis" style="width: 350rpx;">
								{{item.productName}}
							</view>
							<view class="font-small text-muted my-1">
								{{item.specification}}
							</view>
							<view class="border rounded-circle text-center py shadow" 
								hover-class="hover-styles"
								style="width: 100rpx"
								v-if="orderInfo.orderState == 2"
								@click.stop="toComment(item)">
								<text class="font-sm">评价</text>
							</view>
						</view>
					</view>
					<view class="flex-1 flex flex-column align-end">
						<view class="font-sm font-weight-bolder">
							<text>￥</text>
							<text>{{item.productPrice}}</text>
						</view>
						<view class="font-sm text-muted mt-2">
							<text>x</text>
							<text>{{item.num}}</text>
						</view>
					</view>
				</view>
			</block>
			<!-- 运费&&总价区域 -->
			<view class="mt-5">
				<view class="flex align-center justify-between font-sm text-muted">
					<text>商品总价</text>
					<text>￥{{orderInfo.orderPrices}}</text>
				</view>
				<view class="flex align-center justify-between font-sm text-muted my-2">
					<text>邮费</text>
					<text>￥{{orderInfo.postage}}</text>
				</view>
				<view class="flex align-center justify-between font-sm">
					<text class="text-muted">需付款</text>
					<text class="text-tb-danger font-weight-bolder">￥{{orderInfo.practicalPrice}}</text>
				</view>
			</view>
		</view>
		
		<!-- 支付方式 -->
		<view class="p-2" style="padding-bottom: 100rpx;" v-if="orderInfo.orderState===3">
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
		<!-- 底部按钮区域 -->
		<view class="fixed-bottom flex justify-end">
			<view class="p-2" v-if="orderInfo.orderState===3">
				<u-button @click="pay" shape="circle" size="medium">付款</u-button>
			</view>
			<view class="p-2" v-else-if="orderInfo.orderState==1||orderInfo.orderState==0">
				<u-button @click="toRefund" type="error" shape="circle" size="medium">申请退款</u-button>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	export default {
		computed:{
			...mapState({
				orderInfo: state => state.goods.orderDetail
			})
		},
		data(){
			return{
				// 支付方式
				payMethod: 1
			}
		},
		onLoad() {
			console.log(this.orderInfo)
		},
		methods:{
			// 商品评论
			toComment(e){
				this.$store.commit('goods/getCommentGoodsInfo',e)
				uni.navigateTo({
					url: '/pagesB/integral/goodsComment'
				})
			},
			// 选择支付方式
			radioChange(e){
				this.payMethod = parseInt(e.detail.value)
			},
			// 付款
			pay(){
				this.$https.get('/pay/payOrder',{
					orderNo: this.orderInfo.orderSoleId,
					payMethod: this.payMethod,
				}).then(res=>{
					console.log(res)
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
						    }
						});
					}else{
						uni.showToast({
							title: '微信支付开发中',
							icon: 'none'
						})
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			// 跳转到对应的店铺
			toShop(e){
				uni.navigateTo({
					url: '/pagesC/mall/shopInfo?merId=' + e.commercialId
				})
			},
			// 查看商品详情
			toGoodsDetails(goodsId){
				this.$u.route('/pagesC/mall/goodsDetails', {
					goodsId: goodsId
				})
			},
			// 去售后服务
			toRefund(){
				uni.navigateTo({
					url: '/pagesC/order/refund'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.tips-icon{
		background-image: linear-gradient(to bottom right, red, yellow);
	}
</style>
