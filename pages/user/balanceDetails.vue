<template>
	<view class="">
		<!-- 自定义导航 -->
		<u-navbar title="余额明细" title-size="30" title-bold :border-bottom="false" title-color="#0077FF" :background="navbarBg" back-icon-color="#0077FF"></u-navbar>
		<!-- 余额明细列表 -->
		<block v-for="(item,index) in list" :key="index">
			<view class="flex justify-between align-center p-3 border-bottom" hover-class="bg-light" @click="toBalanInfo(item)">
				<view class="">
					<view class="">
						<text class="font text-dark">{{item.title}}</text>
					</view>
					<view class="mt-1">
						<text class="font-sm text-light-muted">{{item.createTime | date('yyyy-mm-dd hh:MM')}}</text>
					</view>
				</view>
				<view class="flex flex-column align-end">
					<view class="font-weight-bolder font main-text-color">
						<text v-if="item.isIncome===1">+{{item.number.toFixed(2)}}</text>
						<text v-else>-{{item.number.toFixed(2)}}</text>
					</view>
					<view class="font-sm text-light-muted mt-1">
						<text class="mr-1">余额</text>
						<text>{{item.balance}}</text>
					</view>
				</view>
			</view>
		</block>
		<u-loadmore :status="status" />
		<!-- 弹出层 -->
		<view v-if="show">
			<u-popup v-model="show" mode="center" border-radius="30">
				<view class="p-2" style="height: 350rpx;width: 500rpx;">
					<view class="mb-2">
						<text class="text-muted font-sm mr-4">类型</text>
						<text class="text-dark font-sm" v-if="itemInfo.isIncome===0">支出  {{itemInfo.number.toFixed(2)}}</text>
						<text class="text-dark font-sm" v-else>收入  {{itemInfo.number.toFixed(2)}}</text>
					</view>
					<view class="mb-2">
						<text class="text-muted font-sm mr-4">时间</text>
						<text class="text-dark font-sm">{{itemInfo.createTime | date('yyyy-mm-dd hh:MM:ss')}}</text>
					</view>
					<view class="mb-2">
						<text class="text-muted font-sm mr-4">余额</text>
						<text class="text-dark font-sm">{{itemInfo.balance.toFixed(2)}}</text>
					</view>
					<view class="mb-2">
						<text class="text-muted font-sm mr-4">备注</text>
						<text class="text-dark font-sm">{{itemInfo.remarks}}</text>
					</view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				navbarBg:{
					backgroundColor: "#ffffff"
				},
				pagination:{
					page: 1,
					pageSize: 9
				},
				list: [],
				show: false,
				itemInfo: {},
				status: 'loadmore',
			}
		},
		onLoad() {
			this.getBalanceDetailList()
		},
		methods:{
			// 获取余额明细列表
			getBalanceDetailList(){
				this.$https.get('/fund/balanceDetails',this.pagination).then(res=>{
					this.list = this.list.concat(res.data.list)
					if(this.pagination.pageSize>res.data.list.length){
						this.status = 'nomore'
					}else{
						this.status = 'loading'
					}
				})
			},
			// 查看单个列表详情
			toBalanInfo(e){
				this.itemInfo = e
				this.show = true
			}
		},
		onReachBottom() {
			if(this.status=='nomore') return;
			setTimeout(()=>{
				this.pagination.page++
				this.getBalanceDetailList()
			},1500)
		}
	}
</script>

<style>
</style>
