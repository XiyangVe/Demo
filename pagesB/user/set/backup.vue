<template>
	<view class="">
		<!-- 头部备份通讯录 -->
		<view class="flex align-center justify-between p-2" hover-class="bg-hover-light"
				@click="backupPhone">
			<view class="flex align-center">
				<u-icon name="phone" color="#19be6b" size="50"></u-icon>
				<text class="ml-1">备份手机联系人</text>
			</view>
			<view class="">
				<u-icon name="arrow-right" color="#82848a" size="40"></u-icon>
			</view>
		</view>
		<!-- 通讯录列表 -->
		<view class="p-2">
			<block v-for="(item,index) in backupData" :key="index">
				<view class="flex align-center justify-between border-bottom"
					hover-class="bg-hover-light">
					<view class="my-1 flex flex-column">
						<text class="">{{item.displayName}}</text>
						<text class="text-muted">{{item.phone}}</text>
					</view>
					<view class="bg-success text-white p rounded" @click="modify(item)">
						修改
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				// 从手机获取的通讯录数据
				data:null,
				// 备份的通讯录列表
				backupData: [],
				pageNo: 1
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			this.getUserPhone()
			// #endif
			this.getUserIdInPhoneRows()
		},
		methods:{
			// 获取服务器备份的通讯录
			getUserIdInPhoneRows(){
				this.$u.api.getUserIdInPhoneRows({
					pageNo: this.pageNo
				}).then(res=>{
					if(res.code==200){
						this.backupData = res.data.page.list
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 修改
			modify(item){
				this.$store.dispatch("index/setBackupPhoneInfo",item)
				uni.navigateTo({
					url: './modifyPhone'
				})
			},
			backupPhone(){
				uni.showLoading({
					title: '备份中'
				})
				this.$u.api.addInPhoneRows(this.data).then(res=>{
					uni.hideLoading()
					if(res.code==200){
						uni.showToast({
							title: '备份通讯录成功'
						})
					}
				})
			},
			getUserPhone(){
				var that = this  
				// 获取通讯录对象  
				plus.contacts.getAddressBook( plus.contacts.ADDRESSBOOK_PHONE, function( addressbook ) {  
					// 查找联系人  
					addressbook.find(["displayName","phoneNumbers"],function(contacts){  
						that.data = contacts
					}, function () {  
						uni.showToast({  
							title: '获取联系人失败',  
							icon: 'none',
							duration: 2000  
						})  
					},{multiple:true});  
				}, function ( e ) {  
					uni.showToast({  
						title: '获取通讯录对象失败:' + e.message,  
						icon: 'none',
						duration: 2000  
					})  
				});  
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
