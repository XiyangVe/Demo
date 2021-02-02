<template>
	<view class="">
		<view style="padding-bottom: 140rpx;">
			<!-- 商品详情轮播图 -->
			<view>
				<u-swiper 
				:list="GoodsDetailSwiper"
				:autoplay="true"
				indicator-pos="bottomRight"
				border-radius="0"
				height="756">
				</u-swiper>
			</view>
			<!-- 商品参数 -->
			<view>
				<view class="flex justify-between align-center p-3">
					<view class="text-tb-danger">
						<text class="font-sm">￥</text>
						<text class="font-weight-bolder font-lg">{{goodsInfo.goodsPrice}}</text>
					</view>
					<view class="" hover-class="bg-hover-light" @click="share()">
						<u-icon name="zhuanfa" size="40" color="#A9A5A0"></u-icon>
					</view>
				</view>
				<view class="flex align-center px-2">
					<text class="bg-danger text-white rounded px mr-1">自营</text>
					<view class="text-ellipsis-2 flex-5 font-weight-bolder">{{goodsInfo.goodsName}}</view>
				</view>
				<view class="flex align-center border-bottom justify-between p-2 font-sm text-muted">
					<view class="">
						<text>原价:</text>
						<text class="text-through">{{goodsInfo.marketPrice}}</text>
					</view>
					<view class="">
						<text>库存:</text>
						<text>{{goodsInfo.goodsStock}}</text>
					</view>
					<view class="">
						<text>销量:</text>
						<text class="">{{goodsInfo.goodsSaleNum}}</text>
					</view>
				</view>
				<view class="flex align-center justify-between p-2"
					hover-class="bg-hover-light">
					<view class="">
						<text class="text-muted">优惠劵:</text>
						<text class="border border-danger font-sm text-danger rounded px-1 ml-1">满8000.00减300.00</text>
					</view>
					<view class="">
						<u-icon name="arrow-right" size="40" color="#A9A5A0"></u-icon>
					</view>
				</view>
				<view class="flex align-center justify-between p-2 border-bottom" 
					@click="getGoodsParameter"
					hover-class="bg-hover-light" >
					<view>
						<text class="text-muted">已选择</text>
					</view>
					<view>
						<u-icon name="arrow-right" size="40" color="#A9A5A0"></u-icon>
					</view>
				</view>
			</view>
			
			<!-- 商品评论区域 -->
			<view class="merchant-comment-box">
				<view class="flex align-center justify-between p-2"
					hover-class="bg-hover-light text-primary"
					@click="toCommentList">
					<view>
						<text class="font-weight-bolder">评价</text>
					</view>
					<view>
						<u-icon name="arrow-right" size="40" color="#A9A5A0"></u-icon>
					</view>
				</view>
				<!-- 评论列表 -->
				<view class="p-2" v-for="(item,index) in productReviews" :key="item.id">
					<view class="flex align-center">
						<view class="">
							<u-image shape="circle" width="70rpx" height="70rpx" :src="item.headImg ? `${baseUrl}${item.headImg}` : ''"></u-image>
						</view>
						<view class="ml-2">
							<view class="font-sm">
								{{item.userName}}
							</view>
							<view class="font-small text-muted">
								{{item.commentTime | date('yyyy-mm-dd hh:MM:ss')}}
							</view>
						</view>
					</view>
					<!-- 评论具体信息 -->
					<view class="my-1 text-ellipsis-2">
						{{item.commentContent}}
					</view>
					<!-- 评论图片 -->
					<view v-if="item.plImgs">
						<scroll-view scroll-x>
							<view class="flex align-center">
								<block v-for="(img,idx) in item.plImgs" :key="idx">
									<view class="m-2">
										<u-image width="160rpx" height="160rpx" :src="`${baseUrl}${img}`" ></u-image>
									</view>
								</block>
							</view>
						</scroll-view>
					</view>
					<!-- 具体评论的商品规格 -->
					<view class="font-small text-muted">
						{{item.purchasedSpecifications}}
					</view>
				</view>
			</view>
			
			<!-- 商户信息 -->
			<view class="p-2">
				<view class="flex align-center justify-between">
					<view class="flex align-center">
						<view class="">
							<u-image width="100rpx" height="100rpx" :src="storeInfo.logo ? `${baseUrl}${storeInfo.logo}` : '' "></u-image>
						</view>
						<view class="px-1">
							<view class="py">
								<text class="font-weight-bolder">{{storeInfo.shopName}}</text>
								<text class="bg-danger text-white rounded px ml-1">自营</text>
							</view>
							<view class="font-sm text-muted">
								{{storeInfo.followers}}人关注
							</view>
						</view>
					</view>
					<view @click="toShopInfo" hover-class="bg-dark text-white"
						class="bg-taobao-red rounded-circle px-2 py text-white">
						进店
					</view>
				</view>
				<view class="py-2">
					<view class="flex align-center">
						<text class="font-sm text-muted">商品描述:</text>
						<view class="flex-5">
							<u-rate :count="count" disabled v-model="starNum"></u-rate>
						</view>
					</view>
					<view class="flex align-center">
						<text class="font-sm text-muted">卖家服务:</text>
						<view class="flex-5">
							<u-rate :count="count" disabled v-model="starNum"></u-rate>
						</view>
					</view>
					<view class="flex align-center">
						<text class="font-sm text-muted">物流服务:</text>
						<view class="flex-5">
							<u-rate :count="count" disabled v-model="starNum"></u-rate>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		<!-- 底部提交订单栏 -->
		<view class="navigation fixed-bottom">
			<view class="left">
				<view class="item">
					<u-icon name="server-fill" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="font-sm u-line-1">客服</view>
				</view>
				<view class="item">
					<u-icon name="home" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="font-sm u-line-1">店铺</view>
				</view>
				<view class="item car" @click="toShoppingCart">
					<u-badge class="car-num" :count="shoppingCartData.total" type="error" :offset="[-3, -6]"></u-badge>
					<u-icon name="shopping-cart" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="font-sm u-line-1">购物车</view>
				</view>
			</view>
			<view class="right">
				<view class="cart btn u-line-1" @click="getGoodsParameter">加入购物车</view>
				<view class="buy btn u-line-1" @click="getGoodsParameter">立即购买</view>
			</view>
		</view>
		<!-- 选择商品属性弹出层 -->
		<u-popup v-model="isShow" mode="bottom"  border-radius=20>
			<goods-more 
				:data="goodsInfo" 
				:gdata="goodsParameter" 
				:merId="merId"
				:userId="userId"
				@success="changeData">
			</goods-more>
		</u-popup>
	</view>
