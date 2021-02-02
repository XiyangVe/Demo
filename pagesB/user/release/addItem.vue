<template>
	<view>
		<!--自定义导航栏-->
		<u-navbar back-icon-name="close" back-icon-size="32" title="发布需求"   height="50" :border-bottom="false" style="font-weight: bold;">
			<view class="slot-wrap" :style="{color: isRease ? '#2b85e4' : '#a0cfff'}" @tap="release">
				发表
			</view>
		</u-navbar>
		<view class="body">
			<view class="title u-f-ac">
				<view style="flex: 1;">标题:</view>
				<view class="input">
					<u-input style="border-radius: 35rpx;" height="60" v-model="titleValue" type="text" border maxlength="30" placeholder="加个标题呦~" />
				</view>
			</view>
			<view class="details">
				<view >详情:</view>
				<view class="content">
					<view class="text">
						<u-input v-model="contentValue" type="textarea" :clearable="false"  auto-height placeholder="分享新鲜事~" maxlength="300"/>
					</view>
					<view class="image">
						<!--限制50m 大小 9张图 可以绑定多个回调比如@on-remove -->
						<u-upload ref="uUpload"  :auto-upload="false"  max-count="6" ></u-upload>
					</view>
				</view>
			</view>
			<view class="bottom-row">
				<!-- <view class="item u-f-ac">
					<view class="left">过期时间</view>
					<view class="right u-f-ac" @click="validDateShow = true">
						<text v-if="validDate">{{validDate}}</text>
						<text v-else>请选择日期</text>
						<u-icon name="arrow-right" color="#2979ff" size="28"></u-icon>
					</view>
				</view>
				<view class="item u-f-ac">
					<view class="left">发布圈子（必填）</view>
					<view class="right u-f-ac"  @click="show=true">
						<text v-if="quanType">{{quanType}}</text>
						<text v-else>请选择发布圈子</text>
						<u-icon name="arrow-right" color="#2979ff" size="28"></u-icon>
					</view>
				</view>
				 -->
			</view>
		</view>
		<!--日历-->
		<u-calendar v-model="validDateShow" mode="date" @change="change"  :min-date="minTime" :max-date="maxTime"  ></u-calendar> 
		<!-- 发布分类 -->
		<u-picker mode="selector" v-model="show" :range="quanList" @confirm="confirm"></u-picker>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import config from '../../../utils/config.js'
	export default {
		data() {
			return{
				//标题
				titleValue: '',
				//发表内容
				contentValue:'',
				//生日
				validDateShow:false,
				validDate:'',
				messTypeId: 9, //信息分类id
				messType: '', //信息类型；1:图文；0:视频
				// 圈子选择控件
				show: false,
				quanList:[], // 展示数据
				quanType: '',
				qData: [], //圈子分类数据
			}
		},
		computed:{
			isRease:function(){
				return this.titleValue && this.contentValue && this.messTypeId ? true : false
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
			}, 
		},
		watch:{
			
		},
		onLoad() {
			this.getInfoShopMall()
		},
		methods:{
			// 选择发布分类
			confirm(index){
				for(let i=0;i<this.quanList.length;i++){
					if(index==i){
						this.quanType = this.quanList[i]
					}
				}
				this.qData.forEach(item=>{
					if(this.quanType==item.messTypeName){
						this.messTypeId = item.id
					}
				})
			},
			// 获取发布分类列表
			async getInfoShopMall(){
				let res = await this.$u.api.getInfoShopMall()
				if(res.code==200){
					this.qData = res.data
					var arr = []
					for(let i=0;i<res.data.length;i++){
						arr.push(res.data[i].messTypeName)
					}
					this.quanList = arr
				}else{
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
				}
			},
			submit() {
				let files = [];
				// 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
				files = this.$refs.uUpload.lists.filter(val => {
					return val.progress == 100;
				})
				// 如果您不需要进行太多的处理，直接如下即可
				// files = this.$refs.uUpload.lists;
				console.log(files)
			},
			change(e) {
				this.validDate = e.result
			},
			//发布
			release(){
				if(this.titleValue==''){
					uni.showToast({
						icon:'none',
						type: 'success',
						title:'请输入标题'
					})
					return 
				}
				if(this.contentValue==''){
					uni.showToast({
						icon:'none',
						type: 'success',
						title:'请输入内容详情'
					})
					return 
				}
				if(this.messTypeId==''){
					uni.showToast({
						icon:'none',
						type: 'success',
						title:'请选择要发布的圈子'
					})
					return 
				}
				//获取所有选择的列表
				let imgList = this.$refs.uUpload.lists.map((v,index) => {
					return {
						name:`${index}`, 
						uri:v.url,
					}
				})
				// let overTime = `${this.validDate} 00:00:00`
				// 没有图片的时候
				if(this.$refs.uUpload.lists.length==0){
					uni.showLoading({
						title: '发布中',
						mask: true
					})
					uni.request({
					    url:  config.baseUrl + '/messPublish/addText',
					    data: {
							title:this.titleValue,
							messText:this.contentValue,
							messTypeId:this.messTypeId,
							// overTime,
							messType:'1'
					    },
						method: 'POST',
					    header: {
							"Authorization": uni.getStorageSync('localToken')
						},
					    success: (res) => {
							uni.hideLoading()
							if(res.data.code==200){
								setTimeout(()=>{
									uni.navigateBack({
										delta: 1
									})
								},2000)
							}
							uni.showToast({
								title:res.data.msg,
								icon: 'none'
							})
					    }
					})
				}else{
					uni.showLoading({
						title: '发布中',
						mask: true
					})
					this.$myMethod.addMessPublish(imgList,{
						title:this.titleValue,
						messText:this.contentValue,
						messTypeId:this.messTypeId,
						// overTime,
						messType:'1'
					}).then(res=>{
						uni.hideLoading()
						if(res.code==200){
							uni.showToast({
								title: "发布成功",
								icon: 'none'
							})
							setTimeout(()=>{
								uni.navigateBack({
									delta: 2
								})
							},2000)
						}else{
							uni.showToast({
								title:res.msg,
								icon: 'none'
							})
						}
					})
				}
			}
		},
	}
</script>

<style lang="less" scoped>
	.slot-wrap {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex: 1;
		padding: 0 30rpx;
		font-size: 32rpx;
		font-weight: normal;
	}
	.body{
		width: 710rpx;
		margin: 20rpx;
		font-size: 36rpx;
		.title{
			.input{
				flex: 7;
			}
		}
		.details{
			margin-top: 30rpx;
			.content{
				.text{
					min-height: 300rpx;
					font-size: 40rpx;
				}
				.image{
					
				}
				.video-box{
					display: flex;
					margin: 20rpx 0;
					.video{
						image{
							width: 220rpx;
							height: 220rpx;
						}
					}
					video{
						height: 220rpx;
						width: 220rpx;
						margin-left: 20rpx;
					}
				}
			}
		}
		.bottom-row{
			margin-top: 30rpx;
			font-size: 30rpx;
			.item{
				margin-bottom: 20rpx;
			}
			.left{
				flex:1;
			}
			.right{
				flex: 1;
				color: #82848a;
				justify-content: flex-end;
			}
		}
	}


</style>
