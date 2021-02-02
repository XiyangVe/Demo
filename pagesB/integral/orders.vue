<template>
	<view>
		<!-- 搜素 -->
		<view class="search-top">
			<u-search v-model="keyword" @custom='topSearch'></u-search>
		</view>
		<!-- 订单列表 -->
		<view>
			<view>
				<u-tabs-swiper ref="uTabs" :list="list" 
							:current="current" 
							@change="tabsChange" 
							:is-scroll="false"
							active-color="#f40"
							swiperWidth="750">
				 </u-tabs-swiper>
			</view>
			<swiper style="height: 100vh;" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="(item,index) in orderList" :key="index">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
						<block v-for="(item2,index2) in item.list" :key="index2">
							<view class="order-content" @click="toOrderDetails(item2)">
								<view class="order-content-left">
									<u-image width="180rpx" height="180rpx"
										:src="`${baseUrl}${item2.orderDetails[0].recommendImage}`">
									</u-image>
								</view>
								<view class="order-content-right">
									<view class="order-state-icon">
										<text v-if="item2.orderState==3">待付款</text>
										<text v-else-if="item2.orderState==1">待收货</text>
										<text v-else-if="item2.orderState==0">待发货</text>
										<text v-else-if="item2.orderState==2">已收货</text>
										<text v-else-if="item2.orderState==4">已取消</text>
									</view>
									<view class="product-name">
										{{item2.orderDetails[0].productName}}
									</view>
									<view class="order-state-type">
										{{item2.orderDetails[0].specification}}
									</view>
									<view class="">
										<view class="" v-if="item2.usePoints>0">
											<text class="font-sm">积分：</text>
											<text class="font-weight-bolder">{{item2.usePoints}}</text>
										</view>
										<view class="" v-if="item2.practicalPrice>0">
											<text class="font-weight-bolder">￥{{item2.practicalPrice}}</text>
										</view>
									</view>
									<view class="btn-box" v-if="item2.orderState==1">
										<text class="btn-l" @click.stop="toLogisticsInfo(item2)">查看物流</text>
										<text class="btn-r" @click.stop="confirm(item2.orderName)">确定收货</text>
									</view>
									<view class="btn-box" v-else-if="item2.orderState==0">
										<!-- <text class="btn-l">催一下</text>
										<text class="btn-r" @click.stop="confirm(item2.orderName)">确定收货</text> -->
									</view>
									<view class="btn-box" v-else-if="item2.orderState==2">
										<!-- <text class="btn-l">去评价</text> -->
										<!-- <text class="btn-r">申请售后</text> -->
									</view>
									<view class="btn-box" v-else-if="item2.orderState==3">
										<text class="btn-l" @click.stop="cancelOrder(item2.orderName)">取消订单</text>
										<text class="btn-r">去支付</text>
									</view>
									<view class="btn-box" v-else-if="item2.orderState==4">
										
									</view>
								</view>
							</view>
						</block>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 加载动画 -->
		<view class="loading-show-box">
			<u-loading mode="circle" color="#f40" size="100" :show="loadingShow"></u-loading>
		</view>
		<!-- 上拉加载更多 -->
		<u-loadmore :status="status" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				orderState: null,
				status: 'loadmore',
				// 控制加载中显示隐藏
				loadingShow: false,
				page: 1,
				pageSize: 10,
				list: [
					{
						name: '全部'
					},
					{
						name: '待付款'
					},
					{
						name: '待发货'
					},
					{
						name: '待收货'
					},
					{
						name: '已收货'
					}
				],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				orderList:[
					{
						name: '全部',
						list:[]
					},
					{
						name: '待付款',
						list:[]
					},
					{
						name: '待发货',
						list:[]
					},
					{
						name: '待收获',
						list:[]
					},
					{
						name: '已收货',
						list:[]
					}
				],
			
			}
		},
		onLoad() {
			this.orderTracking()
		},
		methods:{
			// 去物流信息页面
			toLogisticsInfo(orderDetail){
				this.$store.commit('goods/setOrderDetails',orderDetail)
				this.$u.route('/pagesB/integral/goodsTrack')
			},
			// 去订单详情页面
			toOrderDetails(orderDetail){
				this.$store.commit('goods/setOrderDetails',orderDetail)
				uni.navigateTo({
					url: './orderDetail'
				})
			},
			// 取消订单
			cancelOrder(orderNo){
				this.loadingShow = true
				this.$u.api.cancelOrder({
					orderNo: orderNo
				}).then(res=>{
					if(res.code==200){
						this.clearArr()
						this.orderTracking()
						this.loadingShow = false
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 确认收货
			confirm(orderNo){
				this.loadingShow = true
				this.$u.api.confirmReceipt({
					orderNo: orderNo
				}).then(res=>{
					if(res.code==200){
						this.clearArr()
						this.orderTracking()
						this.loadingShow = false
					}
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				})
			},
			// 积分订单查询
			orderTracking(){
				this.$u.api.orderTracking({
					orderState: this.orderState,
					orderName: this.keyword,
					isIntegralMall: 1,
					page: this.page,
					pageSize: this.pageSize
				}).then(res=>{
					this.orderList[0].list = this.orderList[0].list.concat(res.data)
					
					if(this.swiperCurrent==1){
						this.orderList[1].list = this.orderList[1].list.concat(res.data)
					}else if(this.swiperCurrent==2){
						this.orderList[2].list = this.orderList[2].list.concat(res.data)
					}else if(this.swiperCurrent==3){
						this.orderList[3].list = this.orderList[3].list.concat(res.data)
					}else if(this.swiperCurrent==4){
						this.orderList[4].list = this.orderList[4].list.concat(res.data)
					}
					// 判断是否还有下一页
					if(res.data.length<this.pageSize){
						this.status="nomore"
					}
				})
			},
			// 清除每个分类订单数据
			clearArr(){
				this.orderList[0].list = []
				this.orderList[1].list = []
				this.orderList[2].list = []
				this.orderList[3].list = []
				this.orderList[4].list = []
			},
			// 顶部搜素
			topSearch(e){
				this.clearArr()
				this.orderTracking()
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
				
				this.page = 1
				this.status = 'loadmore'
				this.orderState = ''
				this.keyword = ''
				this.orderList[index].list = []
				
				if(index==1){
					this.orderState = 3
				}else if(index==2){
					this.orderState = 0
				}else if(index==3){
					this.orderState = 1
				}else if(index==4){
					this.orderState = 2
				}
				this.orderTracking()
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				if(this.status==="nomore"){
					return;
				}
				this.status = 'loading';
				this.page = ++ this.page;
				this.orderTracking()
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	// 搜素
	.search-top{
		padding: 20rpx;
	}
	// 加载动画
	.loading-show-box{
		position: absolute;
		top: 50%;
		left: 50%;
	}
	// 订单列表
	.order-content{
		width: 94vw;
		margin: 10rpx 3vw 40rpx 3vw;
		box-shadow: 0px 0px 6px rgba(167, 167, 167, 0.16);
		opacity: 1;
		border-radius: 10px;
		display: flex;
		justify-content: space-between;
		.order-content-left{
			padding: 20rpx 30rpx;
		}
		.order-content-right{
			position: relative;
			width: 60vw;
			padding: 20rpx 0;
			.order-state-icon{
				color: #FF6969;
				font-size: 20rpx;
				position: absolute;
				right: 6rpx;
				top: 0;
			}
			.product-name{
				font-size: 22rpx;
				padding-top: 20rpx;
				font-weight: bold;
			}
			.order-state-type{
				font-size: 18rpx;
				color: #979797;
				padding: 10rpx 0;
			}
			.btn-box{
				display: flex;
				justify-content: space-around;
				align-items: center;
				padding: 15rpx 0;
				font-size: 20rpx;
				.btn-l{
					border: 1px solid #DBDBDB;
					border-radius: 20px;
					color: #979797;
					padding: 6rpx 15rpx;
				}
				.btn-r{
					color: #FF6969;
					border: 1px solid #FF6969;
					border-radius: 20px;
					padding: 6rpx 15rpx;
				}
			}
		}
	}
</style>
