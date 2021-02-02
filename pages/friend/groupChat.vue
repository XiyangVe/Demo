<template>
	<view class="page">
		<!--当用户无网提示-->
		<u-no-network></u-no-network>
		<u-navbar title="群组" title-color="#ffffff" back-icon-color="#ffffff" :background="{'background-color':'#6aa8d8'}"  height="50" :border-bottom="false">
			<view class="slot-wrap">
				<view >
					<u-icon name="plus" style="margin-right: 30rpx;" color="#ffffff" size="40" @click="$refs.modal.running()"></u-icon>
				</view>
			</view>
			
		</u-navbar>
		<!-- <view style="height: 60upx;"></view> -->
		<right-top-modal type="weather" ref="modal"></right-top-modal>
		<view v-if="loginState">
			<view class="" v-if="syList.length!=0">
				<view class="title">
					<text style="margin-left: 20upx;">商业群</text>
				</view>
				<view class="list" v-for="item in syList" @click="toGroupChat(item)">
					<image :src="`${baseUrl}${item.groupHeadImage}`" mode="" class="images"></image>
					<text class="nickname">{{item.groupName}}</text>
				</view>
			</view>
			<view class="">
				<view class="title">
					<text style="margin-left: 20upx;">创业群</text>
				</view>
				<view class="list" >
					<image :src="`${baseUrl}${this.myImg}`" mode="" class="images"></image>
					<text class="nickname">我的创业群</text>
					<text class="nickname1">我创建的创业群</text>
				</view>
				<view class="list" v-if="myRecommend=='{}'">
					<image :src="`${baseUrl}${myRecommend.userHeadImage}`" mode="" class="images"></image>
					<text class="nickname">{{myRecommend.nickname}}</text>
					<text class="nickname1">我的推荐人</text>
				</view>
			</view>
			<view class="">
				<view class="title">
					<text style="margin-left: 20upx;">普通群</text>
				</view>
				<view class="list" v-for="item in commonList" @click="toGroupChat(item)">
					<image :src="`${baseUrl}${item.groupHeadImage}`" mode="" class="images"></image>
					<text class="nickname">{{item.groupName}}</text>
				</view>
			</view>
		</view>
		<view v-else>	
			<to-login></to-login>
		</view>
	</view>
</template>

<script>
	// import cmdNavbar from '../../components/commoms/cmd-navbar.vue'
	// import friendList from '../../components/friend/friend-list.vue'
	// import groupChatList from '../../components/friend/group-chat-list.vue'
	import rightTopModal from '@/components/commoms/rightTop-modal1.vue'
	import freeListItem from '@/components/friend/free-list-item.vue';
	import toLogin from '../../components/commoms/cmd-toLogin.vue'
	import $https from '@/utils/lib/https.js';
	import { mapGetters } from 'vuex';
	export default {
		components: {
			// cmdNavbar,
			// friendList,
			// groupChatList,
			rightTopModal,
			toLogin
		},
		computed:{
			...mapGetters(['friendList']),
		},
		data() {
			return {
				commonList: [],
				syList: [],
				recommendList:[],//我推荐的人
				myRecommend:{},//推荐我的人
			}
		}, 
		onShow() {
			this.getUserGroupList()
		},
		methods: {
			
			getUserGroupList(){
				//获取普通群列表
				$https.get('/chat/getUserGroup?groupType=0').then(res => {
					console.log(res)
					this.commonList=res.data
				})
				//获取商业群列表
				$https.get('/chat/getUserGroup?groupType=1').then(res => {
					console.log(res)
					this.syList=res.data
				})
				//我推荐的人
				$https.get('/chatGroup/personIRecommend').then(res => {
					console.log(res)
					this.recommendList=res.data
				})
				//推荐我的人
				$https.get('/chatGroup/myReferrer').then(res => {
					console.log(res)
					if(res.code==200){
						this.myRecommend=res.data
					}
				})
				
				
			},
			toGroupChat(item){
				// console.log(item)
				// 把选择的群信息放在VueX
				this.$store.commit('index/setGroupInfo',item)
				this.$u.route('/pagesB/groupChat/groupChat', {
					groupName: item.groupName,
					groupId: item.id
				})
			},
			//前往聊天页面
			toChat(e){
				// console.log('123')
				let toId = e.currentTarget.dataset.toid
				let toName = e.currentTarget.dataset.toname 
				let toImg = e.currentTarget.dataset.toimg
				let toSigna = e.currentTarget.dataset.tosigna
				uni.navigateTo({
					url: `../../pagesA/news/chat?toId=${toId}&toName=${toName}&toImg=${toImg}&toSigna=${toSigna}`
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.slot-wrap{
		display: flex;
		align-items: center;
		flex: 1;
		justify-content: flex-end;
	}
	.messages {
		font-size: 32upx;
		font-weight: 400;
		line-height: ;
		margin: 0 30upx;
		line-height: 80upx;
	}
	.page {
		background-color: #FFFFFF;
		height: 100%;
		min-height: 100vh;
	}
	.list{
		display: flex;
		height: 100upx;
		border-bottom: 1px solid #f0f0f0;
	}
	.list1{
		display: flex;
		height: 100upx;
	}
	.images{
		width: 64upx;
		height: 64upx;
		margin:18upx 20upx;
	}
	.nickname{
		line-height:100upx ;
		font-size: 32upx;
		color: #000000;
	}
	.nickname1{
		position: absolute;
		right: 20upx;
		margin-top: 25upx;
	}
	.title{
		background: #f3f3f3;
		line-height: 80upx;
		font-size: 24upx;
		color: #979797;
	}

</style>
