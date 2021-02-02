<template>
	<view class="">
		<view class="">
			<u-cell-item icon="reload" title="商户名称" :value="mchInfo.mchName" :arrow="false"></u-cell-item>
			<u-cell-item icon="reload" title="商户地址" :value="mchInfo.mchAddr" :arrow="false"></u-cell-item>
			<u-cell-item icon="reload" title="申请时间" :value="`${$u.timeFormat(mchInfo.createTime, 'yyyy年mm月dd日')}`" :arrow="false"></u-cell-item>
			<u-cell-item icon="reload" title="商户性质" :value="mchInfo.mchNature==1 ? '品牌旗舰店' : '普通商户'" :arrow="false"></u-cell-item>
		</view>
		<view class="" style="width: 50%;margin: 10% 25%;">
			<u-button @click="show=true" type="error" shape="circle" plain>注销商户</u-button>
		</view>
		<u-modal v-model="show" :content="content" show-cancel-button @confirm="cancelMerchant"></u-modal>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				mchInfo:{},
				show:false,
				content:"是否确定注销商户？"
			}
		},
		onLoad() {
			this.getMchInfo()
		},
		methods:{
			getMchInfo(){
				this.$https.get('/userCenter/getMchInfo').then(res=>{
					this.mchInfo = res.data
				})
			},
			// 注销商户
			cancelMerchant(){
				this.show = false
				this.$https.post('/userCenter/cancelMerchant').then(res=>{
					uni.showToast({
						title:res.msg
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta: 1
						})
					},2000)
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	
</style>
