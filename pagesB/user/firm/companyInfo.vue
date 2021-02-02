<template>
	<view class="company-info-box">
		<view class="info-item">
			<text class="info-title">所在企业：</text>
			<text class="info-value">{{companyInfo.company.companyName}}</text>
		</view>
		<view class="info-item">
			<text class="info-title">创建人：</text>
			<text class="info-value">{{companyInfo.company.idcardName}}</text>
		</view>
		<view class="info-item">
			<text class="info-title">企业地址：</text>
			<text class="info-value">{{companyInfo.company.companyAddr}}</text>
		</view>
		<view class="info-item">
			<text class="info-title">用户类型：</text>
			<text class="info-value" v-if="companyInfo.type==0">企业boss</text>
			<text class="info-value" v-if="companyInfo.type==1">普通员工</text>
		</view>
		<!-- 按钮区域 -->
		<view class="company-info-btn-box">
			<view class="btn" @click="out()" v-if="companyInfo.type==1">
				退出企业
			</view>
			<view class="btn" @click="Logout()" v-if="companyInfo.type==0">
				注销企业
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				companyInfo:{
					company:{}
				}
			}
		},
		onLoad() {
			this.getCompanyInfo()
		},
		methods:{
			// 获取当前用户所在的企业信息
			getCompanyInfo(){
				this.$u.api.getCompanyInfo().then(res=>{
					if(res.code==200){
						this.companyInfo = res.data
					}else{
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				})
			},
			// 用户退出企业
			out(){
				const that = this
				that.$u.debounce(()=>{
					uni.showModal({
						title: '提示',
						content: '您确定要退出吗',
						success(res) {
							if(res.confirm){
								that.$u.api.quitCompany().then(res=>{
									if(res.code==200){
										setTimeout(function(){
											uni.navigateBack({
											    delta: 1
											})
										},2000)
									}
									uni.showToast({
										title: res.msg,
										icon: "none"
									})
								})
							}else if(res.cancel){
								
							}
						}
					})
				})
			},
			// 注销企业
			Logout(){
				const that = this
				that.$u.debounce(()=>{
					uni.showModal({
						title: '提示',
						content: '注销后加入该企业的员工将自动退出',
						success(res) {
							if(res.confirm){
								that.$u.api.cancelCompany().then(res=>{
									if(res.code==200){
										setTimeout(function(){
											uni.navigateBack({
											    delta: 1
											})
										},2000)
									}
									uni.showToast({
										title: res.msg,
										icon: "none"
									})
								})
							}else if(res.cancel){
								
							}
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.company-info-box{
		padding: 20rpx;
		.info-item{
			border-bottom: 2rpx solid #eee;
			padding: 20rpx;
			.info-title{
				color: #777777;
				font-weight: 600;
				
			}
			.info-value{
				
			}
		}
		.company-info-btn-box{
			width: 100vw;
			display: flex;
			justify-content: center;
			position: fixed;
			bottom: 50rpx;
			.btn{
				width: 638rpx;
				height: 86rpx;
				line-height: 86rpx;
				text-align: center;
				background: #0077FF;
				box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
				border-radius: 60rpx;
				color: #FFFFFF;
			}
		}
	}
</style>
