<template>
	<view class="submit-order-box">
		<!-- 头部地址管理 -->
		<view class="submit-order-address">
			<view v-if="addressIsNull">
				<view class="msg-box">
					<text class="uname">{{addressData.recPerson}}</text>
					<text class="uphone">{{addressData.recPersonPhone}}</text>
				</view>
				<view class="uaddress">
					{{addressData.region}}{{addressData.addrDetail}}
				</view>
			</view>
			<view class="address-null" v-else>
				请选择地址
			</view>
			<view class="" @click="toAddress()">
				<u-icon name="arrow-right" size="40" color="#A9A5A0"></u-icon>
			</view>
		</view>
		<!-- 商品参数区域 -->
		<view class="submit-order-desc">
			<block v-for="(item,index) in chekGoodsInfo" :key="index">
				<block v-for="(citem,cindex) in item.orderDetails" :key="cindex">
					<view class="top-box">
						<view class="top-left">
							<u-image width="240rpx" height="240rpx" 
								:src="`${baseUrl}${citem.recommendImage}`">
							</u-image>
						</view>
						<view class="top-right">
							<view class="top-right-bottom">
								<view class="goods-name">
									{{citem.productName}}
								</view>
								<view class="goods-cs">
									{{citem.specification}}
								</view>
							</view>
							<view class="top-right-top flex align-center">
								<view class="jg" v-if="citem.usePoints>0">
									<image src="../static/shop/exist-integral.png" mode=""></image>
									<text>{{citem.usePoints}}</text>
								</view>
								<view class="jg" v-if="citem.productPrice>0">
									<text>￥{{citem.productPrice}}</text>
								</view>
								<view class="ml-3 text-hover-light">
									<text>X{{value}}</text>
								</view>
							</view>
						</view>
					</view>
				</block>
				<view class="bottom-box">
					<view class="flex align-center">
						<text class="">快递费用：</text>
						<text v-if="item.payPostage!=0">￥{{item.payPostage}}</text>
					</view>
					<view class="flex align-center">
						<text class="">备注信息：</text>
						<u-input v-model="remarks" type="text"/>
					</view>
				</view>
			</block>
			<!-- 支付方式 -->
			<view class="p-2" v-if="practicalPrice>0">
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
		</view>
		<!-- 底部按钮提交区域 -->
		<view class="submit-order-btn">
			<view class="flex align-center">
				<view class="sum" v-if="usePoints>0">
					<image class="icon" src="../static/shop/exist-integral.png" mode=""></image>
					<text class="je">{{usePoints}}</text>
				</view>
				<view class="sum" v-if="practicalPrice>0">
					<text class="je">￥{{practicalPrice}}</text>
				</view>
			</view>
			
			<view class="btn" @click="submitOrder()">
				确定兑换
			</view>
		</view>
		<!-- 遮罩层 -->
		<u-mask :show="show" @click="show = false">
			<view class="warp">
				<view class="rect" @tap.stop>
					<image class="yimage" src="../static/shop/subordericon.png" mode="aspectFill"></image>
					<view class="ysusses">
						{{prompt.msg}}
					</view>
					<view class="ymsg">
						正在为你加紧安排商品
					</view>
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				// 是否有地址
				addressIsNull:null,
				// 控制遮罩层显示隐藏
				show: false,
				// 地址数据
				addressData:{},
				// 选择的数量
				value: 1,
				// 选择的商品数据
				chekGoodsInfo:[],
				// 备注
				remarks: '',
				// 兑换成功提示
				prompt:{},
				// 购物车id集合
				cartIds: [],
				// 支付方式
				payMethod: 1,
				// 使用积分
				usePoints: 0,
				// 实际支付金额
				practicalPrice: 0
			}
		},
		onLoad(e) {
			this.cartIds[0] = e.cartIds
			this.value = parseInt(e.goodsCount)
			// this.chekGoodsInfo = this.$store.state.goods.goodsChekInfo
			this.getAddressList()
		},
		onShow() {
			
		},
		methods:{
			/** 积分兑换
			exchange(orderNumber){
				this.$u.api.exchange({
					orderNumber: orderNumber
				}).then(res=>{
					if(res.code==200){
						this.show = true
						this.prompt = res
						setTimeout(function() {
							uni.redirectTo({
								url: 'orders'
							})
						}, 3000)
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			*/
			// 选择支付方式
			radioChange(e){
				this.payMethod = parseInt(e.detail.value)
			},
			// 提交订单
			submitOrder(){
				// 提交订单-积分商城
				this.$https.post('/shopping/submitOrder',{
					addrId: this.addressData.id,
					cartIds: this.cartIds,
					couponId: null,
					remarks:{
						0: this.remarks
					}
				}).then(res=>{
					// 积分商城-订单支付
					this.$https.get('/pay/pointsMallPayment',{
						orderNo: res.data.orderName,
						payMethod: this.payMethod,
					}).then(res=>{
						if(this.payMethod==2){
							this.show = true
							this.prompt = res
							setTimeout(function() {
								uni.redirectTo({
									url: './orders'
								})
							}, 3000)
						}else if(this.payMethod==1){
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
									setTimeout(()=>{
										uni.redirectTo({
											url: 'orders'
										})
									},2000)
							    }
							});
						}else{
							uni.showToast({
								title: '微信支付开发中',
								icon: 'none'
							})
						}
					}).catch(err=>{
						setTimeout(()=>{
							uni.redirectTo({
								url: './orders'
							})
						},2000)
					})
					
				})
				
			},
			// 获取地址列表
			getAddressList(){
				this.$u.api.getAddress().then(res=>{
					if(res.data.length==0){
						this.addressIsNull = false
					}else{
						this.addressIsNull = true
						let arr = res.data
						for(let i=0;i<arr.length;i++){
							if(arr[i].isDefaultAddr==1){
								this.addressData = arr[i]
							}
						}
						this.getOrderInfo()
					}
				})
			},
			// 获取订单金额信息
			getOrderInfo(){
				this.$https.post('/shopping/check',{
					addrId: this.addressData.id,
					cartIds: this.cartIds,
					isIntegralMall: 1
				}).then(res=>{
					this.chekGoodsInfo = res.data
					this.usePoints = res.data[0].usePoints
					this.practicalPrice = res.data[0].practicalPrice
					if(res.data[0].practicalPrice===0){
						this.payMethod = 2
					}
				})
			},
			// 去地址管理页面
			toAddress(){
				uni.navigateTo({
					url: '/pagesB/user/set/address'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.submit-order-box{
		background-color: #eee;
		height: 100vh;
		.submit-order-address{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx 30rpx 30rpx 20rpx;
			border-bottom-left-radius: 30rpx;
			border-bottom-right-radius: 30rpx;
			background-color: #FFFFFF;
			.msg-box{
				.uname{
					font-weight: bold;
				}
				.uphone{
					font-size: 22rpx;
					color: #A2A2A2;
					margin-left: 20rpx;
				}
			}
			.uaddress{
				font-size: 22rpx;
				color: #A2A2A2;
				padding: 15rpx 0;
			}
			.address-null{
				width: 100%;
				text-align: center;
				font-weight: 600;
			}
		}
		.submit-order-desc{
			background-color: #FFFFFF;
			margin-top: 20rpx;
			border-top-left-radius: 30rpx;
			border-top-right-radius: 30rpx;
			.top-box{
				display: flex;
				justify-content: space-between;
				padding: 40rpx 20rpx;
				.top-left{
					width: 240rpx;
					height: 240rpx;
				}
				.top-right{
					margin-left: 20rpx;
					.top-right-top{
						width: 450rpx;
						.jg{
							image{
								width: 36rpx;
								height: 36rpx;
							}
							text{
								color: #FF0000;
								font-size: 40rpx;
								font-weight: bold;
								line-height: 36rpx;
							}
						}
					}
					.top-right-bottom{
						width: 450rpx;
						padding: 20rpx 0;
						.goods-name{
							font-weight: bold;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
							font-size: 20rpx;
						}
						.goods-cs{
							color: #999999;
							font-size: 18rpx;
							padding: 10rpx 0;
						}
					}
				}
				
			}
			.bottom-box{
				padding: 20rpx;
			}
		}
		// 底部按钮提交
		.submit-order-btn{
			position: fixed;
			left: 0;
			bottom: 0;
			height: 140rpx;
			width: 100vw;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx;
			.sum{
				display: flex;
				align-items: center;
				.icon{
					height: 36rpx;
					width: 36rpx;
				}
				.je{
					color: #FF0000;
					font-size: 40rpx;
					font-weight: bold;
					margin-left: 10rpx;
				}
			}
			.btn{
				color: #fff;
				background-color: #FF0000;
				height: 80rpx;
				width: 300rpx;
				border-radius: 40rpx;
				font-weight: bold;
				text-align: center;
				line-height: 80rpx;
			}
			.btn-disable{
				color: #fff;
				background-color: #ccc;
				height: 80rpx;
				width: 300rpx;
				border-radius: 40rpx;
				font-weight: bold;
				text-align: center;
				line-height: 80rpx;
			}
		}
		// 遮罩层
		.warp {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			.rect {
				width: 188px;
				height: 148px;
				background: #000000;
				opacity: 0.5;
				border-radius: 10px;
				color: #FFFFFF;
				font-weight: bold;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.yimage{
					height: 100rpx;
					width: 100rpx;
				}
				.ysusses{
					padding: 20rpx;
				}
			}
		}
		
	}
</style>
