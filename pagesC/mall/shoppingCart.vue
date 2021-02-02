<template>
	<view class="p-2">
		<view style="padding-bottom: 110rpx;">
			<block v-for="(item,index) in shoppingCartList" :key="index">
				<view class="flex align-center">
					<view class="flex align-center py-2">
						<u-icon name="bag" size="40"></u-icon>
						<text class="font-weight-bolder px-1">{{item.shopName}}</text>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
				<block v-for="(item2,index2) in item.cartList" :key="item2.id">
					<view class="flex align-center py-2 border-bottom">
						<view class="flex-1">
							<checkbox-group @change="checkboxChange(item2)">
								<checkbox :checked="item2.checked"></checkbox>
							</checkbox-group>
						</view>
						<view class="flex-2" @click="toGoodsDetails(item2)" v-if="item2.status==1">
							<u-image width="200rpx" height="200rpx" 
							:src="item2.sukInfo.goodsPropertyImage ? `${baseUrl}${item2.sukInfo.goodsPropertyImage}` : '' "></u-image>
						</view>
						<view class="none-icon" v-if="item2.status==0">
							<text>已下架</text>
						</view>
						<view class="none-icon" v-if="item2.status==2">
							<text>无货</text>
						</view>
						<view class="flex-4 col-7">
							<view class="text-ellipsis" :class="item2.status==0||item2.status==2 ? 'text-hover-light':''">
								{{item2.goodsName}}
							</view>
							<view class="text-tb-danger" v-if="item2.status==1">
								<text>￥</text>
								<text class="font-lg font-weight-bolder">{{item2.sukInfo.goodsPropertyPrice}}</text>
							</view>
							<view class="">
								<view class="flex align-center justify-between">
									<text class="font-sm">数量:</text>
									<view class="flex align-center">
										<view @click="minus(item2)">
											<u-icon name="minus-circle" size="30"></u-icon>
										</view>
										<text class="px-3 font-md">{{item2.cartNum}}</text>
										<view @click="plus(item2)">
											<u-icon name="plus-circle" size="30"></u-icon>
										</view>
									</view>
								</view>
								<view class="" @click="sukShow(item2)" v-if="item2.status==1">
									<text class="font-sm bg-light px-1">{{item2.sukInfo.goodsPropertyValue}}</text>
									<u-icon name="arrow-down"></u-icon>
								</view>
							</view>
						</view>
					</view>
				</block>
			</block>
			<view class="">
				<u-loadmore :status="status" />
			</view>
		</view>
		<!-- 底部下单&&价格合计区域 -->
		<view class="flex align-center fixed-bottom border-top bg-white p-2">
			<view class="flex-1 flex align-center">
				<checkbox-group @change="checkAll">
					<checkbox :checked="checkedAll"></checkbox>
				</checkbox-group>
			</view>
			<view class="flex-2 text-tb-danger">
				<text>￥</text>
				<text class="font-lg font-weight-bolder">{{totalPrice}}</text>
			</view>
			<view class="flex-1" @click="delCart" hover-class="text-danger">
				<text class="font-sm">删除</text>
			</view>
			<view class="flex-2">
				<view hover-class="hover-styles"
					class="rounded-circle text-center py-1 bg-taobao-red text-white"
					style="width: 200rpx;background-image: linear-gradient(to bottom right, #ff4400, #FF00FF);"
					@click="toOrderDetails">
					立即下单
				</view>
			</view>
		</view>
		<!-- 选择商品属性弹出层 -->
		<u-popup v-model="isShow" mode="bottom"  border-radius=20>
			<view v-if="isShow">
				<view class="flex py-3 px-2">
					<view class="flex-1">
						<u-image width="200rpx" height="200rpx" :src="isShow ? `${baseUrl}${sukInitData.sukInfo.goodsPropertyImage}` : '' "></u-image>
					</view>
					<view class="flex-2">
						<view class="text-ellipsis">
							<text class="font-small font-weight-bolder">
								{{sukInitData.goodsName}}
							</text>
						</view>
						<view class="py-2 text-tb-danger">
							<text>￥</text>
							<text class="font-weight-bolder">{{sukInitData.sukInfo.goodsPropertyPrice}}</text>
						</view>
					</view>
				</view>
				<!-- 商品规格内容区域 -->
				<view class="goods-desc-component-content">
					<block v-for="(item,index) in goodsParameter" :key="index">
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
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data(){
			return{
				// 购物车数据列表
				shoppingCartList: [],
				// 选中的购物车id
				cartIds: [],
				// 控制是否全选
				checkedAll: false,
				// 购物车总数量
				shoppingCartTotal: 0,
				// 选中的商品总价
				totalPrice: 0,
				totalPriceArr: [],
				// 购物车商品数量
				cartNum: null,
				// 购物车分页
				pagination:{
					page: 1,
					pageSize: 10,
				},
				// 上拉加载更多
				status: 'loadmore',
				// 控制选择商品属性弹出层显示与隐藏
				isShow: false,
				// 商品参数初始数据
				sukInitData:{},
				// 商品规格
				goodsParameter: [],
				iac:[],
			}
		},
		onLoad() {
			this.getUserShoppingCart()
		},
		methods:{
			// 点击商品返回商品详情
			toGoodsDetails(e){
				console.log(e)
			},
			// 选择商品规格参数
			sukShow(e){
				console.log(e)
				this.isShow = !this.isShow
				this.sukInitData = e
				// 查询商品规格
				this.$u.api.goodsSpecification({
					id: e.goodsId
				}).then(res=>{
					this.goodsParameter = res.data
				})
			},
			// 选择商品规格添加到数组
			selectClick(index,index2,item2){
				this.iac[index] = item2.id
				this.iac = this.iac.concat([])
				if(this.goodsParameter.length==this.iac.length){
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
						this.$https.post('/cart/update',{
							id: this.sukInitData.id,
							cartNum: this.sukInitData.cartNum,
							priceId: res.data.id
						}).then(res=>{
							this.isShow = false
							this.shoppingCartList = []
							this.getUserShoppingCart()
						})
					}
				})
			},
			// 获取购物车列表
			getUserShoppingCart(){
				this.$https.get('/cart/getUserCart',{
					page: this.pagination.page,
					pageSize: this.pagination.pageSize
				}).then(res=>{
					res.data.list.forEach(item => {
						this.$set(item, "checked", false)
						if (item.cartList) {
							item.cartList.forEach((citem) => {
								this.$set(citem, "checked", false)
								if(citem.sukInfo!=null){
									let sumPrice = citem.cartNum * citem.sukInfo.goodsPropertyPrice
									this.$set(citem,"sumPrice",sumPrice.toFixed(2))
								}
							})
						}
					})
					this.shoppingCartTotal = res.data.total
					this.shoppingCartList = this.shoppingCartList.concat(res.data.list)
					if(this.pagination.pageSize>res.data.list.length){
						this.status = 'nomore'
					}
				})
			},
			//全选
			checkAll() {
				this.totalPriceArr = []
				this.cartIds = []
				this.totalPrice = 0
				
				this.checkedAll = !this.checkedAll
				this.shoppingCartList.forEach(item => {
					item.checked = this.checkedAll;
					if (item.cartList) {
						item.cartList.forEach(citem => {
							citem.checked = this.checkedAll;
							this.totalPriceArr.push(citem.sumPrice)
							this.cartIds.push(citem.id)
						})
					}
				})
				if(this.checkedAll===true){
					this.totalPrice = eval(this.totalPriceArr.join("+"))
				}else{
					this.totalPriceArr = []
					this.cartIds = []
					this.totalPrice = 0
				}
			},
			// 商品多选框点击事件
			checkboxChange(e){
				if(e.checked==true){
					this.$set(e,"checked", false)
					var idIndex = this.cartIds.indexOf(e.id)
					this.cartIds.splice(idIndex,1)
					var index = this.totalPriceArr.indexOf(e.sumPrice)
					this.totalPriceArr.splice(index,1)
					this.totalPrice = eval(this.totalPriceArr.join("+"))
				}else{
					this.$set(e,"checked", true)
					this.cartIds.push(e.id)
					this.totalPriceArr.push(e.sumPrice)
					this.totalPrice = eval(this.totalPriceArr.join("+"))
				}
				if(this.totalPriceArr.length===0){
					this.totalPrice = 0
				}
				if(this.shoppingCartTotal==this.totalPriceArr.length){
					this.checkedAll = true
				}else{
					this.checkedAll = false
				}
				console.log(this.cartIds)
			},
			// 商品数量增加
			plus(cart){
				this.totalPrice = 0
				this.totalPriceArr = []
				this.checkedAll = false
				this.cartIds = []
				this.cartNum = ++ cart.cartNum
				this.updateShoppingCart(cart.id,this.cartNum)
			},
			// 商品数量减少
			minus(cart){
				if(cart.cartNum==1){
					return
				}
				this.totalPrice = 0
				this.totalPriceArr = []
				this.checkedAll = false
				this.cartIds = []
				this.cartNum = -- cart.cartNum
				this.updateShoppingCart(cart.id,this.cartNum)
			},
			// 更新购物车
			updateShoppingCart(id,cartNum){
				this.$https.post('/cart/update',{
					id: id,
					cartNum: cartNum,
					priceId: null
				}).then(res=>{
					this.shoppingCartList = []
					this.getUserShoppingCart()
				})
			},
			// 删除购物车数据
			delCart(){
				if(this.cartIds.length===0){
					return uni.showToast({
						title: '请选择要删除的商品',
						icon: 'none'
					})
				}
				this.$https.post('/cart/del',this.cartIds).then(res=>{
					console.log(res)
					this.shoppingCartList = []
					this.getUserShoppingCart()
					this.totalPrice = 0
				})
			},
			// 立即下单
			toOrderDetails(){
				if(this.cartIds.length===0){
					return uni.showToast({
						title: '请选择要购买的商品',
						icon: 'none'
					})
				}
				this.$store.dispatch('goods/getCartIds',this.cartIds)
				uni.navigateTo({
					url: './orderDetails'
				})
			}
			
		},
		onReachBottom() {
			if(this.status == 'nomore'){
				return
			}
			this.status = 'loading'
			setTimeout(()=>{
				this.pagination.page ++
				this.getUserShoppingCart()
			})
		}
	}
</script>

<style scoped lang="scss">
	.none-icon{
		// position: absolute;
		// left: 110rpx;
		background:rgba(0,0,0,0.5);
		color: #FFFFFF;
		font-size: 20rpx;
		width: 200rpx;
		height: 200rpx;
		display: flex;
		justify-content: center;
		align-items: center;
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
</style>
