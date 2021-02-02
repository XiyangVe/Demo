<template>
	<view class="">
		<!-- 设置没有导航栏占位 -->
		<view class="status_bar"></view>
		<view class="">
			<!-- 商户信息 -->
			<view class="p-2 bg-light">
				<view class="flex align-center justify-between">
					<view class="flex align-center">
						<view class="">
							<u-image width="100rpx" height="100rpx" :src="storeInfo.logo ? `${baseUrl}${storeInfo.logo}` : '' "></u-image>
						</view>
						<view class="px-1">
							<view class="py flex align-center" @click="toShopDesc()">
								<text class="bg-taobao-red text-white rounded font-small px">自营</text>
								<text class="font-weight-bolder px-1">{{storeInfo.shopName}}</text>
								<u-icon name="arrow-right"></u-icon>
							</view>
							<view class="">
								<u-rate :count="count" disabled v-model="starNum"></u-rate>
							</view>
							<view class="font-sm text-muted">
								{{storeInfo.followers}}人关注
							</view>
						</view>
					</view>
					<view hover-class="bg-dark text-white"
						@click="followShop"
						:class="storeInfo.attention ? 'rounded-circle px-2 py' : 'bg-taobao-red rounded-circle px-2 py text-white'">
						<text v-if="storeInfo.attention==false">关注</text>
						<text v-else>取消关注</text>
					</view>
				</view>
			</view>
			<!-- 筛选区域 -->
			<view class="bg-light">
				<u-dropdown>
					<u-dropdown-item v-model="value1" title="筛选" @change="change" :options="options1"></u-dropdown-item>
					<u-dropdown-item v-model="value2" title="价格" @change="change2" :options="options2"></u-dropdown-item>
				</u-dropdown>
			</view>
			<!-- 商户商品列表 -->
			<view class="px-2 py-3" v-for="(item,index) in goodsList" :key="index">
				<view class="flex align-center" hover-class="bg-light" @click="toGoodsDesc(item)">
					<view class="flex-2">
						<u-image width="200rpx" height="200rpx"
							border-radius="30"
							:src="item.recommendImage ? `${baseUrl}${item.recommendImage}` : ''">
						</u-image>
					</view>
					<view class="flex-4 border-bottom pb-4">
						<text>{{item.goodsName}}</text>
						<view class="py-2 text-tb-danger">
							<text>￥</text>
							<text class="font-md font-weight-bolder">{{item.goodsPrice}}</text>
						</view>
						<view class="font-sm">
							<text class="mr-1">5.0评分</text>
							<text>8563条评论</text>
						</view>
					</view>
				</view>
			</view>
			
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
				// 商户id
				merId: '',
				// 商户信息
				storeInfo: {},
				// 商户商品查询参数
				fromData:{
					isBest: null,
					isHot: null,
					isNew: null,
					sortField: '',
					orderingRule: '',
					page: 1,
					pageSize: 10,
				},
				// 商户商品列表
				goodsList: [],
				// 分页
				status: 'loadmore',
				// 店铺评分
				count: 5,
				starNum: 5,
				// 筛选
				value1: 999,
				value2: null,
				options1: [
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
						label: '由低到高',
						value: 1,
					},
					{
						label: '由高到低',
						value: 2,
					},
				],
			}
		},
		onReachBottom(){
			if(this.status == 'nomore'){
				return
			}
			this.status = 'loading'
			this.fromData.page = ++this.fromData.page
			setTimeout(()=>{
				this.getGoodsList()
				this.status = 'loadmore'
			},1000)
		},
		onLoad(e) {
			this.merId = e.merId
			this.getStoreInfo()
			this.getGoodsList()
		},
		methods:{
			// 获取商户店铺信息
			getStoreInfo(){
				this.$https.get('/MerchantShop/getStoreInfo',{
					merId: this.merId
				}).then(res=>{
					this.storeInfo = res.data
				})
			},
			// 关注店铺
			followShop(){
				this.$https.get('/MerchantShop/followOrUnfollow',{
					shopId: this.storeInfo.id
				}).then(res=>{
					this.getStoreInfo()
				})
			},
			// 获取商品列表
			getGoodsList(){
				this.$u.api.queryGoods({
					merId: this.merId,
					isIntegralMall: 0,
					isBest: this.fromData.isBest,
					isHot: this.fromData.isHot,
					isNew: this.fromData.isNew,
					orderingRule: this.fromData.orderingRule,
					sortField: this.fromData.sortField,
					page: this.fromData.page,
					pageSize: this.fromData.pageSize
				}).then(res=>{
					this.goodsList = this.goodsList.concat(res.data.list)
					if(res.data.list.length<this.fromData.pageSize){
						this.status = 'nomore'
					}
				})
			},
			// 筛选
			change(e) {
				this.value1 = e
				this.goodsList = []
				if(e==1001){
					this.fromData.isBest = 1
					this.fromData.isHot = ''
					this.fromData.isNew = ''
				}else if(e==2001){
					this.fromData.isHot = 1
					this.fromData.isBest = ''
					this.fromData.isNew = ''
				}else if(e==2002){
					this.fromData.isNew = 1
					this.fromData.isBest = ''
					this.fromData.isHot = ''
				}else{
					this.fromData.isBest = ''
					this.fromData.isHot = ''
					this.fromData.isNew = ''
				}
				this.getGoodsList()
			},
			// 价格
			change2(e){
				this.value2 = e
				this.goodsList = []
				this.fromData.sortField = 'goods_price'
				if(e==1){
					this.fromData.orderingRule = 'asc'
				}else if(e==2){
					this.fromData.orderingRule = 'desc'
				}
				this.getGoodsList()
			},
			// 去商品详情页面
			toGoodsDesc(e){
				this.$u.route('/pagesC/mall/goodsDetails', {
					goodsId: e.id,
					merId: e.merId
				})
			},
			// 查看商户详情
			toShopDesc(){
				this.$store.commit('goods/getStoreInfo',this.storeInfo)
				uni.navigateTo({
					url: './shopDetails'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.status_bar {
	      height: var(--status-bar-height);
	      width: 100%;
	  }
</style>
