<template>
	<view class="goods-comment-box">
		<view class="goods-comment-content">
			<!-- 头部商品 -->
			<view class="goods-comment-top">
				<view class="img">
					<image :src="`${baseUrl}${orderInfo.recommendImage}`" mode="aspectFill"></image>
				</view>
				<view class="msg-info">
					<view class="name">
						{{orderInfo.productName}}
					</view>
					<view class="info">
						{{orderInfo.specification}}
					</view>
				</view>
			</view>
			<!-- 评论框 -->
			<view class="goods-comment-input">
				<u-input v-model="commentContent" :type="type" :height="height" :auto-height="autoHeight" />
			</view>
			<!-- 图片上传 -->
			<view class="goods-comment-upload">
				<u-upload ref="uUpload" :auto-upload="false" max-count="6"></u-upload>
			</view>
			<!-- 评分 -->
			<view class="goods-comment-rate">
				<view class="rate-item">
					<view class="rate-title">商品评分</view>
					<u-rate size="40" @change="goodsChange" :count="count" v-model="valueGoods"></u-rate>
				</view>
				<view class="rate-item">
					<view class="rate-title">服务评分</view>
					<u-rate size="40" @change="serviceChange" :count="count" v-model="valueService"></u-rate>
				</view>
			</view>
			<!-- 提交按钮 -->
			<view class="goods-comment-btn" @click="orderRate()">
				立即发表
			</view>
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	export default {
		data() {
			return {
				// orderInfo: {},
				// 评论框参数
				commentContent: '',
				type: 'textarea',
				height: 300,
				autoHeight: true,
				// 评分参数
				count: 5,
				valueGoods: 4,
				valueService: 4,
				isAdditional: 0
			}
		},
		computed:{
			...mapState({
				orderInfo: state => state.goods.commentGoodsInfo
			})
		},
		onLoad() {
			// this.orderInfo = this.$store.state.goods.orderDetail
			// console.log(this.orderInfo)
			// 判断是否为追评
			if(this.orderInfo.isComment==1){
				this.isAdditional = 1
			}
		},
		methods: {
			orderRate() {
				//获取所有选择的列表
				let imgList = this.$refs.uUpload.lists.map((v, index) => {
					return {
						name: `${index}`,
						uri: v.url,
					}
				})
				this.$myMethod.orderRate(imgList, {
					orderId: this.orderInfo.id,   //	是	int	订单详情id
					goodsId: this.orderInfo.goodsId,   //	是	int	商品id
					goodsScore: this.valueGoods,   //	是	int	商品分数；1-5分
					serviceScore: this.valueService,   //	是	int	服务分数；1-5分
					commentContent: this.commentContent,   //	否	String	评价内容
					isAdditional: this.isAdditional,   //	是	int	是否追评；0：否；1：是
					//file: '',   //	否	int	评论图片，可以多张
				}).then(res => {
					if(res.code==200){
						this.$refs.uToast.show({
							title: res.msg,
							duration: 3000,
							url: '/pagesB/integral/commentList',
							params: {
								goodsId: this.orderInfo.goodsId
							}
						}) 
					}else{
						this.$refs.uToast.show({
							title: res.msg,
							duration: 3000,
							type: 'error'
						})
					}
				}).catch(res => {
					console.log(res)
				})
			},
			// 商品评分
			goodsChange(e) {
				this.valueGoods = e
			},
			// 服务评分
			serviceChange(e) {
				this.valueService = e
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #eee;
	}

	.goods-comment-box {

		.goods-comment-content {
			margin-top: 30rpx;
			padding: 20rpx;
			background-color: #FFFFFF;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;

			.goods-comment-top {
				display: flex;
				align-items: center;

				.img {
					height: 92rpx;
					width: 92rpx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}

				.msg-info {
					margin-left: 20rpx;
					width: 80vw;

					.name {
						font-weight: bold;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.info {
						padding-top: 16rpx;
						color: #979797;
						font-size: 22rpx;
					}
				}
			}

			.goods-comment-input {
				margin: 30rpx 0;
				background-color: #F8FBFF;
			}

			.goods-comment-upload {}

			.goods-comment-rate {
				padding: 30rpx 0;

				.rate-item {
					display: flex;
					align-items: center;
					padding: 10rpx 0;

					.rate-title {
						font-size: 32rpx;
						font-weight: bold;
						margin-right: 20rpx;
					}
				}
			}

			.goods-comment-btn {
				width: 710rpx;
				height: 76rpx;
				line-height: 76rpx;
				background: #FF0000;
				border-radius: 38rpx;
				font-size: 32rpx;
				text-align: center;
				color: #FFFFFF;
				position: fixed;
				bottom: 3vh;
			}
		}
	}
</style>
