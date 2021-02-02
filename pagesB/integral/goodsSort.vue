<template>
	<view>
		<!-- 头部搜索 -->
		<view class="search">
			<u-search placeholder="搜素分类" v-model="keyword"></u-search>
		</view>
		<!--左侧-->
		<view class="u-f-ac">
			<view class="navbar">
				<scroll-view style="height: 100%;" scroll-y="true" class="scroll-Y">
					<view class="item u-f-ajc" 
							:class="index==categoryActive?'item-active':''"
							v-for="(item,index) in navbBarList" 
							@click="categoryClickMain(item,index)"
							:key="index" >
						{{item.sortName}}
					</view>
				</scroll-view>
			</view>
			<!--右侧-->
			<view class="content">		
				<scroll-view style="height: 100%;" scroll-y="true" class="scroll-Y">
					<block>
						<sort-box :goodsSortList="goodsSortList"></sort-box>
					</block>
				</scroll-view>	
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import sortBox from '../components/integral/sort-box.vue'
	export default{
		components:{
			sortBox
		},
		data(){
			return {
				keyword: '',
				navbBarList:[],
				categoryActive:0,
				goodsSortList:[]
			}
		},
		onLoad() {
			// console.log(this.$store.state.goods.goodsSort)
			this.navbBarList=this.$store.state.goods.goodsSort
		},
		methods:{
			categoryClickMain(item,index){
				this.categoryActive=index
				if(item.children!==null){
					this.goodsSortList=item.children
				}else{
					this.goodsSortList=[]
					this.$refs.uToast.show({
						title: '没有商品'
					})
				}
				// console.log(item)
			}
			
		}
	}
</script>

<style lang="less" scoped>
	.search{
		padding:20rpx 50rpx;
	}
	.navbar{
		width: 200rpx;
		height: 100vh;
		.item{
			padding: 20rpx 0;
		}
		.item-active{
			color: #ff6969;
			background-color: #eee;
			border-left: 6rpx solid #ff6969;
		}
	}
	.content{
		width: 550rpx;
		height: 100vh;
		padding: 20rpx;
		background-color: #f4f4f5;
		.title{
			font-size: 30rpx;
			font-weight: bold;
			margin: 20rpx 0;
		}

	}
</style>
