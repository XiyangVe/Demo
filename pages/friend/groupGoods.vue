<template>
	<view>
		<u-navbar :title="title" :is-back='true' back-icon-color="#0077FF" :background="{'background-color':'#fff'}" height="50">
		</u-navbar>
		<view class="">

		</view>
		<!-- 群名 -->
		<view class="Grouptop">
			<view style="display: flex;">
				<view class="GroupPortrait">
					<image :src="`${baseUrl}${headImg}`"
					 mode=""></image>
				</view>
				<view class="GroupName">{{groupName}}</view>
			</view>
		</view>
		<!-- 筛选 -->
		<view class="screen" v-if="type=='more'">
			<view :class="current==1?'Select':''" @click="changeColor('1')">综合排序</view>
			<view :class="current==2?'Select':''" @click="changeColor('2')">销量</view>
			<view :class="current==3?'Select':''" @click="changeColor('3')">价格<u-icon name="arrow-upward" color="#979797" size="28"></u-icon>
			</view>
		</view>
		<!-- 卡片 -->
		<view class="wrap">
			<u-waterfall v-model="flowList" ref="uWaterfall">
				<template v-slot:left="{ leftList }">
					<view class="demo-warter" v-for="(item, index) in leftList" :key="index">
						<!-- 微信小程序需要hx2.8.11版本才支持在template中引入其他组件，比如下方的u-lazy-load组件 -->
						<u-lazy-load threshold="-450" border-radius="10" :image="`${baseUrl}${item.recommendImage}`" :index="index"></u-lazy-load>
						<view class="demo-title">{{ item.goodsName }}
						<!-- <view style="float: right;margin-right: 10upx;">销量：{{item.goodsSaleNum}}</view> -->
						</view>
						<view class="demo-card" v-if="item.isHot==1">
							<view class="demo-card-img">
								<image src="https://img02.mockplus.cn/idoc/xd/2021-01-19/9aee7acf-1080-43ce-a76c-f07235dd1426.png" mode=""></image>
							</view>
							<view class="">新品出售</view>
						</view>
						<view class="demo-tag">
							<view class="demo-price">￥{{ item.goodsPrice }}元</view>
							<view class="demo-tag">
								<view v-if="item.shelfStatus==0&&type=='apply'" class="demo-buttom" @click="applySheves(item.id)">申请上柜</view>
								<!-- <view v-else="item.shelfStatus==1" style="color: #FF8800;">已上架</view> -->
							</view>
						</view>
					</view>
				</template>
				<template v-slot:right="{ rightList }">
					<view class="demo-warter" v-for="(item, index) in rightList" :key="index">
						<u-lazy-load threshold="-450" border-radius="10" :image="`${baseUrl}${item.recommendImage}`" :index="index"></u-lazy-load>
						<view class="demo-title">{{ item.goodsName }}
						<!-- <view style="float: right;margin-right: 10upx;">销量：{{item.goodsSaleNum}}</view> -->
						</view>
						
						<!-- 新品出售 -->
						<view class="demo-card" v-if="item.isHot==1">
							<view class="demo-card-img">
								<image src="https://img02.mockplus.cn/idoc/xd/2021-01-19/9aee7acf-1080-43ce-a76c-f07235dd1426.png" mode=""></image>
							</view>
							<view class="">新品出售</view>
						</view>
						<view class="demo-tag">
							<view class="demo-price">￥{{ item.goodsPrice }}元</view>
							<!-- 申请上柜 -->
							<view v-if="item.shelfStatus==0&&type=='apply'" class="demo-buttom" @click="applySheves(item.id)">申请上柜</view>
							<!-- <view v-else-if="item.shelfStatus==1" style="color: #FF8800;">已上架</view> -->
						</view>
					</view>
				</template>
			</u-waterfall>
			<u-loadmore v-if="flowList.length>=6" bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
		</view>
	</view>

	</view>
</template>

