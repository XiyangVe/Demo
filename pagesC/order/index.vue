<template>
	<view>
		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs-swiper activeColor="#f29100" ref="tabs" :list="list" :current="current" @change="change" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
			</view>
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page-box" v-if="orderList[0].length>0">
							<view class="order" v-for="(res, index) in orderList[0]" :key="res.id">
								<view class="top">
									<view class="left" @click="toShop(res)">
										<u-icon name="home" :size="30" color="rgb(94,94,94)"></u-icon>
										<view class="store">{{ res.shopName }}</view>
										<u-icon name="arrow-right" color="rgb(203,203,203)" :size="26"></u-icon>
									</view>
									<view class="right" v-if="res.orderState==1&&res.refundStatus==0">待收货</view>
									<view class="right" v-else-if="res.orderState==0&&res.refundStatus==0">待发货</view>
									<view class="right" v-else-if="res.orderState==2&&res.refundStatus==0">已完成</view>
									<view class="right" v-else-if="res.orderState==3&&res.refundStatus==0">待付款</view>
									<view class="right" v-else-if="res.orderState==4&&res.refundStatus==0">已取消</view>
									<view class="right" v-else-if="res.refundStatus==1">申请退款</view>
									<view class="right" v-else-if="res.refundStatus==2">拒绝退款</view>
									<view class="right" v-else-if="res.refundStatus==3">退款成功</view>
								</view>
								
								<view class="item" v-for="(item, index) in res.orderDetails" :key="index" @click="toOrderDesc(res)">
									<view class="left"><image :src="`${baseUrl}${item.recommendImage}`" mode="aspectFill"></image></view>
									<view class="content">
										<view class="title u-line-2">{{ item.productName }}</view>
										<view class="delivery-time">{{ item.specification }}</view>
									</view>
									<view class="right">
										<view class="price">
											￥
											<text class="decimal">{{item.productPrice.toFixed(2)}}</text>
										</view>
										<view class="number">x{{ item.num }}</view>
									</view>
								</view>
								<view class="total">
									共{{res.orderProductCount}}件商品 合计:
									<text class="total-price">
										￥
										<text class="decimal">{{res.orderPrices.toFixed(2)}}</text>
									</text>
								</view>
								
								<view class="bottom">
									<view v-if="res.orderState==1" @click="toLogisticsInfo(res)" class="logistics btn" hover-class="hover-styles">查看物流</view>
									<view v-if="res.orderState==1" @click="confirmReceipt(res)" class="logistics btn" hover-class="hover-styles">确认收货</view>
									<view v-if="res.orderState==3" @click="cancelOrder(res)" class="evaluate btn" hover-class="hover-styles">取消订单</view>
								</view>
							</view>
							<u-loadmore :status="loadStatus[0]" bgColor="#f2f2f2"></u-loadmore>
						</view>
						<view class="page-box" v-else>
							<view>
								<view class="centre">
									<image src="https://cdn.uviewui.com/uview/template/taobao-order.png" mode=""></image>
									<view class="explain">
										您还没有相关的订单
										<view class="tips">可以去看看有那些想买的</view>
									</view>
									<view class="btn">随便逛逛</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;">
						<view class="page-box" v-if="orderList[1].length>0">
							<view class="order" v-for="(res, index) in orderList[1]" :key="res.id">
								<view class="top">
									<view class="left">
										<u-icon name="home" :size="30" color="rgb(94,94,94)"></u-icon>
										<view class="store">{{ res.shopName }}</view>
										<u-icon name="arrow-right" color="rgb(203,203,203)" :size="26"></u-icon>
									</view>
									<view class="right" v-if="res.orderState==1&&res.refundStatus==0">待收货</view>
									<view class="right" v-else-if="res.orderState==0&&res.refundStatus==0">待发货</view>
									<view class="right" v-else-if="res.orderState==2&&res.refundStatus==0">已完成</view>
									<view class="right" v-else-if="res.orderState==3&&res.refundStatus==0">待付款</view>
									<view class="right" v-else-if="res.orderState==4&&res.refundStatus==0">已取消</view>
									<view class="right" v-else-if="res.refundStatus==1">申请退款</view>
									<view class="right" v-else-if="res.refundStatus==2">拒绝退款</view>
									<view class="right" v-else-if="res.refundStatus==3">退款成功</view>
								</view>
								
								<view class="item" v-for="(item, index) in res.orderDetails" :key="index" @click="toOrderDesc(res)">
									<view class="left"><image :src="`${baseUrl}${item.recommendImage}`" mode="aspectFill"></image></view>
									<view class="content">
										<view class="title u-line-2">{{ item.productName }}</view>
										<view class="delivery-time">{{ item.specification }}</view>
									</view>
									<view class="right">
										<view class="price">
											￥
											<text class="decimal">{{ item.payPrice }}</text>
										</view>
										<view class="number">x{{ item.num }}</view>
									</view>
								</view>
								<view class="total">
									共{{res.orderProductCount}}件商品 合计:
									<text class="total-price">
										￥
										<text class="decimal">{{res.orderPrices}}</text>
									</text>
								</view>
								
								<view class="bottom">
									<view v-if="res.orderState==1" @click="toLogisticsInfo(res)" class="logistics btn" hover-class="hover-styles">查看物流</view>
									<view v-if="res.orderState==3" @click="cancelOrder(res)" class="evaluate btn" hover-class="hover-styles">取消订单</view>
								</view>
							</view>
							<u-loadmore :status="loadStatus[1]" bgColor="#f2f2f2"></u-loadmore>
						</view>
						<view class="page-box" v-else>
							<view>
								<view class="centre">
									<image src="https://cdn.uviewui.com/uview/template/taobao-order.png" mode=""></image>
									<view class="explain">
										您还没有相关的订单
										<view class="tips">可以去看看有那些想买的</view>
									</view>
									<view class="btn">随便逛逛</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;">
						<view class="page-box" v-if="orderList[2].length>0">
							<view class="order" v-for="(res, index) in orderList[2]" :key="res.id">
								<view class="top">
									<view class="left">
										<u-icon name="home" :size="30" color="rgb(94,94,94)"></u-icon>
										<view class="store">{{ res.shopName }}</view>
										<u-icon name="arrow-right" color="rgb(203,203,203)" :size="26"></u-icon>
									</view>
									<view class="right" v-if="res.orderState==1&&res.refundStatus==0">待收货</view>
									<view class="right" v-else-if="res.orderState==0&&res.refundStatus==0">待发货</view>
									<view class="right" v-else-if="res.orderState==2&&res.refundStatus==0">已完成</view>
									<view class="right" v-else-if="res.orderState==3&&res.refundStatus==0">待付款</view>
									<view class="right" v-else-if="res.orderState==4&&res.refundStatus==0">已取消</view>
									<view class="right" v-else-if="res.refundStatus==1">申请退款</view>
									<view class="right" v-else-if="res.refundStatus==2">拒绝退款</view>
									<view class="right" v-else-if="res.refundStatus==3">退款成功</view>
								</view>
								
								<view class="item" v-for="(item, index) in res.orderDetails" :key="index" @click="toOrderDesc(res)">
									<view class="left"><image :src="`${baseUrl}${item.recommendImage}`" mode="aspectFill"></image></view>
									<view class="content">
										<view class="title u-line-2">{{ item.productName }}</view>
										<view class="delivery-time">{{ item.specification }}</view>
									</view>
									<view class="right">
										<view class="price">
											￥
											<text class="decimal">{{ item.payPrice }}</text>
										</view>
										<view class="number">x{{ item.num }}</view>
									</view>
								</view>
								<view class="total">
									共{{res.orderProductCount}}件商品 合计:
									<text class="total-price">
										￥
										<text class="decimal">{{res.orderPrices}}</text>
									</text>
								</view>
								
								<view class="bottom">
									<view v-if="res.orderState==1" @click="toLogisticsInfo(res)" class="logistics btn" hover-class="hover-styles">查看物流</view>
									<view v-if="res.orderState==3" @click="cancelOrder(res)" class="evaluate btn" hover-class="hover-styles">取消订单</view>
								</view>
							</view>
							<u-loadmore :status="loadStatus[2]" bgColor="#f2f2f2"></u-loadmore>
						</view>
						<view class="page-box" v-else>
							<view>
								<view class="centre">
									<image src="https://cdn.uviewui.com/uview/template/taobao-order.png" mode=""></image>
									<view class="explain">
										您还没有相关的订单
										<view class="tips">可以去看看有那些想买的</view>
									</view>
									<view class="btn">随便逛逛</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;">
						<view class="page-box" v-if="orderList[3].length>0">
							<view class="order" v-for="(res, index) in orderList[3]" :key="res.id">
								<view class="top">
									<view class="left">
										<u-icon name="home" :size="30" color="rgb(94,94,94)"></u-icon>
										<view class="store">{{ res.shopName }}</view>
										<u-icon name="arrow-right" color="rgb(203,203,203)" :size="26"></u-icon>
									</view>
									<view class="right" v-if="res.orderState==1&&res.refundStatus==0">待收货</view>
									<view class="right" v-else-if="res.orderState==0&&res.refundStatus==0">待发货</view>
									<view class="right" v-else-if="res.orderState==2&&res.refundStatus==0">已完成</view>
									<view class="right" v-else-if="res.orderState==3&&res.refundStatus==0">待付款</view>
									<view class="right" v-else-if="res.orderState==4&&res.refundStatus==0">已取消</view>
									<view class="right" v-else-if="res.refundStatus==1">申请退款</view>
									<view class="right" v-else-if="res.refundStatus==2">拒绝退款</view>
									<view class="right" v-else-if="res.refundStatus==3">退款成功</view>
								</view>
								
								<view class="item" v-for="(item, index) in res.orderDetails" :key="index" @click="toOrderDesc(res)">
									<view class="left"><image :src="`${baseUrl}${item.recommendImage}`" mode="aspectFill"></image></view>
									<view class="content">
										<view class="title u-line-2">{{ item.productName }}</view>
										<view class="delivery-time">{{ item.specification }}</view>
									</view>
									<view class="right">
										<view class="price">
											￥
											<text class="decimal">{{ item.payPrice }}</text>
										</view>
										<view class="number">x{{ item.num }}</view>
									</view>
								</view>
								<view class="total">
									共{{res.orderProductCount}}件商品 合计:
									<text class="total-price">
										￥
										<text class="decimal">{{res.orderPrices}}</text>
									</text>
								</view>
								
								<view class="bottom">
									<view v-if="res.orderState==1" @click="toLogisticsInfo(res)" class="logistics btn" hover-class="hover-styles">查看物流</view>
									<view v-if="res.orderState==1" @click="confirmReceipt(res)" class="logistics btn" hover-class="hover-styles">确认收货</view>
									<view v-if="res.orderState==3" @click="cancelOrder(res)" class="evaluate btn" hover-class="hover-styles">取消订单</view>
								</view>
							</view>
							<u-loadmore :status="loadStatus[3]" bgColor="#f2f2f2"></u-loadmore>
						</view>
						<view class="page-box" v-else>
							<view>
								<view class="centre">
									<image src="https://cdn.uviewui.com/uview/template/taobao-order.png" mode=""></image>
									<view class="explain">
										您还没有相关的订单
										<view class="tips">可以去看看有那些想买的</view>
									</view>
									<view class="btn">随便逛逛</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [
				{
					name: '全部'
				},
				{
					name: '待付款',
				},
				{
					name: '待发货'
				},
				{
					name: '待收货'
				}
			],
			orderList: [[], [], [], []],
			current: 0,
			swiperCurrent: 0,
			loadStatus: ['loadmore','loadmore','loadmore','loadmore'],
			// 查询订单参数
			fromData: {
				isIntegralMall: 0,
				page: 1,
				pageSize: 5
			}
			
		};
	},
	onLoad() {
		this.getOrderList();
	},
	methods: {
		// 订单列表
		getOrderList(){
			this.$https.post('/shopping/orderTracking',this.fromData).then(res=>{
				res.data.map(item=>{
					this.orderList[0].push(item)
					if(item.orderState === 3){
						this.orderList[1].push(item)
					}else if(item.orderState === 0){
						this.orderList[2].push(item)
					}else if(item.orderState === 1){
						this.orderList[3].push(item)
					}
				})
				if(this.fromData.pageSize > res.data.length){
					return this.loadStatus.splice(this.current,1,"nomore")
				}
				this.loadStatus.splice(this.current,1,"loadmore")
			})
		},
		// 分页(上拉加载更多)
		reachBottom() {
			if(this.loadStatus[this.current] == 'nomore') return;
			this.loadStatus.splice(this.current,1,"loading")
			setTimeout(() => {
				this.fromData.page ++
				this.getOrderList();
			}, 1200);
		},
		// 跳转到对应的店铺
		toShop(e){
			uni.navigateTo({
				url: '/pagesC/mall/shopInfo?merId=' + e.commercialId
			})
		},
		// 查看订单详情
		toOrderDesc(orderInfo){
			this.$store.commit('goods/setOrderDetails',orderInfo)
			uni.navigateTo({
				url: './orderInfo'
			})
		},
		// 查看物流信息
		toLogisticsInfo(e){
			this.$store.commit('goods/setOrderDetails',e)
			uni.navigateTo({
				url: '/pagesB/integral/goodsTrack'
			})
		},
		// 确定收货
		confirmReceipt(e){
			this.$u.api.confirmReceipt({
				orderNo: e.orderName
			}).then(res=>{
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
				if(res.code==200){
					this.orderList[0] = []
					this.orderList[3] = []
					setTimeout(()=>{
						this.getOrderList()
					},2000)
				}
			})
		},
		// 取消订单
		cancelOrder(e){
			this.$u.api.cancelOrder({
				orderNo: e.orderName
			}).then(res=>{
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
				if(res.code==200){
					this.orderList[0] = []
					this.orderList[1] = []
					setTimeout(()=>{
						this.getOrderList()
					},2000)
				}
			})
		},
		// tab栏切换
		change(index) {
			this.swiperCurrent = index;
		},
		transition(e) {
			let dx = e.detail.dx;
			this.$refs.tabs.setDx(dx);
		},
		animationfinish({ detail: { current } }) {
			this.$refs.tabs.setFinishCurrent(current);
			this.swiperCurrent = current;
			this.current = current;
		}
	}
};
</script>

