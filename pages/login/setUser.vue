<template>
	<view>
		<!--日历-->
		<u-calendar v-model="show" mode="date" @change="change"></u-calendar>
		<!--登录头部图片-->
		<login-head v-if="step === 1 || step === 2"></login-head>
		
		<!--步骤一 选择头像呢称-->
		<view v-if="step === 1" class="user-pic u-f-ajc">
			<view>
				<image class="u-avatar-demo" :src="avatar" mode="aspectFill" @tap="chooseAvatar" ></image>
			</view>
		</view>

		<!--步骤二：生日性别-->
		<view v-if="step === 2" class="sex u-f-ac">
			<view>性别：</view>
			<view>
				<radio-group @change="radioChange">
					<label class="radio">
						<radio style="transform: scale(0.6);" value="1" checked="true" />男</label>
					<label class="radio">
						<radio style="transform: scale(0.6);" value="0" />女</label>
				</radio-group>
			</view>
		</view>
		<!--输入内容-->
		<view v-if="step === 1 || step === 2" class="input u-f-ajc">

			<!--步骤一设置称呼-->
			<view v-if="step === 1" class="info u-f-ac">
				<text style="padding-right: 10rpx;">昵称:</text>
				<input v-model="nickName" placeholder="快设置一个称呼吧" />
			</view>

			<!--步骤二生日性别-->
			<view v-if="step === 2" class="info u-f-ac">
				<text style="padding-right: 10rpx;">生日</text>
				<view style="width: 500rpx; color: #dbdbdb;" @click="show = true">
					<text v-if="!birthDay">选择日期</text>
					<text>{{birthDay}}</text>
				</view>
			</view>
		</view>
		
		<!--步骤三选择爱好-->
		<view v-if="step === 3">
			<view class="set-hobby u-f">
				<view v-for="(item, index) in  setHobby" :key="index" class="item" :data-index="index" @tap="setMyHobby" >
					<text :style="{'background-color' : item.active ? '#ffcbcb':'#e6e6e6'}" class="item">{{item.text}}</text>
				</view>
			</view>
			<view class="get-hobby u-f">
				<view class="item" v-for="(item, index) in  getHobby" :key="index"  :data-index="index" @tap="removeMyHobby">
					<text>{{item.text}}</text>
					<image src="../../static/login/remove.png" mode="widthFix"></image>
				</view>
			</view>
		</view>

		
		<!--确认按钮-->
		<login-button @handle="next">
			<slot>
				<text v-if="step <= 2">下一步</text>
				<text v-else>选好了</text>
			</slot>
		</login-button>
		<!--是否跳过-->
		<!-- <view v-if="step <= 2" class="skip u-f-ajc" @tap="login" style="color: #FF9900;">
			直接登录
		</view> -->
	</view>
</template>

