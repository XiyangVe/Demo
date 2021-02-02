<template>
	<view>
		<!--设置 和 添加城市-->
		<view :animation="animationData" class="animation">
			<view class="modal"  v-if="show">
				<view v-if="type === 'weather'" class="u-f-ac item" @tap="handle('set')">
					<u-icon name="setting-fill"  color="#909399" size="40" ></u-icon>
					<text> 设置</text>
				</view>
				<view v-if="type === 'weather'" class="u-f-ac item" @tap="handle('manage')">
					<u-icon name="plus-circle"  color="#909399" size="40" ></u-icon>
					<text> 城市管理 </text>
				</view>
				<view v-if="type === 'release'" class="item" style="border-bottom: none">
					<view @tap="handle('add')"
						style="padding-bottom: 20rpx;">
						<u-icon name="edit-pen"></u-icon>
						<text> 添加发布 </text>
					</view>
					<view @tap="handleVideo()"
						style="padding: 10rpx 0;border-top: 2rpx solid #EEEEEE;">
						<u-icon name="edit-pen"></u-icon>
						<text>发布视频</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			type:{
				type:String,
				default:''
			}
		},
		data() {
			return{
				show:false,
				//动画帧
				animationData: {},
				//动画是否进行
				animationing:false
			}
		},
		created() {
			this.animation = uni.createAnimation() 
		},
		beforeDestroy() {
			this.running()
		},
		destroyed() {	
			this.animationData = {}
		},
		methods:{
			//实现动画帧
			running() {
				
				if(this.show === true && this.animationing === false){
					
					this.animationing = true
					this.animation.opacity(0).translateY(20).step({duration:300})
					// 调用实例的方法来描述动画
					// 调用 step() 来表示一组动画完成(当前参数动画时间1s)
					// step 可以配置参数用于指定当前组动画的配置。具体参数请看文档
					// export方法导出动画数据
					this.animationData = this.animation.export()
					setTimeout(()=>{
						this.show = false
						this.animationing = false
					},300)			
				}else if (this.show === false && this.animationing === false){
					this.show = true
					this.animationing === true
					this.animation.opacity(1).translateY(-20).step({duration:300})
					this.animationData = this.animation.export()
					setTimeout(()=>{
						this.animationing = false
					},300)
				}
			},
			hide(){
				if(this.show === true){
					this.running()
				}
			},
			// 添加视频跳转页面
			handleVideo(){
				uni.navigateTo({
					url: '/pagesB/user/release/addVideo'
				})
			},
			//跳转页面
			handle(val){
				switch(val){
					case 'manage' :
						uni.navigateTo({
							url:`./manageCity`
						})
					break;
					case 'set' :
						uni.navigateTo({
							url:`./set`
						})
					break;
					case 'add':
						uni.navigateTo({
							url:`addItem`
						})
					break;
					
				}
			},
			
		}
	}
</script>

<style lang="less" scoped>
	//添加城市
	.animation{
		position: absolute;
		z-index: 999999;
		//#ifdef H5
		top: 120rpx;
		//#endif
		//#ifdef APP-PLUS
		top: 160rpx;
		//#endif
		right: 100rpx;
		opacity: 0;
		.modal{
			background-color: #FFFFFF;
			border-radius: 15rpx;
			box-shadow: 1rpx 1rpx 15rpx #C0C4CC;
			.item:first-child{
				border-bottom: 1rpx solid #C0C0C0;
			}
			.item{
				padding: 15rpx 20rpx;
				text{
					margin-left: 10rpx;
				}
			}
		}
	}
</style>
