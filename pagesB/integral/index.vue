<template>
	<view>
		<!--头部-->
		<integral-head :userInfo="userInfo"></integral-head>
		<!--积分导航分类-->
		<view class="title-class u-f-ajc">
			<view class="item u-f-ajc" v-for="(item,index) in  titleClass" :key="index" :data-index="index" @tap="navigateTo">
				<image :src="item.icon" mode="widthFix" style="width: 100rpx;border-radius:50%;"></image> 
				<view>{{item.text}}</view> 
			</view>
		</view>
		<!--商城轮播图-->
		<view class="swiper-box">
			<u-swiper :list="swiperList" effect3d interval="5000" border-radius="15" title></u-swiper>
		</view>
		<!--积分内容-->
		<view class="content"></view>
		<!-- 加载动画 -->
		<view class="loading-box">
			<u-loading mode="circle" size="80" color="#00FF00" :show="loadingShow"></u-loading>
		</view>
	</view>
</template>

<script>
	import integralHead from '../components/integral/integral-head.vue'
	export default {
		components:{
			integralHead
		},
		data() {
			return {
				// 控制加载动画显示隐藏
				loadingShow: true,
				userInfo:{},
				titleClass:[
					{
						icon:'../static/shop/all.png',
						text:'积分商城'
					},
					{
						icon:'../static/shop/integral-give.png',
						text:'赠送积分'
					},
					{
						icon:'../static/shop/oders.png',
						text:'订单记录'
					}
				],
				swiperList:[
					{
						image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
						title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
					}
				]
			}
		},
		onLoad() {
			this.getUserInfo()
		},
		methods: {
			// 获取用户信息
			getUserInfo(){
				this.$u.api.getUserInfo().then(res=>{
					if(res.code==200){
						// 存放到VueX全局
						// this.$store.commit("user/SET_USER_INFO",res.data)
						this.userInfo = res.data.user
						this.loadingShow = false
					}else{
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				})
			},
			// 积分导航路由跳转
			navigateTo(e){
				let {index} = e.currentTarget.dataset
				//#ifdef APP-PLUS
					index = `${index}`
				//#endif
				switch(index) {
						case '0':
						//积分订单记录
						uni.navigateTo({
							url:'./shop'
						})
					break;
						case '1':
						//积分订单记录
						uni.navigateTo({
							url:'./giveIntegral'
						})
					break;
						case '2':
						//积分订单记录
						uni.navigateTo({
							url:'./orders'
						})
					break;
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	
	.title-class{
		width: 100%;
		.item{
			flex: 1;
			flex-flow: column;
		}
	}
	.swiper-box{
		margin: 30rpx;
		width: 690rpx;
		height: 230rpx;
		swiper{
			width: 100%;
			height: 100%;
		}
	}
</style>
