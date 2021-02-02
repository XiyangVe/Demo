<template>
	<view :class="noticeList.length<5?'page1':'page'">
		<u-navbar :is-back='true' back-icon-color="#ffffff" title-color="#ffffff" title='群通知' :background="{'background-color':'#6aa8d8'}"
		 height="50">
		</u-navbar>
		<view class="content" v-for="item in noticeList">
			<view class="contentTime">
				<view class="textTime">{{item.createTime | timeFrom}}</view>
			</view>
			<view class="contentCard">
				<view class="Cardtop">
					<view class="">{{item.title}}</view>
				</view>
				<view class="CardBottom">
					<view style="display: flex;">
						<view class="CardBottomImg">
							<image class="imgs1" :src="`${baseUrl}${item.extend.image}`" mode=""></image>
						</view>
						<view class="Cardtext">
							<text class="colorblue">{{item.content}}</text>
						</view>
					</view>
					<view class="Cardbuttom" v-if="item.extend.status==0">
						<view class="CardbuttomAgree" @click="agreeToGroup(item.extend.id)">同意</view>
						<view class="CardbuttomAgree orange" @click="refuseToGroup(item.extend.id)">拒绝</view>
					</view>
					<view class="Cardbuttom" v-else-if="item.extend.status==1">
						已同意
					</view>
					<view class="Cardbuttom" v-else-if="item.extend.status==2">
						已拒绝
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="status" :content-text="contentText" color="#979797" />
	</view>
</template>

<script>
	import $https from '@/utils/lib/https.js';
	export default {
		data() {
			return {
				type:null,
				page:1,
				pageSize:6,
				noticeList:[],
				status: 'more',
				contentText: {
					contentdown: '查看更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				total: 0,
			}
		},
		onLoad(e) {
			this.type = e.type
			// this.clearNoMessage()
			this.getIntegral()
		},
		onReachBottom() {
			let _self = this
			this.status = 'loading'
			setTimeout(function() {
				_self.getIntegraltwo();
				uni.hideNavigationBarLoading()
			}, 1000);
		},
		methods: {
			//第一次数据
			getIntegral() {
				var self=this
				$https.get('/notificationMessage/messageList?page=' + this.page + '&pageSize=' + this.pageSize + '&type=' + this.type)
					.then(res => {
						for(let i=0;i<res.data.list.length;i++){
							res.data.list[i].extend=JSON.parse(res.data.list[i].extend)
							if(res.data.list[i].subtype==1){
								self.$https.get('/groupAudit/info?id=' +res.data.list[i].extend.id )
									.then(res1 => {
										this.$set(res.data.list[i].extend,'status',res1.data.auditStatus)
								})
							}else{
								this.$set(res.data.list[i].extend,'status',5)
							}
						}
						this.total = res.data.total
						this.noticeList = res.data.list
						console.log(this.noticeList)
				})
			},
			//同意加群
			agreeToGroup(id){
				$https.get('/groupAudit/verify?id=' + id + '&isAgree=1')
					.then(res => {
						console.log(res)
						this.getIntegral()
				})
			},
			//拒绝加群
			refuseToGroup(id){
				$https.get('/groupAudit/verify?id=' + id + '&isAgree=0')
					.then(res => {
						console.log(res)
						this.getIntegral()
				})
			},
			//下拉加载显示数据
			getIntegraltwo() {
				var self=this
				if (this.pageSize >= this.total){
					this.status='noMore'
					// uni.hideNavigationBarLoading()
				}
				this.pageSize = this.pageSize + 6
				$https.get('/notificationMessage/messageList?page=' + this.page + '&pageSize=' + this.pageSize + '&type=' + this.type)
					.then(res => {
						for(let i=0;i<res.data.list.length;i++){
							res.data.list[i].extend=JSON.parse(res.data.list[i].extend)
							if(res.data.list[i].subtype==1){
								self.$https.get('/groupAudit/info?id=' +res.data.list[i].extend.id )
									.then(res1 => {
										this.$set(res.data.list[i].extend,'status',res1.data.auditStatus)
								})
							}else{
								this.$set(res.data.list[i].extend,'status',5)
							}
						}
						this.total = res.data.total
						this.noticeList = res.data.list
						console.log(this.noticeList)
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.page{
		background-color: #F0F0F0;
		// min-height: 100%;
		// height: auto;
	}
	.page1{
		background-color: #F0F0F0;
		height: 100vh;
	}
	.colorblue{
		color: #0077FF;
	}
	.top_bar {
		display: flex;
		width: 100%;
		justify-content: center;
		padding-right: 28upx;
	}
	.content{
		padding: 20upx;
		.contentTime{
			height: 76upx;
			width: 100%;
			font-size: 20upx;
			color: #979797;
			position: relative;
			
			.textTime{
				position: absolute;
				bottom: 10upx;
				width: 100%;
				text-align: center;
			}
			
		}.contentCard{
			width: 710upx;
			padding-bottom: 30upx;
			border-radius: 20upx;
			background: #FFFFFF;
			.Cardtop{
				padding-left: 20upx;
				padding-right: 20upx;
				width: 100%;
				height: 84upx;
				line-height: 84upx;
				font-weight: 550;
			}
			.CardTEXT{
				margin-top: 20upx;
				width: 644upx;
				height: 132upx;
				font-size: 28upx;
				overflow: auto;
				color: #000000;
				margin-left: 20upx;
			}
			.CardBottom{
				width: 100%;
				padding-left: 20upx;
				padding-right: 20upx;
				margin-top: 8upx;
				display: flex;
				justify-content: space-between;
				.Cardtext{
					margin-left: 10upx;
					display: flex;
					font-size: 28upx;
					line-height: 44upx;
				}
				.Cardbuttom{
					display: flex;
					.CardbuttomAgree{
						width: 82upx;
						height: 38upx;
						background: #0077ff;
						border-radius: 4upx;
						color: #FFFFFF;
						font-size: 24upx;
						text-align: center;
						line-height: 38upx;
					}
					.orange{
						background: #FF6969;
						margin-left: 6upx;
					}
				}
				.CardBottomImg{
					width: 48upx;
					height: 48upx;
					border-radius: 50%;
					overflow: hidden;
					image{
						width: 100%;
						height: 100%;
					}
				}
				
			}
			
		}
	}
</style>
