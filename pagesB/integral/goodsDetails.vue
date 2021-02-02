<template>
	<view class="">
		<!-- 自定义导航 -->
		<u-navbar back-text="返回" 
				title="商品详情"
				back-icon-color="#ff6969"
				:back-text-style="backStyle"
				title-bold>
				<view class="slot-wrap">
					<view @click="share(goodsDesc.id)">
						<u-icon name="zhuanfa" style="margin-right: 30rpx;" color="#ff6969" size="50"></u-icon>
					</view>
				</view>
		</u-navbar>
		<!-- 商品详情轮播图 -->
		<view>
			<u-swiper :list="GoodsDetailSwiper"
						:autoplay="false"
						indicator-pos="bottomRight"
						border-radius="0"
						height="756">
			</u-swiper>
		</view>
		<!-- 商品详情 -->
		<view class="goods-desc-box">
			<view class="goods-desc-name">{{goodsDesc.goodsName}}</view>
			<text>
				{{goodsDesc.goodsIntroduce}}
			</text>
			<view class="goods-desc-price">
				<view class="goods-desc-jg">
					<view class="" v-if="goodsDesc.giveIntegral>0">
						<image src="../static/shop/exist-integral.png" mode="widthFix"></image>
						<text>{{goodsDesc.giveIntegral}}</text>
					</view>
					<view class="" v-if="goodsDesc.goodsPrice>0">
						<text>￥</text>
						<text>{{goodsDesc.goodsPrice}}</text>
					</view>
					<view class="market-price">
						{{goodsDesc.marketPrice}}
					</view>
				</view>
				
				<view class="goods-desc-btn" @click="handleMoreClick(goodsDesc)">
					立即兑换
				</view>
			</view>
		</view>
		<u-gap height="5" bg-color="#eee"></u-gap>
		<!-- 服务 -->
		<view class="goods-desc-fw-box">
			<view class="title">服务</view>
			<view class="lists">
				<view class="txt">
					<u-icon name="checkbox-mark"></u-icon>
					<text style="color: #979797;">包邮</text>
				</view>
				<view class="txt">
					<u-icon name="checkbox-mark"></u-icon>
					<text style="color: #979797;">7天无忧退换</text>
				</view>
			</view>
		</view>
		<u-gap height="20" bg-color="#eee"></u-gap>
		<!-- 更多选择 -->
		<view class="goods-desc-more-box">
			<view class="name">更多选择</view>
			<view class="more"  @click="handleMoreClick(goodsDesc)">
				<u-icon name="arrow-right" size="40" color="#A9A5A0"></u-icon>
			</view>
		</view>
		<u-popup v-model="show" mode="bottom"  border-radius=20>
			<goods-more :data="goodsDesc" :gdata="goodsGg"></goods-more>
		</u-popup>
		<u-gap height="20" bg-color="#eee"></u-gap>
		<!-- 商品评价 -->
		<view class="goods-desc-comment-box" v-if="productReviews.length>0">
			<view class="goods-desc-comment-top">
				<view class="title">
					商品评价
				</view>
				<view class="icon" @click="toGoodsComment()">
					<u-icon name="arrow-right" size="40" color="#A9A5A0"></u-icon>
				</view>
			</view>
			<view class="goods-desc-comment-list">
				<comment-list :commentData="productReviews"></comment-list>
			</view>
		</view>
		
		<!-- 商品属性开始 -->
		<view class="goods-desc-attributes-box">
			<view>
				<u-tabs-swiper ref="uTabs" active-color="#CB0000"
								:list="list" 
								:current="current"
								 @change="tabsChange" 
								 :is-scroll="false"
								swiperWidth="750">
				 </u-tabs-swiper>
			</view>
			<swiper style="height: 100vh;" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="(item, index) in tabs" :key="index">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
						<!-- 商品介绍 -->
						<view class="goods-desc-item" v-if="current==0">
							<block v-for="(item3,index3) in item.list" :key="index3">
								<u-image width="100%" height="60vh" :src="`${baseUrl}${item3}`"></u-image>
							</block>
						</view>
						<!-- 商品参数 -->
						<view class="goods-desc-item" v-else-if="current==1">
							<block v-for="(item2,index2) in item.list" :key="index2">
								<view class="canshu">
									<view class="cs-key">{{item2.goodsParamName}}</view>
									<view class="cs-vlaue">{{item2.goodsParamValue}}</view>
								</view>
							</block>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import goodsMore from '../components/integral/goods-desc-more.vue'
	import commentList from '../components/integral/comment-list.vue'
	export default{
		components:{
			goodsMore,
			commentList
		},
		data(){
			return{
				backStyle:{
					color: '#ff6969'
				},
				// 评论列表分页参数
				page: 1,
				pageSize: 2,
				productReviews: [], //商品评论列表
				show: false, //控制更多选择弹出层显示与隐藏
				contentId: null,
				goodsDesc:{}, //商品详情数据
				goodsGg: [], //商品规格数据
				GoodsDetailSwiper:[],
				list: [{
						name: '商品介绍'
					}, {
						name: '商品参数'
					}
				],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				// 商品属性数据
				tabs:[
					{
						name:'商品介绍',
						list: []
					},
					{
						name:'商品参数',
						list: []
					}
				]
			}
		},
		onLoad(option) {
			this.contentId=option.id
			this.getGoodsDetails()
			this.getProductReviewsList()
		},
		methods:{
			// 商品分享
			share(id){
				this.$store.commit('goods/setGoodsDesc',this.goodsDesc)
				this.$u.route('/pages/share/share', {
					id: id,
				})
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
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
				
			},
			// 商品评价列表
			getProductReviewsList(){
				this.$u.api.productReviewsList({
					page: this.page, 			//是	int	当前页码
					pageSize: this.pageSize, 	//是	int	页码大小
					goodsId: parseInt(this.contentId )	//是	int	商品id
				}).then(res=>{
					if(res.code==200){
						var plImg = []
						res.data.forEach(item=>{
							if(item.commentImages!=null){
								plImg = item.commentImages.split(',')
								item.addPlImg = plImg
							}else{
								console.log('没有图片')
							}
						})
						this.productReviews = res.data
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 去评论列表页面
			toGoodsComment(){
				this.$u.route('/pagesB/integral/commentList', {
					goodsId: this.contentId
				});
			},
			// 商品详情
			getGoodsDetails(){
				this.$u.api.commodityDetails({
					contentId: this.contentId,	
					longitude: this.$store.state.goods.maps.longitude,
					latitude: this.$store.state.goods.maps.latitude,
				}).then(res=>{
					console.log(res)
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
					this.goodsDesc=res.data
					// 商品介绍图转换数组
					let goodsDescriptionStr = res.data.goodsDescription
					this.tabs[0].list = goodsDescriptionStr.split(',')
					// 给商品参数赋值
					this.tabs[1].list = res.data.goodsParams
				})
			},
			// 更多选择
			handleMoreClick(e){
				// console.log(e)
				this.show = true
				this.$u.api.goodsSpecification({
					id: e.id
				}).then(res=>{
					this.goodsGg = res.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.slot-wrap{
		display: flex;
		align-items: center;
		flex: 1;
		justify-content: flex-end;
	}
	.goods-desc-box{
		padding: 20rpx;
		.goods-desc-name{
			font-size: 32rpx;
			margin-bottom: 20rpx;
		}
		text{
			color: #CB0000;
			font-size: $uni-font-size-sm;
		}
		.goods-desc-price{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 10rpx;
			.goods-desc-jg{
				display: flex;
				align-items: center;
				image{
					width: 24rpx;
				}
				text{
					color: #CB0000;
					font-size: 60rpx;
				}
				.market-price{
					text-decoration: line-through;
					color: #979797;
					font-size: 26rpx;
					margin-left: 30rpx;
				}
			}
			.goods-desc-btn{
				background: #FF0000;
				border-radius: 100px;
				color: #FFFFFF;
				text-align: center;
				padding: 8rpx 20rpx;
			}
		}
	}
	.goods-desc-fw-box{
		display: flex;
		padding: 15rpx 20rpx;
		.title{
			font-size: 32rpx;
		}
		.lists{
			margin-left: 40rpx;
			font-size: 24rpx;
			display: flex;
			.txt{
				color: #CB0000;
				margin: 0 50rpx 0  0;
			}
		}
	}
	.goods-desc-more-box{
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		.name{
			font-size: 32rpx;
		}
		// .more{
		// 	background-color: #ccc;
		// 	color: #727C8E;
		// 	width: 40rpx;
		// 	height: 40rpx;
		// 	border-radius: 50%;
		// 	display: flex;
		// 	justify-content: center;
		// 	align-items: center;
		// 	font-weight: bold;
		// 	font-size: 40rpx;
		// }
	}
	// 商品评价
	.goods-desc-comment-box{
		padding: 20rpx;
		.goods-desc-comment-top{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.title{
				font-weight: bold;
			}
			// .icon{
			// 	color: #727C8E;
			// 	width: 40rpx;
			// 	height: 40rpx;
			// 	background: #ccc;
			// 	border-radius: 50%;
			// 	margin-right: 20rpx;
			// 	font-weight: bold;
			// 	display: flex;
			// 	align-items: center;
			// 	justify-content: center;
			// 	font-size: 40rpx;
			// }
		}
		.goods-desc-comment-list{
			
		}
	}
	// 商品属性
	.goods-desc-attributes-box{
		.goods-desc-item{
			padding: 40rpx 0;
			.canshu{
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 24rpx;
				.cs-key{
					border: 2rpx solid #EEEEEE;
					color: #707070;
					width: 200rpx;
					height: 50rpx;
				}
				.cs-vlaue{
					border: 2rpx solid #EEEEEE;
					width: 300rpx;
					height: 50rpx;
				}
			}
		}
	}

</style>
