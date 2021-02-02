<template>
	<view>
		<!--导航栏-->
		<u-navbar  :title="id == myId ? '我的好友' : 'Ta的好友'">
		</u-navbar>
		<!--tab-->
		<view>
			<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false"  active-color="#f29100"
			 swiperWidth="750"></u-tabs-swiper>
		</view>
		<!-- {{concernedIds}} -->
		<u-gap height="20" bg-color="#f4f4f5" margin-top="10" margin-bottom="10"></u-gap>
		<swiper :style="{height:swiperheight + 'px'}" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" >
				<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
					<view class="contacts">
						<view class="item u-f-ac" v-for="(item,index) in follow" :key="index" :data-id="item.id" @tap="toUserSpase">
							<view class="pic">
								<u-image shape="circle" :src="`${baseUrl}${item.userHeadImage}`" mode="widthFix" style="width: 80rpx;" ></u-image>
							</view>
							<view class="info">
								<view class="name">
									{{item.nickname}}
								</view>
								<view class="autograph eps-1">
									{{item.signature}}
								</view>
							</view>
							<view class="is-follow">
								<u-button @click="setFriend" :data-id="item.id" v-if="concernedIds.some(v => v == item.id)" class="btn" plain style="background-color: #c0c4cc;">已关注</u-button> 
								<u-button @click="setFriend" :data-id="item.id" v-else class="btn" plain type="warning">+关注</u-button>
							</view>
						</view>
					</view>
					
				</scroll-view>
			</swiper-item>
			
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
					<view class="contacts">
						<view class="item u-f-ac" v-for="(item,index) in fans" :key="index" :data-id="item.id" @tap="toUserSpase">
							<view class="pic">
								<u-image shape="circle" :src="`${baseUrl}${item.userHeadImage}`" mode="widthFix" style="width: 80rpx;" ></u-image>
							</view>
							<view class="info">
								<view class="name">
									{{item.nickname}}
								</view>
								<view class="autograph eps-1">
									{{item.signature}}
								</view>
							</view>
							<view class="is-follow">
								<u-button @click="setFriend" :data-id="item.id" v-if="concernedIds.some(v => v == item.id)" class="btn" plain style="background-color: #c0c4cc;">已关注</u-button> 
								<u-button @click="setFriend" :data-id="item.id" v-else class="btn" plain type="warning">+关注</u-button>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default{
		data() {
			return {
				id:'',
				follow:[],
				fans:[],
				//高度自适应
				swiperheight:500,
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
			}
		},
		computed:{
			...mapGetters(['concernedIds']),
			list:function(){
				if(this.id == this.myId){
					return  [{
						name: '我的的关注'
					}, {
						name: '我的粉丝'
				},]
				}else{
					return  [{
							name: 'Ta的关注'
						}, {
							name: 'Ta的粉丝'
					},]
				}
			}
			
		},
		onLoad(e) {
			//查询屏幕高度,自动填写swpier高度
			uni.getSystemInfo({
				success: (res)=> {
					let height = 0
					//#ifdef APP-PLUS
					height = res.windowHeight - uni.upx2px(270)
					//#endif
					//#ifdef H5
					height = res.windowHeight - uni.upx2px(210)
					//#endif
					this.swiperheight = height;
				}
			});
			this.id = e.id
			this.getUserContacts()
		},
		methods:{
			//获取用户关注与粉丝
			async getUserContacts(){
				function obj(data){
					return {
						id:data.id,
						nickname:data.nickname,
						signature:data.signature,
						userHeadImage:data.userHeadImage
					}
				}
				let res = await this.$u.api.getOtherContacts({
					otherUserId:this.id, 
					pageNo:1
				})
				if(res.data.concerners){
					this.follow = res.data.concerners.map(v => {
						return obj(v)
					})
				}else{
					this.follow = []
				}
				if(res.data.fans){
					this.fans = res.data.fans.map(v=>{
						return obj(v)
					})
				}else{
					this.fans = []
				}
			},
			//关注与取关
			async setFriend(e){
				const {id} = e.currentTarget.dataset
				console.log(id)
				if(this.concernedIds.some(v => v == id)){
					console.log('取关')
					let res = await this.$u.api.removeFriend({
						concernerId:id
					})
					this.$store.dispatch('user/getUserInfo')
					this.$refs.uToast.show({
						title: res.msg,
						type: 'success',
						duration:500
					})
					if(this.id == this.myId) this.getUserContacts()
					
				}else{
					let res = await this.$u.api.addFriend({
						concernerId:id
					})
					this.$store.dispatch('user/getUserInfo') 
					this.$refs.uToast.show({
						title: res.msg,
						type: 'success',
						duration:500
					})
					//如果是自己关注列表那么就要刷新
					if(this.id == this.myId) this.getUserContacts()	
				}
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				
			},
			//跳转到用户空间
			toUserSpase(e){
				let {id} =  e.currentTarget.dataset
				console.log(id)
				uni.navigateTo({
					url:`./userSpace?id=${id}`
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.contacts{
		padding: 10rpx 20rpx;
		.item{
			border-bottom: 1rpx solid #f4f4f5;
			padding: 10rpx 0;
			.pic{
				flex: 2;
			}
			.info{
				position: relative;
				top: -10rpx;
				flex: 10;
				.name{
					color: #fa3534;
				}
				.autograph{
					color: #c0c4cc;
					font-size: 24rpx;
					width: 100%;
				}
			}
			.is-follow{
				flex: 3;
				.btn{
					font-size: 24rpx;
					height: 50rpx;
					width: 120rpx;
				}
			}
		}
	}
</style>
