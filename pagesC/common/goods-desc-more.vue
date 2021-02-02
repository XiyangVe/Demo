<template>
	<view class="">
		<!-- 商品规格头部区域 -->
		<view class="flex align-center p-2">
			<view>
				<u-image v-if="!isShow" height="200" width="200" :src="`${baseUrl}${data.recommendImage}`" ></u-image>
				<u-image v-else height="200" width="200" :src="`${baseUrl}${commodityInfo.goodsPropertyImage}`" ></u-image>
			</view>
			<view class="ml-2">
				<view class="text-ellipsis-2">
					{{data.goodsName}}
				</view>
				<view class="text-tb-danger py-2">
					<text class="text-tb-danger">￥</text>
					<text v-if="!isShow" class="font-weight-bolder font-lg">{{data.goodsPrice}}</text>
					<text v-else class="font-weight-bolder font-lg">{{commodityInfo.goodsPropertyPrice}}</text>
				</view>
				<view class="font-sm text-muted">
					<text v-if="!isShow">库存：{{data.goodsStock}}</text>
					<text v-else>库存：{{commodityInfo.goodsPropertyStock}}</text>
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
		</view>
		<view class="p-2">
			<view class="flex align-center justify-between" v-if="isShow">
				<view class="cart btn u-line-1" @click="addShoppingCart()">加入购物车</view>
				<view class="buy btn u-line-1" @click="buyNow()">立即购买</view>
			</view>
			<view class="flex align-center justify-between" v-else>
				<view class="disabled-cart btn u-line-1">加入购物车</view>
				<view class="disabled-buy btn u-line-1">立即购买</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			data:Object,
			gdata: Array,
			merId: String,
			userId: String
		},
		data(){
			return{
				iac:[],
				value: 1,
				isShow: false,
				commodityInfo:{},
				// 购物车分页
				pagination:{
					page: 1,
					pageSize: 10,
				}
			}
		},
		mounted() {
			console.log(this.merId)
		},
		methods:{
			// 加入购物车
			addShoppingCart(){
				this.$u.api.addShoppingCart({
					cartNum: this.value,
					goodsId: this.data.id,
					priceId: this.$store.state.goods.goodsChekInfo.id,
					distributionMerId: this.merId,
					distributionUserId: this.userId,
					isNew: 0,
				}).then(res=>{
					if(res.code===200){
						this.$store.dispatch('goods/getUserShoppingCart',this.pagination)
						uni.showToast({
							title:res.msg
						})
						this.$emit('success',false);
					}else{
						uni.showToast({
							title:res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 立即购买
			buyNow(){
				this.$u.api.addShoppingCart({
					cartNum: this.value,
					goodsId: this.data.id,
					priceId: this.$store.state.goods.goodsChekInfo.id,
					distributionMerId: this.merId,
					distributionUserId: this.userId,
					isNew: 1
				}).then(res=>{
					let cartIdArr = []
					cartIdArr.push(res.data)
					this.$store.dispatch('goods/getCartIds',cartIdArr)
					uni.navigateTo({
						url: '/pagesC/mall/orderDetails' 
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
				if(parseInt(this.commodityInfo.goodsPropertyStock)>parseInt(this.value)){
					this.value ++
				}
			},
			// 选择商品规格添加到数组
			selectClick(index,index2,item2){
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
					// console.log(res)
					if(res.code==200){
						this.isShow = true
						this.commodityInfo = res.data
						this.$store.commit('goods/setChekGoodsInfo',res.data)
					}else{
						uni.showToast({
							title:res.msg,
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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
	}
	.btn {
		line-height: 66rpx;
		padding: 0 30rpx;
		border-radius: 36rpx;
		color: #ffffff;
	}
	.cart {
		background-color: #ed3f14;
	}
	.buy {
		background-color: #ff7900;
	}
	.disabled-cart{
		background-color: #EEEEEE;
		color: #000000;
		font-size: 24rpx;
	}
	.disabled-buy{
		background-color: #EEEEEE;
		color: #000000;
		font-size: 24rpx;
	}
</style>
