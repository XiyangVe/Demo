<template>
	<view class="goods-pl-desc-box">
		<!--自定义导航栏-->
		<u-navbar title="评论详情" back-icon-color="#FF6969"></u-navbar>
		<view class="goods-pl-item">
			<view class="goods-pl-item-top">
				<view class="userinfo-left">
					<view class="user-tx">
						<image class="y-img" :src="`${baseUrl}${goodsPlInfo.headImg}`" mode="aspectFill"></image>
					</view>
					<view class="user-name">
						{{goodsPlInfo.userName}}
					</view>
				</view>
				<view class="time-right">
					{{$u.timeFormat(goodsPlInfo.commentTime,'yyyy-mm-dd')}}
				</view>
			</view>
			<view class="goods-pl-item-content">
				<view class="goods-pl-item-content-top">
					<u-rate size="40" :disabled="true" :count="count" v-model="goodsPlInfo.goodsScore"></u-rate>
					<text class="gtype">{{goodsPlInfo.purchasedSpecifications}}</text>
				</view>
				<view class="comment-content">
					{{goodsPlInfo.commentContent}}
				</view>
			</view>
			<view class="goods-pl-item-img">
				<block v-for="(img,index2) in goodsPlInfo.addPlImg" :key="index2">
					<image class="pl-img" :src="`${baseUrl}${img}`" mode="aspectFill"></image>
				</block>
			</view>
			<!-- 追加评论 -->
			<view class="goods-add-to-pl">
				<block v-for="(item,index) in goodsPlInfo.review" :key="index">
					<view class="top">
						<view class="title">
							追加评论
						</view>
						<view class="time">
							{{$u.timeFormat(item.commentTime,'yyyy-mm-dd hh:MM')}}
						</view>
					</view>
					<view class="pl-txt">
						{{item.commentContent}}
					</view>
					<view class="pl-add-to-imgs">
						<block v-for="(img,index2) in item.addPlImg2" :key="index2">
							<image class="imgs" :src="`${baseUrl}${img}`" mode=""></image>
						</block>
					</view>
				</block>
				<view class="admin-pl-hf">
					掌柜回复：您好，您平常不用的时候可以把蓝牙、WIFI、GPS等关闭，把经常自动后台运行的程序清除了看一下,后台运行的程序越多也是越耗电的。有问题请您联系我们的在线客服
				</view>
			</view>
		</view>
		<!-- 评论回复 -->
		<view class="goods-pl-reply">
			<view class="reply-title">
				评论回复
			</view>
			<view class="reply-list-box">
				<block v-for="(item,index) in plList" :key="index">
					<view class="reply-user-info" @click="commentReply(item)">
						<view class="reply-user-tx">
							<image class="y-img" :src="`${baseUrl}${item.commentUserHeadImg}`" mode="aspectFill"></image>
						</view>
						<view class="reply-user-name">
							<text>{{item.commentUserName}} 回复 {{item.commentedUserName}}</text>
							<text>{{$u.timeFormat(item.commentReplyTime,'yyyy-mm-dd hh:MM')}}</text>
						</view>
					</view>
					<view class="reply-content">
						{{item.commentReplyContent}}
					</view>
				</block>
			</view>
		</view>
		<!-- 回复按钮 -->
		<view class="goods-pl-reply-btn">
			<text class="yindao" v-if="hfIsShow">回复：{{commentUserName}}</text>
			<u-input v-model="value" 
					type="textarea" 
					:border="true"
					:focus="isFocus"
					@blur="blur"
					@input="input"
					auto-height/>
			<view class="btn" @click="replyClick()">回复</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				count: 5, //控制评分分数最多显示
				goodsPlInfo:{},
				value: '',
				//是否聚焦
				isFocus:false,
				// 评论回复列表
				plList:[],
				// 回复的用户
				commentUserName: '',
				// 控制回复框提示显示
				hfIsShow: false, 
				// 评论回复详情
				commentReplyData:{}
			}
		},
		onLoad(e) {
			this.goodsPlInfo = this.$store.state.goods.goodsPlInfo
			// console.log(this.goodsPlInfo)
			this.getCommentReplyList()
		},
		methods:{
			//输入框失去聚焦点
			blur(){
				this.isFocus = false
			},
			// 当键盘输入时，触发input事件
			input(){
				// this.hfIsShow = false
			},
			// 商品评价回复
			replyClick(){
				// 这是评论走的接口
				if(this.hfIsShow==false){
					this.$u.api.commentReply({
						commentedId: this.goodsPlInfo.id,	//是	int	被评论id
						commentedUserId: this.goodsPlInfo.userId,	//是	int	被回复用户id
						commentReplyContent: this.value,	//是	int	回复内容
					}).then(res=>{
						if(res.code==200){
							this.getCommentReplyList()
							this.value = ''
						}else{
							uni.showToast({
								title:res.msg,
								icon: 'none'
							})
						}
					})
				}else{ // 回复评论走的接口
					this.$u.api.commentReply({
						commentedId: this.commentReplyData.commentedId,	//是	int	被评论id
						commentedUserId: this.commentReplyData.commentUserId,	//是	int	被回复用户id
						commentReplyContent: this.value,	//是	int	回复内容
					}).then(res=>{
						if(res.code==200){
							this.getCommentReplyList()
							this.value = ''
						}else{
							uni.showToast({
								title:res.msg,
								icon: 'none'
							})
						}
					})
				}
			},
			// 回复评论
			commentReply(item){
				this.commentUserName = item.commentUserName
				this.commentReplyData = item
				this.hfIsShow = true
				this.isFocus = true
			},
			// 获取商品评价回复列表
			getCommentReplyList(){
				this.$u.api.queryCommentReply({
					commentId: this.goodsPlInfo.id
				}).then(res=>{
					if(res.code==200){
						this.plList = res.data
					}else{
						uni.showToast({
							title:res.msg,
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #eee;
	}
	.goods-pl-desc-box{
		width: 100vw;
		.goods-pl-item{
			background-color: #FFFFFF;
			padding: 20rpx;
			margin-bottom: 20rpx;
			border-radius: 30rpx;
			.goods-pl-item-top{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.userinfo-left{
					display: flex;
					align-items: center;
					.user-tx{
						width: 70rpx;
						height: 70rpx;
					}
					.user-name{
						font-weight: bold;
						margin-left: 10rpx;
					}
				}
				.time-right{
					color: #979797;
				}
				
			}
			.goods-pl-item-content{
				padding: 20rpx 0;
				.goods-pl-item-content-top{
					.gtype{
						font-size: 22rpx;
						color: #979797;
						margin-left: 30rpx;
					}
				}
				.comment-content{
					width: 710rpx;
				}
			}
			.goods-pl-item-img{
				.pl-img{
					width: 21vw;
					height: 160rpx;
					padding: 10rpx 1vw;
				}
			}
			// 追加评论
			.goods-add-to-pl{
				padding: 20rpx 0;
				.top{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.title{
						color: #FF0000;
						font-weight: bold;
					}
					.time{
						color: #979797;
					}
				}
				.pl-txt{
					padding: 20rpx 0;
				}
				.pl-add-to-imgs{
					.imgs{
						width: 21vw;
						height: 160rpx;
						padding: 10rpx 1vw;
					}
				}
				.admin-pl-hf{
					background-color: #F3F3F3;
				}
			}
		}
		// 评论回复
		.goods-pl-reply{
			background-color: #FFFFFF;
			padding: 20rpx;
			border-radius: 30rpx;
			.reply-title{
				font-weight: bold;
				padding-bottom: 30rpx;
				border-bottom: 2px solid #eee;
			}
			.reply-list-box{
				padding: 20rpx 0;
				.reply-user-info{
					display: flex;
					.reply-user-tx{
						width: 70rpx;
						height: 70rpx;
					}
					.reply-user-name{
						display: flex;
						flex-direction: column;
						color: #979797;
						margin-left: 20rpx;
					}
				}
				.reply-content{
					margin-left: 90rpx;
					padding-bottom: 20rpx;
					font-weight: 600;
				}
			}
		}
		// 回复按钮
		.goods-pl-reply-btn{
			width: 100vw;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 50rpx 0;
			background-color: #FFFFFF;
			.yindao{
				color: #979797;
				position: absolute;
				left: 20rpx;
				font-size: 20rpx;
			}
			.btn{
				width: 172rpx;
				height: 76rpx;
				line-height: 76rpx;
				background: #FF0000;
				border-radius: 19px;
				color: #FFFFFF;
				text-align: center;
			}
		}
	}
</style>
