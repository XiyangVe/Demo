<template>
	<view>
		<!-- <view class="title">企业定制</view> -->
		<view class="goods-box u-f-ac">
			<block v-for="(item,index) in goodsSortList" :key="index">
				<view class="item" @click="toGoodsDesc(item)">
					<view class="pic">
						<u-image :src="`${baseUrl}${item.sortImage}`"
									width="100%"
									mode="widthFix">
						</u-image>
					</view>
					<view class="u-f-ajc">
						{{item.sortName}}
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			goodsSortList:{
				type: Array,
				default:function(){
					return []
				}
			}
		},
		methods:{
			toGoodsDesc(item){
				// console.log(item)
				this.$u.route('/pagesB/integral/goodsList', {
					id: item.id
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.goods-box{
		border-radius: 15rpx;
		background-color: #FFFFFF;
		padding:10rpx 0rpx;
		flex-wrap: wrap;
		.item{
			width: 156rpx;
			margin: 10rpx;
			.pic{
				height:152rpx;
				width: 142rpx;
				border: 2rpx dotted #ccc;
			}
		}
		.item:nth-child(3n-1){
			margin: 0;
		}
	}
</style>
