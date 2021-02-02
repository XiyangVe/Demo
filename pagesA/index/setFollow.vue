<template>
	<view>
		<view class="body">
			<view class="my-follow u-f-ac">
				<view class="pic u-f-ajc">
					<u-image mode="widthFix" width="130rpx"  src="../static/index/my-follow.png" shape="circle"></u-image>
					<view style="color:#fe8787;font-weight: bold;">我的关注</view>
				</view>
				<view class="list">
					<view class="title">我的关注</view>
					<view class="content" v-if="myFollow.length>0">
						<block v-for="(item,index) in myFollow" :key="index">
							<u-tag :text="item.messTypeName" 
								size="mini" shape="circle" type="success" 
								closeable  @close="tagClick(item)" />
						</block>
					</view>
					<view class="content" v-else>
						<u-tag text="暂未关注" shape="circle" type="success" />
					</view>
				</view>
			</view>
			
			<view class="set-follow">
				<view class="title">设置关注</view>
				<view class="set-follow-content u-f">
					<!--左侧图标栏-->
					<view class="pic">
						<view class="item u-f-ajc">
							<u-image mode="widthFix" width="130rpx"  src="../static/index/1.png" shape="circle"></u-image>
							<view>未关注</view>
						</view>
					</view>
					<!--右侧选项列表-->
					<view class="list">
						<view class="content">
							<block v-for="(item,index) in setList" :key="index">
								<u-tag :text="item.messTypeName" 
									shape="circle" 
									type="warning"
									@click="setClick(item)" />
							</block>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//我的关注
				myFollow:[],
				//设置关注列表
				setList:[],
				ids:[],
				nIds:[]
			}
		},
		onLoad() {
			this.getUserSort()
		},
		methods: {
			// 获取圈子关注与未关注信息
			getUserSort(){
				this.$u.api.userSort({
					pageNo: 1
				}).then(res=>{
					// console.log(res)
					if(res.code==200){
						this.setList = res.data.list.list
						this.myFollow = res.data.sortIds.list
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			//取消某个标签
			tagClick(index){
				this.$u.api.updateUserTypes({
					delids: index.id
				}).then(res=>{
					if(res.code===200){
						this.getUserSort()
					}
				})
			},
			//添加标签
			setClick(e) {
				this.$u.api.updateUserTypes({
					addids: e.id
				}).then(res=>{
					if(res.code===200){
						this.getUserSort()
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.body{
		padding-bottom: ;
		width: 100%;
		height: 100vh;
		padding: 40rpx 50rpx 0 20rpx;
		background-color: #f3f4f6;
		.title{
			font-size: 30rpx;
			font-weight: bold;
			margin-bottom: 15rpx;
		}
		.my-follow{
			margin-bottom: 20rpx;
			.pic{
				flex: 3;
				flex-flow: column;
				margin-right: 30rpx;
			}
			.list{
				flex: 7;
				.content{
					width: 500rpx;
					height: auto;
					padding: 10rpx;
					background-color: #FFFFFF;
					border-radius: 25rpx;
					flex-wrap: wrap;
					align-content: flex-start;		
					.u-tag{
						margin: 0 10rpx 10rpx 0;
					}
				}
			}
		}
		// 未关注
		.set-follow{
			.pic{
				flex: 3;
				margin-right: 30rpx;
				.item{
					margin-bottom: 20rpx;
					flex-flow: column;
					font-weight: bold;
					color: #aeb4c0;
				}
			}
			.list{
				flex: 7;
				.content{
					padding: 20rpx 0;
					width: 500rpx;
					background-color: #FFFFFF;
					border-radius: 25rpx;
					overflow: hidden;
					height: auto;
					.u-tag{
						margin: 10rpx;
					}
				}
			}
		}
	}
</style>
