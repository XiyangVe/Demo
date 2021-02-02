<template>
	<view>
		<u-navbar title-bold title-size="30" title="我的会员">
			<view class="slot-wrap">
				<view class="mr-4" @click="navbarClick">
					<u-icon name="more-dot-fill" size="40"></u-icon>
				</view>
			</view>
		</u-navbar>
		<view class="p-2 wrap">
			<view>
				<u-tabs-swiper ref="uTabs" 
				:list="list" :current="current" @change="tabsChange" :is-scroll="true"
				active-color="#fd4d4d"
				swiperWidth="750"></u-tabs-swiper>
			</view>
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="(item, index) in vipInfoList" :key="index">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
						<view class="py-2 border-bottom">
							<text class="font-weight-bolder">会员特权</text>
							<view class="mt-2" style="color: #fd4d4d;">{{item.remarks}}</view>
						</view>
						<view class="my-2 flex justify-between">
							<view class="vip-box flex flex-column align-center shadow" 
								@click="openVip(item.monthlyMemberPrice,1,item.level)"
								:class="activation==item.monthlyMemberPrice ? 'activation-vip-box': '' ">
								<view class="font-small">月票价格</view>
								<view style="color: #fd4d4d;">
									<text>￥</text>
									<text class="font-weight-bolder font-lg">{{item.monthlyMemberPrice}}</text>
								</view>
							</view>
							<view class="vip-box flex flex-column align-center shadow"
								@click="openVip(item.quarterMemberPrice,2,item.level)"
								:class="activation==item.quarterMemberPrice ? 'activation-vip-box': '' ">
								<view class="font-small">季票价格</view>
								<view style="color: #fd4d4d;">
									<text>￥</text>
									<text class="font-weight-bolder font-lg">{{item.quarterMemberPrice}}</text>
								</view>
							</view>
							<view class="vip-box flex flex-column align-center shadow"
								@click="openVip(item.yearMemberPrice,3,item.level)"
								:class="activation==item.yearMemberPrice ? 'activation-vip-box': '' ">
								<view class="font-small">年票价格</view>
								<view style="color: #fd4d4d;">
									<text>￥</text>
									<text class="font-weight-bolder font-lg">{{item.yearMemberPrice}}</text>
								</view>
							</view>
						</view>
						<!-- 支付方式 -->
						<view class="mt-4">
							<text class="font-weight-bolder">支付方式</text>
							<radio-group @change="radioChange">
								<view class="flex align-center justify-between py-2">
									<view class="flex align-center">
										<u-icon name="zhifubao-circle-fill" color="#2b85e4" size="50"></u-icon>
										<text class="ml-2">支付宝支付</text>
									</view>
									<view class="">
										<radio value="1" checked="1"></radio>
									</view>
								</view>
								<!-- <view class="flex align-center justify-between py-2">
									<view class="flex align-center">
										<u-icon name="weixin-circle-fill" color="#19be6b" size="50"></u-icon>
										<text class="ml-2">微信支付</text>
									</view>
									<view class="">
										<radio value="0"></radio>
									</view>
								</view> -->
							</radio-group>
						</view>
						<!-- 确认开通按钮 -->
						<view class="flex justify-center py-3">
							<u-button style="width: 80%;"
									:ripple="true" 
									shape="circle"
									type="error"
									@click="aliPay"
									ripple-bg-color="#fff">
									立即支付
							</u-button>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				vipInfoList: [],
				list: [],
				
				vipLevel: null,
				vipType: null,
				activation: null,
				
				current: 0, 
				swiperCurrent: 0,
			}
		},
		onLoad() {
			this.getMemberRechargePageInfo()
		},
		methods:{
			// 获取会员充值界面信息
			getMemberRechargePageInfo(){
				this.$https.get('/userCenter/getMemberRechargePageInfo').then(res=>{
					res.data.vips.map(item=>{
						this.$set(item,'name',item.levelName)
					})
					this.list = res.data.vips
					this.vipInfoList = res.data.vips
				})
			},
			// 点击选择要开通的VIP选项
			openVip(e,type,lv){
				this.activation = e
				this.vipType = type
				this.vipLevel = lv
			},
			// 导航栏右侧查看会员开通记录
			navbarClick(){
				uni.navigateTo({
					url: '/pagesB/user/info/vipRecording'
				})
			},
			// 选择支付方式
			radioChange(e){
				
			},
			// 支付宝充值会员
			aliPay(){
				if(this.activation==null){
					uni.showToast({
						title: '请选择要开通的会员类型',
						icon: 'none'
					})
					return
				}
				this.$https.get('/pay/MemberPurchaseAli',{
					level: this.vipLevel,
					type: this.vipType,
					money: this.activation
				}).then(res=>{
					console.log(res)
					uni.requestPayment({
					    provider: 'alipay',
					    orderInfo: res.data,
					    success: function (res) {
					        uni.showToast({
					        	title: "支付成功"
					        })
					    },
					    fail: function (err) {
					        uni.showToast({
					        	title: "支付失败",
								icon: 'none'
					        })
					    }
					})
				})
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				
			}
		}
	}
</script>

<style scoped lang="scss">
	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
		justify-content: flex-end;
	}
	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
	}
	.swiper-box {
		flex: 1;
	}
	.swiper-item {
		height: 100%;
	}
	.vip-box{
		border: 3rpx solid #EEEEEE;
		border-radius: 30rpx;
		padding: 20rpx;
		width: 220rpx;
		height: 320rpx;
		justify-content: center;
	}
	.activation-vip-box{
		border: 7rpx solid #fd4d4d;
		border-radius: 30rpx;
		padding: 20rpx;
		width: 220rpx;
		height: 320rpx;
	}
</style>
