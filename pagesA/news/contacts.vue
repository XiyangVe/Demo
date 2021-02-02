<template>
	<view class="contacts-box">
		<!-- 好友资料 -->
		<view class="friend-info-box" @click="toUserSpace(friendInfo.friendId)">
			<view class="friend-info-left">
				<u-image width="84rpx" height="84rpx"
					shape="circle"
					:src="`${baseUrl}${friendInfo.friendsAvatar}`">
				</u-image>
				<view class="friend-info">
					<view class="fname">{{friendInfo.nickname}}</view>
					<view class="fsigna">{{friendInfo.signature}}</view>
				</view>
			</view>
			<u-icon name="arrow-right" color="#FF6969" size="28"></u-icon>
		</view>
		<!-- 好友备注 -->
		<view class="friend-beizhu-box">
			<view class="left">
				<view class="f-title">
					好友备注
				</view>
				<input type="text" v-model="friendInfo.friendsNotes"/>
			</view>
			<view class="set-beizhu" @click="setBzCllick()">
				<u-icon name="checkbox-mark" color="#FF6969" size="35"></u-icon>
			</view>
		</view>
		<!-- 拉黑 -->
		<view class="friend-beizhu-box"  style="justify-content: space-between;">
			<view class="GroupNicknameMy">加入黑名单</view>
			<view class="GroupNicknameIMg">
				<u-switch v-model="checked" @change="changes"></u-switch>
			</view>
		</view>
	</view>
</template>

<script>
	import listItem from '../components/news/list-item.vue'
	import $https from '@/utils/lib/https.js';
	import { mapGetters } from 'vuex';
	export default{
		components:{
			listItem
		},
		data(){
			return{
				friendInfo:{},
				isShowGroup:false,
				groupName: '我的好友',
				checked:false,
				id:null
			}
		},
		computed:{
			...mapGetters(['friendList']),
		},
		onLoad(e) {
			this.getFriendInfoById(e.toId)
			this.id=e.toId
			this.getBlack()
		},
		methods:{
			//黑名单列表
			getBlack(){
				$https.get('/chat/chatBlacklist?hackedUserId=' + this.id)
					.then(res => {
						console.log(res.data)
						for(let i=0;i<res.data.length;i++){
							if(res.data[i].id==this.id){
								this.checked=true
							}
						}
				})
			},
			//拉黑
			changes(e){
				if(e){
					$https.get('/chat/addBlacklist?hackedUserId=' + this.id)
						.then(res => {
							this.groupMembers = res.data
							console.log(res.data)
					})
				}else{
					$https.get('/chat/removeFromBlacklist?hackedUserId=' + this.id)
						.then(res => {
							this.groupMembers = res.data
							console.log(res.data)
					})
				}
			},
			// 去好友空间页面
			toUserSpace(id){
				this.$u.route('/pagesB/user/userSpace', {
					id: id
				})
			},
			// 根据id获取用户资料
			getFriendInfoById(id){
				this.$u.api.getFriendInfoById({
					friendId:id
				}).then(res=>{
					// console.log(res)
					if(res.code==200){
						this.friendInfo = res.data
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 设置备注
			setBzCllick(){
				this.$u.api.mobileFriendsGroup({
					concernerId: this.friendInfo.friendId,
					friendNotes: this.friendInfo.friendsNotes
				}).then(res=>{
					if(res.code==200){
						uni.showToast({
							title: '设置成功',
							icon: 'none'
						})
					}else{
						uni.showToast({
							title: '设置失败',
							icon: 'none'
						})
					}
				})
			},
			chekGroup(){
				this.isShowGroup = true
			}
		}
		
	}
</script>
<style lang="scss" scoped>
	.contacts-box{
		padding: 20rpx;
		.friend-info-box{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.friend-info-left{
				display: flex;
				align-items: center;
				width: 80vw;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				.friend-info{
					margin-left: 20rpx;
					.fname{
						font-weight: 600;
					}
					.fsigna{
						color: #979797;
					}
				}
			}
		}
		.friend-beizhu-box{
			padding-top: 40rpx;
			display: flex;
			align-items: center;
			border-bottom: 1px solid #F6F6F6;
			justify-content: space-between;
			.left{
				display: flex;
				align-items: center;
				.f-title{
					font-weight: 600;
					margin-right: 10rpx;
				}
				input{
					width: 200rpx;
					height: 60rpx;
					background: #FFFFFF;
					border: 1px solid #0077FF;
					border-radius: 10rpx;
				}
			}
			.set-beizhu{
				margin-left: 20rpx;
			}
		}
		.transfer-friend-box{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.left-box{
				font-weight: 600;
			}
			.right-box{
				display: flex;
				align-items: center;
				.rname{
					color: #979797;
					margin-right: 10rpx;
				}
			}
		}
	}
</style>
