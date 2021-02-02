<template>
	<view>
		<!-- 自定义导航栏 -->
		<u-navbar :border-bottom="false" back-text="取消" back-icon-color="#0077FF" :back-text-style="backTextStyle">
			<view slot="right" class="flex align-center flex-1 px-3 py-2" hover-class="bg-light"
				@click="next()">
				<text class="font text-dark main-text-color">下一步</text>
			</view>
		</u-navbar>
		<!-- 输入内容区域开始 -->
		<view class="p-2">
			<view class="flex align-center" style="height: 96rpx;border-bottom: 2rpx solid #f0f0f0;">
				<input v-model="title" style="width: 100%;" type="text" placeholder="请输入视频标题(2-20字)" />
			</view>
			<view class="flex align-center" style="border-bottom: 2rpx solid #f0f0f0;">
				<textarea v-model="deputyTitle" style="width: 100%;" placeholder="请输入视频简介" />
			</view>
			<view class="">
				<view class="font text-muted py-3">请选择视频</view>
				<view class="" v-if="videoUrl">
					<video
						:src="`${baseUrl}${videoUrl}`" 
						controls></video>
				</view>
				<view v-else class="position-relative" style="background-color: #DBECFF;width: 230rpx;height: 230rpx;"
					@click="addVideo">
					<view class="flex align-center justify-center position-absolute left-0 right-0 top-0 bottom-0">
						<uni-icons type="plusempty" size="40" color="#ffffff"></uni-icons>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import config from '@/utils/config.js';
	export default {
		data(){
			return {
				backTextStyle:{
					color: '#0077FF'
				},
				token: '',
				videoUrl:'',
				// 标题
				title: '',
				// 副标题(视频简介)
				deputyTitle: ''
			}
		},
		onLoad() {
			// 获取token
			let token = uni.getStorageSync('localToken')
			this.token = token
		},
		methods:{
			next(){
				if(this.title === ''){
					return uni.showToast({
						title: '请输入视频标题',
						icon: 'none'
					})
				}
				if(this.videoUrl === ''){
					return uni.showToast({
						title: '请选择发布视频',
						icon: 'none'
					})
				}
				uni.navigateTo({
					url: '/pages/news/addNews/addNewsNext'
				})
				setTimeout(() => {
					uni.$emit("newsObj",{
						title: this.title,
						deputyTitle: this.deputyTitle,
						editorHtml: '',
						messVidio: this.videoUrl,
						type: 0
					})
				},1000)
			},
			// 选择视频
			addVideo(){
				uni.chooseVideo({
					success: (res) => {
						uni.showLoading({
							title: '加载中...',
						})
						uni.uploadFile({
							url: config.baseUrl + '/base/upload',
							filePath: res.tempFilePath,
							name: 'file',
							header: {
								Authorization: this.token
							},
							success: (uploadFileRes) => {
								var fileRes = JSON.parse(uploadFileRes.data)
								if (fileRes.code === 200) {
									this.videoUrl = fileRes.data
								}else{
									uni.showToast({
										title: fileRes.msg,
										icon: 'none'
									})
								}
								uni.hideLoading()
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