<style>
/* #ifndef H5 */
page {
	height: 100%;
	background-color: #f2f2f2;
}
/* #endif */
</style>

<style lang="scss" scoped>
.order {
	width: 710rpx;
	background-color: #ffffff;
	margin: 20rpx auto;
	border-radius: 20rpx;
	box-sizing: border-box;
	padding: 20rpx;
	font-size: 28rpx;
	.top {
		display: flex;
		justify-content: space-between;
		.left {
			display: flex;
			align-items: center;
			.store {
				margin: 0 10rpx;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
		.right {
			color: $u-type-warning-dark;
		}
	}
	.item {
		display: flex;
		margin: 20rpx 0 0;
		.left {
			margin-right: 20rpx;
			image {
				width: 200rpx;
				height: 200rpx;
				border-radius: 10rpx;
			}
		}
		.content {
			.title {
				font-size: 28rpx;
				line-height: 50rpx;
			}
			.delivery-time {
				color: #e5d001;
				font-size: 24rpx;
			}
		}
		.right {
			margin-left: 10rpx;
			padding-top: 20rpx;
			text-align: right;
			.decimal {
				font-size: 24rpx;
				margin-top: 4rpx;
			}
			.number {
				color: $u-tips-color;
				font-size: 24rpx;
			}
		}
	}
	.total {
		margin-top: 20rpx;
		text-align: right;
		font-size: 24rpx;
		.total-price {
			font-size: 32rpx;
		}
	}
	.bottom {
		display: flex;
		margin-top: 40rpx;
		padding: 0 10rpx;
		justify-content: space-between;
		align-items: center;
		.btn {
			line-height: 52rpx;
			width: 160rpx;
			border-radius: 26rpx;
			border: 2rpx solid $u-border-color;
			font-size: 26rpx;
			text-align: center;
			color: $u-type-info-dark;
		}
		.evaluate {
			color: $u-type-warning-dark;
			border-color: $u-type-warning-dark;
		}
	}
}
.centre {
	text-align: center;
	margin: 200rpx auto;
	font-size: 32rpx;
	image {
		width: 164rpx;
		height: 164rpx;
		border-radius: 50%;
		margin-bottom: 20rpx;
	}
	.tips {
		font-size: 24rpx;
		color: #999999;
		margin-top: 20rpx;
	}
	.btn {
		margin: 80rpx auto;
		width: 200rpx;
		border-radius: 32rpx;
		line-height: 64rpx;
		color: #ffffff;
		font-size: 26rpx;
		background: linear-gradient(270deg, rgba(249, 116, 90, 1) 0%, rgba(255, 158, 1, 1) 100%);
	}
}
.wrap {
	display: flex;
	flex-direction: column;
	height: calc(100vh - var(--window-top));
	width: 100%;
}
.swiper-box {
	flex: 1;
}
.swiper-item {
	height: 100%;
}
</style>
