<template>
	<view class="register-firm-user-box">
		<view class="register-firm-user-list">
			<view class="rfu-item">
				<view class="title">
					企业名：
				</view>
				<view class="input">
					<input type="text" v-model="companyName"/>
				</view>
			</view>
			<view class="rfu-item">
				<view class="title">
					营业执照号：
				</view>
				<view class="input">
					<input type="text" v-model="businessNum"/>
				</view>
			</view>
			<view class="rfu-item">
				<view class="title">
					申请人姓名：
				</view>
				<view class="input">
					<input type="text" v-model="idcardName"/>
				</view>
			</view>
			<view class="rfu-item">
				<view class="title">
					申请人身份证号：
				</view>
				<view class="input">
					<input type="text" v-model="idcardNum"/>
				</view>
			</view>
			<view class="rfu-item" @tap="showRegionPicker">
				<view class="title">
					公司地址：
				</view>
				<view class="input">
					<input type="text" v-model="regionAddr"/>
				</view>
			</view>
			<view class="rfu-item">
				<view class="title">
					详细地址：
				</view>
				<view class="input">
					<input type="text" v-model="descAddr"/>
				</view>
			</view>
			<!-- 企业性质 -->
			<view class="rfu-item-imgs">
				<radio-group @change="radioChange" class="radio-box">
					<label class="radio-item" v-for="(item, index) in items" :key="item.value">
						<view>
							<radio :value="item.value" :checked="index === current" />
						</view>
						<view>{{item.name}}</view>
					</label>
				</radio-group>
			</view>
			<view class="rfu-item-imgs">
				<view class="title">
					营业执照
				</view>
				<view class="image">
					<u-upload ref="uUpload" :auto-upload="false" max-count="1"></u-upload>
				</view>
			</view>
			<view class="rfu-item-imgs">
				<view class="title">
					身份证
				</view>
				<view class="image">
					<u-upload ref="uUpload2" :auto-upload="false" max-count="2" ></u-upload>
				</view>
			</view>
		</view>
		<view class="btn" @click="toApply()">立即申请</view>
		
		<!--区域-->
		<u-picker mode="region" ref="uPicker" v-model="regionShow" @confirm="regionAddress"/>
	</view>
	
</template>

<script>
	import config from '../../../utils/config.js'
	export default {
		data() {
			return {
				// 地区选择器显示隐藏
				regionShow: false,
				regionAddr: '',
				descAddr: '',
				
				companyName: '',
				businessNum: '',
				idcardName: '',
				idcardNum: '',
				regionCode: '',
				items: [{
						value: '0',
						name: '普通企业'
					},
					{
						value: '1',
						name: '政府企业',
						checked: 'true'
					},
					{
						value: '2',
						name: '求助中心'
					}
				],
				current: 0
			};
		},
		methods:{
			// 选择企业性质
			radioChange(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
			},
			// 选择地址
			showRegionPicker() {
				this.regionShow = true;
			},
			regionAddress(e){
				let regionAddr = e.province.label+e.city.label+e.area.label
				this.regionAddr = regionAddr
				this.regionCode = e.area.value
			},
			// 申请
			toApply(){
				//获取所有选择的图片列表
				let imgList = this.$refs.uUpload.lists.map((v,index) => {
					return {
						name:"businessLicense", 
						uri:v.url,
					}
				})
				let imgList2 = this.$refs.uUpload2.lists.map((v,index) => {
					return {
						name:"idcardImage"+`${index+1}`, 
						uri:v.url,
					}
				})
				// 合并数组
				var imgLists = imgList.concat(imgList2)
				
				if(this.companyName == ''){
					uni.showToast({
						title: '请输入企业名',
						icon: 'none'
					})
					return
				}
				if(this.businessNum == ''){
					uni.showToast({
						title: '请输入营业执照号',
						icon: 'none'
					})
					return
				}
				if(this.idcardName == ''){
					uni.showToast({
						title: '请输入申请人姓名',
						icon: 'none'
					})
					return
				}
				if(this.idcardNum == ''){
					uni.showToast({
						title: '请输入申请人身份证号',
						icon: 'none'
					})
					return
				}
				if(this.companyAddr == ''){
					uni.showToast({
						title: '请输入公司地址',
						icon: 'none'
					})
					return
				}
				if(this.$refs.uUpload.lists.length == 0){
					uni.showToast({
						title: '请上传营业执照',
						icon: 'none'
					})
					return
				}
				if(this.$refs.uUpload2.lists.length == 0){
					uni.showToast({
						title: '请上传身份证正反面',
						icon: 'none'
					})
					return
				}
				this.$myMethod.applyOpenCompany(imgLists,{
					companyName: this.companyName,
					businessNum: this.businessNum,
					idcardName: this.idcardName,
					idcardNum: this.idcardNum,
					companyAddr: this.regionAddr + this.descAddr,
					regionCode: this.regionCode,
					companyNature: this.current
				}).then(res=>{
					if(res.code==200){
						setTimeout(function() {
							uni.navigateBack({
							    delta: 2
							})
						}, 2000)
					}
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.register-firm-user-box{
		position: relative;
		left: 0;
		top: 0;
		background-color: #eee;
		width: 100vw;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.register-firm-user-list{
			width: 710rpx;
			height: auto;
			background: #FFFFFF;
			box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
			border-radius: 5px;
			.rfu-item{
				display: flex;
				align-items: center;
				padding: 20rpx;
				border-bottom: 2rpx solid #eee;
				.title{
					color: #777777;
					font-weight: bold;
				}
				.input{
					
				}
			}
			.rfu-item-imgs{
				padding: 20rpx;
				.title{
					color: #777777;
					font-weight: bold;
				}
				.radio-box{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.radio-item{
						display: flex;
						align-items: center;
						margin: 10rpx;
					}
				}
			}
		}
		.btn{
			background-color: #0077FF;
			width: 640rpx;
			height: 86rpx;
			line-height: 86rpx;
			box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
			border-radius: 60rpx;
			color: #fff;
			text-align: center;
			margin: 5% 0;
		}
	}
</style>
