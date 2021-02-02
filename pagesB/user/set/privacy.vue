<template>
	<view class="">
		<u-cell-group>
			<u-cell-item icon="setting-fill" title="免打扰" :arrow="false">
				<u-switch slot="right-icon" v-model="checked" @change="change"></u-switch>
			</u-cell-item>
			<u-cell-item icon="setting-fill" title="好友搜索可见" :arrow="false">
				<u-switch slot="right-icon" v-model="checked2" @change="change2"></u-switch>
			</u-cell-item>
			<u-cell-item icon="setting-fill" title="显示收藏" :arrow="false">
				<u-switch slot="right-icon" v-model="checked3" @change="change3"></u-switch>
			</u-cell-item>
		</u-cell-group>
		<view class="privacy-setting-btn">
			<view class="btn" @click="setUserPersonalSetting">保存</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				checked:false,
				checked2:false,
				checked3:false,
				collectIsVisible: null,
				isSearch: null,
				noDisturbing: null
			}
		},
		onLoad() {
			this.getUserPersonalSetting()
		},
		methods:{
			// 获取用户隐私信息
			getUserPersonalSetting(){
				this.$u.api.getUserPersonalSetting().then(res=>{
					if(res.code==200){
						if(res.data.userSetting.noDisturbing==1){
							this.checked = true
						}
						if(res.data.userSetting.isSearch==1){
							this.checked2 = true
						}
						if(res.data.userSetting.collectIsVisible==1){
							this.checked3 = true
						}
						this.noDisturbing = res.data.userSetting.noDisturbing
						this.isSearch = res.data.userSetting.isSearch
						this.collectIsVisible = res.data.userSetting.collectIsVisible
					}
				})
			},
			// 设置用户隐私信息
			setUserPersonalSetting(){
				this.$u.api.setUserPersonalSetting({
					noDisturbing:this.noDisturbing,
					collectIsVisible:this.collectIsVisible,
					isSearch:this.isSearch
				}).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
				})
			},
			change(status) {
				if(status==true){
					this.noDisturbing = 1
				}else{
					this.noDisturbing = 0
				}
			},
			change2(status) {
				if(status==true){
					this.isSearch = 1
				}else{
					this.isSearch = 0
				}
			},
			change3(status) {
				if(status==true){
					this.collectIsVisible = 1
				}else{
					this.collectIsVisible = 0
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.privacy-setting-btn{
		position: fixed;
		left: 0;
		bottom: 5vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		.btn{
			width: 600rpx;
			height: 86rpx;
			text-align: center;
			line-height: 86rpx;
			background: #0077FF;
			box-shadow: 0px 6rpx 12rpx rgba(0, 0, 0, 0.16);
			border-radius: 60rpx;
			color: #FFFFFF;
		}
	}
</style>
