<template>
	<view class="add-video-box">
		<view class="top" v-if="isShow">
			<view class="video-btn" @tap="chooseVideoImage">
				<uni-icons type="videocam-filled" color="#2979ff" size="100"></uni-icons>
			</view>
			<video v-show="src"
					object-fit="cover"
					:src="src">
			</video>
		</view>
		<view class="body" v-else>
			<view class="">
				<view class="">
					<input class="py-2" style="border-bottom: 2rpx solid #EEEEEE;" v-model="titleValue" type="text" maxlength="30" placeholder="加个标题呦~" />
				</view>
			</view>
			<view class="border-bottom flex align-center py-2">
				<textarea v-model="contentValue" auto-height placeholder="分享新鲜事~" maxlength="300"/>
			</view>
			<!-- <view class="bottom-row">
				<view class="left">过期时间</view>
				<view class="right u-f-ac" @click="validDateShow = true">
					<text v-if="validDate">{{validDate}}</text>
					<text v-else>请选择日期</text>
					<u-icon name="arrow-right" color="#2979ff" size="28"></u-icon>
				</view>
			</view> -->
		</view>
		<view class="next-btn-box">
			<view class="next-btn" @click="next" v-if="isShow">
				下一步
			</view>
			<view class="next-btn" @click="videoClick" v-else>
				完成
			</view>
		</view>
		
		<!--日历-->
		<u-calendar v-model="validDateShow" mode="date" @change="change"  :min-date="minTime" :max-date="maxTime"  ></u-calendar> 
	</view>
</template>

<script>
	export default {
		data(){
			return{
				isShow: true,
				validDateShow:false,
				titleValue: '',
				contentValue: '',
				validDate:'',
				// 视频上传
				cameraList: [{
				        value: 'back',
				        name: '后置摄像头',
				        checked: 'true'
				    },
				    {
				        value: 'front',
				        name: '前置摄像头'
				    },
				],
				 cameraIndex: 0,
				 src:"",//视频存放
			}
		},
		computed:{
			isRease:function(){
				return this.titleValue && this.contentValue ? true : false
			},
			//最大最小
			minTime:function(){
				let time = new Date().getTime() + 24*60*60*1000
				let minTime = this.$u.timeFormat(time, 'yyyy-mm-dd')
				return minTime
			}, 
			maxTime:function(){
				let time = new Date().getTime() + 15*24*60*60*1000
				let maxTime = this.$u.timeFormat(time, 'yyyy-mm-dd')
				return maxTime
			}
		},
		methods:{
			// 下一步
			next(){
				if(this.src == ''){
					uni.showToast({
						title:"请选择视频",
						icon: 'none'
					})
					return
				}
				this.isShow = false
			},
			change(e) {
				this.validDate = e.result
			},
			// 视频发布
			videoClick(){
				if(!this.isRease){
					uni.showToast({
						icon:'none',
						type: 'success',
						title:'请输入标题和内容'
					})
					return 
				}
				if(this.src == ''){
					uni.showToast({
						icon:'none',
						title:'请添加要发布的视频资源'
					})
					return 
				}
				uni.showLoading({
					title: '发布中',
					mask: true
				})
				// let overTime = `${this.validDate} 00:00:00`
				this.$myMethod.addMessPublish(this.src,{
					// overTime,
					title:this.titleValue,
					messText:this.contentValue,
					messType:'0',
					messTypeId:9
				}).then(res=>{
					console.log(res)
					if(res.code==200){
						uni.hideLoading()
						uni.showToast({
							title:"发布成功"
						})
						setTimeout(()=>{
							uni.navigateBack({
							    delta: 1
							})
						},500)
					}else{
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				})
			},
			// 视频上传
			chooseVideoImage(){
			    uni.showActionSheet({
			        title:"选择上传类型",
			        itemList: ['视频'],
			        success: (res) => {
			            if(res.tapIndex == 0){
			                this.chooseVideo()
			            } else {
							
			            }
			        }
			    })
			},
			chooseVideo(){
			    // 上传视频
			    uni.chooseVideo({
			        maxDuration:60,
			        count: 1,
			        camera: this.cameraList[this.cameraIndex].value,
			        sourceType: ['album'],
			        success: (resp) => {
			            let videoFile = resp.tempFilePath;
						this.src = videoFile
			        }
			    })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add-video-box{
		padding: 20rpx;
		.top{
			.video-btn{
				text-align: center;
			}
			video{
				width: 100%;
			}
		}
		.body{
			.bottom-row{
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
		.next-btn-box{
			width: 750rpx;
			height: 800rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.next-btn{
				width: 500rpx;
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
				background: #0077FF;
				border-radius: 50rpx;
				box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
				color: #FFFFFF;
			}
		}
	}
</style>
