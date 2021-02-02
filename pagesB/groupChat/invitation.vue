<template>
	<view class="invitation-box">
		<view class="user-list-box">
			<block v-for="(item,index) in friendList" :key="index">
				<view class="content">
					<view class="left-box">
						<u-checkbox-group>
							<u-checkbox 
								shape="circle"
								@change="checkboxChange" 
								:name="item.friendId"
								v-model="item.isShow">
							</u-checkbox>
						</u-checkbox-group>
					</view>
					<view class="item-box">
						<u-image width="80rpx" height="80rpx"
							border-radius="50%"
							:src="`${baseUrl}${item.friendsAvatar}`">
						</u-image>
						<view class="name">
							{{item.nickname}}
						</view>
					</view>
				</view>
			</block>
		</view>
		<view class="btn-box">
			<view class="btn" @click="inviteIntoTheGroup">
				立即邀请
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				friendList: [],
				// 好友id
				userIds: [],
				// 群id
				groupId: ''
			}
		},
		onLoad(e) {
			this.groupId = e.groupId
			this.getFriendList()
		},
		methods:{
			// 邀请成员
			async inviteIntoTheGroup(){
				const res = await this.$u.api.inviteIntoTheGroup({
					userIds: this.userIds,
					groupId: parseInt(this.groupId)
				})
				if(res.code==200){
					setTimeout(()=>{
						uni.navigateBack({
							delta: 1
						})
					},2000)
				}
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			},
			// 获取用户好友列表
			async getFriendList(){
				const res = await this.$u.api.getFriendList()
				if(res.code==200){
					this.friendList = res.data
				}else{
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
			},
			// 选择好友
			checkboxChange(e){
				if(e.value == true){
					this.userIds.push(e.name)
				}else{
					var index = this.userIds.indexOf(e.name)
					if(index>-1){
						this.userIds.splice(index,1)
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.invitation-box{
		padding: 20rpx;
		.user-list-box{
			.content{
				display: flex;
				align-items: center;
				.left-box{
					
				}
				.item-box{
					display: flex;
					align-items: center;
					padding: 10rpx 0;
					.name{
						padding: 0 10rpx;
					}
				}
			}
		}
		.btn-box{
			position: fixed;
			bottom: 5vh;
			width: 100vw;
			display: flex;
			justify-content: center;
			.btn{
				width: 500rpx;
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				background: #0077FF;
				box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
				border-radius: 50rpx;
				color: #FFFFFF;
			}
		}
	}
</style>
