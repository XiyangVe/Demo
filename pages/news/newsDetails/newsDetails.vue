<template>
	<view>
		<!-- 自定义导航栏 -->
		<u-navbar back-icon-color="#0077FF" :border-bottom="false">
			<view slot="right" class="slot-wrap px-3 py-2" hover-class="bg-light">
				<u-icon name="share" color="#0077FF" size="40"></u-icon>
			</view>
		</u-navbar>
		
		<view class="p-2">
			<view class="">
				<text class="font-lg text-dark">{{newsInfo.title}}</text>
			</view>
			<view class="my-2 flex align-center justify-between">
				<view class="flex align-center flex-5">
					<u-image shape="circle" width="62rpx" height="62rpx" :src="`${baseUrl}${newsInfo.userHeadImage}`"></u-image>
					<view class="ml-2">
						<text class="font-md text-dark">{{newsInfo.userName}}</text>
						<view class="">
							<text class="font-sm text-light-muted">{{newsInfo.createTime | date('yyyy-mm-dd hh:MM')}}</text>
							<text class="font-sm text-light-muted pl-1">{{companyName}}</text>
						</view>
					</view>
				</view>
				<view class="flex-1 flex justify-center align-center">
					<view class="rounded-circle bg-danger text-white font-small" 
						style="width: 100rpx;height: 50rpx;line-height: 50rpx;text-align: center;"
						hover-class="hover-styles"
						@click="setFllow">{{isFllow ? '取消关注' : '+ 关注'}}</view>
				</view>
			</view>
			<!-- 副标题 -->
			<view class="">
				<text class="font text-light-muted">{{newsInfo.deputyTitle}}</text>
			</view>
			<!-- 资讯内容(富文本解析) -->
			<view class="" v-if="newsInfo.messType===1">
				<rich-text :nodes="newsInfo.html"></rich-text>
			</view>
			<!-- 视频 -->
			<view @click="toVideo()" class="flex justify-center align-center" v-if="newsInfo.messType===0">
				<image class="position-relative" :src="`${baseUrl}${newsInfo.cover}`" style="width: 710rpx;height: 340rpx;" mode="aspectFill"></image>
				<view class="position-absolute">
					<u-icon name="play-circle" size="100" color="#fff"></u-icon>
				</view>
			</view>
			<!-- 阅读量区域 -->
			<view class="my-2 flex align-center justify-between">
				<view class="flex align-center">
					<text class="font-sm text-dark">{{newsInfo.pageViews}}阅读</text>
				</view>
				<view class="">
					<text class="font-sm text-light-muted">审核人:</text>
					<text class="font-sm text-light-muted">admin</text>
				</view>
			</view>
			<!-- 文章打赏区域 -->
			<view class="flex align-center justify-between">
				<view class="flex-1">
					<u-line color="#6c757d"/>
				</view>
				<view class="flex-2 flex align-center justify-center">
					<text class="font-sm text-muted">好的东西需要你的鼓励</text>
					<view class="" @click="reward()">
						<text class="font-sm main-text-color">打赏</text>
					</view>
				</view>
				<view class="flex-1">
					<u-line color="#6c757d"/>
				</view>
			</view>
		</view>
		
		<!-- 问卷调查区域 -->
		<view class="p-2">
			<text class="font-sm text-light-muted">{{quest.questionnaireIssueSet}}</text>
			<view class="flex align-center justify-between my-2">
				<view class="rounded-circle px-2 font-sm"
				style="border: 2rpx solid #0077FF;color: #0077FF;">
					有用
				</view>
				<view class="rounded-circle px-2 font-sm"
				style="border: 2rpx solid #FF6969;color: #FF6969;">
					没用
				</view>
			</view>
		</view>
		
		<!-- 广告轮播图 -->
		<view class="position-relative"
		style="width: 750rpx;height: 420rpx;" 
		v-if="adShow">
			<swiper style="width: 750rpx;height: 386rpx;"
			:indicator-dots="true" :autoplay="true" :interval="7000" :duration="1000">
				<swiper-item class="px-2" v-for="(item,index) in adLists" :key=""index>
					<image @click="clickAd(item)" style="width: 710rpx;height: 386rpx;" :src="`${baseUrl}${item.icon}`" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			<view class="position-absolute flex justify-center align-center" 
				style="bottom: 34rpx;right: 20rpx;width: 120rpx;height: 46rpx;background-color: rgba(255,255,255,0.3);">
				<text class="font-small text-white">广告</text>
				<view class="ml-1" @click="closeAd">
					<uni-icons type="close" color="#fff"></uni-icons>
				</view>
			</view>
		</view>
		
		<!-- 全部评论 -->
		<view style="height: 10rpx;background-color: #F0F0F0;"></view>
		<view class="">
			<view class="p-2">
				<text class="font-md text-dark font-weight-bolder">全部评论</text>
			</view>
		</view>
		
		<!--评论组件-->
		<view class="p-2">
			<comment :id="id" ref="comment" @hand="setCommonNumber"></comment>
		</view>
		
		<!--输入盒子-->
		<cmd-input :value="value" ref="inputBox" @changeInput="setInput" @send="service"></cmd-input>
		
		<!--底部操作栏-->
		<view class="operate u-f-ajc">
			<view class="ready-input u-f-ac" @tap="$refs.inputBox.isShowInput({type:'comment'})">
				说点什么...
			</view>
			<view class="other-info u-f-ajc">
				<view class="item u-f-ajc">
					<u-icon  name="thumb-up-fill" :color="isbingoIds ? '#ff6969' : '#cccccc'" size="50" @click="mesFavor"></u-icon>			
					<text v-if="newsInfo.messCount">{{newsInfo.messCount}}</text>
					<text v-else>点赞</text>
				</view>
				<view class="item u-f-ajc">
					<u-icon name="star-fill" :color="iscollectedIds ? '#ff6969' : '#cccccc'" size="50" @click="mesCollection"></u-icon>
					<text v-if="newsInfo.messCollect">{{newsInfo.messCollect}}</text>
					<text v-else>收藏</text>
				</view>
				<view class="item u-f-ajc">
					<u-icon name="chat"  color="#ff6969" size="50"></u-icon>
					<text>{{commentNumber}}</text>
				</view>
			</view>
		</view>
		<!-- 打赏操作弹出层 -->
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog
				mode="input"
				title="打赏"
				placeholder="请输入打赏金额"
				@confirm="confirm"></uni-popup-dialog>
		</uni-popup>
		
		<view class="bg-white" style="height: 200rpx;"></view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { mapState,mapGetters } from 'vuex';
	import comment from '@/pagesA/components/index/comment.vue'
	import cmdInput from '@/components/commoms/cmd-input.vue'
	
	export default {
		components:{
			comment,
			cmdInput
		},
		data() {
			return {
				id:'',
				//是回复还是评论
				sendType:'no',
				//输入值
				value: '',
				//评论条数
				commentNumber:0,
				// 企业名
				companyName: '',
				// 广告列表
				adLists: [],
				// 广告显示&隐藏
				adShow: false,
				// 问卷调查
				quest: {}
				
			}
		},
		computed:{
			...mapState({
				newsInfo: state => state.index.nodes,
				maps: state => state.goods.maps
			}),
			...mapGetters(['collectedIds','bingoIds','concernedIds']),
			//关注
			isFllow:function(){
				return this.concernedIds.some(v => v == this.newsInfo.userId) ? true : false
			},
			//是否点赞与收藏
			isbingoIds:function(){
				return this.bingoIds.some(v => v == this.newsInfo.id) ? true : false
			},
			iscollectedIds:function(){
				return this.collectedIds.some(v => v == this.newsInfo.id) ? true : false
			}
		},
		onLoad(data) {
			this.id = data.id
			this.updateByPageViews()
			this.getQuestList()
			this.getAdvertise()
			this.queryCompanyName()
			console.log(this.newsInfo)
		},
		methods: {
			// 获取调查表
			async getQuestList(){
				const res = await this.$https.get('/questionnaire/listQuest',{
					questionnaireIssueType: 0,
					questionnaireIssueTypeId: this.newsInfo.id
				})
				this.quest = res.data
				console.log(res)
			},
			// 广告获取
			async getAdvertise(){
				const res = await this.$https.get('/advertise',{
					advertiseType: 2,
					advertiseStatus: 0,
					isQzts: 0
				})
				this.adLists = res.data
				if(res.data.length>0){
					this.adShow = true
				}
			},
			// 广告点击事件
			clickAd(item){
				// #ifdef APP-PLUS
					plus.runtime.openURL('http://59.110.165.249/');
				// #endif
			},
			// 关闭广告
			closeAd(){
				this.adShow = false
			},
			// 根据用户id获取企业
			async queryCompanyName(){
				const res = await this.$https.get('/messPublish/queryCompanyName',{userId:this.newsInfo.userId})
				this.companyName = res.data
			},
			// 播放视频
			toVideo(){
				uni.navigateTo({
					url: '/pages/news/newsDetails/video/video?url='+this.newsInfo.messVidio
				})
			},
			// 打赏功能
			reward(){
				this.$refs.popup.open()
			},
			// 确认打赏
			async confirm(done,value){
				// 输入框的值 value
				const res = await this.$https.get('/messPublish/giveByUserIdAdd',{
					givePrice: value,
					useredId: this.newsInfo.userId
				})
				// TODO 做一些其他的事情，手动执行 done 才会关闭对话框
				done()
				setTimeout(()=>{
					uni.showToast({
						title: '打赏成功',
						icon: 'none'
					})
				},1500)
			},
			//设置评论条数
			setCommonNumber(value){
				this.commentNumber = value
			},
			//设置关注
			setFllow(){
				this.$u.throttle( async ()=>{
					let res 
					if(this.isFllow){
						res = await this.$u.api.removeFriend({
							concernerId:this.newsInfo.userId
						})
					}else{
						res = await this.$u.api.addFriend({
							concernerId:this.newsInfo.userId
						})
					}
					if(res.code == 200){
						this.$store.commit('user/SET_FLLOW',{
							id:this.newsInfo.userId,
							type:this.isFllow
						})
					}
				},500)
			},
			//点赞	
			mesFavor(){
				if(!this.loginState){
					this.handleNoLogin()
					return
				}else{
					this.$u.throttle(()=>{
						this.$u.api.mesFavor({
							id:this.newsInfo.id,
							count:this.newsInfo.messCount,
							type:this.isbingoIds ? 1 : 0
						}).then(res => {
							this.$store.commit('user/SET_BINGOIDS',{
								id:this.newsInfo.id,
								type:this.isbingoIds
							})
							this.isbingoIds ? this.newsInfo.messCount++ : this.newsInfo.messCount--
						})
					}, 500)
				}
			},
			//收藏
			mesCollection(){
				if(!this.loginState){
					this.handleNoLogin()
					return
				}else{
					this.$u.throttle(()=>{
						this.$u.api.mesCollection({
							id:this.newsInfo.id,
							collect:this.newsInfo.messCollect,
							type:this.iscollectedIds ? 1 : 0
						}).then(res=>{
							this.iscollectedIds ? this.newsInfo.messCollect-- : this.newsInfo.messCollect++
							this.$store.commit('user/SET_COLLECTEDIDS',{
								id:this.newsInfo.id,
								type:this.iscollectedIds
							})
							//触发首页收藏回调
							// uni.$emit('setStroe',{mesId:this.newsInfo.id,type:this.iscollectedIds})
						})
					}, 500)
				}
			},
			//设置评论输入值
			setInput(value){
				this.value = value
			},
			//设置回复值
			//被触发的发送信息事件
			async service(data){
				if(!this.value){
					this.$refs.uToast.show({
						title: '请输入内容',
						type: 'warning',
					})
					return
				}
				let res 
				if(data.type === 'comment'){
					res = await this.$u.api.addMescomment({
						messPublishId:this.id,
						commentContent:this.value
					})
				}else if(data.type === 'reply'){
					console.log(data.msgCommentedReplyId)
					res = await this.$u.api.addMescommentrelay({
						commentedId:data.id,
						commentedUserId:data.userid,
						commentReplyContent:this.value,
						msgCommentedReplyId:data.msgCommentedReplyId,
					})
					console.log(res)
				}
				if(res.code === 200){
					this.$refs.uToast.show({
						title: '发表成功',
						type: 'success',
					})
					this.$refs.comment.getList()
				}else{
					this.$refs.uToast.show({
						title: res.msg,
						type: 'error',
					})
				}
				this.value = ''
				this.$refs.inputBox.closeInput()	
			},
			//未登录提示
			handleNoLogin(){
				this.$refs.uToast.show({
					title: '您尚未登录',
					type: 'error',
				})
			},
			// 记录浏览量
			async updateByPageViews(){
				let res = await this.$https.get('/messPublish/updateByPageViews',{
					id: this.id,
					longitude: this.maps.longitude,
					latitude: this.maps.latitude
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	//底部操作栏
	.operate{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #f0f0f0;
		height:90rpx;
		padding: 0 20rpx;
		.ready-input{
			background-color: #FFFFFF;
			color: #c0c4cc;
			border-radius: 20rpx;
			width: 300rpx;
			height: 50rpx;
			margin-right: 20rpx;
			padding-left: 10rpx;
		}
		.other-info{
			width: 390rpx;
			.item{
				flex: 1;
				image{
					width: 50rpx;
				}
				text{
					font-size: 30rpx;
					margin-left: 10rpx;
				}
			}
		}
	}
</style>
