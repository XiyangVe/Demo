<template>
	<view>
		<!-- <scroll-view scroll-y="true"> -->
		<!-- :style="{height:height}" -->
		<u-navbar :is-back='true' back-icon-color="#ffffff" title-color="#ffffff" :title='title' :background="{'background-color':'#6aa8d8'}"
		 height="50">
		</u-navbar>
		<view class="page">
			<view class="boxes" v-for="item in integralList">
				<view class="notice">
					{{item.createTime | timeFrom}}
				</view>
				<view class="box">
					
					<!-- <view class="title">
						<image class="imgs" src="../../static/images/Avatar-1.png" mode=""></image>
						<text style="line-height: 60upx;">华润富农旗舰店</text>
					</view> -->
					<view class="details">
						<view>
							<image class="imgs1" :src="`${baseUrl}${item.extend.orderDetails[0].recommendImage}`" mode=""></image>
						</view>
						<view>
							<view class="titles">
								{{item.title}}
							</view>
							<view class="content">
								{{item.content}}
							</view>
							<view class="">
								请注意物流信息,<text style="color: #0077FF;" v-if="title=='物流消息'">查看物流信息</text>
								<text style="color: #0077FF;" v-if="title=='订单消息'">查看订单信息</text>
							</view>
						</view>
			
					</view>
				</view>
			</view>
		</view>
		
		<!-- </scroll-view> -->


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
			this.type = e.type
			if(e.type==3){
				this.title='订单消息'
			}else if(e.type==2){
				this.title='物流消息'
			}
			this.clearNoMessage()
			this.getIntegral()
		},
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
			getIntegral() {
				$https.get('/notificationMessage/messageList?page=' + this.page + '&pageSize=' + this.pageSize + '&type=' + this.type)
					.then(res => {
						for(let i =0;i<res.data.list.length;i++){
							res.data.list[i].extend=JSON.parse(res.data.list[i].extend)
						}
						this.total = res.data.total
						this.integralList = res.data.list
						console.log(this.integralList)
					})
			}
		}
	}
</script>

<style scoped>
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

	.imgs {
		width: 40upx;
		height: 40upx;
		vertical-align: middle;
		margin: 0 20upx;
	}

	.imgs1 {
		width: 120upx;
		height: 120upx;
		padding: 0 10upx 10upx 10upx;
	}

	.box {
		width: 90%;
		height: auto;
		/* padding: 20upx; */
		border-radius: 10px;
		background: white;
		margin: 0 auto;
	}

	.content {
		color: #979797;
		font-size: 28upx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		display: -moz-box;
		-moz-line-clamp: 2;
		-moz-box-orient: vertical;
		word-wrap: break-word;
		word-break: break-all;
		white-space: normal;
	}

	.boxes {
		margin-bottom: 20upx;
	}

	.titles {
		height: auto;
		/* padding: 10upx; */
		font-weight: bolder;
		color: #000000;
		font-size: 30upx;
	}

	.title {
		font-size: 32upx;
		line-height: 80upx;
		color: #000000;
		font-weight: 400;
		border-bottom: 1px solid #f0f0f0;
	}

	.details {
		color: #979797;
		font-size: 28upx;
		display: flex;
		padding: 10upx 0;
	}
</style>
