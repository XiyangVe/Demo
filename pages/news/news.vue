<template>
	<view>
		<view v-if="loginState">
			<view style="height: 60upx;">
			
			</view>
			<view class="box">
				<text class="messages">消息</text>
				<u-search shape="round" :show-action="false" :clearabled="true" width="200px"></u-search>
				<text class="add">+</text>
			</view>
			<view class="qun-msg-list">
				<uni-swipe-action>
					<block v-for="(item, index) in list" :key="index">
						<!-- @click="click($event,index,item.isTop)" -->
						<uni-swipe-action-item :right-options="item.isTop==0?options:optionsCancel"  @click="click($event,index,item.isTop)">
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
		<view v-else>
			<to-login></to-login>
		</view>
		
		
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import $https from '@/utils/lib/https.js';
	import toLogin from '../../components/commoms/cmd-toLogin.vue'
	import {uniSwipeAction,uniSwipeActionItem} from '@dcloudio/uni-ui'
	export default {
		components:{
			uniSwipeAction,
			uniSwipeActionItem,
			toLogin
		},
		data() {
			return {
				list: [],
				disabled: false,
				btnWidth: 180,
				show: false,
				showNewsListId:[],
				options: [{
						text: '置顶',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				optionsCancel: [{
						text: '取消置顶',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				]
			}
		},
		onShow() {
			this.getNews()
			this.getNoMessage()
			console.log(this.$store.state.news.total)
		},
		watch: {
			listCount(val) {
				this.getNews()
				uni.setTabBarBadge({
						index: 2,
						text: this.$store.state.news.total
				})
				console.log(this.$store.state.news.total)
			},

		},
		computed: {
			listCount() {
				// console.log(this.$store.state.news.counts)
				return this.$store.state.news.counts;
			},
		},

		methods: {
			//获取未读消息数量
			getNoMessage(){
				let count=0
				let list=uni.getStorageSync(`LocalShowNewsListIdUID${this.myId}`)
				list.forEach((item)=>{
					count +=item.unreadCount;
				})
				count=count+''
				if(count==0){
					uni.removeTabBarBadge({
						index:2
					})	
				}else{
					uni.setTabBarBadge({
							index: 2,
							text: count
					})
				}
			},
			// getCount(){
			// 	let count = 0
			// 	this.$store.state.news.showNewsListId.forEach((item)=>{
			// 		count +=item.unreadCount;
			// 	})
			// 	this.count = count+''
			// 	console.log(this.count)
			// 	uni.setTabBarBadge({
			// 		index: 2,
			// 		text: this.count
			// 	})
			// },
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
				this.list = uni.getStorageSync(`LocalShowNewsListIdUID${this.myId}`)
				this.list.sort(function(a, b) {
					return b.isTop - a.isTop || b.time - a.time
				})
				console.log(this.list)
			},
			click(event,index,isTop) {
				console.log(event.index)
				console.log(index)
				if(event.index==0){
					if(isTop==0){
						console.log('置顶')
						this.list[index].isTop = 1
						uni.setStorageSync(`LocalShowNewsListIdUID${this.myId}`, this.list)
						setTimeout(()=>{
							this.getNews()
						},100)
						this.$u.toast(`置顶成功`);
					}else{
						this.list[index].isTop = 0
						uni.setStorageSync(`LocalShowNewsListIdUID${this.myId}`, this.list)
						setTimeout(()=>{
							this.getNews()
						},100)
						this.$u.toast(`取消成功`);
					}
					
				}else{
					this.list.splice(index, 1);
					uni.setStorageSync(`LocalShowNewsListIdUID${this.myId}`, this.list)
					setTimeout(()=>{
						this.getNews()
					},100)
					// this.$u.toast(`删除了第${index}个cell`);
				}
				console.log(this.list)
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
