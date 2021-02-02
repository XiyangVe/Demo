<template>
	<view>
		
		<view class="qun-msg-list">
			<uni-swipe-action>
				<block v-for="(item, index) in list" :key="item.id">
					<!-- @click="click($event,index,item.isTop)" -->
					<uni-swipe-action-item>
						<view :data-toId="item.id" :data-toName="item.name" :data-toImg="item.avatar" class="item u-border-bottom"
						 :data-toSigna="item.signature" @click="navigate($event,item.type,item.id)">
							<view>
								<image class="img" :src="`${baseUrl}${item.avatar}`" mode=""></image>
							</view>
							<view class="system">
								<view class="">
									{{item.name}}
								</view>
						
								<view class="notice">
									<text>{{item.content}}</text>
								</view>
							</view>
							<view  class="times notice" style="width:150upx;" v-if="item.unreadCount==0">
								{{item.time | timeFrom}}
							</view>
							<view style="width:150upx;" v-else>
								<view class="notice" style="text-align: center;">
									{{item.time | timeFrom}}
								</view>
								<view class="read notice">
									<span>{{item.unreadCount}}</span>
								</view>
							</view>
							<view class="title-wrap">
								<text class="title u-line-2"></text>
							</view>
						</view>
					</uni-swipe-action-item>
				</block>
			</uni-swipe-action>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import $https from '@/utils/lib/https.js';
	import {uniSwipeAction,uniSwipeActionItem} from '@dcloudio/uni-ui'
	export default {
		components:{
			uniSwipeAction,
			uniSwipeActionItem
		},
		data() {
			return {
				list: [],
				disabled: false,
				btnWidth: 180,
				show: false,
			}
		},
		onShow() {
			this.getNews()
		},
		watch: {
			listCount(val) {
				this.getNews()
			}

		},
		computed: {
			listCount() {
				console.log(this.$store.state.news.counts)
				return this.$store.state.news.counts;
			}
		},

		methods: {
			navigate(e, type,id) {
				if (type == 0) {
					let toId = e.currentTarget.dataset.toid
					let toName = e.currentTarget.dataset.toname
					let toImg = e.currentTarget.dataset.toimg
					let toSigna = e.currentTarget.dataset.tosigna
					uni.navigateTo({
						url: `../../pagesA/news/chat?toId=${toId}&toName=${toName}&toImg=${toImg}&toSigna=${toSigna}`
					})
				} else if (type == 1) {
					this.$u.route('/pagesB/groupChat/groupChat', {
						groupName: e.currentTarget.dataset.toname,
						groupId: e.currentTarget.dataset.toid
					})
				} else{
					console.log(id)
					let toId = e.currentTarget.dataset.toid
					if(id==2||id==3){
						uni.navigateTo({
							url: `order?type=${id}`
						})
					}else if(id==7||id==6){
						uni.navigateTo({
							url: `accountInfo?type=${id}`
						})
					}else if(id==5){
						console.log('22222222')
						uni.navigateTo({
							url: `groupNotice?type=${id}`
						})
					}
					
					// uni.navigateTo({
					// 	url: 'merchants'
					// })
					
				}

			},
			getNews() {
				this.list=[]
				console.log(uni.getStorageSync(`LocalShowNewsListIdUID${this.myId}`))
				var list = uni.getStorageSync(`LocalShowNewsListIdUID${this.myId}`)
				for(let i=0;i<list.length;i++){
					if(list[i].type==1){
						this.list.push(list[i])
					}
				}
				this.list.sort(function(a, b) {
					return b.time - a.time
				})
			},
		}
	}
</script>

<style>
	.box {
		display: flex;
	}

	.messages {
		font-size: 32upx;
		font-weight: 400;
		line-height: ;
		margin: 0 30upx;
		line-height: 80upx;
	}

	.add {
		margin: 0 30upx;
		font-size: 60upx;
	}

	.system {
		width: 70%;
	}

	.img {
		width: 64upx;
		height: 64upx;
		margin: 4upx 15upx;
	}

	.notice {
		font-size: 20upx;
		color: #979797;
	}

	.times {
		text-align: center;
		line-height: 64upx;
	}

	.read {
		width: 30upx;
		height: 30upx;
		border-radius: 30upx;
		text-align: center;
		margin: 5upx auto;
		background: red;
		color: #FFFFFF;
		box-shadow: 0px 8upx 12upx 0px rgba(255, 105, 105, 0.40);
	}

	.item {
		width: 100%;
		display: flex;
		padding: 20rpx;
	}
</style>
