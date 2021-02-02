<template>
	<view class="create-group-box">
		<view class="group-name">
			<view class="title">
				群名称：
			</view>
			<view class="input">
				<input type="text" v-model="groupName" />
			</view>
		</view>
		
		<view class="group-announcement">
			<view class="top">
				<u-icon name="volume-fill" color="#2979ff" size="32"></u-icon>
				<view class="gg-title">
					群公告：
				</view>
			</view>
			<view class="gg-textarea">
				<u-input v-model="groupAnnouncement" type="textarea"/>
			</view>
		</view>
		
		<view class="group-avatar-box">
			<view class="title">
				群头像：
			</view>
			<u-upload :action="action" 
						@on-success="uploadSuccess"
						@on-remove="removeImg"
						max-count='1'
						:auto-upload='true'
						ref="upload"
						:header="header">
			</u-upload>
		</view>
		
		<view class="create-group-btn">
			<view class="btn" @click="nextStep()">
				下一步
			</view>
		</view>
	</view>
</template>

<script>
	import config from '../../utils/config.js'
	export default{
		data(){
			return{
				groupName: '',
				groupAnnouncement: '',
				groupHeadImage: '',
				action: config.baseUrl + '/base/upload',
				header:{
					Authorization: ''
				}
			}
		},
		onLoad() {
			this.header.Authorization = uni.getStorageSync('localToken')
		},
		methods:{
			// 上传图片成功回调
			uploadSuccess(e){
				this.groupHeadImage = e.data
			},
			// 移除图片回调
			removeImg(e){
				this.$u.api.delFile({
					url: this.groupHeadImage
				}).then(res=>{
					console.log(res)
				})
				this.groupHeadImage = ''
			},
			nextStep(){
				this.$refs.upload.upload()
				if(this.groupName==''){
					uni.showToast({
						title: '请输入群名称',
						icon: 'none'
					})
					return;
				}
				if(this.groupHeadImage==''){
					uni.showToast({
						title: '请设置群头像',
						icon: 'none'
					})
					return;
				}
				this.createGroup()
			},
			// 创建群
			createGroup(){
				this.$u.api.addGroup({
					groupName:this.groupName,
					groupAnnouncement:this.groupAnnouncement,
					groupHeadImage: this.groupHeadImage
				}).then(res=>{
					if(res.code==200){
						uni.showToast({
							title: "创建成功"
						})
						setTimeout(function(){
							uni.navigateBack({
							    delta: 1
							})
						},3000)
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.create-group-box{
		padding: 20rpx;
		width: 100vw;
		.group-name{
			display: flex;
			border-bottom: 2rpx solid #eee;
			padding: 20rpx 0;
			.title{
				font-weight: 600;
				width: 18vw;
			}
			.input{
				width: 80vw;
			}
		}
		.group-announcement{
			padding: 20rpx 0;
			.top{
				display: flex;
				align-items: center;
				.gg-title{
					font-weight: 600;
					margin-left: 10rpx;
				}
			}
			.gg-textarea{
				margin-top: 10rpx;
				background-color: #F0F0F0;
				border-radius: 20rpx;
				padding: 10rpx;
			}
			
		}
		.group-avatar-box{
			.title{
				font-weight: bold;
			}
		}
		.create-group-btn{
			width: 100vw;
			display: flex;
			justify-content: center;
			position: fixed;
			bottom: 5vh;
			.btn{
				text-align: center;
				width: 500rpx;
				height: 102rpx;
				line-height: 102rpx;
				background: #0077FF;
				box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
				border-radius: 50rpx;
				color: #FFFFFF;
				font-weight: 600;
			}
		}
	}
</style>
