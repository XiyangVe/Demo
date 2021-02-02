<template>
	<view>
		<view class="goodsBox u-f-ac">
			<block v-for="(item,index) in goodsList" :key='index'>
				<view class="card" @click="toGoodsDetails(item.id)">
					<view class="pic">
						<u-image :src="`${baseUrl}${item.recommendImage}`" style="width: 100%;height: 100%;"></u-image>
					</view>
					<view class="info">
						<view class="title eps-2">{{item.goodsName}}</view>
						<view class="other u-f-ajs">
							<view class="price text-tb-danger flex align-center">
								<view class="" v-if="item.giveIntegral>0">
									<text>{{item.giveIntegral}}</text>
									<text>积分</text>
								</view>
								<view class="" v-if="item.goodsPrice>0">
									<text>￥</text>
									<text>{{item.goodsPrice}}</text>
								</view>
							</view>
							<view class="number">
								销量<text style="color: red;">{{item.goodsSaleNum}}</text>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default{
		props:['goodsList'],
		data(){
			return{
				
			}
		},
		methods: {
			toGoodsDetails(Id){
				this.$u.route('/pagesB/integral/goodsDetails', {
					id: Id
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.goodsBox{
		display: flex;
		flex-wrap: wrap;
		width: 100vw;
	}
	.card{
		width: 335rpx;
		height: 500rpx;
		margin: 20rpx;
		box-shadow: 1rpx 1rpx 15rpx #c8c9cc;
		padding-bottom: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.pic{
			width: 100%;
			height: 70%;
			margin-bottom: 5rpx;
		}
		.info{
			padding:0 10rpx;
			.title{
				color: #2C405A;
				margin-bottom: 10rpx;
				font-size: 22rpx;
			}
			.other{
				font-size: 24rpx;
				.price{
					flex: 1;
				}
				.number{
					flex: 1;
					display: flex;
					justify-content: flex-end;
				}
			}
	
		}
	}
</style>
