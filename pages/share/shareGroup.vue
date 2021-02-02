<template>
	<view class="">
		<view class="share-group-box">
			<block v-for="(item,index) in groupChatList" :key="index">
				<view class="share-group-item" @click="confirm(item.id)">
					<u-image width="100rpx" height="100rpx" shape="circle" :src="`${baseUrl}${item.groupHeadImage}`"></u-image>
					<view class="group-name">
						{{item.groupName}}
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				// 群聊列表
				groupChatList: [],
				// 分享商品
				shareGoods: {
					goodsName: '',
					goodsId: '',
					recommendImage: '',
					type: 0,
					userId: null
				}
			}
		},
		onShow() {
			
		},
		onLoad() {
			if(this.$store.state.goods.goodsDesc.isIntegralMall==1){
				this.shareGoods.type = 1
			}
			this.getUserGroupList()
			this.shareGoods.goodsId = this.$store.state.goods.goodsDesc.id
			this.shareGoods.goodsName = this.$store.state.goods.goodsDesc.goodsName
			this.shareGoods.recommendImage = this.$store.state.goods.goodsDesc.recommendImage
			this.shareGoods.userId = this.myId
		},
		methods:{
			// 获取用户群列表
			getUserGroupList(){
				this.$u.api.getUserGroup().then(res=>{
					if(res.code==200){
						this.groupChatList = res.data
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 选择要分享的群
			confirm(id){
				var that = this
				uni.showModal({
				    title: '提示',
				    content: '是否确认分享？',
				    async success (res) {
				        if (res.confirm) {
							const res = await that.$myMethod.chat('',{
								msgType:5,
								chatType:1,
								groupId: JSON.stringify(id),
								content: JSON.stringify(that.shareGoods)
							}) 
							let data = {
								chatType:1,
								groupId: JSON.stringify(id),
								fromId:that.myId,
								msgType: 5,
								content: that.shareGoods,
								createTime: res.data.createTime,
								senderAvatar: that.myImg
							}
							that.$store.dispatch('news/handleSend',data)
							if(res.code==200){
								uni.showToast({
									title: '分享成功'
								})
								setTimeout(()=>{
									uni.navigateBack({
									    delta: 2
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
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.share-group-box{
		
		.share-group-item{
			padding: 10rpx 20rpx;
			display: flex;
			align-items: center;
			border-bottom: 2rpx solid #eee;
			.group-name{
				margin-left: 20rpx;
			}
		}
	}
</style>
