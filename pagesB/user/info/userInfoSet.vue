<template>
	<view>
		<!--列表-->
		<view class="container u-skeleton">
			<view class="set-list">
				<view class="item" @tap="chooseAvatar">
					<view class="left">头像:</view>
					<view class="right">
						<view>
							<u-image :src="avatar ? `${baseUrl}${avatar}` : ''" style="width:100rpx;height: 100rpx;" shape="circle"></u-image>
						</view>
						<u-icon style="margin-left: 20rpx;" name="arrow-right" size="26"></u-icon>
					</view>
				</view>
				<view class="item" @tap="setUser('setNickname')">
					<view class="left">昵称:</view>
					<view class="right">
						<view>{{nickname}}</view>
						<u-icon style="margin-left: 20rpx;" name="arrow-right" size="26"></u-icon>
					</view>
				</view>
				<view class="item" @click="regionShow = true">
					<view class="left">地区:</view>
					<view class="right">
						<view>{{region}}</view>
						<u-icon style="margin-left: 20rpx;" name="arrow-right" size="26"></u-icon>
					</view>
				</view>
				<view class="item">
					<view class="left">性别:</view>
					<view class="right" @click="sexShow = true">
							<view>
								{{sex}}				
							</view>
						<u-icon style="margin-left: 20rpx;" name="arrow-right" size="26"></u-icon>
					</view>
				</view>
				<view class="item" @click="birthDateShow = true">
					<view class="left">生日:</view>
					<view class="right">
						<view>{{$u.timeFormat(birthDate, 'yyyy-mm-dd')}}</view>
						<u-icon style="margin-left: 20rpx;" name="arrow-right" size="26"></u-icon>
					</view>
				</view>
				<view class="item" @tap="setUser('setSignature')">
					<view class="left">签名:</view>
					<view class="right">
						<view class="eps-1">{{signature}}</view>
						<u-icon style="margin-left: 20rpx;" name="arrow-right" size="26"></u-icon>
					</view>
				</view>
				<view class="item" @click="toQyStatus(qyStatus)">
					<view class="left">企业认证:</view>
					<view class="right">
						<view v-if="qyStatus==0">未认证</view>
						<view v-if="qyStatus==1">审核中</view>
						<view v-if="qyStatus==2">已认证</view>
						<u-icon style="margin-left: 20rpx;" name="arrow-right" size="26"></u-icon>
					</view>
				</view>
				<view class="item" @click="toShStatus(shStatus)">
					<view class="left">商户认证:</view>
					<view class="right">
						<view v-if="shStatus==0">未认证</view>
						<view v-if="shStatus==1">已认证</view>
						<view v-if="shStatus==2">审核中</view>
						<u-icon style="margin-left: 20rpx;" name="arrow-right" size="26"></u-icon>
					</view>
				</view>
				<view class="item" @click="toSetFollow">
					<view class="left">咨询栏目:</view>
					<view class="right">
						<view class="u-f-ac" v-if="hobby.length !== 0">
							<block v-for="item in hobby" :key="item.id">
								<view style="transform: scale(0.8);">
									<text style="background-color: #e6e6e6;border-radius: 10rpx;padding: 5rpx;">{{item.messTypeName}}</text>
								</view>
							</block>
						</view>
						<u-icon style="margin-left: 20rpx;" name="arrow-right" size="26"></u-icon>
					</view>
				</view>
			</view>
			<!-- 推广二维码 -->
			<view class="flex flex-column align-center">
				<text class="text-muted font-sm">推广二维码</text>
				<u-image :src="qrCode ? `${baseUrl}${qrCode}` : '' " height="200rpx" width="200rpx"></u-image>
			</view>
		</view>
		<!--性别-->
		<u-action-sheet :list="actionSheetList" v-model="sexShow" @click="actionSheetCallback"></u-action-sheet>
		<!--日历-->
		<u-calendar v-model="birthDateShow" mode="date" @change="change"></u-calendar> 
		<!--地区-->
		<u-picker mode="region" ref="uPicker" v-model="regionShow" @confirm="regionAddress" />
	</view>
</template>

