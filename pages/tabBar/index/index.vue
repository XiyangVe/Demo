<template>
	<view>
		<!--当用户无网提示-->
		<u-no-network></u-no-network>
		<!--自定义导航栏-->
		<cmd-navbar :type="'index'"></cmd-navbar>
		<!-- 轮播图 -->
		<view class="p-2">
			<u-swiper height="240" :list="lbtList"></u-swiper>
		</view>
		<!-- 菜单导航栏 -->
		<view class="flex align-center justify-between" style="height: 200rpx;">
			<view class="flex flex-column align-center justify-center flex-1" 
			style="height: 200rpx;"
			hover-class="bg-light"
			@click="menuClick(mitem)"
			v-for="(mitem,mindex) in menuList" :key="mindex">
				<image :src="mitem.img" mode="heightFix" style="height: 40rpx;"></image>
				<text class="font-small text-dark pt-1">{{mitem.title}}</text>
			</view>
		</view>
		<!-- 精选好物 -->
		<view class="mx-2 rounded" style="background: linear-gradient(82deg,#0077FF, #C5E0FF);height: 450rpx;">
			<view class="px-1 py-2">
				<u-icon name="bag" color="#FFFFFF" size="28"></u-icon>
				<text class="font text-white ml-1">精选好物</text>
			</view>
			<view class="bg-white rounded mx-2 flex align-center" style="height: 350rpx;">
				<view class="flex-1 flex justify-center">
					<image src="/static/index/1.png" mode="aspectFill" style="width: 194rpx;height: 328rpx;"></image>
				</view>
				<view class="flex-2">
					<view class="flex align-center justify-between flex-wrap mx-1">
						<block v-for="(item,index) in jingpinList" :key="index">
							<image @click="toShopGoods(item)" :src="`${baseUrl}${item.recommendImage}`" mode="aspectFill" class="my-1" style="width: 132rpx;height: 160rpx;"></image>
						</block>
					</view>
				</view>
			</view>
		</view>
		<!-- 动态 -->
		<view class="mt-4">
			<view class="flex align-center pl-1 mx-2 rounded-top" style="background: linear-gradient(82deg,#0077FF, #C5E0FF);height: 60rpx;">
				<uni-icons type="spinner-cycle" color="#ffffff"></uni-icons>
				<text class="font text-white pl-2">动态</text>
			</view>
			<view class="mx-2 position-relative left-0 right-0">
				<image style="height: 312rpx;width: 710rpx;" src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=234948622,3080389771&fm=26&gp=0.jpg" mode="aspectFill"></image>
				<view class="position-absolute left-0 right-0" style="top: 20rpx;">
					<text class="font text-white pl-2">年关将至，朋友们新年快乐呀</text>
				</view>
				<view class="position-absolute left-0 right-0 flex align-center justify-end" 
				style="bottom: 20rpx;"
				@click="navigateTo">
					<text class="font text-white">查看更多动态</text>
					<uni-icons type="arrowright" color="#ffffff"></uni-icons>
				</view>
			</view>
		</view>
		<!-- 秒杀&拼团 -->
		<view class="bg-light flex align-center justify-between" style="height: 420rpx;">
			<view class="flex-1 flex flex-column align-center bg-white rounded ml-2" 
			style="height: 366rpx;"
			hover-class="bg-light">
				<view class="flex align-center py-2">
					<text class="font text-dark">限时秒杀</text>
					<uni-countdown color="#FFFFFF" 
					background-color="#0077FF" 
					border-color="#0077FF" 
					splitor-color="#FF6969"
					:hour="2" :minute="30" :second="0"
					:show-day="false"></uni-countdown>
				</view>
				<view class="">
					<image style="width: 316rpx;height: 186rpx;" src="https://cdn.uviewui.com/uview/swiper/1.jpg" mode="aspectFill"></image>
				</view>
				<view class="flex align-center justify-between mt-2 px-1"
				style="width: 340rpx;">
					<view class="font" style="color: #FF8800;">229.99</view>
					<view class="font-sm text-light-muted" style="text-decoration: line-through;">366.66</view>
				</view>
			</view>
			<view class="flex-1 bg-white rounded mx-2" 
			style="height: 366rpx;"
			hover-class="bg-light">
				<view class="px-2 py-3">
					<text class="font text-dark">拼团抢购</text>
				</view>
				<view class="flex flex-column align-center">
					<view class="">
						<image style="width: 316rpx;height: 186rpx;" src="https://cdn.uviewui.com/uview/swiper/1.jpg" mode="aspectFill"></image>
					</view>
					<view class="flex align-center justify-between mt-2 px-1"
					style="width: 340rpx;">
						<view class="font" style="color: #FF8800;">229.99</view>
						<view class="font-sm text-light-muted" style="text-decoration: line-through;">366.66</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 好物推荐&热点资讯&关注 -->
		<view class="bg-light">
			<u-subsection bg-color="#f8f9fa" button-color="#f8f9fa" inactive-color="#343a40" active-color="#0077FF" 
			:list="items" :current="current" @change="onClickItem"
			mode="button"></u-subsection>
			<view class="">
				<view v-if="current === 0">
					<u-waterfall v-model="flowList" ref="uWaterfall">
						<template v-slot:left="{ leftList }">
							<view class="demo-warter" v-for="(item, index) in leftList" :key="index" @click="toShopGoods(item)">
								<u-lazy-load threshold="-450" border-radius="10" :image="`${baseUrl}${item.recommendImage}`" :index="index"></u-lazy-load>
								<view class="demo-title">{{ item.goodsName }}</view>
								<view class="flex align-center justify-between">
									<view class="main-text-color">
										<text class="font-small">￥</text>
										<text class="font-sm">{{ item.goodsPrice }}</text>
									</view>
									<view class="demo-shop">销量:{{ item.goodsSaleNum }}</view>
								</view>
							</view>
						</template>
						<template v-slot:right="{ rightList }">
							<view class="demo-warter" v-for="(item, index) in rightList" :key="index" @click="toShopGoods(item)">
								<u-lazy-load threshold="-450" border-radius="10" :image="`${baseUrl}${item.recommendImage}`" :index="index"></u-lazy-load>
								<view class="demo-title">{{ item.goodsName }}</view>
								<view class="flex align-center justify-between">
									<view class="main-text-color">
										<text class="font-small">￥</text>
										<text class="font-sm">{{ item.goodsPrice }}</text>
									</view>
									<view class="demo-shop">销量:{{ item.goodsSaleNum }}</view>
								</view>
							</view>
						</template>
					</u-waterfall>
					<uni-load-more class="bg-light" :status="loadMoreStatus"></uni-load-more>
				</view>
				<view v-if="current === 1">
					<!-- 资讯内容列表 -->
					<view class="bg-white">
						<block v-for="(item,index) in newsList" :key="index">
							<!-- 没有上传封面 -->
							<view v-if="item.cover===null" 
								class="p-2" hover-class="bg-light" 
								style="border-bottom: #F9F9F9 solid 2rpx;"
								@click="toNewsDetails(item)">
								<text class="h5">{{item.title}}</text>
								<view class="">
									<text class="font-sm text-muted">{{item.userName}}</text>
									<text class="font-sm text-muted mx-3">{{item.countByMpId}}评论</text>
									<text class="font-sm text-muted">{{item.createTime | date('yyyy-mm-dd hh:MM')}}</text>
								</view>
							</view>
							<!-- 上传了封面和多张封面 -->
							<view v-if="item.cover!==null&&item.messType===1" 
								class="p-2"
								:class="item.coverList.length===1 ? 'flex align-center' : ''"
								hover-class="bg-light" 
								style="border-bottom: #F9F9F9 solid 2rpx;" 
								@click="toNewsDetails(item)">
								<view :class="item.coverList.length===1 ? 'flex-3' : ''">
									<text class="h5">{{item.title}}</text>
									<view class="flex" v-if="item.coverList.length>1">
										<block v-for="(img,i) in item.coverList" :key="i">
											<image class="mx-1" :src="`${baseUrl}${img}`" style="width: 230rpx;height: 160rpx;" mode="aspectFill"></image>
										</block>
									</view>
									<view class="">
										<text class="font-sm text-muted">{{item.userName}}</text>
										<text class="font-sm text-muted mx-3">{{item.countByMpId}}评论</text>
										<text class="font-sm text-muted">{{item.createTime | date('yyyy-mm-dd hh:MM')}}</text>
									</view>
								</view>
								<view class="flex-1" v-if="item.coverList.length===1">
									<image :src="`${baseUrl}${item.cover}`" class="rounded" style="width: 230rpx;height: 150rpx;" mode="aspectFill"></image>
								</view>
							</view>
							<!-- 视频 -->
							<view v-if="item.messType===0" @click="toNewsDetails(item)" class="p-2" hover-class="bg-light" style="border-bottom: #F9F9F9 solid 2rpx;">
								<text class="h5">{{item.title}}</text>
								<view class="flex justify-center align-center">
									<image class="position-relative" :src="`${baseUrl}${item.cover}`" style="width: 710rpx;height: 340rpx;" mode="aspectFill"></image>
									<view class="position-absolute">
										<u-icon name="play-circle" size="100" color="#fff"></u-icon>
									</view>
								</view>
								<view class="">
									<text class="font-sm text-muted">{{item.userName}}</text>
									<text class="font-sm text-muted mx-3">{{item.countByMpId}}评论</text>
									<text class="font-sm text-muted">{{item.createTime | date('yyyy-mm-dd hh:MM')}}</text>
								</view>
							</view>
						</block>
					</view>
				</view>
				<view v-if="current === 2">
					<view class="flex flex-wrap justify-between">
						<block v-for="(item,index) in attentionList" :key="index">
							<view @click="followClick(item)" class="bg-white rounded mx-1 my-2 position-relative left-0 right-0 top-0 bottom-0" style="width: 350rpx;height: 632rpx;">
								<image v-if="item.messType===0" style="width: 350rpx;height: 480rpx;" 
								:src="`${baseUrl}${item.vidioImg}`" mode="aspectFill"></image>
								<image v-if="item.messType===1" style="width: 350rpx;height: 480rpx;" 
								:src="!item.imgs ? '/static/index/null.png' : `${baseUrl}${item.imgs[0]}`" 
								mode="aspectFill"></image>
								<view v-if="item.messType===0" class="position-absolute" style="top: 20rpx;right: 20rpx;">
									<u-icon name="play-circle" color="#FFFFFF" size="50"></u-icon>
								</view>
								<view class="px-2">
									<text class="font text-dark">{{item.title}}</text>
								</view>
								<view class="flex align-center justify-between px-2 my-1">
									<view class="flex align-center">
										<image class="rounded-circle" style="width: 40rpx;height: 40rpx;" :src="`${baseUrl}${item.userHeadImage}`" mode="aspectFill"></image>
										<text class="font-small text-muted">{{item.userName}}</text>
									</view>
									<view class="flex align-center">
										<uni-icons v-if="collectedIds.some(v => v == item.id)" type="heart-filled" color="#ff6969"></uni-icons>
										<uni-icons v-else type="heart-filled" color="#A4A4A4"></uni-icons>
										<text class="font-small text-muted">{{item.messCollect}}</text>
									</view>
								</view>
							</view>
						</block>
					</view>
					<uni-load-more class="bg-light" :status="loadMoreStatus2"></uni-load-more>
				</view>
			</view>
		</view>
		<!-- 占位 -->
		<view style="height: 100rpx;" class="bg-light"></view>
	</view>
