<template>
	<view class="user-chat-item animated fadeIn fast">
		<block v-for="(item,index) in getNewsContent" :key="index">
			<view class="user-chat-list u-f" :class="{'user-chat-me':item.fromId == myId}">
				<!---->
				<u-image class="pic"  v-if="item.fromId != myId" width="80rpx"  shape="circle" :src="`${baseUrl}${item.senderAvatar}`" mode="widthFix"></u-image>
				<view  :class="[item.msgType === 1 ? 'bodyImg' :'']" class="user-chat-list-body u-f-ajc">
					<!-- 文字 -->
					<view v-if="item.msgType=== 0" style="max-width:480rpx; word-wrap:break-word">
						<view v-html="renderTextMessage(item.content)"></view>
					</view>
					<!-- 图片 -->
					<view @click="previewImage" :data-url="`${baseUrl}${item.content}`">
						<u-image class="img" v-if="item.msgType === 1" :src="`${baseUrl}${item.content}`" mode="widthFix" style="width: 250rpx;"></u-image>
					</view>
					<!--音频-->
					<view v-if="item.msgType===2" class="voice-box" @click="playVoice(index,item)">
						<view :class="[index === contentId ? 'play-icon':'audio-facade-bg']"> </view>
						<view>{{Math.ceil(item.duration/1000)}}</view>
					</view>
					<!-- 商品 -->
					<view class="share-box" v-if="item.msgType===5" @click="toShare(item.content)">
						<view class="share-name overflow-2">
							{{item.content.goodsName}}
						</view>
						<view class="share-img">
							<view class="share-tips">
								我发现了一个不错的商品，赶快来看看吧。
							</view>
							<u-image width="100rpx" height="100rpx" :src="`${baseUrl}${item.content.recommendImage}`"></u-image>
						</view>
					</view>
				</view>
				<!--是否为自己-->
				<u-image class="pic" v-if="item.fromId == myId"  width="80rpx" shape="circle"  :src="`${baseUrl}${myImg}`" mode="widthFix" ></u-image>
			</view>
		</block>
	</view>
</template>

<script>
	const innerAudioContext = uni.createInnerAudioContext();
	import EmojiDecoder from "../../../utils/EmojiDecoder.js";
	export default {
		props:{
			//消息列表
			getNewsContent:Array,
		},
		data(){
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
				//音频播放实例
				audioList:[],
				//定义表情列表
				emoji : {
					url : emojiUrl,
					map : emojiMap,
				    show: false,
				    decoder:  new EmojiDecoder(emojiUrl, emojiMap),
				},
				isPay:false,
				contentId:null
			}
		},
		computed: {
			//图片列表
			imgList:function(){
				let arr = this.getNewsContent.filter(v => {return v.msgType === 1}).map(v=>{return `${this.baseUrl}${v.content}`})
				return arr
			}
		},
		watch:{
			//有消息传递进行判断
			
		},
		// 实例销毁之前调用
		beforeDestroy() {
			if(this.isPay == true){
				console.log('停止语音播放')
				innerAudioContext.stop();
			}
		},
		methods:{
			// 点击分享跳转
			toShare(e){
				if(e.type == 0){
					this.$u.route('/pagesC/mall/goodsDetails', {
						goodsId: e.goodsId,
						userId: e.userId
					})
				}else{
					this.$u.route('/pagesB/integral/goodsDetails', {
						id: e.goodsId
					})
				}
			},
			//渲染文本消息，如果包含表情，替换为图片
			//todo:本不需要该方法，可以在标签里完成，但小程序有兼容性问题，被迫这样实现
			renderTextMessage(message) {
				return '<span class="text-content">' 
							+ this.emoji.decoder.decode(message) + 
						'</span>'
			},
			playVoice(index,item) {
				this.contentId=index
				this.isPay = true
				innerAudioContext.src = `${this.baseUrl}`+item.content;
				innerAudioContext.play();
				setTimeout(() => {
				    this.contentId = -1;
					this.isPay = false
				}, item.duration)
			},
			//图片预览
			previewImage(e){
				let {url} = e.currentTarget.dataset
				uni.previewImage({
					urls: this.imgList,
					current:url,
				});
			}
		}
	}
</script>

<style scoped lang="less">
	.voice-box{
		background-color: #2B85E4;
		display: flex;
		align-items: center;
		padding: 15rpx 25rpx ;
		border-radius: 30rpx;
		color: #FFFFFF;
		margin-left: 10rpx;
		.audio-facade-bg{
		    background: url("/pagesA/static/voice.png") no-repeat center;
		    background-size: 30rpx;
		    width: 50rpx;
			height: 40rpx;
		}
		.play-icon{
			background: url("/pagesA/static/play.gif") no-repeat center;
			width: 50rpx;
			height: 40rpx;
			background-size: 30rpx;
			-moz-transform:rotate(180deg);
			-webkit-transform:rotate(180deg);
			-o-transform:rotate(180deg);
			transform:rotate(180deg);
		}	
	}
	.share-box{
		.share-name{
			font-weight: bold;
		}
		.share-img{
			margin-top: 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.share-tips{
				font-size: 22rpx;
				flex: 4;
			}
		}
	}
	
.user-chat-time{
	padding: 50rpx 0;
	color: #a2a2a2;
	font-size: 24rpx;
}

.user-chat-list{
	padding: 20rpx 10rpx;
	.pic{
		border-radius: 100%;
		flex-shrink: 0;
	}	
}
.user-chat-list-body{
	position: relative;
	background: #F4F4F4;
	padding: 25rpx;
	margin-left: 20rpx;
	border-radius: 20rpx;
	margin-right: 100rpx;
}
.user-chat-list-body:after{
	position: absolute;
	left: -30rpx;
	right: 0;
	top: 30rpx;
	content: '';
	width: 0;
	height: 0;
	border: 16rpx solid #F4F4F4; 
	border-color: transparent #F4F4F4 transparent transparent;
}
.bodyImg{
	padding: 15rpx 15rpx 5rpx 15rpx;
}
.user-chat-me{
	justify-content: flex-end;
}
.user-chat-me .user-chat-list-body{
	margin-right: 20rpx;
	margin-left: 100rpx;
}
.user-chat-me .user-chat-list-body:after{
	left: auto;
	right: -30rpx;
	border-color: transparent transparent transparent #F4F4F4;
}

</style>
