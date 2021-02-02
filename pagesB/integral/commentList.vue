<template>
	<view class="goods-pl-list-box">
		<!-- 评论列表 -->
		<block v-for="(item,index) in productReviews" :key="index">
			<view class="goods-pl-item" @click="toPlDesc(item)">
				<view class="goods-pl-item-top">
					<view class="userinfo-left">
						<view class="user-tx">
							<image class="y-img" :src="`${baseUrl}${item.headImg}`" mode="aspectFill"></image>
						</view>
						<view class="user-name">
							{{item.userName}}
						</view>
					</view>
					<view class="time-right">
						{{$u.timeFormat(item.commentTime,'yyyy-mm-dd')}}
					</view>
				</view>
				<view class="goods-pl-item-content">
					<view class="goods-pl-item-content-top">
						<u-rate size="40" :disabled="true" :count="count" v-model="item.goodsScore"></u-rate>
						<text class="gtype">{{item.purchasedSpecifications}}</text>
					</view>
					<view class="comment-content">
						{{item.commentContent}}
					</view>
				</view>
				<view class="goods-pl-item-img" v-if="item.commentImages!=null">
					<block v-for="(img,index2) in item.addPlImg" :key="index2">
						<image class="pl-img" :src="`${baseUrl}${img}`" mode="aspectFill"></image>
					</block>
				</view>
				<!-- 追加评论（在评论列表只显示一条） -->
				<view class="goods-add-to-lp" v-if="item.review.length>0">
					<view class="title">
						追加评论
					</view>
					<view class="content">
						{{item.review[0].commentContent}}
					</view>
					<view class="imgs" v-if="item.review[0].commentImages!=null">
						<block v-for="(img2,index3) in item.review[0].addPlImg2" :key="index3">
							<image :src="`${baseUrl}${img2}`" mode="aspectFill"></image>
						</block>
					</view>
				</view>
			</view>
		</block>
		<!-- 上拉加载更多 -->
		<u-loadmore :status="status" />
		
	</view>
	
</template>

<script>
	export default{
		data(){
			return{
				page: 1,
				pageSize: 10,
				status: 'loadmore', //控制分页参数
				productReviews: [],
				count: 5, //控制评分分数最多显示
				goodsId: null
			}
		},
		onLoad(e) {
			this.getProductReviewsList(e.goodsId)
			this.goodsId=e.goodsId
		},
		methods:{
			// 点开评论详情
			toPlDesc(item){
				this.$store.commit('goods/setGoodsPlInfo',item)
				this.$u.route('/pagesB/integral/commentDesc')
			},
			// 获取评论列表
			getProductReviewsList(goodsId){
				this.$u.api.productReviewsList({
					page: this.page, 			//是	int	当前页码
					pageSize: this.pageSize, 	//是	int	页码大小
					goodsId: parseInt(goodsId)	//是	int	商品id
				}).then(res=>{
					if(res.code==200){
						var plImg = []
						res.data.forEach(item=>{
							if(item.commentImages==null){
								
							}else{
								plImg = item.commentImages.split(',')
								item.addPlImg = plImg	
							}
							// 判断追加评论是否有图片
							if(item.review.length>0){
								var plImg2 = []
								item.review.forEach(item2=>{
									if(item2.commentImages==null){
										console.log('追加评论没有图片')
									}else{
										plImg2 = item2.commentImages.split(',')
										item2.addPlImg2 = plImg2
									}
								})
							}
						})
						this.productReviews = this.productReviews.concat(res.data)
						// 判断是否还有下一页
						if(res.data.length<this.pageSize){
							this.status="nomore"
						}
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
		},
		// 上拉加载更多
		onReachBottom() {
			if(this.status==="nomore"){
				console.log('没有更多了')
			}else{
				this.status = 'loading';
				this.page = ++ this.page;
				this.getProductReviewsList(this.goodsId)
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.goods-pl-list-box{
		background-color: #eee;
		width: 100vw;
		height: 100vh;
		.goods-pl-item{
			background-color: #FFFFFF;
			padding: 20rpx;
			margin-bottom: 20rpx;
			border-radius: 30rpx;
			.goods-pl-item-top{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.userinfo-left{
					display: flex;
					align-items: center;
					.user-tx{
						width: 70rpx;
						height: 70rpx;
					}
					.user-name{
						font-weight: bold;
						margin-left: 10rpx;
					}
				}
				.time-right{
					color: #979797;
				}
				
			}
			.goods-pl-item-content{
				padding: 20rpx 0;
				.goods-pl-item-content-top{
					.gtype{
						font-size: 22rpx;
						color: #979797;
						margin-left: 30rpx;
					}
				}
				.comment-content{
					width: 710rpx;
				}
			}
			.goods-pl-item-img{
				.pl-img{
					width: 21vw;
					height: 160rpx;
					padding: 10rpx 1vw;
				}
			}
			// 追加评论
			.goods-add-to-lp{
				.title{
					color: #FF0000;
					font-weight: 600;
					padding: 20rpx 0;
				}
				.content{
					
				}
			}
		}
	}
</style>
