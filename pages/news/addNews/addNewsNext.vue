<template>
	<view class="">
		<!-- 自定义导航栏 -->
		<u-navbar :border-bottom="false" back-icon-color="#0077FF"></u-navbar>
		<!-- 发布文章参数 -->
		<view class="">
			<view class="p-2 border-bottom flex align-center justify-between" 
			style="border-color: #F0F0F0;"
			hover-class="bg-light"
			@click="selectShow = true">
				<view>
					<text class="font text-dark">文章分类</text>
					<text class="pl-2 font font-weight-bolder text-dark">{{sortName}}</text>
				</view>
				<uni-icons type="forward" color="#0077FF" size="30"></uni-icons>
			</view>
			<view class="pb-1 border-bottom" style="border-color: #F0F0F0;">
				<view class="p-2">
					<text class="font text-dark" style="letter-spacing: 50rpx;">封面</text>
				</view>
				<u-upload ref="uUpload" 
					:max-count="maxCount"
					:action="action"
					:header="header"
					:auto-upload="true"
					@on-success="onSuccess"
					@on-remove="onRemove"></u-upload>
			</view>
			<view class="px-2 py-3 border-bottom flex align-center" style="border-color: #F0F0F0;">
				<text class="font text-dark">问卷调查</text>
				<radio-group @change="radioChange" class="flex align-center ml-4">
					<label class="flex align-center mx-2" v-for="(item, index) in items" :key="item.value">
						<view>
							<radio style="transform:scale(0.7)" :value="item.value" :checked="item.value == current" />
						</view>
						<view>{{item.name}}</view>
					</label>
				</radio-group>
			</view>
			<view class="p-2 border-bottom flex align-center justify-between"
				style="border-color: #F0F0F0;"
				hover-class="bg-light"
				@click="toPickerObj">
				<view>
					<text class="font text-dark">发布对象</text>
					<text class="pl-2 font font-weight-bolder text-dark">{{objName}}</text>
				</view>
				<uni-icons type="forward" color="#0077FF" size="30"></uni-icons>
			</view>
			<view class="p-2 border-bottom flex align-center justify-between"
				style="border-color: #F0F0F0;"
				hover-class="bg-light"
				@click="pickerShow = true">
				<view>
					<text class="font text-dark">发布区域</text>
					<text class="pl-2 font font-weight-bolder text-dark">{{regionName}}</text>
				</view>
				<uni-icons type="forward" color="#0077FF" size="30"></uni-icons>
			</view>
			
		</view>
		<!-- 发布按钮 -->
		<view class="" style="margin-top: 140rpx;">
			<u-button @click="submit" style="width: 700rpx;height: 100rpx;" type="primary" :ripple="true" shape="circle">立即提交审核</u-button>
		</view>
		<!-- 分类选择器 -->
		<u-select v-model="selectShow" :list="twoSortList" value-name="id" label-name="messTypeName" @confirm="selectEvent"></u-select>
		<!-- 发布区域选择器 -->
		<u-picker v-model="pickerShow" mode="region" safe-area-inset-bottom @confirm="pickerEvent"></u-picker>
	</view>
</template>

<script>
	import config from '@/utils/config.js';
	export default {
		data() {
			return {
				// 图片上传
				action: config.baseUrl + '/base/upload',
				header:{
					Authorization: ''
				},
				// 控制封面图最大上传数量
				maxCount: 3,
				// 封面图
				coverLists: '',
				items: [
					{
						value: '1',
						name: '开启'
					},
					{
						value: '0',
						name: '关闭'
					}
				],
				 current: 0,
				 // 控制分类列表显示隐藏
				 selectShow: false,
				 pickerShow: false,
				 // 二级分类列表
				 twoSortList: [],
				 // 选中的分类
				 sortName: '',
				 sortId: null,
				 // 选中的发布对象名
				 objName: '发布对象',
				 // 选中的地区名
				 regionName: '',
				 title: '',
				 deputyTitle: '',
				 editorHtml: '',
				 messVidio: '',
				 // 发布类型
				 type: null
			}
		},
		onLoad() {
			this.header.Authorization = uni.getStorageSync('localToken')
			this.getTwoSort()
			uni.$on("newsObj",(data)=>{
				console.log(data)
				this.title = data.title
				this.deputyTitle = data.deputyTitle
				this.editorHtml = data.editorHtml
				this.messVidio = data.messVidio
				this.type = data.type
				if (data.type===0) {
					this.maxCount = 1
				}
			})
		},
		onUnload() {
			console.log('onUnload')
			uni.$off('newsObj')
		},
		methods:{
			// 封面图片上传完成事件
			onSuccess(e){
				let lists = this.$refs.uUpload.lists;
				this.coverLists = lists
				console.log(this.coverLists)
			},
			// 移除图片事件
			onRemove(e){
				console.log(e)
			},
			// 问卷调查开启&关闭事件
			radioChange(e){
				this.current = e.detail.value
				console.log(this.current)
			},
			// 获取二级分类列表
			async getTwoSort(){
				const res = await this.$https.get('/messType/getMessTypeBysecondId')
				this.twoSortList = res.data
			},
			// 选择分类事件
			selectEvent(e){
				this.sortName = e[0].label
				this.sortId = e[0].value
			},
			// 选择发布区域事件
			pickerEvent(e){
				console.log(e)
				this.regionName = e.province.label + e.city.label + e.area.label
			},
			// 选择发布对象
			toPickerObj(){
				uni.navigateTo({
					url: '/pages/news/addNews/publish-to'
				})
			},
			// 提交发布资讯
			submit(){
				var covers = []
				if(this.coverLists.length > 0){
					this.coverLists.map(item => {
						covers.push(item.response.data)
					})
				}
				if(this.sortId === null) return uni.showToast({title:"请选择文章分类",icon:"none"})
				if(this.regionName === '') return uni.showToast({title:"请选择发布区域",icon:"none"})
				
				if(this.type === 1){
					this.$https.post('/messPublish/addText',{
						messType: 1,
						title: this.title,
						messTypeId: this.sortId,
						deputyTitle: this.deputyTitle,
						cover: covers.toString(),
						html: this.editorHtml,
						messArea: this.regionName
					}).then(res => {
						console.log(res)
						uni.showToast({title:"提交成功",icon:"none"})
						setTimeout(()=>{
							uni.switchTab({
								url: '/pages/tabBar/news/news'
							})
						},1500)
					})
				}else{
					this.$https.post('/messPublish/addText',{
						messType: 0,
						title: this.title,
						messTypeId: this.sortId,
						deputyTitle: this.deputyTitle,
						cover: covers.toString(),
						html: '',
						messVidio: `${this.baseUrl}`+this.messVidio,
						messArea: this.regionName
					}).then(res => {
						console.log(res)
						uni.showToast({title:"提交成功",icon:"none"})
						setTimeout(()=>{
							uni.switchTab({
								url: '/pages/tabBar/news/news'
							})
						},1500)
					})
				}
				
			}
		}
	}
</script>

<style scoped lang="scss">
	
</style>
