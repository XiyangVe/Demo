<template>
	<view>
		<!-- 自定义导航栏 -->
		<u-navbar :is-back="false" :border-bottom="false">
			<view class="slot-wrap" style="height: 68rpx;">
				<view class="flex-1 flex justify-center">
					<text class="font font-weight-bolder">资讯</text>
				</view>
				<view class="flex-5 flex justify-center">
					<input class="bg-light border rounded-circle px-2" 
						style="height: 68rpx;width: 100%;" 
						type="text" placeholder="搜索"/>
				</view>
				<view class="flex-1 flex justify-center" hover-class="bg-light" @click="toAddNews()">
					<u-icon name="plus" size="50"></u-icon>
				</view>
			</view>
		</u-navbar>
		<!-- 头部导航栏 -->
		<view style="white-space: nowrap;height: 100rpx;z-index: 999;" class="flex align-center position-fixed left-0 right-0 border-bottom bg-white">
			<scroll-view scroll-x style="width: 700rpx;">
				<view class="flex align-center" style="width: 700rpx;white-space: nowrap;">
					<view v-for="(item,index) in tabList" :key="index">
						<view class="mx-2" @click="tabsChange(index,item)">
							<text :class="action===index ? 'font-md text-primary font-weight-bolder' : 'font text-dark'">{{item.name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="position-absolute right-0" style="width: 50rpx;">
				<u-icon name="list" color="#777f8e" size="50"></u-icon>
			</view>
		</view>
		<!-- 二级分类区域 -->
		<view v-if="action2Show"
			class="position-fixed left-0 right-0 bg-white flex flex-wrap" 
			style="z-index: 998;border-radius: 0px 0px 10px 10px;box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16); " :style="'top:' +fixedTop+ 'px;'">
			<view class="p-2" v-for="(i,index2) in childTabList" :key="index2" @click="actionChange(i,index2)">
				<text :class="action2===index2 ? 'font text-primary' : 'font text-dark'">{{i.messTypeName}}</text>
			</view>
		</view>
		<!-- 资讯内容列表 -->
		<view class="position-relative left-0 right-0" style="top: 100rpx;">
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
			<uni-load-more :status="loadMoreStatus"></uni-load-more>
		</view>
		<!-- 占位 -->
		<view style="height: 100rpx;"></view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	
	export default {
		data() {
			return {
				tabList:[],
				childTabList:[],
				action: 0,
				action2: 0,
				// 资讯列表
				newsList: [],
				// 控制二级分类显示隐藏
				action2Show: false,
				// 距离顶部位置
				fixedTop: 0,
				// 分类id
				sortId: null,
				// 分页
				pageNo: 1,
				loadMoreStatus: 'more'
			}
		},
		computed:{
			...mapState({
				maps: state => state.goods.maps
			})
		},
		mounted() {
			// #ifdef APP-PLUS
			const res = uni.getSystemInfoSync();
			this.fixedTop = res.statusBarHeight + uni.upx2px(188)
			// #endif
			// #ifdef H5
			this.fixedTop = uni.upx2px(188)
			// #endif
			this.getTabList()
		},
		methods: {
			//获取tab
			async getTabList(){
				let res = await this.$u.api.getInfoShopMall()
				this.tabList = res.data.map( v =>{
					return {
						id:v.id,
						name:v.messTypeName,
					}
				})  
				this.getNewsList(res.data[0].id)
			},
			// 获取二级分类
			getNewsChildTab(id){
				this.$u.api.getNewsChildTab({
					id: id
				}).then(res=>{
					this.childTabList = res.data
					if(res.data.length>0){
						this.action2Show = true
					}
				})
			},
			// 获取资讯(消息)列表
			getNewsList(sortId){
				this.$https.get('/messPublish',{
					messTypeId: sortId,
					pageNo: this.pageNo,
					messSortGrade: 1,
					currentAddr: this.maps.address ? this.maps.address.province + this.maps.address.city + this.maps.address.district : '北京市北京市东城区',
				}).then(res => {
					res.data.list.map(e => {
						if(e.cover!==null){
							let list = e.cover.split(",")
							this.$set(e,'coverList',list)
						}
					})
					this.newsList = this.newsList.concat(res.data.list)
					if(res.data.list.length<20){
						this.loadMoreStatus = 'noMore'
					}else{
						this.loadMoreStatus = 'more'
					}
				})
			},
			// 一级分类切换
			tabsChange(index,e){
				this.newsList = []
				this.action = index
				this.getNewsChildTab(e.id)
				this.getNewsList(e.id)
				this.sortId = e.id
			},
			// 二级分类切换
			actionChange(e,index){
				this.newsList = []
				this.action2 = index
				this.getNewsList(e.id)
				this.action2Show = false
				this.sortId = e.id
			},
			// 查看资讯详情
			toNewsDetails(e){
				this.$u.route('/pages/news/newsDetails/newsDetails', {
					id: e.id,
					typeId: e.messTypeId
				})
				this.$store.commit('index/getNewsNodes',e)
			},
			// 发布资讯
			toAddNews(){
				uni.navigateTo({
					url: '/pages/news/addNews/addNews'
				})
			}
		},
		onReachBottom() {
			if(this.loadMoreStatus === 'noMore'){
				return;
			}
			this.loadMoreStatus = 'loading'
			setTimeout(()=>{
				this.pageNo ++
				this.getNewsList(this.sortId)
			},1500)
		}
	}
</script>

<style scoped>
	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
	}
</style>
