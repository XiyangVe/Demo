<template>
	<!--主题部分-->
	<view class="content">
		<view class="body">		
				<view class="item u-f-ajs" hover-class="text-hover-light" v-for="item in list" :key="item.id" :data-index="item.id"  @tap="toOther" >
					<view class="right u-f-ac">
						<view>
							<u-icon :name="item.icon" :color="item.color" size="50" ></u-icon>
						</view>
						<view style="margin-left: 20rpx;">{{item.text}}</view>
					</view>
					<view class="left">
						<view class="arrow u-f-ajc">
							<u-icon name="arrow-right" color="#FFFFFF" size="20" ></u-icon>
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
				list:[
					{
						id:0,
						text:'积分订单',
						icon:'order',
						color:'#21a9e2'
					},
					{
						id:2,
						text:'充值',
						icon:'rmb-circle-fill',
						color:'#19be6b'
					},
					{
						id:3,
						text:'推广',
						icon:'share-fill',
						color:'#389fff'
					},
					{
						id:4,
						text:'客服',
						icon:'server-man',
						color:'#00fefd'
					},
					{
						id:5,
						text:'即时求助',
						icon:'warning',
						color:'#fe0001'
					},
					{
						id:6,
						text:'通讯录备份',
						icon:'fingerprint',
						color:'#ffc107'
					},
					{
						id:1,
						text:'多商户商城',
						icon:'bag-fill',
						color:'#f40'
					},
					{
						id:8,
						text:'多商户订单',
						icon:'order',
						color:'#ff4400'
					},
					{
						id:7,
						text:'后台管理系统',
						icon:'grid-fill',
						color:'#2979ff'
					}
				]
			}
		},
		methods: {
			toOther(e) {
				let {index} = e.currentTarget.dataset
				//#ifdef APP-PLUS
					index = `${index}`
				//#endif
					switch(index) {
						case '0':
						//积分订单记录
							uni.navigateTo({
								url:'../../pagesB/integral/orders'
							})
						break;
						//多商户商城（大模块）
						case '1':
							uni.navigateTo({
								url:'/pagesC/mall/sort'
							})
						break;
						//充值
						case '2':
							uni.navigateTo({
								url:'../../pagesB/user/uesrChongzhi'
							})
						break;
						//推广
						case '3':
							uni.navigateTo({
								url:''
							})
						break;
						//客服
						case '4':
							uni.navigateTo({
								url:'../../pagesB/user/userKefu'
							})
						break;
						// 即使求助
						case '5':
							uni.navigateTo({
								url:'/pagesB/help/list'
							})
						break;
						case '6':
							uni.navigateTo({
								url:'/pagesB/user/set/backup'
							})
						break;
						case '7':
						// #ifdef APP-PLUS
							plus.runtime.openURL('http://59.110.165.249/');
						// #endif
						// #ifdef H5
						uni.showToast({
							title: '请在App上使用此功能',
							icon: 'none'
						})
						// #endif
						break;
						case '8':
							uni.navigateTo({
								url: '/pagesC/order/index'
							})
						break;
					}
			}
		}
	}
</script>

<style lang="less" scoped>
	page{
		background-color: #f6f6f6;
	}
	.content{
		padding: 20rpx 20rpx 0rpx 20rpx;
		.body{
			width: 710rpx;
			padding: 20rpx 30rpx;
			background-color: #FFFFFF;
			border-radius: 15rpx;
			box-shadow: 1rpx 1rpx 35rpx #f2f2f2;
			.item{
				margin: 10rpx 0;
				padding-bottom: 10rpx;
				border-bottom: 1rpx solid #f2f2f3;
				.right{
					flex: 15;
				}
				.left{
					flex:1;
					.arrow{
						width: 35rpx;
						height: 35rpx;
						background-color: #c8c9cc;
						border-radius: 50%;
					}
				}
			}
		}
	}
</style>
