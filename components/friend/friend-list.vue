<template>
	<view>
		<!--好友分组列表-->
		<view class="list">
			<!--折叠列表-->
			<u-collapse  :item-style="itemStyle" :head-style="headStyle">
				<block v-for="(item, index) in friendList" :key="index">	
					<u-collapse-item   style="position: relative;" :index="index"   @change="again" ref="item"
					:title="`${item.head}${item.length}`" >
						<!--好友列表每一项-->	
							<view v-if="isshow"  class="friend-item u-f-ac" v-for="item1 in item.friend" :key="item1.id"
							:data-toId="item1.id" :data-toName="item1.nickname" :data-toImg="item1.userHeadImage"  
							:data-toSigna="item1.signature" @tap="toChat">
								<view class="head-img">
									<u-image  style="margin-right: 20rpx;"  width="60rpx"
									mode="widthFix" :src="`${baseUrl}${item1.userHeadImage}`" shape="circle"></u-image>
								</view>
								<view class="base-info">
									<view class="nickname">
										{{item1.nickname}}
									</view>
									<view class="signature eps-1">
										{{item1.signature}}
									</view>
								</view>
							</view>			
					</u-collapse-item>
				</block>
			</u-collapse>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default {
		computed:{
			...mapGetters(['friendList']),
		},
		data() {
			return {
				list:[],
				//好友列表样式
				headStyle:  Object.freeze({
					fontSize: '34rpx',
				}),
				itemStyle:Object.freeze({
					padding: '10rpx 0  0 20rpx',
					borderBottom: '1rpx solid #f0f0f0',
				}),
				//好友分组列表全部数据
				itemList: [],
				isshow:true,
			}
		},
		methods: {
			//重新计算高度
			again(e){
				this.$refs.item[e.index].init()
			},
			//前往聊天页面
			toChat(e){
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
	.list{
		margin: 20rpx;
		width: 710rpx;
		box-shadow: 1rpx 1rpx 15rpx #C0C0C0;
		.friend-item{
			height: 100rpx;
			padding-right:30rpx;
			.head-img{
				flex: 1;
			}
			.base-info{
				flex: 8;
				.nickname{
					color: #000000;
					font-size: 30rpx;
					margin-bottom: 5rpx;
				}
				.signature{
					color: #999999;
					font-size: 24rpx;
				}
			}
		}
	}
</style>
