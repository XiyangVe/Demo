<template>
	<view>
		<swiper class="image-container" previous-margin="45rpx" next-margin="45rpx" circular  @change="swiperChange" >
			<swiper-item :class="currentIndex == index ? 'swiper-item' : 'swiper-item-side'" v-for="(item, index) in list" :key="item.id">
				<!--滑动时候停止动画帧，-->		
				<view class="item-content" :class="currentIndex == index ? 'max' : 'min'" 
				:style="dontFirstAnimation ? 'animation: none;' : ''">
					<view class="head" :class="`head-${item.typeStr}`">
						<view class="title">{{item.scheduletitle}}</view>
						<view class="time u-f-ac">
							<u-icon name="clock-fill" color="#ffffff" size="30" ></u-icon>
							<text style="margin-left: 15rpx;">(今){{item.date}}</text>
						</view>
						<view class="address u-f-ac">
							<u-icon name="map-fill" color="#ffffff" size="30" ></u-icon>
							<text style="margin-left: 15rpx;">{{item.starttime}}-{{item.endtime}}</text>
						</view>
					</view>
					<view class="body">
						<view class="remarks">
							<view style="font-size: 45rpx;" >备注</view>
							<text style="color: #C0C0C0; font-size: 24rpx;">{{item.remarks}}</text>
						</view>
						<view class="remind-time">
							<view style="font-size: 45rpx;">提醒时间</view>
							<text style="color: #C0C0C0;">{{item.date}}</text>
						</view>
					</view>
				</view>
				<view class="handleWay u-f-ajc">
					<view class="box u-f-ac justify-between">
						<view @click="toAdd">
							<u-icon class="item" name="plus-circle-fill" color="#606266" size="80"></u-icon>
						</view>
						<view @click="edit(item)">
							<u-icon class="item" name="edit-pen-fill" color="#606266" size="80" ></u-icon>
						</view>
						<view class="" @click="del(item)">
							<u-icon class="item" name="trash-fill" color="#606266" size="80"></u-icon>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		
	</view>
</template>
<script>
	export default {
		data() {
			return {
				list: [],
				//当前选中的索引值
				currentIndex: 0,
				dontFirstAnimation: true
			}
		},
		onLoad() {
			this.getScheduleList()
		},
		methods: {
			// 获取日程列表
			getScheduleList(){
				this.$https.get('/schedule/list').then(res=>{
					res.data.map(item=>{
						if(item.type===0){
							this.$set(item,"typeStr","usually")
						}else if(item.type===1||item.type===2){
							this.$set(item,"typeStr","birthday")
						}else{
							this.$set(item,"typeStr","store")
						}
						this.$set(item,'date',item.noticetime.slice(11,19))
					})
					this.list = res.data
				})
			},
			//滑动时候关闭动画帧数
			swiperChange(e) {
				this.dontFirstAnimation = false
				this.currentIndex = e.detail.current
			},
			// 添加
			toAdd(){
				uni.navigateTo({
					url: 'addItem'
				})
			},
			// 修改
			edit(e){
				this.$store.commit('index/getScheduleInfo',e)
				uni.navigateTo({
					url: 'addItem?type=' + 'edit'
				})
			},
			// 删除
			del(e){
				this.$https.get('/schedule/delete',{
					id: e.id
				}).then(res=>{
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					setTimeout(()=>{
						this.getScheduleList()
					},2000)
				})
			}
		}
	}
</script>
<style scoped lang="less">
	.image-container {
		width: 750rpx;
		height: 1050rpx;
	}
	.swiper-item {
		width: 630rpx;
		height: 950rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.swiper-item-side {
		width: 630rpx;
		height: 880rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.item-content {
		border-radius: 25rpx;
		animation: to-big .3s;
		box-shadow: 1rpx 1rpx 15rpx #c7c7c7;
		.head{
			color: #FFFFFF;
			background-color: #3493ff;
			border-radius: 25rpx 25rpx 0 0;
			box-shadow: 1rpx 1rpx 15rpx #c7c7c7;
			height: 300rpx;
			padding: 80rpx 30rpx 0 30rpx;
			.title{
				font-size: 40rpx;
			}
			.time{
				margin: 10rpx 0;
			}
		}
		.head-usually{
			background-color: #0077ff;
		}
		.head-birthday{
			background-color: #e8422a;
		}
		.head-store{
			background-color: #ff72fb;
		}
		.body{
			padding: 50rpx 25rpx 0 25rpx;
			.remarks{
				margin-bottom: 20rpx;
			}
		}
	}
	//动态添加类
	.max{
		width: 630rpx;
		height: 950rpx;
		animation: to-big .3s;
	}
	.min{
		width: 630rpx;
		height: 880rpx;
		animation: to-mini .3s;
	}
	//动画
	@keyframes to-mini
	{
		from {
			height: 950rpx;
		}
		to {
			height: 880rpx;
		}
	}
	@keyframes to-big
	{
		from {
			height: 880rpx;
		}
		to {
			height: 950rpx;
		}
	}
	.handleWay{
		position: absolute;
		right: 0;
		left: 0;
		bottom: 50rpx;
		z-index: 999;
		.box{
			width: 400rpx;
			position: relative;
			left: 20rpx;
			.item{
				flex: 1;
			}
		}
	}
</style>