<script>
	export default{
		data() {
			return {
				// 商户认证状态
				shStatus: '',
				// 企业认证状态
				qyStatus: '',
				nickname:'',
				signature:'',
				avatar:'',
				qrCode: '',
				sex: '',
				sexShow: false,
				actionSheetList: Object.freeze([
					{
						text: '男',
						sex:1
					},
					{
						text: '女',
						sex:0
					},
				]),
				//生日
				birthDateShow:false,
				birthDate:0,
				//地区
				regionShow:false,
				region:'',
				//兴趣集合
				hobby:[]
			}
		},
		onLoad() {
			uni.$on('uAvatarCropper', path => {
				this.avatar = path;
				//path为图片路径
	 			this.$myMethod.setUserBaseInfo(path,{
				}).then(res => {
					this.getUserBaseInfo()
				}).catch(res=>{
					console.log(res)
				}) 
			})
		},
		onShow() {
			this.getUserBaseInfo()
		},
		onUnload() {
			this.$store.dispatch('user/getUserInfo')
		},
		methods:{
			// 通过商户状态判断跳转到对应的页面
			toShStatus(status){
				if(status==0){
					uni.navigateTo({
						url: '/pagesB/user/merchant/application'
					})
				}else if(status==2){
					uni.navigateTo({
						url: '/pagesB/user/merchant/schedule'
					})
				}else if(status==1){
					uni.navigateTo({
						url: '/pagesB/user/merchant/index'
					})
				}
			},
			// 通过企业状态判断跳转到对应的页面
			toQyStatus(status){
				if(status==0){
					uni.navigateTo({
						url: '/pagesB/user/firm/selectFirm'
					})
				}else if(status==1){
					uni.navigateTo({
						url: '/pagesB/user/firm/progres'
					})
				}else if(status==2){
					uni.navigateTo({
						url: '/pagesB/user/firm/companyInfo'
					})
				}
			},
			// 跳转
			toSetFollow(){
				uni.navigateTo({
					url: '/pagesA/index/setFollow'
				})
			},
			//获取用户资料
			getUserBaseInfo(){
				this.$u.api.getUserBaseInfo().then( res =>{
					console.log(res)
					if(res.code === 200){
						this.shStatus = res.data.merchantUserAuthStatus
						this.qyStatus = res.data.companyUserAuthStatus
						let data = res.data.userDetails
						this.nickname = data.nickname
						this.signature = data.signature
						this.avatar = data.userHeadImage
						this.qrCode = data.qrCode
						this.sex = data.sex === 1 ? '男' : '女'
						this.region = data.location
						this.birthDate = data.birthDate ? data.birthDate : ''
						this.hobby = res.data.hobby.map(v=>{
							return {
								id:v.id,
								messTypeName:v.messTypeName
							}
						})
					}
				})
			},
			//修改昵称和签名
			setUser(data){
				this.$u.route({
					url: 'pagesB/user/info/setUser',
					params: {
						key:data,
						nickname:this.nickname,
						signature:this.signature,
					}
				})
			},
			//头像
			chooseAvatar() {
				uni.navigateTo({
					url:'../../../node_modules/uview-ui/components/u-avatar-cropper/u-avatar-cropper?destWidth=300&rectWidth=200&fileType=jpg'
				}) 
			},
			//性别
			async actionSheetCallback(index) {
 				this.sex = this.actionSheetList[index].text;
				let res = await this.$myMethod.setUserBaseInfo('',{
					sex:this.actionSheetList[index].sex	
				})
				this.getUserBaseInfo() 
			},
			//生日
			async change(e) {
				let res = await this.$myMethod.setUserBaseInfo('',{
					birth:e.result		
				})
				this.getUserBaseInfo()
			},
			//区域
			async regionAddress(e){
				let region = ''
				for(let i in e){
					region = region + e[i].label
				}
				this.region = region
 				let res = await this.$myMethod.setUserBaseInfo('',{
					location:region		
				}) 
			},	
		}
	}
</script>

<style lang="less" scoped>
	.container{
		padding: 20rpx 0rpx;
		background-color: #f4f4f4;
		height: 100vh;
		.set-list{
			width: 710rpx;
			margin: 0rpx 20rpx 20rpx 20rpx;
			background-color: #ffffff;
			border-radius: 15rpx;
			box-shadow: 1rpx 1rpx 25rpx #e8e8e8;
			//列表每一项
			.item{
				padding: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-bottom: 1rpx solid #f0f0f0;
				.left{
					flex: 2;
					text-align: right;
					margin-right: 15rpx;
				}
				.right{
					flex: 7;
					color: #acacac;
					display: flex;
					justify-content: flex-end;
				}
			}
			
		}
	}
	
</style>
