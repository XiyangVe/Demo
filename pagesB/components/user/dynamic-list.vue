<template>
	<view class="dynamic-content-box">
		<view class="dynamic-item" v-for="(item,index) in dataList" :key="index" 
			@longpress="logoTime(index)"
			@click="toDetails(item.id,item.messType)">
			<view class="pic-box" v-if="item.messType==1">
				<u-image :src="item.dynamicImg ? `${baseUrl}${item.dynamicImg[0]}` : ''" style="width: 100%; height: 100%;" mode="aspectFill"></u-image>
			</view>
			<view class="pic-box" v-else>
				<u-image :src="item.vidioImg ? `${baseUrl}${item.vidioImg}` : ''" style="width: 100%; height: 100%;" mode="aspectFill"></u-image>
				<view class="video-icon">
					<u-icon name="play-circle" color="#fff" size="80"></u-icon>
				</view>
			</view>
			<view class="flex align-center justify-between">
				<view class="title">
					{{item.title}}
				</view>
				<view class="pr-2">
					<u-icon name="star-fill" color="#ff6969" size="30"></u-icon>
					<text class="font-small pl-1 text-muted">{{item.messCollect}}</text>
				</view>
			</view>
			<view class="bg-danger text-center text-white rounded-bottom" 
				@click.stop="del(item.id)"
				v-if="index==delShow">
				删除
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			dataList: Array
		},
		data(){
			return{
				delShow: null
			}
		},
		mounted() {
		},
		methods:{
			// 长按显示删除按钮
			logoTime(index){
				this.delShow = index
			},
			// 删除动态
			del(id){
				this.$u.api.deleteById({
					id:id
				}).then(res=>{
					if(res.code===200){
						this.$emit('success');
						this.delShow = null
					}
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				})
			},
			toDetails(id,type){
				console.log(type)
				if(type==1){
					uni.navigateTo({
						url: `/pagesA/index/details?id=${id}`
					})
				}else{
					uni.navigateTo({
						url: `/pages/Test/Test?id=${id}`
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dynamic-content-box{
		padding: 15rpx;
		width: 750rpx;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		.dynamic-item{
			width: 340rpx;
			border-radius: 15rpx;
			margin: 10rpx;
			box-shadow: 2rpx 10rpx 15rpx #d5d5d5;
			.pic-box{
				width: 100%;
				height: 500rpx;
				border-bottom: 2rpx solid #CCCCCC;
				display: flex;
				justify-content: center;
				align-items: center;
				.video-icon{
					position: absolute;
				}
			}
			.title{
				font-size: 24rpx;
				padding: 10rpx;
			}
		}
	}
</style>
