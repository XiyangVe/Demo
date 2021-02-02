<template>
	<view style="padding: 20rpx;">
		<view class="list">
			<view class="item" v-for="(item,index) in list" :key="index"  @tap="toDetails">
				<view class="head u-f-ac" :class="`head-${item.typeStr}`">
					<image v-if="item.typeStr === 'birthday'" src="../../static/user/birthday.png" mode="widthFix" style="width: 50rpx;"></image>
					<u-icon  v-if="item.typeStr === 'store'" name="star-fill" color="#ffffff" size="50" ></u-icon>
					<text >{{item.date}}</text>
				</view>
				<view class="body body-usually" :class="`body-${item.typeStr}`" >
					<view class="title">{{item.scheduletitle}}</view>
				</view>
			</view>
		</view>
		<view class="add u-f-ajc">
			<u-icon name="plus-circle-fill" color="#0077ff" size="100" @tap="toadd"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				list2:[{
					typeStr:'usually',
					date:'2020-07-16 (全天)',
					title:'开会',
					address:'希尔顿大厦 2006'
				},
				{
					typeStr:'birthday',
					date:'2020-12-01 (全天)',
					title:'咸鱼的生日',
				},
				{
					typeStr:'store',
					date:'2020-02-16 (全天)',
					title:'初始线纪念日',
				},
				],
			}
		},
		onShow() {
			this.getScheduleList()
		},
		onLoad() {
			
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
			toDetails(e) {
				uni.navigateTo({
					url:'details'
				})
			},
			toadd(){
				uni.navigateTo({
					url:'addItem'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.list{
		width: 710rpx;
		padding-bottom: 150rpx;
		.item{
			height: 200rpx;
			border-radius: 35rpx;
			box-shadow: 1rpx 1rpx 15rpx #C0C0C0;
			margin: 20rpx 0;
			font-size: 30rpx;
			.head{
				height: 70rpx;
				border-radius: 35rpx 35rpx 0 0;
				padding-left: 15rpx;
				color: #FFFFFF;
				text{
					position: relative;
					left: 10rpx;
					top: 10rpx;
				}
			}
			.body{
				padding: 15rpx 20rpx 0 20rpx;
				.title{
					
				}
				.address{
					font-size: 24rpx;
				}
			}
			.head-usually{
				background-color: #0077ff;
			}
			.head-birthday{
				background-color: #ff0000;
			}
			.head-store{
				background-color: #ff72fb;
			}
			.body-usually{
				color: #0077ff;
			}
			.body-birthday{
				color: #ff0000;
			}
			.body-store{
				color: #ff72fb;
			}
		}

	}
	.add{
		position: fixed;
		bottom: 50rpx;
		left: 0;
		right: 0;
	}
</style>
