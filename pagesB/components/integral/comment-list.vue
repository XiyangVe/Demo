<template>
	<!-- 商品详情评论组件 -->
	<view class="goods-detail-comment-box">
		<block v-for="(item,index) in commentData" :key="index">
			<view class="goods-detail-comment-item" @click="toGoodsComment(item)">
				<view class="goods-detail-comment-top">
					<view class="headImg">
						<image class="y-img" :src="`${baseUrl}${item.headImg}`" mode="aspectFill"></image>
					</view>
					<view class="user-info">
						<view class="name">
							{{item.userName}}
						</view>
						<view class="time">
							{{$u.timeFormat(item.commentTime,'yyyy-mm-dd')}}
						</view>
					</view>
				</view>
				<view class="goods-detail-comment-content">
					{{item.commentContent}}
				</view>
				<view class="goods-detail-comment-img" v-if="item.commentImages!=null">
					<block v-for="(item2,index2) in item.addPlImg" :key="index2">
						<image class="pl-img" :src="`${baseUrl}${item2}`" mode="aspectFill"></image>
					</block>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default{
		props:{
			commentData:Array
		},
		data(){
			return{
				
			}
		},
		methods:{
			// 去评论列表页面
			toGoodsComment(goods){
				this.$u.route('/pagesB/integral/commentList', {
					goodsId: goods.goodsId
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods-detail-comment-box{
		.goods-detail-comment-item{
			padding: 30rpx 0;
			.goods-detail-comment-top{
				display: flex;
				.headImg{
					width: 70rpx;
					height: 70rpx;
				}
				.user-info{
					margin-left: 20rpx;
					.name{
						font-weight: bold;
					}
					.time{
						color: #979797;
					}
				}
			}
			.goods-detail-comment-content{
				overflow : hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			.goods-detail-comment-img{
				width: 100vw;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				.pl-img{
					width: 21vw;
					height: 160rpx;
					padding: 8rpx 1vw;
				}
			}
		}
		
	}
</style>
