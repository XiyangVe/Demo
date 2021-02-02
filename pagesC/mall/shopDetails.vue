<template>
	<view class="bg-light">
		<!-- 商户信息 -->
		<view class="p-2 bg-white">
			<view class="flex align-center">
				<view class="flex align-center">
					<view class="">
						<u-image width="100rpx" height="100rpx" :src="`${baseUrl}${storeInfo.logo}`"></u-image>
					</view>
					<view class="px-1">
						<view class="py flex align-center">
							<text class="bg-taobao-red text-white rounded font-small px">自营</text>
							<text class="font-weight-bolder px-1">{{storeInfo.shopName}}</text>
						</view>
						<view class="font-sm text-muted">
							{{storeInfo.followers}}人关注
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bg-white p-2 mt-2 flex align-center justify-between">
			<view class="">
				店铺评级
			</view>
			<view class="">
				<u-rate :count="count" disabled v-model="starNum"></u-rate>
			</view>
		</view>
		<view class="bg-white p-2 mt-2 flex align-center justify-between">
			<view class="">
				店铺二维码
			</view>
			<view class="">
				<u-icon name="scan" size="40"></u-icon>
			</view>
		</view>
		<view class="mt-2 bg-white">
			<view class="border-bottom p-2">
				<text>店铺简介</text>
				<text class="ml-2">{{storeInfo.shopIntroduction}}</text>
			</view>
			<view class="border-bottom p-2">
				<text>店铺地址</text>
				<text class="ml-2">重庆市江北区</text>
			</view>
			<view class="border-bottom p-2">
				<text>联系电话</text>
				<text class="ml-2">16602316666</text>
			</view>
			<view class="border-bottom p-2">
				<text>开店时间</text>
				<text class="ml-2">{{$u.timeFormat(storeInfo.createTime, 'yyyy年mm月dd日')}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data(){
			return{
				// 店铺评分
				count: 5,
				starNum: 5,
			}
		},
		computed:{
			...mapState({
				storeInfo:state=>state.goods.storeInfo,
			})
			
		},
		onLoad() {
			console.log(this.storeInfo)
		},
		methods:{
			
		}
	}
</script>

<style>
</style>
