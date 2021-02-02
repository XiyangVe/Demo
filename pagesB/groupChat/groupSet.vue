<template>
	<view class="group-set-box">
		<!-- 自定义导航 -->
		<u-navbar title="群设置" title-color="#ffffff" back-icon-color="#ffffff" :background="{'background-color':'#6aa8d8'}"  height="50" :border-bottom="false">
			<view class="slot-wrap">
				<view @click="updateGroup">
					完成
				</view>
			</view>
		</u-navbar>
		<!-- 群设置 -->
		<view class="group-name">
			<view class="title">
				群名称：
			</view>
			<view class="input">
				<input type="text" v-model="groupInfo.groupName" />
			</view>
		</view>
		<view class="group-announcement">
			<view class="top">
				<u-icon name="volume-fill" color="#2979ff" size="32"></u-icon>
				<view class="gg-title">
					群公告：
				</view>
			</view>
			<view class="gg-textarea">
				<u-input v-model="groupInfo.groupAnnouncement" type="textarea"/>
			</view>
		</view>
		<!-- 群聊成员 -->
		<view class="group-user-box">
			<view class="group-user-top">
				<view class="title">
					群聊成员
				</view>
				<view class="right" @click="getGroupMembers">
					<view class="right-l">
						查看所有群成员
					</view>
					<u-icon name="arrow-right" size="30"></u-icon>
				</view>
			</view>
			<view class="group-user-content">
				<view class="item-box" v-for="(item,index) in groupUserlist" :key="index">
					<u-image width="100rpx" height="100rpx"
						border-radius="50%"
						:src="`${baseUrl}${item.menberHeadPortrait}`">
					</u-image>
					<view class="user-name">
						{{item.groupNickname}}
					</view>
				</view>
				<view class="add-user-icon" @click="addUser">
					<u-icon name="plus-people-fill" size="80"></u-icon>
					<view>邀请</view>
				</view>
			</view>
		</view>
		<!-- 设置群昵称 -->
		<view class="set-group-nickname">
			<view class="title">
				我的本群昵称：
			</view>
			<view class="input">
				<input type="text" v-model="groupNickname" @blur="setGroupNickname"/>
			</view>
		</view>
		<!-- 修改群头像 -->
		<view class="set-group-avatar">
			<view class="title">
				修改群头像：
			</view>
			<u-image v-if="count==0" :src="`${baseUrl}${groupInfo.groupHeadImage}`" 
					width="100rpx" 
					height="100rpx" 
					@click="editGroupAvatar"
					shape="circle">
			</u-image>
			<u-image v-if="count!=0" :src="`${groupInfo.groupHeadImage}`"
					width="100rpx" 
					height="100rpx" 
					@click="editGroupAvatar"
					shape="circle">
			</u-image>
		</view>
		<!-- 退出群聊 -->
		<view class="create-group-btn" v-if="groupInfo.groupOwner != myId">
			<view class="btn" @click="exitGroup">
				退出群聊
			</view>
		</view>
		<view class="create-group-btn" v-else>
			<view class="btn" @click="disbandGroup">
				解散群聊
			</view>
		</view>
	</view>
</template>

