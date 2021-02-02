<template>
	<view>
		<!--用户等级页面-->
		<!--信息封面-->
		<view class="head u-f-ajc">
			<view class="pic" style="width: 150rpx;height: 150rpx;">
				<image :src="`${baseUrl}${myImg}`" mode="scaleToFill" style="width: 100%; height: 100%; border-radius: 50%;"></image>
			</view>
			<view class="info">
				当前等级:
				<text style="color: #fd4d4d;margin-left: 10rpx;">{{userInfo.levelName}}</text>
			</view>
			<view class="border rounded-circle py-1 px-2" 
				style="color: #fd4d4d;"
				@click="toVipRecharge"
				hover-class="hover-styles">
				<text>充值会员</text>
			</view>
			<view class="user-progress">
				<view class="number u-f-ac">
					<view v-for="(item,index) in number" :key="index" style="flex: 1;" :style="{'color': index <= nowLevel ? '#ff0000' : ''}">
						{{item}}
					</view>
					<view style="position: absolute;left:490rpx;" :style="{'color':  nowLevel <= maxLevel ? '#ff0000' : ''}">{{maxLevel}}</view>
				</view>
				<u-line-progress :percent="nowLevel / maxLevel * 100"  striped striped-active :show-percent="false" active-color="#fc7d7d" height="12"></u-line-progress>
			</view>
		</view>
		<!--等级说明-->
		<view class="body">
			<view class="privilege">
				<view class="title pb-2">等级特权</view>
				<view class="content u-f-ac">
					{{right}}
				</view>
			</view>
			<view class="next">
				<view v-if="upLevelScore === 0" class="title">已达到最等级</view>
				<view v-else class="title">距离下一等级</view>
				<view class="content u-f-ajc">
					<u-circle-progress inactive-color="#979797" active-color="#fc7d7d" width="250" border-width="8" :percent="percent">
						<view class="u-progress-content">
							<view class="u-progress-dot"></view>
							<text class='u-progress-info'>还差{{upLevelScore}}元</text>
						</view>
					</u-circle-progress>
				</view>
				
			</view>
			<view class="tips">
				<view class="title pb-2">等级说明</view>
				<view class="content">
					<view class="item" v-for="(item,index) in explain" :key="index">
						{{item}}	
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				nowLevel:0,
				maxLevel:0,
				//下一等剩余积分
				upLevelScore:0,
				right:'',
				explain:[],
				percent: null
			}
		},
		computed: {
			...mapGetters(['userInfo']),
			//等级列表
			number:function(){
				let list = []
				for(let i = 0; i < this.maxLevel; i++){
					list.push(i)
				}
				return list
			},
			//进度条
		},
		onLoad() {
			this.getUserLevel()
		},
		methods: {
			getUserLevel(){
				this.$u.api.getUserLevel().then(res =>{
					console.log(res)
					this.nowLevel = res.data.nowLevel
					this.maxLevel = res.data.maxLevel
					this.right = res.data.right
					this.explain = res.data.explain
					this.upLevelScore = res.data.upLevelMoney
					let num = parseInt(res.data.allLessMoney) - parseInt(res.data.upLevelMoney)
					let number = parseInt(num)/parseInt(res.data.allLessMoney)*100
					this.percent = parseInt(number)
				})
			},
			// 去会员充值页面
			toVipRecharge(){
				uni.navigateTo({
					url: '/pagesB/user/info/vipRecharge'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	page{
	}
	.head{
		margin-top: 50rpx;
		flex-flow: column;
		overflow: hidden;
		.info{
			margin: 20rpx;
			font-size: 34rpx;
		}
		.user-progress{
			width: 500rpx;
			.number{
				width: 500rpx;
				position: relative;
				top: 20rpx;
			}
		}
	}
	.body{
		margin-top: 100rpx;
		width: 710rpx;
		margin: 100rpx 20rpx 0 20rpx;
		.title{
			font-size: 32rpx;
			font-weight: bold;
		}
		.content{
			color:#acacac;
			margin-left: 20rpx;
		}
		.privilege{
			.content:before {
				content: ' ';
				width: 12rpx;
				height: 12rpx;
				position: relative;
				right: 10rpx;
				background-color: #ff6868;
				border-radius: 50%;
			}
		}
		.next{
			margin-top: 30rpx;
			.content{
				padding: 30rpx;
				.u-progress-content {
						display: flex;
						align-items: center;
						justify-content: center;
					}
					.u-progress-dot {
						width: 16rpx;
						height: 16rpx;
						border-radius: 50%;
						background-color: #fb9126;
					}
					.u-progress-info {
						font-size: 28rpx;
						padding-left: 16rpx;
						letter-spacing: 2rpx
					}
			}
		}
	}
</style>
