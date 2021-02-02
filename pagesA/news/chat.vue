<template>
	<view>
		<!--导航栏-->
		<u-navbar back-icon-color="#ffffff" :title="toName" title-color="#ffffff" :background="{'background-color':'#6aa8d8'}"  height="50" :border-bottom="false">
			<view class="slot-wrap">
				<u-icon name="account-fill" color="#ffffff" size="40" @tap="toContacts"></u-icon>
			</view>
		</u-navbar>
		<!-- 布局 -->
		<view class="content">
			<!-- 聊天列表 -->
			<!--时间过滤器-->
			<view v-if="getNewsContent" class="time u-f-ajc">
				{{`${getNewsContent[0].createTime}` | timeFrom }}
			</view>
			<!--聊天对象-->
			<view class="chat-item">
				<chat-list :getNewsContent="getNewsContent" :toImg="toImg" ></chat-list>
			</view>
		</view>
		<!-- 输入框 -->
		<view class="bottom" >
			<view class="input-box u-f-ac">
				<view class="input" v-if="audioAndInputShow">
					<u-input v-model="value" type="textarea" auto-height :clearable="false"   height="40" /> 
				</view>
				<!-- 录制语言 -->
				<view class="audio-box" v-else @touchstart="onRecordStart" @touchend="onRecordEnd">
					按住录音
				</view>
				<view class="send">
					<u-button class="btn" shape="circle" type="primary" plain @tap="clickRequest" >发送</u-button>
				</view>
			</view>
			<!-- 底部分类 -->
			<view class="classification u-f-ac">
				<!-- 语音 -->
				<view class="item u-f-ajc" @click="audio" v-if="audioAndInputShow">
					<image src="../static/chat/yuyin.png" mode="widthFix"></image>
				</view>
				<view class="item u-f-ajc" @click="audio" v-else>
					<image src="/pagesB/static/jianpan.png" mode="widthFix"></image>
				</view>
				<!-- 图片 -->
				<view class="item u-f-ajc" @click="album">
					<image src="../static/chat/tupian.png" mode="widthFix"></image>
				</view>
				<!-- 相机 -->
				<view class="item u-f-ajc" @click="camera">
					<image src="../static/chat/xiangji.png" mode="widthFix" style="width:48rpx;"></image>
				</view>
				<!-- 表情 -->
				<view class="item u-f-ajc" @click="showEmoji">
					<image src="../static/chat/biaoqing.png" mode="widthFix" style="width:50rpx;"></image>
				</view>
			</view>
			<!--展示表情列表-->
			<view class="action-bottom" v-if="emoji.show" style="justify-content: space-around">
				<image class="emoji-item" 
						v-for="(emojiItem, emojiKey, index) in emoji.map" :key="index" 
						:src="emoji.url + emojiItem" @click="selectEmoji(emojiKey)">
				</image>
			</view>
		</view>
		<u-toast ref="uToast" />
		<!-- 录音开始动画 -->
		<view class="on-start" v-if="isShow">
			<image src="/static/recording-loading.gif" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script>
	const recorderManager = uni.getRecorderManager();
	
	import chatList from '../components/news/user-chat-list.vue'
	import EmojiDecoder from "../../utils/EmojiDecoder.js";
	import { mapGetters } from 'vuex';
	var time
	export default {
		components:{
			chatList
		},
		computed: {
			...mapGetters(['allNewsList']),
			//获取当前toid 和 fromid 对应消息的聊天内容
			getNewsContent:function(){
				let currentChatType = 1	
				//当前发送消息的对象
				//从vuex里找，找不到再去拉取本地缓存
 				let exist = this.allNewsList.some( v =>{
					return v.otherId === this.toId
				})
				if(exist){
					//存在就过滤
					let currentNewsList = this.allNewsList.filter( v =>{
						return v.otherId === this.toId
					})
					return currentNewsList[0].newsList 
				}else{
					//否则尝试拉取本地存储
 					try{
						this.$store.dispatch('news/queryAllNewsList',this.toId)
						let currentNewsList = this.allNewsList.filter( v => {
							return v.otherId === this.toId
						})
						// console.log(currentNewsList)
						return currentNewsList[0].newsList
					}catch(e){
						console.log(e.message)
					} 
				}
			}
		},
		watch:{
			getNewsContent(){
				if(!this.onPullDown){
					this.toPagesBottom()
				}
			},
		},
		data() {
			let emojiUrl = 'https://imgcache.qq.com/open/qcloud/tim/assets/emoji/';
			let emojiMap = {
				'[么么哒]': 'emoji_3@2x.png',
				'[乒乓]': 'emoji_4@2x.png',
				'[便便]': 'emoji_5@2x.png',
				'[信封]': 'emoji_6@2x.png',
				'[偷笑]': 'emoji_7@2x.png',
				'[傲慢]': 'emoji_8@2x.png'
			};
			return {
				//聊天对象
				toId:'',
				toName:'',
				toImg:'',
				toSigna:'',
				//是否开启下拉
				onPullDown:false,
				//输入内容
				value:'',
				// 控制输入框录音按钮显示隐藏
				audioAndInputShow:true,
				isShow:false,
				//键盘高度
				/* keyHight:'0rpx' */
				//定义表情列表
				emoji : {
					url : emojiUrl,
					map : emojiMap,
				    show: false,
				    decoder:  new EmojiDecoder(emojiUrl, emojiMap),
				},
				// 录音地址
				voicePath: ''
			};
		},
		onLoad(e) {
			this.toId = e.toId
			this.toName = e.toName
			this.toImg = e.toImg
			this.toSigna = e.toSigna
			//告诉vuex现在是哪个人聊天
			this.$store.commit('news/SET_TOID',e.toId)
			
			// 这里做了发送语音
			let self = this;
			recorderManager.onStop(function (res) {
				self.voicePath = res.tempFilePath;
				self.sendAudio()
			})
		},
		onReady() {
			//返回到底端	
			this.toPagesBottom()
			//清空当前聊天未读消息
			this.$store.commit('news/CLEAR_NO_MSGNUMBER')
		},
		onUnload(){
			this.$store.commit('news/CLEAR_NO_MSGNUMBER')
		},
		//上拉加载更多
		onPullDownRefresh(){
			this.onPullDown = true
			this.$store.dispatch('news/queryAllNewsList',this.toId).then(res=>{
				uni.stopPullDownRefresh();
				time = setTimeout(()=>{
					this.onPullDown = false
				},1000)
			})
		},
		methods: {
			// 显示表情栏
			showEmoji() {
				this.emoji.show = !this.emoji.show;
				// this.more.show = false;
			},
			// 选择表情
			selectEmoji(emojiKey) {
				this.value +=emojiKey
			},
			//跳转到联系人
			toContacts(){
				this.$u.route('/pagesA/news/contacts', {
					toId: this.toId
				})
			},
			//滚动到底部
			toPagesBottom(){
				this.$nextTick(function(){
					this.$u.debounce(()=>{
						uni.pageScrollTo({
							scrollTop: 99999,
							duration:100
						})
					}, 300)
				})
			},
			//发送消息
			async clickRequest() {
				let time = new Date().getTime()
				let data = {
					//这里要互换
					otherId:this.toId,
					chatType:0,
					newsList:[{
						id:this.myId,
						content:this.value,
						/* content:i, */
						msgType:0,
						createTime: time,
						file:{},
					}]
				}
				this.$store.dispatch('news/handleSend',data)
				this.toPagesBottom()
				//发送消息
				let res = await this.$myMethod.chat('',{
					toId:this.toId,
					msgType:0,
					chatType:0,
					content:this.value,
				}) 
				// console.log(res)
				if(res.code !== 200){
					console.log('发送失败')
					this.$store.dispatch('FAIL_SEND',data)
					this.$refs.uToast.show({
						title: '发送失败',
						type: 'error',
						icon:false
					}) 
				}else{
					this.value = ''
				}
			},
			// 语音与文字功能切换
			audio(){
				this.audioAndInputShow = !this.audioAndInputShow
			},
			// 开始录音
			onRecordStart () {
				try{
					this.isShow = true
					recorderManager.start();
					console.log('开始录音')
				}catch(e){
					console.log("e:",e);
					uni.showModal({
						title: '录音错误',
						content : e.message
					});
				}
			},
			onRecordEnd () {
				try{
					this.isShow = false
					recorderManager.stop();
					console.log('停止录音')
				}catch(e){
					console.log("e:",e);
				}
			},
			// 发送语音
			async sendAudio(){
				const res =  await this.$myMethod.chat(this.voicePath,{
					toId:this.toId,
					msgType:2,
					chatType:0,
				})
				console.log(res)
				if(res.code === 200){
					let data = {
						otherId:this.toId,
						chatType:0,
						newsList:[{
							id:this.myId,
							content:res.data.url,
							msgType:2,
							createTime:res.data.createTime,
							duration: res.data.duration
						}]
					}
					this.$store.dispatch('news/handleSend',data)
				}
			},
			//相册
			album(){
				let that = this
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相机选择
					success: async  function(chooseImageRes) {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						for(let i = 0; i < tempFilePaths.length; i++){
							let res =  await that.$myMethod.chat(tempFilePaths[0],{
								toId:that.toId,
								msgType:1,
								chatType:0,
							})
							console.log(res)
							if(res.code === 200){
								let data = {
									otherId:that.toId,
									chatType:0,
									newsList:[{
										id:that.myId,
										content:res.data.url,
										msgType:1,
										createTime:res.data.createTime,
										file:{},
									}]
								}
								that.$store.dispatch('news/handleSend',data)
							}else{
								that.$refs.uToast.show({
									title: '发送失败',
									type: 'error',
									icon:false
								})
							}
						}
					}
				});
			},
			//相机
			camera() {
				let that = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera'], //从相机选择
					success: async  function(chooseImageRes) {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						let res =  await that.$myMethod.chat(tempFilePaths[0],{
							toId:that.toId,
							msgType:1,
							chatType:0,
						})
						if(res.code === 200){
							let data = {
								otherId:that.toId,
								chatType:0,
								newsList:[{
									id:that.myId,
									content:res.data.url,
									msgType:1,
									createTime:res.data.createTime,
									file:{},
								}]
							}
							that.$store.dispatch('news/handleSend',data)
						}else{
							that.$refs.uToast.show({
								title: '发送失败',
								type: 'error',
								icon:false
							})
						}
					}
				});
			}
		},
	}
