<template>
	<view class="p-2">
		<view class="">
			<view class="py-2 border-bottom">
				<text class="pr-2">商户名称</text>
				<text>{{mchInfo.mchName}}</text>
			</view>
			<view class="py-2 border-bottom">
				<text class="pr-2">商户地址</text>
				<text>{{mchInfo.mchAddr}}</text>
			</view>
		</view>
		<view class="mt-5">
			<u-steps :list="numList" :current="1" active-color="#28a745"></u-steps>
		</view>
		<view class="font-sm py-5">
			{{$u.timeFormat(mchInfo.createTime, 'yyyy-mm-dd hh:MM:ss')}}
		</view>
	</view>
</template>

<script>
	import $H from '@/utils/lib/https.js';
	export default {
		data(){
			return{
				mchInfo:{},
				numList: [{
					name: '资料提交成功'
				}, {
					name: '资料审核中'
				}, {
					name: '审核通过'
				}],
			}
		},
		onLoad() {
			this.getMchExamineRate()
		},
		methods:{
			// 获取当前用户的商户申请进度
			async getMchExamineRate(){
				const res = await $H.get('/userCenter/getMchExamineRate')
				this.mchInfo = res.data
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
