<template>
	<view class="goods-desc-component-box">
		<!-- 商品规格头部区域 -->
		<view class="goods-desc-component-top">
			<view class="">
				<u-image v-if="!isShow" height="240" width="240" :src="`${baseUrl}${data.recommendImage}`" ></u-image>
				<u-image v-else height="240" width="240" :src="`${baseUrl}${commodityInfo.goodsPropertyImage}`" ></u-image>
			</view>
			<view class="goods-desc-component-top-right">
				<view class="" v-if="isShow">
					<view class="text-ellipsis-2">
						{{commodityInfo.goodsName}}
					</view>
					<view class="py-2">
						库存：{{commodityInfo.goodsPropertyStock}}
					</view>
				</view>
				<view class="" v-else>
					<view class="text-ellipsis-2">
						{{data.goodsName}}
					</view>
					<view class="py-2">
						库存：{{data.goodsStock}}
					</view>
				</view>
				<view class="">
					<view class="flex align-center" v-if="data.giveIntegral>0||commodityInfo.usePoints>0">
						<image src="../../static/shop/exist-integral.png" mode="aspectFill"></image>
						<view v-if="!isShow" class="jg">{{data.giveIntegral}}</view>
						<view v-else class="jg">{{commodityInfo.usePoints}}</view>
					</view>
					<view v-if="data.goodsPrice>0||commodityInfo.goodsPropertyPrice>0"
						class="flex align-center text-tb-danger font-lg font-weight-bolder">
						<view class="">
							￥
						</view>
						<view class="" v-if="!isShow">
							{{data.goodsPrice}}
						</view>
						<view class="" v-else>
							{{commodityInfo.goodsPropertyPrice}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 商品规格内容区域 -->
		<view class="goods-desc-component-content">
			<block v-for="(item,index) in gdata" :key="index">
				<view class="item">
					<view class="item-title">
						{{item.goodsPropertyName}}
					</view>
					<!-- :class="item.goodsSizes[i]==active?'item-active':'item-child'" -->
					<view class="item-child-box">
						<block v-for="(item2,index2) in item.goodsSizes" :key="index2">
							<view class="item-child" @click="selectClick(index,index2,item2)"
								:class="{'item-active':item2.id===iac[index]}">
								{{item2.goodsPropertyValue}}
							</view>
						</block>
					</view>
				</view>
			</block>
		</view>
		<!-- 数量&立即兑换区域 -->
		<view class="goods-desc-component-num">
			<view class="numbox">
				<view class="title">
					数量
				</view>
				<view class="num-box">
					<view class="del-icon" @click="del">
						<u-icon name="minus-circle"></u-icon>
					</view>
					<view class="num-sl">{{value}}</view>
					<view class="add-icon" @click="add">
						<u-icon name="plus-circle"></u-icon>
					</view>
				</view>
			</view>
			<view class="btn" @click="toSubmitOrder()" v-if="isShow">
				立即兑换
			</view>
			<view class="nobtn" v-else>
				立即兑换
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			data:Object,
			gdata: Array
		},
		data(){
			return{
				iac:[],
				value: 1,
				isShow: false,
				commodityInfo:{}
			}
		},
		methods:{
			// 去订单确认页面(做了添加到购物车操作)
			toSubmitOrder(){
				this.$https.post('/cart/add',{
					cartNum: this.value,
					goodsId: this.commodityInfo.goodsId,
					priceId: this.commodityInfo.id,
					isNew: 1
				}).then(res=>{
					this.$u.route('pagesB/integral/submitOrder',{
						goodsCount: this.value,
						cartIds: res.data
					})
				})
			},
			// 商品数量减少
			del(){
				if(this.value==1){
					return
				}
				this.value --
			},
			// 商品数量增加
			add(){
				this.value ++
			},
			// 选择商品规格添加到数组
			selectClick(index,index2,item2){
				// this.iac[index] = index2
				this.iac[index] = item2.id
				this.iac = this.iac.concat([])
				if(this.gdata.length==this.iac.length){
					this.getChekCommodityInfo(item2.goodsId)
				}
			},
			// 查询选择了规格的商品
			getChekCommodityInfo(id){
				let arr = this.iac
				let str = arr.join(",")
				this.$u.api.getChekCommodityInfo({
					goodsId: id,
					goodsPropertyOnlyValue:str
				}).then(res=>{
					if(res.code==200){
						this.isShow = true
						this.commodityInfo = res.data
						this.$store.commit('goods/setChekGoodsInfo',res.data)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	// 头部
	.goods-desc-component-top{
		display: flex;
		padding: 20rpx;
		.goods-desc-component-top-right{
			margin-left: 15rpx;
			image{
				width: 36rpx;
				height: 36rpx;
			}
			.jg{
				font-size: 40rpx;
				font-weight: bold;
				color: #FF4400;
				margin-left: 10rpx;
			}
		}
		
	}
	// 商品规格内容样式
	.goods-desc-component-content{
		padding: 20rpx;
		.item{
			display: flex;
			flex-direction: column;
			.item-title{
				font-size: 32rpx;
				font-weight: bold;
			}
			.item-child-box{
				display: flex;
				flex-wrap: wrap;
				.item-child{
					border-radius: 30rpx;
					background: #eee;
					padding: 15rpx 20rpx;
					text-align: center;
					margin: 30rpx 40rpx 30rpx 0;
				}
				.item-active{
					border: 1px solid #D4341E;
					color: #FF0000;
					border-radius: 30rpx;
					background: #FCEDEA;
					padding: 13rpx 20rpx;
					text-align: center;
					margin: 30rpx 40rpx 30rpx 0;
				}
			}
		}
	}
	// 数量&立即兑换
	.goods-desc-component-num{
		padding: 0 20rpx;
		.numbox{
			display: flex;
			justify-content: space-between;
			.title{
				font-weight: bold;
				font-size: 32rpx;
			}
			.num-box{
				display: flex;
				align-items: center;
				.del-icon{
					background-color: #EEEEEE;
					padding: 0 10rpx;
				}
				.num-sl{
					background-color: #EEEEEE;
					margin: 0 10rpx;
					padding: 0 10rpx;
				}
				.add-icon{
					background-color: #EEEEEE;
					padding: 0 10rpx;
				}
			}
		}
		.btn{
			width: 700rpx;
			height: 80rpx;
			line-height: 80rpx;
			background: #FF0000;
			opacity: 1;
			border-radius: 40rpx;
			color: #FFFFFF;
			text-align: center;
			margin: 30rpx 0;
		}
		.nobtn{
			width: 700rpx;
			height: 80rpx;
			line-height: 80rpx;
			background: #ccc;
			opacity: 1;
			border-radius: 40rpx;
			color: #FFFFFF;
			text-align: center;
			margin: 30rpx 0;
		}
		
	}
</style>