<script>
	import $https from '@/utils/lib/https.js';
	export default {
		data() {
			return {
				current: 1,
				title: '',
				loadStatus: 'none',
				flowList: [],
				params:{
					groupId:null,
				},
				page:1,
				pageSize:6,
				list: [],
				groupName:'',
				headImg:'',
				total:null,
				type:'',
			};
		},
		onLoad(e) {
			this.params.groupId=e.groupId
			this.groupName=e.groupName
			this.headImg=e.headImg
			this.type=e.type
			console.log()
			if(e.type=='apply'){
				this.title="我的商品"
				this.addRandomData();
			}else{
				this.title="货架"
				this.getGroupProduct();
			}
			
			// this.getList()
		},
		onReachBottom() {
			this.loadStatus = 'loading';
			// 模拟数据加载
			setTimeout(() => {
				this.pageSize=this.pageSize+6
				if(this.type=='apply'){
					this.addRandomData();
				}else{
					this.getGroupProduct();
				}
				if(this.pageSize>=this.total){
					this.loadStatus = 'none';
				}
			}, 1000);
		},
		methods: {
			//上柜申请数据
			addRandomData() {
				$https.get('/chatGroup/getUserGoods?page='+this.page+'&pageSize='+this.pageSize+'&groupId='+this.params.groupId)
					.then(res => {
						console.log(res)
						this.flowList=res.data.list
						this.total=res.data.total
				})
				
				// for (let i = 0; i < 10; i++) {
				// 	let index = this.$u.random(0, this.list.length - 1);
				// 	// 先转成字符串再转成对象，避免数组对象引用导致数据混乱
				// 	let item = JSON.parse(JSON.stringify(this.list[index]));
				// 	item.id = this.$u.guid();
				// 	this.flowList.push(item);
				// }
				// console.log(this.flowList)
			},
			//申请上柜按钮
			applySheves(id){
				var self=this
				$https.get('/chatGroup/goodsShelves?goodsId='+id+'&groupId='+this.params.groupId)
					.then(res => {
						console.log(res)
						uni.showToast({
							title:res.msg,
							icon:'success',
							duration:500
						})
				})
				
			},
			//查看更多群商品
			getGroupProduct(){
				$https.post('/chatGroup/groupCommodityQuery', {
						groupId: this.params.groupId
					})
					.then(res => {
						console.log(res.data)
						this.flowList=res.data.list
						this.total=res.data.total
				})
			},
			remove(id) {
				this.$refs.uWaterfall.remove(id);
			},
			changeColor(id) {
				this.current = id
			},
			clear() {
				this.$refs.uWaterfall.clear();
			}
		}
	};
</script>


<style lang="scss" scoped>
	.top_bar {
		display: flex;
		width: 100%;
		justify-content: center;
		padding-right: 28upx;
	}

	.Grouptop {
		width: 750upx;
		height: 124upx;
		background-color: #FFFFFF;
		display: flex;
		justify-content: space-between;
		line-height: 124upx;
		padding: 0 20upx 0 20upx;

		.Sold {
			color: #979797;
			font-size: 24upx;
		}

		.GroupPortrait {
			width: 100upx;
			height: 100upx;
			border-radius: 50%;
			overflow: hidden;
			margin-top: 12upx;
		}

		.GroupName {
			line-height: 124upx;
			margin-left: 40upx;
			font-weight: 500;
			font-size: 32upx;
		}
	}

	.screen {
		margin-top: 10upx;
		width: 100%;
		height: 80upx;
		display: flex;
		justify-content: space-between;
		padding: 0 20upx 0 20upx;
		line-height: 80upx;
		color: #979797;

		.Select {
			color: #333333;
		}
	}

	.demo-warter {
		border-radius: 8px;
		margin: 5px;
		background-color: #ffffff;
		padding: 8px;
		position: relative;
	}

	.u-close {
		position: absolute;
		top: 32rpx;
		right: 32rpx;
	}

	.wrap {}

	.demo-image {
		width: 100%;
		border-radius: 4px;
	}

	.demo-title {
		font-size: 24upx;
		margin-top: 5px;
		color: $u-main-color;
		word-break: break-all;
	}

	.demo-card {
		display: flex;
		font-size: 24upx;
		margin-top: 10upx;
		color: #FF6969;

		.demo-card-img {
			width: 14upx;
			margin-right: 10upx;
			height: 26upx;
		}
	}

	.demo-tag {
		display: flex;
		margin-top: 5px;
		justify-content: space-between;
		height: 44upx;
		line-height: 44upx;

		.demo-Sold {
			font-size: 16upx;
			color: #979797;
			line-height: 44upx;
		}

		.demo-buttom {
			text-align: center;
			line-height: 42upx;
			width: 108upx;
			height: 42upx;
			color: #FFFFFF;
			font-size: 24upx;
			background: #0077ff;
			border-radius: 6upx;
		}

		.demo-price {
			font-size: 24upx;
			color: #0077FF;
			line-height: 44upx;
		}
	}

	.demo-tag-owner {
		background-color: $u-type-error;
		color: #ffffff;
		display: flex;
		align-items: center;
		padding: 4rpx 14rpx;
		border-radius: 50rpx;
		font-size: 20rpx;
		line-height: 1;
	}

	.demo-tag-text {
		border: 1px solid $u-type-primary;
		color: $u-type-primary;
		margin-left: 10px;
		border-radius: 50rpx;
		line-height: 1;
		padding: 4rpx 14rpx;
		display: flex;
		align-items: center;
		border-radius: 50rpx;
		font-size: 20rpx;
	}
</style>
