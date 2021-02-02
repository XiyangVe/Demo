<template>
	<view>
		<block v-for="(item,index) in list" :key="index">
			<view class="vip-record-item border-bottom flex align-center justify-between" hover-class="bg-light">
				<view>
					<view class="flex align-center">
						<view>
							<u-icon name="integral" color="#fd4d4d"></u-icon>
						</view>
						<view class="ml-1">
							<text style="color: #fd4d4d;"
							class="font-weight-bolder">VIP{{item.level}}</text>
						</view>
					</view>
					<view class="mt-1">
						<text class="text-light-muted font-sm">{{item.buyTime | date('yyyy-mm-dd')}}</text>
					</view>
				</view>
				<view class="flex flex-column align-end">
					<view style="color: #fd4d4d;">
						<text>￥</text>
						<text class="font-weight-bolder">{{item.payMoney}}</text>
					</view>
					<view class="mt-1">
						<text class="text-light-muted font-sm">{{item.expireTime | date('yyyy-mm-dd')}}</text>
						<text class="text-light-muted font-sm">到期</text>
					</view>
				</view>
			</view>
		</block>
		<u-loadmore :status="status" />
	</view>
</template>

<script>
	export default {
		data(){
			return{
				list: [],
				// 分页
				status: 'loadmore',
				page: 1,
				pageSize:10
			}
		},
		onLoad() {
			this.getMemberRechargeRecords()
		},
		onReachBottom() {
			if(this.status=='nomore') return;
			this.status = 'loading'
			setTimeout(()=>{
				this.page ++
				this.getMemberRechargeRecords()
			},1500)
		},
		methods:{
			getMemberRechargeRecords(){
				this.$https.get('/userCenter/getMemberRechargeRecords',{
					pageNo: this.page,
					recordNum: this.pageSize
				}).then(res=>{
					this.list = this.list.concat(res.data)
					if(this.pageSize > res.data.length){
						this.status = 'nomore'
					}
				})
			}
		}
	}
</script>

<style scoped>
	.vip-record-item{
		padding: 26rpx 32rpx;
	}
</style>
