<template>
	<view>
		<view class="p-2 flex" v-for="(item,index) in lists" :key="index">
			<view class="flex-1">
				<image :src="item.coverList ? `${baseUrl}${item.coverList[0]}` : ''" style="width: 214rpx;height: 288rpx;" mode="aspectFill"></image>
			</view>
			<view class="flex-2 flex flex-column">
				<view class="flex flex-column flex-3">
					<text class="font text-dark mb-2">{{item.title}}</text>
					<text class="font-small text-muted">{{item.createTime | date('yyyy-mm-dd hh:MM')}}</text>
					<view class="" v-if="item.msgAudit===2">
						<text class="font-sm text-muted">失败原因:</text>
						<text class="font-sm text-muted">{{item.auditingText}}</text>
					</view>
				</view>
				<view class="flex-1">
					<button v-if="item.msgAudit===0 && item.namingSerialNumber>0" @click="getMsgNamingAdd(item)" type="primary" size="mini">提升排名</button>
					<button v-if="item.msgAudit===0 && item.namingSerialNumber===null" @click="clickEvent(item)" type="primary" size="mini">立即竞价</button>
					<button v-if="item.msgAudit===1" type="primary" size="mini" disabled>审核中</button>
					<button v-if="item.msgAudit===2" type="primary" size="mini" disabled>审核失败</button>
				</view>
			</view>
		</view>
		<uni-load-more :status="more"></uni-load-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageNo: 1,
				lists: [],
				// 分页
				more: 'more'
			}
		},
		onLoad() {
			this.queryByUserIdOrConsult()
			uni.$on('update',(data) => {
				console.log('广告+++++++++++++')
				this.pageNo = 1
				this.lists = []
				this.queryByUserIdOrConsult()
			})
		},
		onUnload() {
			uni.$off('update')
			console.log('监听页面卸载')
		},
		onReachBottom() {
			if (this.more === 'noMore') {
				return;
			}
			this.more = 'loading'
			setTimeout(()=>{
				this.pageNo ++
				this.queryByUserIdOrConsult()
			},1500)
		},
		methods: {
			// 获取用户发布的资讯
			async queryByUserIdOrConsult(){
				const res = await this.$https.get('/messPublish/queryByUserIdOrConsult',{pageNo:this.pageNo})
				res.data.list.map(e => {
					if(e.cover!==null){
						let list = e.cover.split(",")
						this.$set(e,'coverList',list)
					}
				})
				this.lists = this.lists.concat(res.data.list)
				if (res.data.list.length<20) {
					this.more = 'noMore'
				}else{
					this.more = 'more'
				}
			},
			// 点击立即竞价
			clickEvent(e){
				uni.navigateTo({
					url: '/pages/user/ad/bidding?messTypeId=' + e.messTypeId + '&id=' + e.id
				})
			},
			// 点击提示资讯名次事件
			getMsgNamingAdd(e){
				this.$https.get('/msgNaming/getMsgNamingAdd',{
					messPublishId: e.id,
					messTypeId: e.messTypeId,
					namingSerialNumber: e.namingSerialNumber
				}).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				})
			}
		}
	}
</script>

<style>

</style>
