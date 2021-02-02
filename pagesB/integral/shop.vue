<template>
	<view>
			<!--查询栏目-->
			<view class="search">
				<u-search placeholder="搜索商品" shape="round" 
							@custom='goodsSearch'
							v-model="keyword">
				</u-search>
			</view>
			<!--导航栏-->
			<view class="u-f-ajc" style="padding: 0 10rpx;">	
				<view style="flex: 8;" >
					<u-tabs name="sortName" 
							:list="list" 
							:current="current" 
							:is-scroll="false"
							active-color="#FF6969"
							@change="change">
					</u-tabs>
				</view>
				 <view style="flex: 1;" class="u-f-ajc" @tap="more">
					<u-icon name="list" color="#777f8e" size="50"></u-icon>
				 </view>
			</view>
			<!--分割线-->
			<u-gap  bg-color="#bbb" height="1" margin-bottom="5" ></u-gap>
			
			<!-- 轮播图 -->
			<view class="shop-swiper-box">
				<u-swiper :list="swiperlist" :effect3d="true"></u-swiper>
			</view>
			<!-- 精选好物 -->
			<view class="shop-jinxuan-box">
				<image class="jxbg" src="../static/shop/jinxuanbg.png"></image>
				<view class="jx-content">
					<text>精选好物</text>
					<view class="jx-right">
						<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
			</view>
			<!--全部商品内容-->
			<block>
				<goods-card :goodsList='goodsList'></goods-card>
			</block>
			<u-loadmore :status="status" />
	</view>
</template>

<script>
	import goodsCard from '../components/integral/goods-card.vue'
	export default{
		components:{
			goodsCard
		},
		data() {
			return {
				keyword: '',
				goodsSortId: null,
				list:[],
				goodsList:[],
				current: 0,
				status: 'loadmore',
				page: 1,
				pageSize: 10,
				// 轮播图数据
				swiperlist: [
					{
						image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
						title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
					}
				]
			}
		},
		onLoad() {
			this.$u.api.goodsSort().then(res=>{
				var item = res.data
				this.list = item.slice(0,7)
				this.$store.commit('goods/setGoodsSort',res.data)
			})
			this.queryGoods()
		},
		methods:{
			change(index) {
				this.current = index;
				this.goodsList = []
				this.goodsSortId = this.list[index].id
				this.queryGoods()
			},
			more(){
				console.log('积分商城改为不要分类')
				// uni.navigateTo({
				// 	url:'./goodsSort'
				// })
			},
			// 搜索
			goodsSearch(e){
				this.keyword=e
				if(this.keyword==''){
					uni.showToast({
						title: '请输入搜素关键字',
						icon: 'none'
					})
					return;
				}
				this.goodsList = []
				this.goodsSortId = null
				this.queryGoods()
			},
			//查询所有商品
			queryGoods(){
				this.$u.api.queryGoods({
					goodsSortId: this.goodsSortId,
					goodsName: this.keyword,
					page: this.page,
					pageSize: this.pageSize
				}).then(res=>{
					console.log(res)
					this.goodsList=this.goodsList.concat(res.data.list)
					if(res.data.list.length<this.pageSize){
						this.status="nomore"
					}
				})
			}
			
		},
		onReachBottom() {
			if(this.status==="nomore"){
				return;
			}
			this.status = 'loading';
			this.page = ++ this.page;
			this.queryGoods()
		}
	}
</script>

<style lang="scss" scoped>
	.search{
		padding: 20rpx;
	}
	.shop-swiper-box{
		margin: 20rpx 0;
	}
	.shop-jinxuan-box{
		position: relative;
		.jxbg{
			width: 100vw;
			height: 60rpx;
		}
		.jx-content{
			position: absolute;
			top: 0;
			width: 100vw;
			height: 60rpx;
			color: #FFFFFF;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 50rpx;
			font-size: 30rpx;
			.jx-right{
				height: 34rpx;
				width: 34rpx;
				background-color: #FFFFFF;
				color: #FF6969;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
				font-size: 18rpx;
			}
		}
	}
</style>