</template>

<script>
	import cmdNavbar from '@/components/commoms/cmd-navbar.vue';
	import { mapGetters } from 'vuex';
	
	export default {
		components: {
			cmdNavbar
		},
		data() {
			return {
				// 分段器参数
				current: 0,
				items: ['好物推荐','热点资讯','关注'],
				// 轮播图
				lbtList: [
					{
						image: '/static/index/5.jpg'
					},
					{
						image: '/static/index/6.jpg'
					}
				],
				menuList: [
					{
						img: '/static/index/mall.png',
						title: '商城',
						event: 'mall'
					},
					{
						img: '/static/index/jifen.png',
						title: '积分购',
						event: 'jifen'
					},
					{
						img: '/static/video-active.png',
						title: '视频',
						event: 'video'
					},
					{
						img: '/static/index/dongtai.png',
						title: '动态',
						event: 'dongtai'
					},
					{
						img: '/static/index/weather.png',
						title: '天气',
						event: 'weather'
					}
				],
				// 好物推荐
				flowList: [],
				// 资讯列表
				newsList: [],
				// 关注列表
				attentionList: [],
				// 好物推荐分页参数
				page: 1,
				pageSize: 10,
				// 关注动态分页
				gzPage: 1,
				// 精品好物
				jingpinList: [],
				// 加载更多状态
				loadMoreStatus: "more",
				loadMoreStatus2: "more"
			}
		},
		computed:{
			...mapGetters(['collectedIds'])
		},
		onLoad() {
			uni.$on('setStroe',(data)=>{
				this.setStroe(data)
			}) 
			this.getSlideshow()
			this.getGoodsList()
			this.getGoodsList2()
		},
		onUnload() {
			uni.$off('setStroe')
		},
		// 页面滚动到底部的事件
		onReachBottom() {
			console.log('页面滚动到底部的事件')
			if(this.current === 0){
				if(this.loadMoreStatus === 'noMore'){
					return;
				}
				this.loadMoreStatus = 'loading'
				setTimeout(() => {
					this.page ++
					this.getGoodsList2()
				},1500)
			}
			
			if(this.current === 2){
				setTimeout(() => {
					if(this.loadMoreStatus2 === 'noMore'){
						return;
					}
					this.loadMoreStatus2 = 'loading'
					setTimeout(() => {
						this.gzPage ++
						this.getAttentionList()
					},2000)
				},1500)
			}
			
		},
		methods: {
			// 分段器点击事件
			onClickItem(e){
				this.current = e
				switch (e){
					case 0:
					this.page = 1
					this.flowList = []
					this.getGoodsList2()
						break;
					case 1:
					this.getHotNewsList()
						break;
					case 2:
					this.gzPage = 1
					this.attentionList = []
					this.getAttentionList()
						break;
				}
			},
			// 菜单导航分发事件
			menuClick(e){
				switch (e.event){
					case "video": // 视频
					uni.navigateTo({
						url: '/pages/video/video-demo'
					})
						break;
					case "mall": // 商城
					uni.navigateTo({
						url: '/pagesC/mall/sort'
					})
						break;
					case "jifen": // 积分商城
					uni.navigateTo({
						url: '/pagesB/integral/index'
					})
						break;
					case "dongtai": // 动态
					uni.navigateTo({
						url: '/pages/index/index'
					})
						break;
					case "weather": // 天气
					uni.navigateTo({
						url: '/pagesA/weather/index'
					})
						break;
				}
			},
			// 获取轮播图
			getSlideshow(){
				this.$u.api.getSlideshow().then(res => {
					var img = {}
					if(res.data.length>0){
						res.data.map(item => {
							this.$set(img,"image",`${this.baseUrl}`+item.slideshowImage)
						})
						this.lbtList.push(img)
					}
				})
			},
			// 获取商品列表(精选)
			getGoodsList(){
				this.$u.api.queryGoods({
					isIntegralMall: 0,
					isBest: 1,
					page: 1,
					pageSize: 6
				}).then(res => {
					this.jingpinList = res.data.list
				})
			},
			// 获取商品列表(推荐)
			getGoodsList2(){
				this.$u.api.queryGoods({
					isIntegralMall: 0,
					isHot: 1,
					page: this.page,
					pageSize: this.pageSize
				}).then(res => {
					this.flowList = this.flowList.concat(res.data.list)
					if(res.data.list.length < this.pageSize){
						this.loadMoreStatus = 'noMore'
					}else{
						this.loadMoreStatus = 'more'
					}
				})
			},
			// 查看商品详情(推荐)
			toShopGoods(item){
				if(item.merUse == 1){
					this.$u.route('/pagesC/mall/goodsDetails', {
						goodsId: item.id,
						merId: item.merId
					})
				}else{
					this.$u.route('/pagesC/mall/goodsDetails', {
						goodsId: item.id
					})
				}
			},
			// 查看更多动态
			navigateTo(){
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
			// 获取热门资讯列表 /messPublish/queryByUserIdOrMsgAudit
			async getHotNewsList(){
				const res = await this.$https.get('/messPublish/queryByUserIdOrMsgAudit',{pageNo: 1})
				console.log(res)
				res.data.list.map(e => {
					if(e.cover!==null){
						let list = e.cover.split(",")
						this.$set(e,'coverList',list)
					}
				})
				this.newsList = res.data.list
			},
			// 查看资讯详情
			toNewsDetails(e){
				this.$u.route('/pages/news/newsDetails/newsDetails', {
					id: e.id,
					typeId: e.messTypeId
				})
				this.$store.commit('index/getNewsNodes',e)
			},
			// 获取关注动态数据列表
			getAttentionList(){
				this.$u.api.getMessPublish({
					messTypeId:9,
					pageNo: this.gzPage,
					messSortGrade:1,
					currentAddr: '重庆'
				}).then(res=>{
					this.attentionList = this.attentionList.concat(res.data.list)
					if(res.data.list.length < 20){
						this.loadMoreStatus2 = 'noMore'
					}else{
						this.loadMoreStatus2 = 'more'
					}
				})
			},
			// 查看关注动态详情
			followClick(e){
				if(e.messType===0){
					this.$store.commit('index/setVideoId',e.id)
					uni.navigateTo({
						url: '/pages/Test/Test?id=' + e.id
					})
				}else{
					uni.navigateTo({
						url: '/pagesA/index/details?id=' + e.id
					})
				}
			},
			//收藏事件回调
			setStroe(data){
				let index = this.attentionList.findIndex(v=>{
					return data.mesId == v.id
				})
				data.type ? this.attentionList[index].messCollect++ : this.attentionList[index].messCollect--
			}
		}
	}
</script>

<style scoped lang="scss">
.demo-warter {
	border-radius: 8px;
	margin: 5px;
	background-color: #ffffff;
	padding: 8px;
	position: relative;
}
.demo-image {
	width: 100%;
	border-radius: 4px;
}
.demo-title {
	font-size: 30rpx;
	margin-top: 5px;
	color: $u-main-color;
	word-break: break-all;
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
.demo-shop {
	font-size: 22rpx;
	color: $u-tips-color;
	margin-top: 5px;
}
</style>
