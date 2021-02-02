<template>
	<view class="group-user-list-box">
		<block v-for="(item,index) in groupUserlist" :key="index">
			<view class="group-use-item">
				<u-image width="80rpx" height="80rpx"
					border-radius="50%"
					:src="`${baseUrl}${item.menberHeadPortrait}`">
				</u-image>
				<view class="name">
					{{item.groupNickname}}
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				groupId: '',
				groupUserlist: []
			}
		},
		onLoad(e) {
			this.groupId = e.groupId
			uni.showLoading({
				title: '加载中'
			})
			setTimeout(()=>{
				this.getGroupUserList()
			},1000)
		},
		methods:{
			// 获取群成员列表
			async getGroupUserList(){
				const res = await this.$u.api.getGroupMembers({
					groupId: this.groupId
				})
				this.groupUserlist = res.data
				console.log(res)
			},
		}
	}
</script>

<style scoped lang="scss">
	.group-user-list-box{
		padding: 20rpx;
		.group-use-item{
			display: flex;
			align-items: center;
			padding: 10rpx 0;
			.name{
				padding: 0 10rpx;
			}
		}
	}
</style>
