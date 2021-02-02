<template>
	<view class="group-chat-box">
		<block v-for="(item,index) in groupData" :key="index">
			<view class="item-box" @click="toGroupChat(item)">
				<u-image width="100rpx" height="100rpx" 
						shape="circle"
						:src="`${baseUrl}${item.groupHeadImage}`">
				</u-image>
				<view class="name">
					{{item.groupName}}
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default{
		props:{
			groupData:Array
		},
		methods:{
			toGroupChat(item){
				// console.log(item)
				// 把选择的群信息放在VueX
				this.$store.commit('index/setGroupInfo',item)
				this.$u.route('/pagesB/groupChat/groupChat', {
					groupName: item.groupName,
					groupId: item.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.group-chat-box{
		.item-box{
			display: flex;
			align-items: center;
			padding: 20rpx;
			.name{
				font-weight: bold;
				margin-left: 10rpx;
			}
		}
	}
</style>
