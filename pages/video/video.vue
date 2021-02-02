<template>
	<view>
		<!--自定义导航栏-->
		<cmd-navbar :type="'index'" ></cmd-navbar>
		<video-card ref="list" type="cardIndex" :list="list"></video-card>
		<!-- 上拉加载更多 -->
		<u-loadmore :status="status" />
		<!-- 悬浮按钮 -->
		<uni-fab
				horizontal="right"
				:pattern="pattern"
				@fabClick="fabClick">
		</uni-fab>
	</view>
</template>

<script>
	import cmdNavbar from '../../components/commoms/cmd-navbar.vue'
	import videoCard from '../../components/video/video-card.vue'
	import uniFab from '@/components/uni-ui/uni-fab/uni-fab.vue'
	import { mapGetters } from 'vuex';
	export default {
		components: {
			cmdNavbar,
			videoCard,
			uniFab
		},
		data() {
			return {
				list: [],
				// 悬浮按钮样式
				pattern:{
					buttonColor: '#C5E0FF'
				},
				// 分页
				pageNo: 1,
				// 上拉加载更多
				status:"loadmore"
			}
		},
		computed: {
			...mapGetters(['friends','allNewsList','showNewsListId',]),
		},
		onShow() {
			this.getUserVidio()
		},
		onLoad() {
			// uni.$on('setStroeVideo',this.setStroeVideo) 
		},
		methods: {
			// 悬浮按钮点击事件
			fabClick(){
				uni.navigateTo({
					url: '/pagesB/user/release/addVideo'
				})
			},
			getUserVidio(){
				this.$u.api.selectUserVidio({
					pageNo: this.pageNo,
					messSortGrade: 1
				}).then(res=>{
					this.list = res.data.list
					this.$refs.list.loading = false
					if(res.data.list.length<20){
						this.status = 'nomore'
					}
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000)
				})
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.getUserVidio()
		},
		// 上拉加载更多
		onReachBottom() {
			if(this.status == 'nomore'){
				return;
			}
			this.status = 'loading'
			this.pageNo = ++this.pageNo
			setTimeout(() => {
				this.getUserVidio()
				this.status = 'loadmore'
			}, 1000)
		},
		//收藏事件回调
		// setStroeVideo(data){
		// 	let index = this.list.findIndex(v=>{
		// 		return data.mesId == v.id
		// 	})
		// 	data.type ? this.list[index].messCollect++ : this.list[index].messCollect--
		// }
	}
</script>

<style lang="scss" scoped>

</style>
