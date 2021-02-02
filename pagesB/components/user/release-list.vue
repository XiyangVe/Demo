<template>
	<view class="body">
		<view class="item" v-for="(item,index) in list" :key="index">
			<view class="row-info u-f-ac">
				<view class="left u-f-ac">
					<view class="pic">
						<u-image shape="circle" :src="`${baseUrl}${myImg}`" mode="widthFix" style="width: 60rpx;"></u-image>
					</view>
					<view class="title">
						<view>{{item.nickname}}</view>
						<view class="time">动态时间：{{$u.timeFormat(item.createTime,'yyyy-mm-dd')}}</view>
					</view>
				</view>
				<view class="right" @click="moreClic(item.id)">
					<u-icon name="more-dot-fill" color="#cecece" size="40"></u-icon>
				</view>
			</view>
			<view class="row-content u-line-3" >
				{{item.title}}
			</view>
			<!-- 视频和图文区域 -->
			<view class="row-image" v-if="item.messType!=0">
				<block v-for="(item2,index2) in item.addFbImg" :key="index2">
					<view class="image-item">
						<image :src="`${baseUrl}${item2}`" mode="aspectFill"></image>
					</view>
				</block>	
			</view>
			<view class="mess-vidio-box" v-else>
				<image style="width: 200rpx;" :src="`${baseUrl}${item.vidioImg}`" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:['list'],
		data(){
			return{
				isShow: false
			}
		},
		methods:{
			moreClic(id){
				var that = this
				uni.showActionSheet({
				    itemList: ['删除'],
				    success: function (res) {
				        that.$u.api.deleteById({
							id:id
						}).then(res=>{
							if(res.code==200){
								that.$emit("callFather")
							}
							uni.showToast({
								title:res.msg,
								icon:"none"
							})
						})
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.body{
		width: 710rpx;
		margin: 20rpx;
		.item{
			margin-top: 20rpx;
			width: 100%;
			border-bottom: 1rpx solid #e3e3e3;
			padding-bottom: 20rpx;
			.row-info{
				margin-bottom: 10rpx;
				.left{
					flex: 7;
					.title{
						margin-left: 20rpx;
						.time{
							color: #c0c4cc;
							margin-left: -30rpx;
							transform: scale(0.8);
						}
					}
				}
				.right{
					flex: 1;
					display: flex;
					justify-content: flex-end;
				}
			}
			.row-content{
				margin-bottom: 10rpx;
			}
			.row-image{
				width: 100%;
				display: flex;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				.image-item{
					width: 32%;
					height: 220rpx;
					margin: 10rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.mess-vidio-box{
				// width: 100vw;
				video{
					width: 100%;
				}
			}
		}
	}
</style>
