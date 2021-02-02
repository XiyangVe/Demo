<template>
	<view>
		<goods-card :goodsList='goodsList'></goods-card>
	</view>
</template>

<script>
	import goodsCard from '../components/integral/goods-card.vue'
	export default{
		components:{
			goodsCard
		},
		data(){
			return{
				goodsList: [], //商品数据
				goodsSortId:null, //商品分类id
				page: 1,
				pageSize: 10
			}
		},
		onLoad(e) {
			// console.log(e)
			this.goodsSortId=e.id
		},
		onShow() {
			this.queryGoods()
		},
		methods:{
			//查询所有商品
			queryGoods(){
				this.$u.api.queryGoods({
					goodsSortId: this.goodsSortId,
					page: this.page,
					pageSize: this.pageSize
				}).then(res=>{
					console.log(res)
					this.goodsList=res.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	
</style>