</script>

<style lang="less" scoped>
	.slot-wrap {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex: 1;
		padding: 0 30rpx;
		font-size: 32rpx;
		font-weight: normal;
		
	}
	.time{
		margin: 20rpx 0;
		color: #909399;
	}
	.content{
		padding-bottom: 150rpx;
	}
	/* 分类 */
	.bottom {
		position: fixed;
		bottom: 0; 
		left: 0;
		right: 0;
		background: #f1f1f1;
		padding: 20rpx 20rpx 10rpx 20rpx;
		.input-box{
			 align-items: flex-end ;
			.input{
				flex: 8;
				background-color: #FFFFFF;
				padding: 0 10rpx;
				border-radius: 25rpx;
			}
			.audio-box{
				flex: 8;
				width: 400rpx;
				height: 60rpx;
				line-height: 60rpx;
				border-radius: 6px;
				background: #cccccc;
				color: #ffffff;
				text-align: center;
			}
			.send{
				flex: 1;
				.btn{
					width: 75%;
					height: 60rpx;
				}
			}
		}
		.classification{
			padding-top: 10rpx;
			.item{
				flex: 1;
				image{
					width: 40rpx;
				}
			}
		}
		.action-bottom{
			height: 150px;
			width: 100%;
			padding: 10px;
			box-sizing: border-box;
			display: flex;
			background-color: #FFFFFF;
			image{
				width: 100rpx;
				height: 100rpx;
			}
		}
	}
	.on-start{
		position: fixed;
		bottom: 30%;
		left: 50%;
		transform: translate(-50%,-50%);
		image{
			width: 400rpx;
			height: 360rpx;
			border-radius: 20rpx;
		}
	}
</style>
