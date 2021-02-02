<template>
	<view class="page">
		<!-- <scroll-view scroll-y="true"> -->
		<!-- :style="{height:height}" -->
		<view class="boxes" v-for="item in list">
			<view class="notice">
				2020-07-08 08:00:08
			</view>
			<view class="box">
				<view class="title">
					<image class="imgs" src="../../pagesB/static/shop/cm2_discover_banner_kr-ip6@2x.jpg" mode=""></image>
				</view>
				<view class="details">
					<view class="titles">您有一份优惠券领取</view>
					<view class="titles others">追求简约优雅的商务风格塑造女性在职场上的干练利落展现生活中自信且优雅的多面形象</view>
				</view>
			</view>
		</view>
		<view>
			<uni-load-more :status="status" :content-text="contentText" color="#979797" />
		</view>
		<!-- </scroll-view> -->


	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				list: [1, 2, 1, 1, 1],
				height: 0,
				status: 'more',
				contentText: {
					contentdown: '查看更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
			}
		},
		// 上拉加载
		onReachBottom() {
			let _self = this
			this.status = 'loading'
			// uni.showNavigationBarLoading()

			console.log('reach');
			setTimeout(function() {
				// _self.page++;
				_self.status = 'more'
				_self.getList();
				uni.hideNavigationBarLoading()
			}, 1000);
		},
		methods: {
			//获取数据
			getList(){
				this.list.push('测试')
			}
		}
	}
</script>

<style scoped>
	.boxes {
		padding-top: 20upx;
	}

	.box {
		width: 90%;
		height: 400upx;
		margin: 0 auto;
		background: white;
		border-radius: 20upx;
	}

	.page {
		background-color: #F6F6F6;
		height: 100%;
		min-height: 100vh;
	}

	.notice {
		text-align: center;
		font-size: 24upx;
		color: #979797;
	}

	.title {
		height: 266upx;
	}

	.imgs {
		width: 100%;
		height: 100%;
		vertical-align: middle;
	}

	.titles {
		font-size: 32upx;
		font-weight: 500;
		padding: 5upx 0 0 10upx;
		color: #000000;
	}

	.others {
		font-size: 26upx;
		color: #979797;
	}

	.contents {}
</style>
