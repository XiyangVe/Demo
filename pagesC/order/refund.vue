<template>
	<view class="p-2">
		<view class="flex align-center">
			<u-icon name="home" size="30" color="rgb(94,94,94)"></u-icon>
			<view class="mx-1 font-sm text-light-muted">{{orderInfo.shopName}}</view>
			<u-icon name="arrow-right" color="rgb(203,203,203)" size="26"></u-icon>
		</view>
		<block v-for="(item,index) in orderInfo.orderDetails">
			<view class="py-2 flex">
				<view class="flex-1">
					<u-image width="150rpx" height="150rpx" :src="`${baseUrl}${item.recommendImage}`"></u-image>
				</view>
				<view class="flex-3">
					<view class="">
						{{item.productName}}
					</view>
					<view class="font-sm my-1 text-muted">
						{{item.specification}}
					</view>
					<view class="font-small">
						数量:{{item.num}}
					</view>
				</view>
			</view>
		</block>
		<view class="mt-4">
			<text class="font-sm">申请原因</text>
			<view class="mt-2">
				<u-input v-model="refundCause" type="textarea" border/>
			</view>
			<view class="mt-2">
				<text class="font-sm">上传凭证</text>
				<view>
					<u-upload ref="uUpload" 
					:action="action" 
					:auto-upload="true" 
					:header="header"
					@on-success="uploadSuccess"
					@on-remove="removeImg"></u-upload>
				</view>
			</view>
		</view>
		<view class="mt-5">
			<u-button shape="circle" @click="submit">提交</u-button>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import config from '@/utils/config.js'
	export default {
		computed:{
			...mapState({
				orderInfo: state => state.goods.orderDetail
			})
		},
		data(){
			return{
				// 退款原因
				refundCause: '',
				// 文件上传地址
				action: config.baseUrl + '/base/upload',
				// 文件上传携带的头信息
				header:{
					Authorization: ''
				},
				// 上传的图片数据
				imgArr:[]
				
			}
		},
		onLoad() {
			this.header.Authorization = uni.getStorageSync('localToken')
		},
		methods:{
			// 提交售后
			submit() {
				this.$https.post('/shopping/requestARefund',{
					orderId: this.orderInfo.id,
					refundCause: this.refundCause,
					refundImage: this.imgArr.toString()
				}).then(res=>{
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta: 2
						})
					},2000)
				})
			},
			// 文件上传成功回调
			uploadSuccess(e){
				this.imgArr.push(e.data)
			},
			// 文件移除回调
			removeImg(e){
				this.$u.api.delFile({
					url: this.imgArr[e]
				}).then(res=>{
					this.imgArr.splice(e,1)
				})
			}
		}
	}
</script>

<style scoped>
	
</style>
