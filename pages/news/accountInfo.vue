<template>
	<view>
		<!-- <view style="height: 60upx;">

		</view> -->

		<u-navbar :is-back='true' back-icon-color="#ffffff" title-color="#ffffff" :title='title' :background="{'background-color':'#6aa8d8'}"
		 height="50">
		</u-navbar>
		<!-- :style="{height:phoneHeight}" -->
		<view class="page">
			<view class="boxes" v-for="item in integralList">
				<view class="notice">
					{{item.createTime | timeFrom}}
				</view>
				<view class="box">
					<view class="title">{{item.title}}</view>
					<view class="details">{{item.content}}</view>
				</view>
			</view>
			<uni-load-more :status="status" :content-text="contentText" color="#979797" />
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import $https from '@/utils/lib/https.js';
	export default {
		data() {
			return {
				integralList: [],
				height: 0,
				type: null,
				page: 1,
				pageSize: 10,
				phoneHeight: 0,
				status: 'more',
				contentText: {
					contentdown: '查看更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				total: 0,
				title:'',
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
				// _self.status = 'more'
				_self.getIntegraltwo();
				uni.hideNavigationBarLoading()
			}, 1000);
		},
		destroyed() {
			this.clearNoMessage()
			console.log('我销毁了！！！！！！！！')
		},
		onLoad(e) {
			if(e.type==6){
				this.title='账号信息'
			}else if(e.type==7){
				this.title='积分信息'
			}
			console.log(e.type)
			this.type = e.type
			this.clearNoMessage()
			this.getIntegral()
		},
		onReady() {
			// 计算屏幕剩余高度  填补剩余高度
			let _this = this;
			uni.getSystemInfo({
				success(res) {
					_this.phoneHeight = res.windowHeight;
					console.log(res.windowHeight);
					// 计算组件的高度
				}
			});
		},
		// beforeCreate () {
		//    document.querySelector('body').setAttribute('style', 'background:red')
		//  },
		methods: {
			clearNoMessage() {
				let list = uni.getStorageSync(`LocalShowNewsListIdUID${this.myId}`)
				for (let i = 0; i < list.length; i++) {
					if (this.type == list[i].id) {
						list[i].unreadCount = 0
					}
				}
				uni.setStorageSync(`LocalShowNewsListIdUID${this.myId}`, list)
			},
			//下拉加载显示数据
			getIntegraltwo() {
				if (this.pageSize >= this.total){
					this.status='noMore'
					// uni.hideNavigationBarLoading()
				}
				this.pageSize = this.pageSize + 10
				$https.get('/notificationMessage/messageList?page=' + this.page + '&pageSize=' + this.pageSize + '&type=' + this.type)
					.then(res => {
						console.log(res)
						this.total = res.data.total
						this.integralList = res.data.list
				})
			},
			//第一次显示数据
			getIntegral() {
				$https.get('/notificationMessage/messageList?page=' + this.page + '&pageSize=' + this.pageSize + '&type=' + this.type)
					.then(res => {
						console.log(res)
						this.total = res.data.total
						this.integralList = res.data.list
					})
			}
		}
	}
</script>

<style scoped>
	.page {
		/* background: red; */
		background-color: #F6F6F6;
		height: 100%;
		min-height: 100vh;
	}

	.notice {
		text-align: center;
		margin-bottom: 5upx;
		font-size: 20upx;
		color: #979797;
	}

	.box {
		width: 90%;
		height: auto;
		padding: 20upx;
		border-radius: 10px;
		background: white;
		margin: 0 auto;
	}

	.boxes {
		margin-bottom: 20upx;
	}

	.title {
		font-size: 32upx;
		color: #000000;
		font-weight: 400;
		margin-bottom: 20upx;
	}

	.details {
		color: #979797;
		font-size: 28upx;
	}
</style>