<script>
	import loginHead from '../../components/login/login-head/login-head.vue';
	import loginButton from '../../components/commoms/cmd-button.vue';
	export default {
		components: {
			loginHead,
			loginButton,
		},
		data() {
			return {
				//账号名
				user:'',
				nickName:'',
				//头像
				avatar: '../../static/login/user-pic.png',
				//性别
				sex:'1',
				//日期选择和显示
				show: false,
				birthDay: '',
				//设置爱好
				setHobby:[],
				//爱好合集
				getHobby:[],
				//步骤
				step: 1,
				chose:false
			}
			
		},
		watch:{
			avatar:function(val){
				this.chose = true
			}
		},
		onLoad() {
			uni.$on('uAvatarCropper', path => {
				this.avatar = path;
				//path为图片路径
				console.log(path)
			})
			this.getMessTypes()
		},
		methods: {
			//爱好分类
			getMessTypes(){
				this.$u.api.getMessTypes().then(res => {
					console.log(res)
					this.setHobby = res.data.map(v => {
						return {
							id:v.id,
							text:v.messTypeName,
							active:false,
						}
					})
				}) 
			},
			//步骤一 跳转到剪裁页
			chooseAvatar() {
 	 			uni.navigateTo({
					url:'../../node_modules/uview-ui/components/u-avatar-cropper/u-avatar-cropper?destWidth=300&rectWidth=200&fileType=jpg'
				}) 
			},
			//步骤二
			//性别选择
			radioChange(evt) {
				this.sex = evt.detail.value
			},
			//日期选择
			change(e) {
				console.log(e);
				this.birthDay = e.result
			},
			//步骤三选择兴趣爱好
			setMyHobby(e){
				if(this.getHobby.length <= 6 ) {
					let {index} = e.currentTarget.dataset
					if(this.setHobby[index].active === false){
						this.getHobby = [...this.getHobby,this.setHobby[index]]
						this.setHobby[index].active = true
					}
				}else{
					uni.showToast({
						title:'最多选择6个爱好'
					})
				}
			},
			removeMyHobby(e){
				let {index} = e.currentTarget.dataset
				//获取对应属性
				let value = this.getHobby[index]
				value.active = false
				//检查数组元素对应值
				let id = this.setHobby.findIndex(v => {
					return v.text === value.text
				})
				this.setHobby[id] = value
				/* console.log(this.setHobby) */
				//删除爱好
				this.getHobby.splice(index,1)
			},
			//下一步
			next(){
				if(this.step > 2){
 					console.log('选好了可以发送数据了')
					let attentionMessSortTypeIds = ''
					this.getHobby.forEach(v=>{
						if(v.active){
							attentionMessSortTypeIds = `${attentionMessSortTypeIds},${v.id}` 
						}
					})
					attentionMessSortTypeIds = attentionMessSortTypeIds.slice(1)
					this.$myMethod.registerMinorInfo(this.chose ? this.avatar : '',{
						username:this.user,
						nickName:this.nickName,
						sex:this.sex,
						birth:this.birthDay,
						attentionMessSortTypeIds,
					}).then(res=>{
						console.log(res)
						if(res.code==200){
							uni.showToast({
								title:res.msg,
								icon: 'none'
							})
							setTimeout(()=>{
								uni.switchTab({
									url: '/pages/tabBar/index/index'
								})
							},2000)
						}
					})
				}
				if(this.step <= 2){
					this.step ++;
				}
			},
			//直接跳转至登录
			// login(){
			// 	uni.navigateTo({
			// 		url:'./login'
			// 	})
			// },
		}
	}
</script>

<style lang="less" scoped>
	page {
		overflow: hidden;
	}

	.user-pic {
		margin: 50rpx 0;
		.u-avatar-demo {
			width: 150rpx;
			height: 150rpx;
			border-radius: 100rpx;
		}
	}

	.sex {
		margin: 100rpx 0 50rpx 100rpx;
	}

	.input {
		margin: 30rpx 0;
		.info {
			width: 640rpx;
			padding: 10rpx;
			box-sizing: border-box;
			border-radius: 25rpx;
			box-shadow: 1rpx 1rpx 15rpx #d8d9dd;
		}
	}
	.set-hobby{
		margin: 50rpx;
		width: 650rpx;
		height: 350rpx;
		flex-wrap: wrap;
		align-content: flex-start;
		.item{
			margin:10rpx;
			text{
				padding: 8rpx;
				background-color: #e6e6e6;
				border-radius: 15rpx;
			}	
		}
	}
	.get-hobby{
		width: 650rpx;
		height: 150rpx;
		margin: 0 50rpx;
		border-radius: 25rpx;
		border: 1rpx solid #000000;
		//允许换行 且换行间隙为正常
		flex-wrap: wrap;
		align-content: flex-start;
		.item{
			margin:10rpx;
			width: auto;
			text{
				padding: 8rpx 20rpx 8rpx 8rpx;
				background-color: #ffcbcb;
				border-radius: 15rpx;
			}	
		}
		image{
			width:15rpx;
			position: relative;
			top: -18rpx;
			left: -20rpx;
		}
	}
</style>
