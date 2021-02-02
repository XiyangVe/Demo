<template>
	<view style="background: linear-gradient(180deg,#ffffff, #f0f0f0);" :style="'height:' +windowHeight+ 'px;'">
		 <!-- 这里是状态栏 -->
		<view class="status_bar"></view>
		<view class="px-2 pt-5 flex align-center justify-between">
			<view class="flex align-center">
				<image :src="`${baseUrl}${myImg}`" mode="aspectFill" class="rounded-circle" style="height: 120rpx;width: 120rpx;"></image>
				<view class="flex flex-column ml-2">
					<text class="font-md text-dark font-weight-bolder">{{myName}}</text>
					<view class="mt-2" @click="toUserGrade">
						<text class="main-text-color font">Lv{{level}}</text>
					</view>
				</view>
			</view>
			<view class="" @click="toUserInfoSet">
				<u-icon name="arrow-right" color="#0077FF" size="40"></u-icon>
			</view>
		</view>
		
		<view class="flex align-center justify-between m-2">
			<view class="flex-1 flex flex-column justify-center align-center" style="height: 104rpx;">
				<view class="">
					<text class="font text-dark">{{userInfo.dynamicNum}}</text>
				</view>
				<view class="">
					<text class="font-sm" style="color: #979797;">动态</text>
				</view>
			</view>
			<view class="flex-1 flex flex-column justify-center align-center" style="height: 104rpx;">
				<view class="">
					<text class="font text-dark">{{userInfo.pocNum}}</text>
				</view>
				<view class="">
					<text class="font-sm" style="color: #979797;">关注</text>
				</view>
			</view>
			<view class="flex-1 flex flex-column justify-center align-center" style="height: 104rpx;">
				<view class="">
					<text class="font text-dark">{{userInfo.fansNum}}</text>
				</view>
				<view class="">
					<text class="font-sm" style="color: #979797;">粉丝</text>
				</view>
			</view>
			<view class="flex-1 flex flex-column justify-center align-center" style="height: 104rpx;">
				<view class="">
					<text class="font text-dark">{{collectedIds.length}}</text>
				</view>
				<view class="">
					<text class="font-sm" style="color: #979797;">收藏</text>
				</view>
			</view>
		</view>
		
		<view class="flex align-center justify-between bg-white m-2 rounded">
			<view class="flex-1 flex flex-column justify-center align-center" 
				style="height: 120rpx;"
				hover-class="bg-light"
				v-for="(i,idx) in listTwo" :key="idx"
				@click="topEventClick(i.event)">
				<image :src="i.icon" mode="widthFix" style="width: 48rpx;height: 48rpx;"></image>
				<view class="">
					<text class="font-sm text-dark">{{i.name}}</text>
				</view>
			</view>
		</view>
		
		<view class="m-2 bg-white rounded" style="height: 452rpx;">
			<view class="p-2">
				<text class="font-md text-dark">小工具</text>
			</view>
			<view class="flex align-center justify-between flex-wrap">
				<view class="flex flex-column align-center justify-center" 
					style="width: 25%;height: 178rpx;"
					hover-class="bg-light"
					v-for="(u,uidx) in listThree" :key="uidx"
					@click="eventClick(u.event)">
					<image :src="u.icon" mode="widthFix" style="width: 40rpx;height: 40rpx;"></image>
					<view class="">
						<text class="font-sm text-dark">{{u.name}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 发布弹出层 -->
		<uni-popup style="z-index: 9999;" ref="popup" type="bottom">
			<view class="bg-white rounded-top flex align-center justify-between" style="height: 300rpx;">
				<view class="flex flex-column align-center flex-1 py-3" 
				hover-class="bg-light"
				v-for="(pitem,pindex) in list" :key="pindex"
				@click="popupClick(pitem.event)">
					<image :src="pitem.img" style="width: 48rpx;height: 48rpx;"></image>
					<text class="text-dark font pt-2">{{pitem.title}}</text>
				</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	
	export default {
		data() {
			return {
				list: [
					{
						img: '/static/my/dongtai.png',
						title: '图文动态',
						event: 'dongtai'
					},
					{
						img: '/static/video-active.png',
						title: '视频动态',
						event: 'video'
					},
					{
						img: '/static/my/wenzhang.png',
						title: '文章资讯',
						event: 'wenzhang'
					},
					{
						img: '/static/my/video.png',
						title: '视频资讯',
						event: 'videoNews'
					}
				],
				listTwo:[
					{
						icon: '/static/my/wallet.png',
						name: '钱包',
						event: 'wallet'
					},
					{
						icon: '/static/my/integral.png',
						name: '积分',
						event: 'integral'
					},
					{
						icon: '/static/my/schedule.png',
						name: '日程',
						event: 'schedule'
					},
					{
						icon: '/static/my/release.png',
						name: '发布',
						event: 'release'
					}
				],
				listThree:[
					{
						icon: '/static/my/Promote.png',
						name: '推广',
						event: ''
					},
					{
						icon: '/static/my/tongxunlu.png',
						name: '通讯录备份',
						event: ''
					},
					{
						icon: '/static/my/ad.png',
						name: '广告',
						event: 'ad'
					},
					{
						icon: '/static/my/data.png',
						name: '数据分析',
						event: ''
					},
					{
						icon: '/static/my/Order.png',
						name: '订单',
						event: 'order'
					},
					{
						icon: '/static/my/Feedback.png',
						name: '反馈',
						event: ''
					},
					{
						icon: '/static/my/kefu.png',
						name: '客服',
						event: ''
					},
					{
						icon: '/static/my/seting.png',
						name: '设置',
						event: 'set'
					}
				],
				// 动态获取页面高度
				windowHeight: 0
			}
		},
		computed:{
			...mapState({
				userInfo: state => state.user.userInfo,
				collectedIds: state => state.user.collectedIds
			})
		},
		onLoad() {
			const res = uni.getSystemInfoSync();
			this.windowHeight = res.windowHeight
		},
		onShow() {
			this.$store.dispatch('user/getUserInfo')
		},
		methods: {
			// 发布弹出层分发事件
			popupClick(event){
				switch (event){
					case "dongtai":
					uni.navigateTo({
						url: '/pagesB/user/release/addItem'
					})
						break;
					case "video":
					uni.navigateTo({
						url: '/pagesB/user/release/addVideo'
					})
						break;
					case "wenzhang":
					uni.navigateTo({
						url: '/pages/news/addNews/addNews'
					})
						break;
					case "videoNews":
					uni.navigateTo({
						url: '/pages/news/addNews/add-video-news'
					})
						break;
				}
			},
			// 钱包栏分发事件
			topEventClick(event){
				switch (event){
					case 'wallet': //钱包
					uni.navigateTo({
						url: '/pages/user/balance'
					})
						break;
					case 'integral': //积分
					uni.navigateTo({
						url: '/pagesB/integral/index'
					})
						break;
					case 'schedule': //日程
					uni.navigateTo({
						url:'/pagesB/user/schedule/list'
					})
						break;
					case 'release': //发布
					this.$refs.popup.open()
						break;
				}
			},
			// 小工具分发事件
			eventClick(event){
				switch (event){
					case 'set':
					uni.navigateTo({
						url:'/pagesB/user/userSet'
					}) 
						break;
					case 'order':
					uni.navigateTo({
						url:'/pagesC/order/index'
					}) 
						break;
					case 'ad':
					uni.navigateTo({
						url:'/pages/user/ad/ad'
					}) 
						break;
				}
			},
			//跳转到个人中心用户等级
			toUserGrade() {
				uni.navigateTo({
					url:'/pagesB/user/info/userGrade'
				})
			},
			//跳转到个人中心用户数据设置
			toUserInfoSet() {
				uni.navigateTo({
					url:`/pagesB/user/userSpace?id=${this.myId}`
				}) 
			},
		}
	}
</script>

<style scoped>
	
</style>
