<template> 
	<view>
		<trends-card ref="list" type="cardIndex" :list="list"></trends-card>
		<!-- 上拉加载更多 -->
		<u-loadmore :status="status" />
	</view>
</template>

<script>
	import trendsCard from '../../components/commoms/trends-card.vue';
	
	export default {
		components: {
			trendsCard
		},
		data() {
			return {
				list: [],
				// 分页
				pageNo: 1,
				// 上拉加载更多
				status:"loadmore"
			}
		},
		onLoad() {
			this.getMessPublish()
		},
		methods: {
			//根据tab获取信息,告诉那个数组要装哪个
			getMessPublish(){
				this.$u.api.getMessPublish({
					messTypeId:9,
					pageNo:this.pageNo,
					messSortGrade:1,
					currentAddr: '重庆'
				}).then(res=>{
					this.list = res.data.list
				})
			}
		}
	}
</script>

<style lang="less" scoped>

</style>
