<template>
	<view class="p-2 modify-box">
		<view class="flex align-center border-bottom pb-2">
			<u-icon name="account" color="#19be6b" size="50"></u-icon>
			<input class="ml-2 flex-5" type="text" v-model="backupPhoneInfo.displayName" />
		</view>
		<view class="flex align-center border-bottom py-2">
			<u-icon name="phone" color="#19be6b" size="50"></u-icon>
			<input class="ml-2 flex-5" type="text" v-model="backupPhoneInfo.phone"/>
		</view>
		<view class="buttom-box">
			<button @click="updateByPhoneId">修改</button>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				backupPhoneInfo:{}
			}
		},
		onLoad() {
			this.backupPhoneInfo = this.$store.state.index.backupPhoneInfo
		},
		methods:{
			// 修改备份通讯录
			updateByPhoneId(){
				this.$u.api.updateByPhoneId({
					id: this.backupPhoneInfo.id,
					displayName: this.backupPhoneInfo.displayName,
					phone: this.backupPhoneInfo.phone
				}).then(res=>{
					if(res.code==200){
						setTimeout(()=>{
							uni.navigateBack({
								delta: 1
							})
						},2000)
					}
					uni.showToast({
						title:res.msg,
						icon: 'none'
					})
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.modify-box{
		.buttom-box{
			margin-top: 30%;
		}
	}
</style>
