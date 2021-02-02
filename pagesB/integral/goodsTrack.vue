<template>
	<view class="goods-track-box">
		<view class="goods-track-top" v-for="(item,index) in goodsInfo.orderDetails" :key="index">
			<view class="goods-track-img">
				<image class="goods-img" :src="`${baseUrl}${item.recommendImage}`" mode="aspectFill"></image>
			</view>
			<view class="goods-track-info">
				<view class="gtname">
					{{item.productName}}
				</view>
				<view class="gttime">
					<text class="gttitle">时间：</text>
					<text class="gtvlaue">
						{{$u.timeFormat(goodsInfo.createTime, 'yyyy-mm-dd hh:MM')}}
					</text>
				</view>
				<view class="gttime">
					<text class="gttitle">订单号：</text>
					<text class="gtvlaue">{{goodsInfo.orderName}}</text>
				</view>
				<view class="gttime" v-show="wlIsShow">
					<text class="gttitle">运单号：</text>
					<text class="gtvlaue">{{logisticsInfo.number}}</text>
				</view>
			</view>
		</view>
		<view class="goods-track-content" v-show="wlIsShow">
			<view class="title">
				物流信息
			</view>
			<block v-for="(item,index) in numList" :key="index">
				<view class="goods-track-item">
					<text class="icon"></text>
					<view class="gtlist">
						<text>{{item.status}}</text>
						<text>{{item.time}}</text>
					</view>
				</view>
				<view :class="index===numList.length-1?'active':'line-box'">
					<u-line color="#CECECE" direction="col" length="100rpx" :hair-line="false"/>
				</view>
			</block>
		</view>
	</view>
</template>
<script>
	import { mapState } from 'vuex';
	export default {
		data() {
			return {
				numList: [],
				// 物流信息
				logisticsInfo: {},
				// 控制物流信息是否显示
				wlIsShow:false
			}
		},
		computed:{
			...mapState({
				goodsInfo: state => state.goods.orderDetail
			})
		},
		onLoad() {
			this.getLogisticsInfo()
			console.log(this.goodsInfo)
		},
		methods:{
			// 获取物流信息
			getLogisticsInfo(){
				this.$u.api.logisticsInfo({
					number: this.goodsInfo.orderName
				}).then(res=>{
					if(res.code==200){
						this.numList = res.data.list
						this.logisticsInfo = res.data
						this.wlIsShow = true
					}else{
						uni.showToast({
							title: res.msg,
							icon:"none"
						})
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.goods-track-box{
		padding: 20rpx 50rpx;
		.goods-track-top{
			display: flex;
			margin-bottom: 20rpx;
			.goods-track-img{
				.goods-img{
					height: 140rpx;
					width: 130rpx;
				}
			}
			.goods-track-info{
				padding-left: 20rpx;
				width: 520rpx;
				.gtname{
					font-size: 32rpx;
					font-weight: bold;
					color: #000000;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.gttime{
					padding-top: 10rpx;
					.gttitle{
						font-size: 24rpx;
					}
					.gtvlaue{
						color: #C0C0C0;
						font-size: 22rpx;
					}
				}
			}
		}
		.goods-track-content{
			.title{
				font-size: 24rpx;
				padding: 20rpx 0;
			}
			.goods-track-item{
				display: flex;
				align-items: center;
				.icon{
					flex: 1;
					width: 20rpx;
					height: 20rpx;
					background-color: #0077FF;
					border-radius: 50%;
				}
				.gtlist{
					flex: 30;
					font-size: 24rpx;
					margin-left: 30rpx;
					display: flex;
					flex-direction: column;
				}
			}
			.line-box{
				margin-left: 8rpx;
			}
			.active{
				display: none;
			}
		}
	}
</style>