<script>
	import config from '../../utils/config.js'
	export default{
		data(){
			return{
				groupInfo:{
					groupName: '',
					groupAnnouncement: '',
					groupOwner: '',
					id: '',
					groupHeadImage: '',
				},
				count:0,
				// 群聊成员
				groupUserlist:[],
				// 群昵称
				groupNickname: '',
				action: config.baseUrl + '/base/upload',
			}
		},
		onShow() {
			this.getGroupUserList()
		},
		onLoad() {
			this.getGroupInfo()
		},
		methods:{
			// 去查看所有群成员列表
			getGroupMembers(){
				this.$u.route('/pagesB/groupChat/groupUserlist', {
					groupId: this.groupInfo.id
				})
			},
			// 获取群成员列表(这里只取了前四个数据)
			async getGroupUserList(){
				const res = await this.$u.api.getGroupMembers({
					groupId: this.groupInfo.id
				})
				this.groupUserlist = res.data.slice(0,4)
				res.data.forEach(v=>{
					if(this.myId==v.memberId){
						this.groupNickname = v.groupNickname
					}
				})
			},
			// 邀请好友进群
			addUser(){
				this.$u.route('/pagesB/groupChat/invitation', {
					groupId: this.groupInfo.id
				})
			},
			// 设置群昵称
			async setGroupNickname(){
				const res = await this.$u.api.updateGroupMembers({
					groupId: this.groupInfo.id,
					groupNickname: this.groupNickname
				})
				console.log(res)
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			},
			// 解散群
			disbandGroup(){
				var that = this
				uni.showModal({
				    title: '提示',
				    content: '确定要解散吗？',
				    success: function (res) {
				        if (res.confirm) {
				           that.$u.api.disbandGroup({
				            	groupId: that.groupInfo.id
				            }).then(res=>{
								if(res.code==200){
									setTimeout(()=>{
										uni.navigateBack({
											delta: 2
										})
									},2000)
								}
								uni.showToast({
									title: res.msg,
									icon: 'none'
								})
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				})
			},
			// 退出群
			exitGroup(){
				var that = this
				uni.showModal({
				    title: '提示',
				    content: '退出后不会再接收此群聊消息',
				    success: function (res) {
				        if (res.confirm) {
				           that.$u.api.exitGroup({
				            	groupId: that.groupInfo.id
				            }).then(res=>{
								if(res.code==200){
									setTimeout(()=>{
										uni.navigateBack({
											delta: 2
										})
									},2000)
								}
								uni.showToast({
									title: res.msg,
									icon: 'none'
								})
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				})
			},
			// 获取群信息
			getGroupInfo(){
				let groupInfo = this.$store.state.index.groupInfo
				if(groupInfo.id){
					this.groupInfo.groupName = groupInfo.groupName
					this.groupInfo.groupAnnouncement = groupInfo.groupAnnouncement
					this.groupInfo.id = groupInfo.id
					this.groupInfo.groupOwner = groupInfo.groupOwner
					this.groupInfo.groupHeadImage = groupInfo.groupHeadImage
				}else{
					console.log('没数据')
				}
			},
			// 修改群
			updateGroup(){
				var that = this
				uni.uploadFile({
				    url: that.action,
				    filePath: that.groupInfo.groupHeadImage,
				    name: 'file',
					header:{
						Authorization: that.$store.state.login.token
					},
				    success: (uploadFileRes) => {
						that.groupInfo.groupHeadImage = JSON.parse(uploadFileRes.data).data
						that.count = 0
						that.$u.api.updateGroup(that.groupInfo).then(res=>{
							if(res.code==200){
								setTimeout(()=>{
									uni.navigateBack({
										delta: 2
									})
								},2000)
							}
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						})
				    }
				})
			},
			// 选择群头像
			editGroupAvatar(){
				var that = this;
				uni.chooseImage({
				    success: (chooseImageRes) => {
						this.count++
				        const tempFilePaths = chooseImageRes.tempFilePaths;
						that.groupInfo.groupHeadImage = tempFilePaths[0]
				    }
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.group-set-box{
		padding: 20rpx;
		width: 100vw;
		.slot-wrap{
			display: flex;
			align-items: center;
			justify-content: flex-end;
			flex: 1;
			padding: 0 30rpx;
			font-size: 32rpx;
			font-weight: normal;
			color: #FFFFFF;
		}
		.group-name{
			display: flex;
			align-items: center;
			border-bottom: 2rpx solid #eee;
			padding-bottom: 20rpx;
			.title{
				font-weight: bold;
				width: 18vw;
			}
			.input{
				width: 80vw;
				font-size: 26rpx;
			}
		}
		.group-announcement{
			padding: 20rpx 0;
			.top{
				display: flex;
				align-items: center;
				.gg-title{
					font-weight: bold;
					margin-left: 10rpx;
				}
			}
			.gg-textarea{
				margin-top: 10rpx;
				background-color: #F0F0F0;
				border-radius: 20rpx;
				padding: 20rpx;
			}
			
		}
		.group-user-box{
			display: flex;
			flex-direction: column;
			border-bottom: 2rpx solid #eee;
			.group-user-top{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.title{
					font-weight: bold;
				}
				.right{
					display: flex;
					align-items: center;
					font-size: 26rpx;
					.right-l{
						padding: 0 10rpx;
					}
				}
			}
			.group-user-content{
				display: flex;
				align-items: center;
				padding: 20rpx 0;
				.item-box{
					width: 25%;
					display: flex;
					flex-direction: column;
					align-items: center;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					.user-name{
						font-size: 26rpx;
					}
				}
				.add-user-icon{
					text-align: center;
					width: 25%;
				}
			}
		}
		.set-group-nickname{
			display: flex;
			align-items: center;
			padding: 30rpx 0;
			.title{
				font-weight: bold;
			}
			.input{
				font-size: 26rpx;
			}
		}
		.set-group-avatar{
			.title{
				font-weight: bold;
			}
			.u-image{
				margin: 20rpx 0;
			}
		}
		.create-group-btn{
			width: 100vw;
			display: flex;
			justify-content: center;
			position: fixed;
			bottom: 5vh;
			.btn{
				text-align: center;
				width: 500rpx;
				height: 102rpx;
				line-height: 102rpx;
				background: #fa3534;
				box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
				border-radius: 50rpx;
				color: #FFFFFF;
				font-weight: 600;
			}
		}
	}
	
</style>