</template>

<script>
	import goodsMore from '../common/goods-desc-more.vue';
	import { mapState } from 'vuex'
	export default {
		components:{
			goodsMore
		},
		data(){
			return{
				// 商品id
				goodsId: null,
				// 轮播图
				GoodsDetailSwiper:[],
				// 商品详情
				goodsInfo:{},
				// 商品参数
				goodsParameter: [],
				// 商户信息
				storeInfo: {},
				// 商品评论列表
				productReviews: [],
				// 购物车分页
				pagination:{
					page: 1,
					pageSize: 10,
				},
				// 控制弹出层显示与隐藏
				isShow:false,
				// 店铺评分
				count: 5,
				starNum: 4,
				// 是否是分销商品
				merId: null,
				// 分销人id
				userId: null
			}
		},
		computed:{
			...mapState({
				shoppingCartData:state=>state.goods.shoppingCartData,
			})
			
		},
		onLoad(e) {
			if(e.merId){
				this.merId = e.merId
			}
			if(e.userId){
				this.userId = e.userId
			}
			this.goodsId = e.goodsId
			this.getGoodsDetails()
		},
		onShow() {
			this.$store.dispatch('goods/getUserShoppingCart',this.pagination)
		},
		methods:{
			// 获取评论列表
			getCommentList(){
				this.$u.api.productReviewsList({
					page: 1,
					pageSize:2,
					goodsId: parseInt(this.goodsId)
				}).then(res=>{
					var imgArr = []
					res.data.map(item => {
						if(item.commentImages!=null){
							imgArr = item.commentImages.split(',');
							this.$set(item,'plImgs',imgArr)
						}
					})
					this.productReviews = res.data
				})
			},
			// 去评论列表页
			toCommentList(){
				uni.navigateTo({
					url: '/pagesB/integral/commentList?goodsId=' + this.goodsId
				})
			},
			// 商品分享
			share(){
				this.$store.commit('goods/setGoodsDesc',this.goodsInfo)
				this.$u.route('/pages/share/share')
			},
			// 获取商户店铺信息
			getStoreInfo(){
				if(this.merId){
					this.goodsInfo.merId = this.merId
				}
				this.$https.get('/MerchantShop/getStoreInfo',{
					merId: this.goodsInfo.merId
				}).then(res=>{
					this.storeInfo = res.data
				})
			},
			// 去店铺页面
			toShopInfo(){
				uni.navigateTo({
					url: './shopInfo?merId=' + this.goodsInfo.merId
				})
			},
			// 子组件改变父组件的值(隐藏了弹出层)
			changeData(params){
				 this.isShow = params
			 },
			// 获取商品详情
			getGoodsDetails(){
				this.$u.api.commodityDetails({
					contentId: this.goodsId,
					longitude: this.$store.state.goods.maps.longitude,
					latitude: this.$store.state.goods.maps.latitude,
				}).then(res=>{
					// 轮播图数据转换拼接
					let str = res.data.rotationImages
					let arr = str.split(',')
					var lbtlist = []
					for(var i=0;i<arr.length;i++){
						var item = {
							image: `${this.baseUrl}`+arr[i]
						}
						lbtlist.push(item)
						this.GoodsDetailSwiper = lbtlist
					}
					this.goodsInfo = res.data
					// 从商品详情拿到商户id后获取商户信息
					this.getStoreInfo()
					// 获取商品评论列表
					this.getCommentList()
				})
			},
			// 查询商品规格
			getGoodsParameter(){
				this.isShow = true
				this.$u.api.goodsSpecification({
					id: this.goodsId
				}).then(res=>{
					this.goodsParameter = res.data
				})
			},
			// 去用户购物车页面
			toShoppingCart(){
				uni.navigateTo({
					url: './shoppingCart'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.merchant-comment-box{
		border-bottom: 20rpx solid #EEEEEE;
	}
	.navigation {
		display: flex;
		justify-content: space-between;
		border: solid 2rpx #f2f2f2;
		background-color: #ffffff;
		padding: 16rpx 0;
		.left {
			display: flex;
			font-size: 20rpx;
			.item {
				text-align: center;
				margin: 0 20rpx;
				&.car {
					text-align: center;
					position: relative;
					.car-num {
						position: absolute;
						top: -10rpx;
						right: -10rpx;
					}
				}
			}
		}
		.right {
			display: flex;
			font-size: 26rpx;
			align-items: center;
			margin-right: 20rpx;
			.btn {
				line-height: 66rpx;
				padding: 0 30rpx;
				border-radius: 36rpx;
				color: #ffffff;
			}
			.cart {
				background-color: #ed3f14;
				margin-right: 30rpx;
			}
			.buy {
				background-color: #ff7900;
			}
		}
	}
</style>
