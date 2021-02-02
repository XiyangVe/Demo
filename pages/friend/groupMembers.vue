<template>
	<view class="">
		<u-navbar :is-back='true' title="群成员" back-icon-color="#0077FF" :background="{'background-color':'#fff'}" height="50">
			<view class="slot-wrap">
				<view>
					<u-icon name="plus" style="margin-right: 30rpx;" color="#0077FF" size="40" @click="toAddMemberList"></u-icon>
				</view>
			</view>
		</u-navbar>
		<view class="list" v-for="item in groupMembers">
			<image :src="`${baseUrl}${item.menberHeadPortrait}`" mode="" class="images"></image>
			<text class="nickname">{{item.groupNickname}}</text>
			<view :class="item.memberType==1||item.memberType==2?'remarks':'remarks1'">
				<text v-if="item.memberType==1">管理员</text>
				<text v-if="item.memberType==2">群主</text>
				<text v-if="item.memberType==0&&isManage=='true'" @click="setManage(item.memberId)">设为管理员</text>
			</view>
		</view>
	</view>
</template>

<script>
	import $https from '@/utils/lib/https.js';
	export default {
		data() {
			return {
				groupMembers: [],
				groupId:0,
				isManage:false
			}
		},
		onLoad(e) {
			this.groupId=e.groupId
			this.isManage=e.isManage
			console.log(this.isManage)
			this.toAddMemberList()
		},
		// onShow() {
		// 	this.toAddMemberList()
		// },
		methods: {
			toAddMemberList() {
				//获取群成员列表
				$https.get('/chat/getGroupMembers?groupId=' + this.groupId)
					.then(res => {
						this.groupMembers = res.data
						console.log(res.data)
				})
			},
			//设置管理员
			setManage(memberId){
				console.log(memberId)
				$https.get('/chatGroup/updateMemberType?groupId=' + this.groupId+'&memberId='+memberId+'&memberType=1')
					.then(res => {
						this.toAddMemberList()
						uni.showToast({
							title:'设置成功！',
							icon:'success',
							duration:1000
						})
				})
				
			}
		}
	}
</script>

<style scoped>
	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
		justify-content: flex-end;
	}

	.list {
		display: flex;
		height: 100upx;
		border-bottom: 1px solid #f0f0f0;
	}

	.images {
		width: 64upx;
		height: 64upx;
		margin: 18upx 20upx;
	}

	.nickname {
		line-height: 100upx;
		font-size: 32upx;
		color: #000000;
	}
	.remarks1{
		height: 40upx;
		text-align: center;
		margin-top: 30upx;
		position: absolute;
		right: 20upx;
		color: #cecece;
	}
	.remarks {
		width: 100upx;
		height: 40upx;
		background: #0077ff;
		border-radius: 30upx;
		color: #FFFFFF;
		text-align: center;
		margin-top: 30upx;
		position: absolute;
		right: 20upx;
	}
</style>
