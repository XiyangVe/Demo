<template>
	<view class="">
		<u-navbar :is-back='true' back-icon-color="#ffffff" title-color="#ffffff" title='手机联系人' :background="{'background-color':'#6aa8d8'}"
		 height="50">
		</u-navbar>
		<view class="list" v-for="item in bookList">
			<image v-if="item.userHeadImage!=null" :src="`${baseUrl}${item.userHeadImage}`" mode="" class="images"></image>
			<image v-else src="../../static/iphone.png" mode="" class="images"></image>
			<!-- <view class="nicknames">
				<text style="display: block;font-size: 34upx;margin-top: 10upx;">{{item.displayName}}</text>
			</view> -->
			<view class="nicknames">
				<text :class="item.nickname!=null?'nickname1':'nickname2'">{{item.displayName}}</text>
				<text style="display: block;font-size: 24upx;" v-if="item.nickname!=null">昵称：{{item.nickname}}</text>
			</view>
			<!-- <view style="float: right;">
				<u-button type="success" style="width: 60upx;height:60upx;margin-top: 20upx;" v-if="item.status==0">添加</u-button>
				<u-button type="success" style="width: 60upx;height:60upx;margin-top: 20upx;" v-if="item.status==1">已关注</u-button>
				<u-button type="success" style="width: 60upx;height:60upx;margin-top: 20upx;">发送短信</u-button>
				<u-button type="success" style="width: 60upx;height:60upx;margin-top: 20upx;" v-if="item.status==1">分享</u-button>
			</view> -->
			<u-button type="success" style="width: 60upx;height:60upx;margin-top: 20upx;position: absolute;right: 20upx;" v-if="item.status==0">添加</u-button>
			<u-button type="success" style="width: 60upx;height:60upx;margin-top: 20upx;position: absolute;right: 20upx;" v-if="item.status==1">已关注</u-button>
			<u-button type="success" style="width: 60upx;height:60upx;margin-top: 20upx;position: absolute;right: 20upx;">发送短信</u-button>
			<u-button type="success" style="width: 60upx;height:60upx;margin-top: 20upx;position: absolute;right: 20upx;" v-if="item.status==1">分享</u-button>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				bookList:[]
			}
		},
		onLoad() {
			this.bookList=uni.getStorageSync('bookAddress')
		}
	}
</script>

<style scoped>
	.nickname1{
		display: block;font-size: 34upx;margin-top: 10upx;
	}
	.nickname2{
		display: block;font-size: 34upx;margin-top: 30upx;
	}
	.list {
		display: flex;
		height: 100upx;
		border-bottom: 1px solid #f0f0f0;
	}
	.images {
		width: 64upx;
		height: 64upx;
		margin: 18upx 20upx;
	}
	.nickname {
		line-height: 100upx;
		font-size: 32upx;
		color: #000000;
	}
	/* .nicknames{
		width: 200upx;
	} */
</style>
