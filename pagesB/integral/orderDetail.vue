<template>
	<view class="">
		<!-- 订单详情头部 -->
		<view class="order-detail-top">
			<!-- 物流 -->
			<view class="order-detail-track" v-show="isShow">
				<view class="track-left">
					<view class="track-icon">
						<image src="../static/shop/track.png" mode="aspectFill"></image>
					</view>
					<view class="track-desc">
						<view class="msg">
							{{newsWlInfo.status}}
						</view>
						<view class="tdate">{{newsWlInfo.time}}</view>
					</view>
				</view>
				<view class="track-right" @click="toTrack()">></view>
			</view>
			<!-- 地址 -->
			<view class="order-detail-orderaddr">
				<view>
					<image class="addricon" src="../static/shop/address.png" mode="aspectFill"></image>
				</view>
				<view class="orderaddr-info">
					<view class="adrtop">
						<text class="adrname">{{orderInfo.userName}}</text>
						<text class="adrphone">{{orderInfo.userPhone}}</text>
					</view>
					<view class="adrbottom">
						{{orderInfo.orderAddr}}
					</view>
				</view>
			</view>
		</view>
		<!-- 间隔槽 -->
		<u-gap height="20" bg-color="#eee"></u-gap>
		<!-- 订单详情 -->
		<view class="order-detail-box">
			<view class="order-detail-top">
				订单编号：{{orderInfo.orderName}}
			</view>
			<block v-for="(item,index) in orderInfo.orderDetails" :key="index">
				<view class="order-detail-content" @click="toGoodsDetail(item)">
					<view class="order-detail-img">
						<u-image border-radius="20rpx" width="100%" height="100%" :src="`${baseUrl}${item.recommendImage}`"></u-image>
					</view>
					<view class="order-detail-desc">
						<view class="odrname">
							{{item.productName}}
						</view>
						<view class="odrcanshu">
							<text>{{item.specification}}</text>
							<view>
								<text>X</text>
								<text class="num">{{item.num}}</text>
							</view>
						</view>
						<view class="odrnum-box">
							<view class="icon-jg" v-if="item.usePoints>0">
								<image class="icon" src="../static/shop/exist-integral.png" mode="aspectFill"></image>
								<text class="jg">{{item.usePoints}}</text>
							</view>
							<view v-if="item.payPrice>0"
								class="text-tb-danger font-weight-bolder" style="font-size: 40rpx;">
								￥{{item.payPrice}}
							</view>
							<view class="btn-box" v-if="orderInfo.orderState==2">
								<text class="btn" @click.stop="toGoodsComment(item)" v-if="item.isComment==0">
									去评论
								</text>
								<text class="btn" v-else @click.stop="toGoodsComment(item)">
									追加评论
								</text>
							</view>
						</view>
					</view>
				</view>
			</block>
			<!-- 优惠总价区域 -->
			<view class="order-detail-count-box">
				<view class="order-detail-count-item">
					<text class="title">优惠：</text>
					<text>无</text>
				</view>
				<view class="order-detail-count-item">
					<text class="title">邮费：</text>
					<text>￥{{orderInfo.payPostage}}</text>
				</view>
				<view class="order-detail-count-item">
					<text class="title">商品总价：</text>
					<view class="flex align-center">
						<view class="r" v-if="orderInfo.usePoints>0">
							<image src="../static/shop/exist-integral.png" mode=""></image>
							<text>{{orderInfo.usePoints}}</text>
						</view>
						<view class="" v-if="orderInfo.orderPrices>0">
							<text>￥{{orderInfo.orderPrices}}</text>
						</view>
					</view>
				</view>
				<view class="order-detail-count-item">
					<text class="title">实际支付：</text>
					<view class="flex align-center">
						<view class="r" v-if="orderInfo.usePoints>0">
							<image src="../static/shop/exist-integral.png" mode=""></image>
							<text>{{orderInfo.usePoints}}</text>
						</view>
						<view class="" v-if="orderInfo.practicalPrice>0">
							<text>￥{{orderInfo.practicalPrice}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 未付款状态订单去付款区域 -->
		<!-- 支付方式 -->
		<view class="p-2" v-if="orderInfo.orderState==3">
			<view v-if="orderInfo.practicalPrice>0">
				<text>支付方式</text>
				<radio-group @change="radioChange">
					<view class="flex align-center justify-between py-2">
						<view class="flex align-center">
							<u-icon name="weixin-circle-fill" color="#19be6b" size="50"></u-icon>
							<text class="ml-2">微信支付</text>
						</view>
						<view class="">
							<radio value="0"></radio>
						</view>
					</view>
					<view class="flex align-center justify-between py-2">
						<view class="flex align-center">
							<u-icon name="zhifubao-circle-fill" color="#2b85e4" size="50"></u-icon>
							<text class="ml-2">支付宝支付</text>
						</view>
						<view class="">
							<radio value="1" checked="1"></radio>
						</view>
					</view>
				</radio-group>
			</view>
			<!-- 支付 -->
			<view class="flex justify-end my-2">
				<view class="free-border rounded-circle px-4 py-1 text-tb-danger" 
					@click="pay"
					hover-class="bg-taobao-red text-white">
					支付
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	export default{
		data(){
			return{
				// 控制头部物流信息是否显示
				isShow:false, 
				// 物流信息
				newsWlInfo:{},
				// 支付方式
				payMethod: 1,
			}
		},
		computed:{
			...mapState({
				orderInfo: state => state.goods.orderDetail
			})
		},
		onLoad() {
			if(this.orderInfo.orderState==1){
				this.getLogisticsInfo()
			}
			if(this.orderInfo.practicalPrice==0){
				this.payMethod = 2
			}
			console.log(this.orderInfo)
		},
		methods:{
			// 选择支付方式
			radioChange(e){
				this.payMethod = parseInt(e.detail.value)
			},
			// 积分商城-订单支付
			pay(){
				this.$https.get('/pay/pointsMallPayment',{
					orderNo: this.orderInfo.orderName,
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
										url: 'orders'
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
					}else if(this.payMethod==0){
						uni.showToast({
							title: '微信支付开发中',
							icon: 'none'
						})
					}else{
						uni.showToast({
							title: '支付成功',
						})
						setTimeout(()=>{
							uni.redirectTo({
								url: 'orders'
							})
						},2000)
					}
				})
			},
			// 去商品详情页面
			toGoodsDetail(item){
				this.$u.route('/pagesB/integral/goodsDetails',{
					id: item.goodsId
				})
			},
			// 去物流信息页面
			toTrack(){
				uni.navigateTo({
					url: 'goodsTrack'
				})
			},
			// 获取物流信息
			getLogisticsInfo(){
				this.$u.api.logisticsInfo({
					number: this.orderInfo.orderName
				}).then(res=>{
					if(res.code==200){
						this.newsWlInfo = res.data.list[0]
						this.isShow=true
					}else{
						console.log('还没做物流真实数据渲染')
					}
				})
			},
			// 去评论商品
			toGoodsComment(e){
				this.$store.commit('goods/getCommentGoodsInfo',e)
				uni.navigateTo({
					url: 'goodsComment'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.free-border{
		border: 2rpx solid #ccc;
	}
	// 订单详情头部
	.order-detail-top{
		padding: 20rpx;
		// 物流
		.order-detail-track{
			padding-bottom: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.track-left{
				width: 80vw;
				display: flex;
				align-items: center;
				.track-icon{
					image{
						width: 70rpx;
						height: 70rpx;
					}
				}
				.track-desc{
					padding-left: 20rpx;
					font-size: 20rpx;
					.msg{
						color: #0077FF;
						padding-bottom: 10rpx;
					}
					.tdate{
						color: #A2A2A2;
					}
				}
			}
			.track-right{
				height: 40rpx;
				width: 40rpx;
				background-color: #F2F2F2;
				color: #727C8E;
				font-weight: 900;
				border-radius: 50%;
				text-align: center;
				line-height: 40rpx;
			}
		}
		// 地址
		.order-detail-orderaddr{
			display: flex;
			align-items: center;
			.addricon{
				width: 70rpx;
				height: 70rpx;
			}
			.orderaddr-info{
				padding-left: 20rpx;
				.adrtop{
					.adrname{
						color: #000000;
						font-weight: bold;
					}
					.adrphone{
						color: #979797;
						font-size: 22rpx;
						padding-left: 30rpx;
					}
				}
				.adrbottom{
					color: #FF6969;
					font-size: 20rpx;
					padding-top: 10rpx;
				}
			}
			
		}
	}
	// 订单详情
	.order-detail-box{
		padding: 20rpx;
		.order-detail-top{
			color: #A2A2A2;
			font-size: 20rpx;
		}
		.order-detail-content{
			display: flex;
			padding: 30rpx 0;
			.order-detail-img{
				width: 240rpx;
				height: 240rpx;
				flex: 4;
			}
			.order-detail-desc{
				flex: 7;
				padding: 0 20rpx;
				.odrname{
					color: #000000;
					font-size: 26rpx;
				}
				.odrcanshu{
					color: #979797;
					font-size: 20rpx;
					padding: 20rpx 0;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.num{
						font-size: 40rpx;
					}
				}
				.odrnum-box{
					.icon-jg{
						display: flex;
						align-items: center;
						.icon{
							width: 36rpx;
							height: 36rpx;
						}
						.jg{
							color: #FF4400;
							font-size: 40rpx;
							font-weight: bold;
						}
					}
					.btn-box{
						
						.btn{
							display: block;
							width: 164rpx;
							height: 48rpx;
							border: 2rpx solid #707070;
							border-radius: 40rpx;
							color: #979797;
							text-align: center;
						}
					}
				}
			}
		}
		// 优惠邮费总价
		.order-detail-count-box{
			.order-detail-count-item{
				display: flex;
				justify-content: space-between;
				padding-bottom: 40rpx;
				.title{
					color: #979797;
				}
				.r{
					display: flex;
					align-items: center;
					image{
						width: 36rpx;
						height: 36rpx;
						margin-right: 10rpx;
					}
				}
			}
		}
	}
</style>
