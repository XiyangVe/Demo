<template>
	<view class="video-content" :style="{height:swiperheight + 'px'}">
		<!--自定义导航栏-->
		<u-navbar back-icon-color="#ff6969" title="" height="50">
			<view class="slot-wrap u-f-ajs">
				<view class="left u-f-ac" @tap="toOtherUser">
					<!--作者-->
					<u-image width="50rpx" mode="widthFix" :src="`${baseUrl}${messPublishData.userHeadImage}`" :lazy-load="false"
					 shape="circle"></u-image>
					<text style="margin-left: 20rpx;">{{messPublishData.userName}}</text>
				</view>
				<view class="right u-f-ajc">
					<u-icon name="zhuanfa" style="margin-right: 30rpx;" color="#ff6969" size="50"></u-icon>
					<view @click="setFllow">
						<u-tag :text="isFllow ? '已关注' : '关注'" :bg-color="isFllow ?  '#cccccc' : '#ff6969' " shape="circle" mode="dark" />
					</view>
				</view>
			</view>
		</u-navbar>
		<view class="body">
			<!--视频-->
			<view class="video-box">
				<swiper-action @swiperAction="handleSwiperAction">
					<video class="video" id="myVideo" 
							loop 
							:controls="false" 
							:autoplay="isPlay"
							:danmu-list="danmuList" 
							:enable-danmu="true" 
							:danmu-btn="true" 
							object-fit="contain" 
							@click="videoPlay" 
							:src="`${baseUrl}${messPublishData.messVidio}`">
					</video>
				</swiper-action>
				<!--主要内容-->
				<view class="content">
					<!--主要标题信息-->
					<view class="title">{{messPublishData.title}}</view>
					<view class="info">
						<view>
							{{messPublishData.messText}}
						</view>
						<view class="time">{{$u.timeFormat(messPublishData.createTime, 'yyyy-mm-dd hh:MM:ss')}}</view>
					</view>
				</view>
			</view>
		</view>
		<!--评论组件-->
		<view class="comment-box" v-if="commentIsShow">
			<comment :id="id" ref="comment" @hand="setCommonNumber"></comment>
		</view>
		<!--输入盒子-->
		<view class="input-box">
			<cmd-input :value="value" ref="inputBox" @changeInput="setInput" @send="service"></cmd-input>
		</view>
		<!--底部操作栏-->
		<view class="operate">
			<view class="ready-input u-f-ac" @tap="$refs.inputBox.isShowInput({type:'comment'})">
				说点什么...
			</view>
			<view class="other-info">
				<view class="item">
					<u-icon name="thumb-up-fill" :color="isbingoIds ? '#ff6969' : '#cccccc'" size="50" @click="mesFavor"></u-icon>
					<text v-if="messPublishData.messCount">{{messPublishData.messCount}}</text>
					<text v-else>点赞</text>
				</view>
				<view class="item">
					<u-icon name="star-fill" :color="iscollectedIds ? '#ff6969' : '#cccccc'" size="50" @click="mesCollection"></u-icon>
					<text v-if="messPublishData.messCollect">{{messPublishData.messCollect}}</text>
					<text v-else>收藏</text>
				</view>
				<view class="item" @click="isComment">
					<u-icon name="chat" color="#ff6969" size="50"></u-icon>
					<text>{{commentNumber}}</text>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {mapGetters} from 'vuex'
	import comment from '../components/index/comment.vue'
	import cmdInput from '../../components/commoms/cmd-input.vue'
	import swiperAction from '../../components/commoms/swiperAction.vue'

	export default {
		components: {
			comment,
			cmdInput,
			swiperAction
		},
		data() {
			return {
				id: '',
				messPublishData: {},
				//是回复还是评论
				sendType: 'no',
				//输入值
				value: '',
				//评论条数
				commentNumber: 0,
				//高度自适应
				swiperheight: 0,
				danmuList: [{
						text: '第 1s 出现的弹幕',
						color: '#ff0000',
						time: 1
					},
					{
						text: '第 3s 出现的弹幕',
						color: '#ff00ff',
						time: 3
					}
				],
				// 控制暂停播放
				isPlay: true,
				// 评论组件是否显示
				commentIsShow: false
			}
		},
		computed: {
			...mapGetters(['collectedIds', 'bingoIds', 'concernedIds']),
			
			//关注
			isFllow: function() {
				return this.concernedIds.some(v => v == this.messPublishData.userId) ? true : false
			},
			//是否点赞与收藏
			isbingoIds: function() {
				return this.bingoIds.some(v => v == this.messPublishData.id) ? true : false
			},
			iscollectedIds: function() {
				return this.collectedIds.some(v => v == this.messPublishData.id) ? true : false
			}
		},
		onLoad(e) {
			this.id = e.id
			this.getDeatails()
		},
		onReady() {
			this.videoContext = uni.createVideoContext('myVideo')
			this.handleSwiperheight()
		},
		methods: {
			//高度自适应
			handleSwiperheight() {
				//查询屏幕高度,自动填写swpier高度
				uni.getSystemInfo({
					success: (res) => {
						let height = 0
						//#ifdef APP-PLUS
						height = res.windowHeight - uni.upx2px(240)
						//#endif
						//#ifdef H5
						height = res.windowHeight - uni.upx2px(190)
						//#endif
						this.swiperheight = height;
					}
				})
			},
			// 滑动事件
			handleSwiperAction(e) {
				// console.log(e)
				this.$u.api.getRandomVidio({
					messSortGrade: 1
				}).then(res => {
					// console.log(res)
					if (res.code == 200) {
						this.id = ''
						this.messPublishData = {}
						this.id = res.data.id
						this.getDeatails()
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			isComment() {
				this.commentIsShow = !this.commentIsShow
				this.$refs.inputBox.isShowInput({
					type: 'comment'
				})
			},
			videoPlay() {
				this.commentIsShow = false
				if (this.isPlay) {
					this.videoContext.pause()
					this.isPlay = false
				} else {
					this.videoContext.play()
					this.isPlay = true
				}
			},
			//获取内容信息
			getDeatails() {
				this.$u.api.getMessPublishDeta({
					id: this.id
				}).then(res => {
					// console.log(res) 
					this.messPublishData = res.data
				})
			},
			//设置评论条数
			setCommonNumber(value) {
				this.commentNumber = value
			},
			//访问他的个人中心
			toOtherUser() {
				if (!this.loginState) {
					this.handleNoLogin()
					return
				} else {
					uni.navigateTo({
						url: `../../pagesB/user/userSpace?id=${this.messPublishData.userId}`
					})
				}
			},
			//设置关注
			setFllow() {
				this.$u.throttle(async () => {
					let res
					if (this.isFllow) {
						res = await this.$u.api.removeFriend({
							concernerId: this.messPublishData.userId
						})
					} else {
						res = await this.$u.api.addFriend({
							concernerId: this.messPublishData.userId
						})
					}
					if (res.code == 200) {
						this.$store.commit('user/SET_FLLOW', {
							id: this.messPublishData.userId,
							type: this.isFllow
						})
					}
					this.$refs.uToast.show({
						title: res.msg,
					})
				}, 500)
			},
			//点赞	
			mesFavor() {
				if (!this.loginState) {
					this.handleNoLogin()
					return
				} else {
					this.$u.throttle(() => {
						this.$u.api.mesFavor({
							id: this.messPublishData.id,
							count: this.messPublishData.messCount,
							type: this.isbingoIds ? 1 : 0
						}).then(res => {
							this.$store.commit('user/SET_BINGOIDS', {
								id: this.messPublishData.id,
								type: this.isbingoIds
							})
							this.isbingoIds ? this.messPublishData.messCount++ : this.messPublishData.messCount--
						})
					}, 500)
				}
			},
			//收藏
			mesCollection() {
				if (!this.loginState) {
					this.handleNoLogin()
					return
				} else {
					this.$u.throttle(() => {
						this.$u.api.mesCollection({
							id: this.messPublishData.id,
							collect: this.messPublishData.messCollect,
							type: this.iscollectedIds ? 1 : 0
						}).then(res => {
							this.iscollectedIds ? this.messPublishData.messCollect-- : this.messPublishData.messCollect++
							this.$store.commit('user/SET_COLLECTEDIDS', {
								id: this.messPublishData.id,
								type: this.iscollectedIds
							})
							//触发首页收藏回调
							// uni.$emit('setStroeVideo', {
							// 	mesId: this.messPublishData.id,
							// 	type: this.iscollectedIds
							// })
						})
					}, 500)
				}
			},
			//设置评论输入值
			setInput(value) {
				// console.log(this.list)
				this.value = value
			},
			//设置回复值
			//被触发的发送信息事件
			async service(data) {
				if (!this.value) {
					this.$refs.uToast.show({
						title: '请输入内容',
						type: 'warning',
					})
					return
				}
				/* console.log(data) */
				let res
				if (data.type === 'comment') {
					res = await this.$u.api.addMescomment({
						messPublishId: this.id,
						commentContent: this.value
					})
				} else if (data.type === 'reply') {
					console.log(data.msgCommentedReplyId)
					res = await this.$u.api.addMescommentrelay({
						commentedId: data.id,
						commentedUserId: data.userid,
						commentReplyContent: this.value,
						msgCommentedReplyId: data.msgCommentedReplyId,
					})
					console.log(res)
				}
				if (res.code === 200) {
					this.$refs.uToast.show({
						title: '发表成功',
						type: 'success',
					})
					this.$refs.comment.getList()
				} else {
					this.$refs.uToast.show({
						title: res.msg,
						type: 'error',
					})
				}
				this.value = ''
				this.$refs.inputBox.closeInput()
			},
			//未登录提示
			handleNoLogin() {
				this.$refs.uToast.show({
					title: '您尚未登录',
					type: 'error',
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.video-content {
		position: relative;
		top: 0;
		left: 0;
		width: 100vw;

		//自定义导航栏
		.slot-wrap {
			display: flex;
			align-items: center;
			/* 如果您想让slot内容占满整个导航栏的宽度 */
			flex: 1;
			/* 如果您想让slot内容与导航栏左右有空隙 */
			padding: 20rpx 0rpx 10rpx 10rpx;

			.left {
				flex: 7;
			}

			.right {
				flex: 4;

				.u-image {
					position: relative;
					top: 5rpx;
				}
			}
		}

		//内容主体
		.body {
			height: 100%;
			.video-box {
				height: 100%;
				.video {
					width: 100%;
					height: 70vh;
				}
			}
			.content {
				width: 710rpx;
				margin: 30rpx 20rpx;
				.title {
					font-size: 34rpx;
					font-weight: bold;
					margin-bottom: 10rpx;
				}
				.info {
					border-bottom: 1rpx solid #e2e2e2;
					.time {
						margin: 10rpx 0;
					}
				}
			}
		}
		// 输入框
		.input-box {}
		.comment-box{
			padding: 20rpx;
			position: fixed;
			bottom: 90rpx;
			background-color: #FFFFFF;
			width: 100vw;
		}
		.controls-title {
			width: 100%;
			z-index: 99999;
			text-align: right;
			position: absolute;
			top: 50%;
			color: #FFFFFF;
		}
		//底部操作栏
		.operate {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #f0f0f0;
			height:90rpx;
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.ready-input{
				background-color: #FFFFFF;
				color: #c0c4cc;
				border-radius: 20rpx;
				width: 300rpx;
				height: 50rpx;
				margin-right: 20rpx;
				padding-left: 10rpx;
				flex: 4;
			}
			.other-info {
				flex: 5;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.item {
					display: flex;
					align-items: center;
					image {
						width: 50rpx;
					}
					text {
						font-size: 30rpx;
						margin-left: 10rpx;
					}
				}
			}
		}
	}
</style>
