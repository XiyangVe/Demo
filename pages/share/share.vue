<template>
	<view>
		<!-- 自定义导航 -->
		<u-navbar back-text="返回" 
				title="选择联系人"
				title-bold>
				<view class="slot-wrap">
					<view class="is-ok" @click="confirm">
						完成
					</view>
				</view>
		</u-navbar>
		<!-- 选择分享到群聊 -->
		<view class="qun-box" @click="toShareGroup()">
			<view class="">
				选择群聊
			</view>
			<u-icon name="arrow-right" color="#2979ff" size="28"></u-icon>
		</view>
		<!-- 好友列表 -->
		<view class="friend-list">
			<block v-for="(item,index) in friendList" :key="index">
				<view class="user-info">
					<view class="u-left">
						<u-image shape="circle" width="100rpx" height="100rpx"
							:src="`${baseUrl}${item.friendsAvatar}`">
						</u-image>
						<view class="user-info-desc">
							<view class="nickname">
								{{item.nickname}}
							</view>
						</view>
					</view>
					<view class="right">
						<u-checkbox-group>
							<u-checkbox 
								shape="circle"
								@change="checkboxChange" 
								:name="item.friendId"
								v-model="item.isShow"
								>
							</u-checkbox>
						</u-checkbox-group>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				friendList: [],
				// 选择要分享的好友
				checkedUsers:[],
				// 分享商品
				shareGoods: {
					goodsName: '',
					goodsId: '',
					recommendImage: '',
					type: 0,
					userId: null
				},
				
			};
		},
		onLoad(e) {
			if(e.id){
				this.shareGoods.type = 1
			}
			this.getFriendGroupAll()
			this.shareGoods.goodsId = this.$store.state.goods.goodsDesc.id
			this.shareGoods.goodsName = this.$store.state.goods.goodsDesc.goodsName
			this.shareGoods.recommendImage = this.$store.state.goods.goodsDesc.recommendImage
			this.shareGoods.userId = this.myId
		},
		methods:{
			// 分享到群聊
			toShareGroup(){
				uni.navigateTo({
					url: './shareGroup'
				})
			},
			// 确定分享
			confirm(){
				var that = this
				if(that.checkedUsers.length == 0){
					uni.showToast({
					    title: '请选择要发送的好友',
						icon: 'none',
					    duration: 2000
					})
					return;
				}
				uni.showModal({
					title: '提示',
					content: '是否确定发送？',
					async success(res) {
						if (res.confirm) {
							for(var i=0;i<that.checkedUsers.length;i++){
								let time = new Date().getTime()
								let data = {
									//这里要互换
									otherId:that.checkedUsers[i]+'',
									chatType:0,
									newsList:[{
										id:that.myId,
										content: that.shareGoods,
										msgType: 5,
										createTime: time,
										file:{},
									}]
								}
								that.$store.dispatch('news/handleSend',data)
							}
							const res = await that.$myMethod.chat('',{
								chatType: 2,
								userIds: that.checkedUsers,
								msgType: 5,
								content: JSON.stringify(that.shareGoods)
							})
							if(res.code==200){
								uni.showToast({
									title: '分享成功'
								})
								setTimeout(()=>{
									uni.navigateBack({
									    delta: 1
									})
								},2000)
							}else{
								uni.showToast({
									title: res.msg,
									icon: 'none'
								})
							}
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
				
				
				
			},
			// 选择好友
			checkboxChange(e){
				if(e.value == true){
					this.friendList.map(val => {
						if(e.name == val.friendId){
							val.isShow = true
							this.checkedUsers.push(val.friendId)
						}
					})
				}else{
					this.friendList.map(val => {
						if(e.name == val.friendId){
							val.isShow = false
							var index = this.checkedUsers.indexOf(val.friendId)
							if(index>-1){
								this.checkedUsers.splice(index,1)
							}
						}
					})
				}
				// console.log(this.checkedUsers)
			},
			// 获取好友列表
			getFriendGroupAll(){
				this.$u.api.getFriendList().then(res=>{
					res.data.forEach(v=>{
						v.isShow = false
					})
					this.friendList = res.data
				})
			}
		}
	}
</script>

<style lang="scss">
	// 自定义导航
	.slot-wrap{
		display: flex;
		align-items: center;
		flex: 1;
		justify-content: flex-end;
		.is-ok{
			font-size: 30rpx;
			padding-right: 30rpx;
		}
	}
	// 选择群聊
	.qun-box{
		padding: 20rpx;
		border-bottom: 1rpx solid #EEEEEE;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	// 好友列表
	.friend-list{
		padding: 20rpx;
		.user-info{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10rpx 0;
			.u-left{
				display: flex;
				align-items: center;
				.user-info-desc{
					font-weight: 500;
					margin-left: 20rpx;
					.nickname{
						color: #000000;
					}
				}
			}
			.right{
				
			}
			
		}
	}
</style>
