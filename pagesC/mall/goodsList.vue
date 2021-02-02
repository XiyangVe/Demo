<template>
	<view class="">
		<!-- 搜索框 -->
		<view class="m-2">
			<u-search placeholder="搜索商品名称" 
					v-model="keyword"
					@custom="search"
					animation>
			</u-search>
		</view>
		<!-- 下拉筛选 -->
		<view class="m-2 border-bottom">
			<view>
				<u-dropdown ref="uDropdown">
					<u-dropdown-item v-model="value1" title="筛选" @change="change" :options="options1"></u-dropdown-item>
					<u-dropdown-item v-model="value2" title="销量" @change="change2" :options="options2"></u-dropdown-item>
					<u-dropdown-item v-model="value3" title="价格" @change="change3" :options="options3">
						
						<!-- <view class="" style="background-color: #FFFFFF;">
							<scroll-view scroll-y="true" style="height: 300rpx;">
								<view class="flex">
									<view style=""
									class="border border-primary rounded-circle text-primary flex-3 text-center p-2 m-1">
										热卖
									</view>
									<view style=""
									class="border border-primary rounded-circle text-primary flex-3 text-center p-2 m-1">
										精品
									</view>
									<view style=""
									class="border border-primary rounded-circle text-primary flex-3 text-center p-2 m-1">
										JavaScript
									</view>
								</view>
							</scroll-view>
							<u-button type="primary" @click="closeDropdown">确定</u-button>
						</view> -->
						
					</u-dropdown-item>
				</u-dropdown>
			</view>
		</view>
		<!-- 商品列表 -->
		<view class="goods-list-box">
			<block v-for="(item,index) in goodsList" :key="index">
				<view @click="toGoodsDetails(item)"
					class="goods-item flex flex-column border rounded shadow">
					<view>
						<image class="goods-img "
							:src="`${baseUrl}${item.recommendImage}`" 
							mode="aspectFill"></image>
					</view>
					<view class="py-2 px-1">
						<view class="text-ellipsis font-sm py">
							<text class="bg-danger text-white rounded px mr-1">自营</text>
							<text>{{item.goodsName}}</text>
						</view>
						<view class="text-tb-danger">
							<text class="font-small">￥</text>
							<text class="font-weight-bolder font-md">{{item.goodsPrice.toFixed(2)}}</text>
						</view>
						<view class="" @click.stop="toShop(item.merId)">
							<text class="font-small text-muted">{{item.shopName}}</text>
							<text class="font-small ml-1">进店</text>
							<u-icon name="arrow-right" size="20"></u-icon>
						</view>
					</view>
				</view>
			</block>
		</view>
		<!-- 上拉加载更多 -->
		<view style="margin-top: 7%;">
			<u-loadmore :status="status" font-size="20"/>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				// 商品列表
				goodsList: [],
				// 查询商品参数
				keyword: '',
				goodsSortId: 0,
				isBest: null,
				isHot: null,
				isNew: null,
				orderingRule: '',
				sortField: '',
				page: 1,
				pageSize: 10,
				status: 'loadmore',
				// 筛选
				value1: 999,
				value2: null,
				value3: null,
				options1:[
					{
						label: '综合',
						value: 999,
					},
					{
						label: '精品',
						value: 1001,
					},
					{
						label: '热卖',
						value: 2001,
					},
					{
						label: '新品',
						value: 2002,
					}
				],
				options2: [{
						label: '由高到低',
						value: 1,
					},
					{
						label: '由低到高',
						value: 2,
					},
				],
				options3: [{
						label: '由低到高',
						value: 3,
					},
					{
						label: '由高到低',
						value: 4,
					},
				],
			}
		},
		onLoad(e) {
			this.goodsSortId = e.id
			this.getGoodsList()
		},
		methods:{
			// 获取商品列表
			getGoodsList(){
				this.$u.api.queryGoods({
					goodsSortId: this.goodsSortId,
					isIntegralMall: 0,
					goodsName: this.keyword,
					isBest: this.isBest,
					isHot: this.isHot,
					isNew: this.isNew,
					orderingRule: this.orderingRule,
					sortField: this.sortField,
					page: this.page,
					pageSize: this.pageSize
				}).then(res=>{
					
					this.goodsList = this.goodsList.concat(res.data.list)
					if(res.data.list.length<this.pageSize){
						this.status = 'nomore'
					}
				})
			},
			// 筛选
			change(e) {
				this.value1 = e
				this.goodsList = []
				if(e==1001){
					this.isBest = 1
					this.isHot = ''
					this.isNew = ''
				}else if(e==2001){
					this.isHot = 1
					this.isBest = ''
					this.isNew = ''
				}else if(e==2002){
					this.isNew = 1
					this.isBest = ''
					this.isHot = ''
				}else{
					this.isBest = ''
					this.isHot = ''
					this.isNew = ''
				}
				this.getGoodsList()
			},
			// 销量
			change2(e){
				this.value2 = e
				this.goodsList = []
				this.sortField = 'goods_sale_num'
				if(e==1){
					this.orderingRule = 'asc'
				}else if(e==2){
					this.orderingRule = 'desc'
				}
				this.getGoodsList()
			},
			// 价格
			change3(e){
				this.value3 = e
				this.goodsList = []
				this.sortField = 'goods_price'
				if(e==3){
					this.orderingRule = 'asc'
				}else if(e==4){
					this.orderingRule = 'desc'
				}
				this.getGoodsList()
			},
			closeDropdown() {
				this.$refs.uDropdown.close();
			},
			// 搜索
			search(e){
				this.keyword = e
				this.goodsList = []
				this.getGoodsList()
			},
			// 去商品详情页
			toGoodsDetails(item){
				if(item.merUse == 1){
					this.$u.route('/pagesC/mall/goodsDetails', {
						goodsId: item.id,
						merId: item.merId
					})
				}else{
					this.$u.route('/pagesC/mall/goodsDetails', {
						goodsId: item.id
					})
				}
			},
			// 进店导航
			toShop(merId){
				console.log('进店')
				uni.navigateTo({
					url: './shopInfo?merId=' + merId
				})
			}
		},
		// 页面滚动到底部的事件
		onReachBottom() {
			if(this.status == 'nomore'){
				return
			}
			console.log('页面滚动到底部的事件')
			this.status = 'loading'
			this.page = ++this.page
			setTimeout(()=>{
				this.getGoodsList()
				this.status = 'loadmore'
			},1000)
		}
	}
</script>

<style lang="scss" scoped>
	.goods-list-box{
		padding: 0 20rpx;
		display: flex;
		flex-wrap: wrap;
		.goods-item{
			width: 48%;
			margin: 0 1% 20rpx 1%;
			.goods-img{
				width: 100%;
				height: 400rpx;
			}
		}
	}
</style>
