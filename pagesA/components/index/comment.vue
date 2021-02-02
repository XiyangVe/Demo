<template>
	<view>
		<view class="comment">
			<view class="item" v-for="item in allList" :key="item.id">
				<!--主要评论-->
				<view class="father u-f">
					<view class="left">
						<u-image width="50rpx" mode="widthFix" :src="`${baseUrl}${item.userHeadImage}`" :lazy-load="false" shape="circle"></u-image>
					</view>
					<view class="centre">
						<view class="name"><text>{{item.commentUserName}}</text></view>
						<view class="time">{{item.commentTime | timeFrom}}</view>
						<!---->
						<u-read-more show-height="105" toggle close-text="展开" font-size="24rpx" text-indent="0" :shadow-style="shadowStyle">
							<view class="centre-info u-line-1">
								{{item.commentContent}}
							</view>
						</u-read-more>
					</view>
					<view class="right">
						<view class="praise u-f-ac">
							<view @click="mescommentUp" :data-id="item.id" :data-count="item.count" :data-isPiont="item.isPiont">
								<u-icon v-if="item.isPiont == 1" name="thumb-up-fill" color="#ff6969" size="40"></u-icon>
								<u-icon v-else name="thumb-up-fill" color="#cecece" size="40"></u-icon>	
							</view>					
							<text v-if="item.count" >{{item.count}}</text>
							<text v-else >赞</text>
						</view>
						<view :data-id="item.id" :data-userId="item.userId" @click="addMescommentrelay">
							<u-tag text="回复" size="mini" bg-color="#ff6969" shape="circle" mode="dark" />
						</view>
						
					</view>
				</view>
				
				<view v-if="item.list.length > 0" class="details" @click="openDetails" :data-id="item.id">
					<text>共{{item.list.length}}条回复</text>
					<u-icon name="arrow-right" color="#5ca8ff" size="24"></u-icon>
				</view>
				
			</view>
		</view>
		
		<!--评论详情-->
		<u-popup v-model="show" mode="bottom" height="800rpx" border-radius="14">
			<comment-details :fatherId="fatherId" :childList="childList" @close="closeDetails" @setRelayUp="changeChildList"></comment-details>
		</u-popup>
		
	</view>
</template>

<script>
	import commentDetails from './comment-details.vue'
	export default {
		components: {
			commentDetails
		},
		props:{
			id:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				//是否显示评论详情
				show:false,
				//关闭展开阴影
				shadowStyle:{
					backgroundImage: "none",
					paddingTop: "0",
					marginTop: "15rpx"
				},
				ready:false,
				//评论内容
				allList:[],
				
				//被点击的父评论id
				fatherId:'',
				//子评论
				childList:[],
				// 评论页面
				pageNo: 1
			}
		},
		created() {
			this.getList()
		},
		methods:{
			//获取评论
			getList(){
				this.$u.api.getMescomment({
					messPublishId:this.id,
					pageNo: this.pageNo
				}).then(res=>{
					// this.$emit("hand",res.data.list.length);
					this.$emit("hand",res.data.count);
					this.allList = res.data.page.list
				})
			},
			//回复评论
			addMescommentrelay(e){
				/* console.log(e) */
				let {id} = e.currentTarget.dataset
				let {userid} = e.currentTarget.dataset
				
				uni.$emit('addMescommentrelay',{type:'reply',id,userid,msgCommentedReplyId:id}) 
			},
			//点赞评论
			mescommentUp(e){
				this.$u.throttle(()=>{
					let {id} = e.currentTarget.dataset
					let {count} = e.currentTarget.dataset
					let {ispiont} = e.currentTarget.dataset
					this.$u.api.mescommentUp({
						id,
						count,
						type:ispiont,
					}).then(res=>{
						let index = this.allList.findIndex(v=>{
							return v.id == id
						})
						ispiont == 1 ? this.allList[index].count-- : this.allList[index].count++
						ispiont == 1 ? this.allList[index].isPiont = 0 : this.allList[index].isPiont = 1
					})
				},500)
			},
			//打开详情页
			openDetails(e){
				let {id} = e.currentTarget.dataset
				let index = this.allList.findIndex(v =>{
					return v.id == id
				})
				this.fatherId = this.allList[index].id
				console.log(this.fatherId)
				this.childList = this.allList[index].list
				this.show = true
			},
			//关闭详情页面
			closeDetails() {
				this.show = false
			},
			//点赞修改子数组数据
			changeChildList(data){
				console.log(data)
				let index = this.childList.findIndex(v=>{
					return v.id == data.id
				})
				this.childList[index].isPiont = data.ispiont == 1 ? 0 : 1
				data.ispiont == 1 ? this.childList[index].count-- :this.childList[index].count++
			}
		}
	}
</script>

<style lang="less" scoped>
	.comment{
		margin-top: 20rpx;
 		.item:last-child{
			border-bottom:none;
		}
		//主评论
		.item{
			margin-top: 10rpx;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #e2e2e2;
			//头像
			.left{
				flex: 1;
			}
			//评论主要内容
			.centre{
				flex: 8;
				.name{
					color:#909399;
				}
				.time{
					transform: scale(0.8);
					color: #C0C0C0;
					position: relative;
					left: -50rpx;
				}
				.centre-info{
					line-height: 35rpx;
					letter-spacing: 2rpx;
					word-wrap: break-word;
					white-space: normal;
					word-break: break-all;
				}
			}
			//点赞
			.right{
				flex: 2;
				padding: 20rpx 0 0 10rpx;
				.praise{
					display: flex;
					justify-content: flex-end;
					margin-bottom: 10rpx;
					text{
						margin-left: 10rpx;
					}
				}
				.u-tag{
					position: relative;
					font-size: 24rpx;
					left: 45rpx;
				}
			}
			.details{
				margin-left: 56rpx;
				font-size: 24rpx;
				color: #5ca8ff;
			}
		}
	}
</style>
