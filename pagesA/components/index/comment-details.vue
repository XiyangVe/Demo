<template>
	<view>
		<!--占位符-->
		<view class="head-back"></view>
		<!--评论头部-->
		<view class="head u-f-ajs">
			<view style="flex: 15;">评论详情(相关回复{{childList.length}}条)</view>
			<view style="flex: 1;" @tap="$emit('close')">
				<u-icon  name="close" size="28"></u-icon>
			</view>
		</view>
		<!--评论主体-->
		<view class="body">
			<scroll-view scroll-y style="height:100%;width: 100%;" >
					<!--需要循环渲染-->
					
					<view class="child u-f" v-for="item in childList" :key="item.id">
						<view class="left">
							<u-image width="50rpx" mode="widthFix" :src="`${baseUrl}${item.userHeadImage}`" :lazy-load="false" shape="circle"></u-image>
						</view>
						<view class="centre">
							<view class="name" ><text>{{item.commentUserName}}</text> 回复 <text>{{item.commentedUserName}}</text></view>
							<view class="time">{{item.commentReplyTime}}</view>
							<view class="centre-info">
								{{item.commentReplyContent}}
							</view>
						</view>
						<view class="right">
							
							<view class="praise u-f-ac">
								
								<view @click="mescommentrelayUp" :data-id="item.id" :data-count="item.count" :data-isPiont="item.isPiont">
									<u-icon v-if="item.isPiont == 1" name="thumb-up-fill" color="#ff6969" size="40"></u-icon>
									<u-icon v-else name="thumb-up-fill" color="#cecece" size="40"></u-icon>	
								</view>	
								
								<text v-if="item.count" style="margin-left: 10rpx;">{{item.count}}</text>
								<text v-else >赞</text>
							</view>
							<view @click="addMescommentrelay" :data-id="item.id" :data-userId="item.commentUserId">
								<u-tag text="回复" size="mini" bg-color="#ff6969" shape="circle" mode="dark" />
							</view>
							
						</view>	
					</view>
					
			</scroll-view>
		</view>	
	</view>
</template>

<script>
	export default{
		props:{
			fatherId:Number,
			childList:{
				type:Array,
				default:function(){
					return []
				},
			},
		},
		created() {
			/* console.log(this.childList) */
		},
		methods:{
			//回复点赞
			mescommentrelayUp(e){
				this.$u.throttle(()=>{
					let {id} = e.currentTarget.dataset
					let {count} = e.currentTarget.dataset
					let {ispiont} = e.currentTarget.dataset
					console.log(ispiont)
					this.$u.api.mescommentrelayUp({
						id,
						count,
						type:ispiont,
					}).then(res=>{
						console.log(res) 
						this.$emit('setRelayUp',{id,ispiont})
					})
				},300)
			},
			//回复
			addMescommentrelay(e){
				let {id} = e.currentTarget.dataset
				let {userid} = e.currentTarget.dataset
				uni.$emit('addMescommentrelay',{type:'reply',id,userid,msgCommentedReplyId:this.fatherId}) 	
			},
			
		}
	}
</script>

<style lang="less" scoped>
	.head-back{
		height: 80rpx;
		content: none;
	}
	.head{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 80rpx;
		border-bottom: 1rpx solid #f0f0f0;
		padding: 0 10rpx;
		
	}
	.body{
		/* height: 720rpx; */
		margin-top: 10rpx;
		padding-bottom: 20rpx;
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
			}
			.details{
				font-size: 24rpx;
				color: #5ca8ff;
			}
		}
		//点赞
		.right{
			flex: 2;
			padding: 20rpx 0 0 10rpx;
			.praise{
				display: flex;
				justify-content: flex-end;
			}
			.u-tag{
				position: relative;
				font-size: 24rpx;
				left: 45rpx;
			}
		}
		//二级评论
		.child{
			padding:  20rpx;
			
			.centre{
				.name{	
					text:first-child{
						margin-right:10rpx;
					}
					text:last-child{
						margin-left:10rpx;
					}
				}
			}	
		}
		
	}
</style>
