<template>
	<view class="page-box">
		<!--返回栏-->
		<view class="top-row u-f-ac">
			<view class="item">
				<view class="icon u-f-ajc" @tap="goback">
					<view class="null"></view>
					<u-icon  name="arrow-left" color="#0077FF" size="50"></u-icon>
				</view>
			</view>
			<view v-if="id == myId" class="item" style="display: flex;justify-content: flex-end;">
				<view class="icon u-f-ajc" @tap="setBgImg">
					<view class="null"></view>
					<u-icon  name="list" color="#0077FF" size="50"></u-icon>
				</view>
			</view>
		</view>
		<!--背景图-->
		<view class="background">
			<image :src="userInfo.bgImage ? `${baseUrl}${userInfo.bgImage}` : ''" mode="scaleToFill" style="width: 100%;height: 100%;"></image>
		</view>
		<view class="head">
			<view class="head-row u-f-ac">
				<view class="pic">
					<u-image shape="circle" :src="userInfo.userHeadImage ? `${baseUrl}${userInfo.userHeadImage}` : ''" style="width: 150rpx;height: 150rpx;"></u-image>
				</view>
				<view class="other">
					<other-info :other="userInfo"  :type="'#82848a'"></other-info>
					<view class="edit">
						<view v-if="id != myId" class="is-follow">
							<u-button  v-if="concernedIds.some(v => v == id)" class="btn"  plain  style="background-color: #c8c9cc;">
								<u-icon name="list" ></u-icon>
								已关注
							</u-button> 
							<u-button v-else class="btn"  plain  type="warning">
								<u-icon name="plus" ></u-icon>
								关注
							</u-button> 
						</view>
						<u-button v-else class="btn"  plain type="primary" @tap="userInfoSet" >编辑资料</u-button>
					</view>
				</view>
			</view>
			<view class="info">
				<view class="name u-f-ac">
					{{userInfo.nickname}}
					<u-tag style="margin-left: 20rpx;" :text="`Lv${userInfo.level}`" type="success"  size="mini"/>
					<view style="margin-left: 10rpx;">
						<u-icon v-if="userInfo.sex === 1" name="man" color="#2979ff" size="32"></u-icon>
						<u-icon v-else name="woman" color="#dd6161" size="32"></u-icon>
					</view>
				</view>
				<view v-if="id === myId" class="grade">
					<u-tag :text="`Lv${userInfo.level}`" type="success"  size="mini"/>
 					<text v-if="userInfo.cumulativeScore/userInfo.nextLevelScore < 1"> {{userInfo.cumulativeScore}}/{{userInfo.nextLevelScore}} </text>
					<text v-else> {{userInfo.nextLevelScore}}/{{userInfo.nextLevelScore}} </text>
					<view style="width: 280rpx; margin-top: -20rpx;">
						<u-line-progress active-color="#f29100" height="8" :percent="(userInfo.cumulativeScore / userInfo.nextLevelScore) *100" 
						:show-percent="false"></u-line-progress>
					</view>
				</view>
				<view class="autograph">
					{{userInfo.signature}}
				</view>
			</view>
		</view>
		<!-- 动态收藏区域 -->
		<view class="body">
			<view>
				<u-tabs-swiper 
					ref="uTabs" 
					:list="list" 
					:current="current" 
					@change="tabsChange" 
					:is-scroll="false"
					swiperWidth="750">
				</u-tabs-swiper>
			</view>
			<view class="">
				<view v-if="current==0">
					<dynamic-list :dataList="dtList" @success="changeData"></dynamic-list>
					<u-loadmore :status="status" />
				</view>
				<view v-else>
					<favorite-list ref="list" type="cardIndex" :list="scList"></favorite-list>
					<u-loadmore :status="status" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import otherInfo from '../../components/user/other-info.vue'
	import dynamicList from '../components/user/dynamic-list.vue'
	import favoriteList from '../components/user/favorite-list.vue'
	
	import { mapGetters } from 'vuex';
	//构建信息对象
	function userObj(res,type){
		return {
			//用户信息
			id:res.user.id,
			sex:res.user.sex,
			nickname:res.user.nickname,
			signature:res.user.signature,
			userHeadImage:res.user.userHeadImage,
			bgImage:res.user.bgImage,
			//粉丝信息
			dynamicNum:res.dynamicNum,
			pocNum:res.pocNum,
			fansNum:res.fansNum,
			//等级
			level:res.level
		}
	}
	export default {
		components:{
			otherInfo,
			dynamicList,
			favoriteList
		},
		data() {
			return {
				//当前用户id
				id:'0',
				userInfo:{},
				list:[
					{
						name: '动态'
					}, 
					{
						name: '收藏'
					}
				],
				current:0,
				dtList: [],
				scList: [],
				// 加载更多
				status: 'loadmore',
				// 动态列表分页
				dtPage: 1,
				// 收藏列表分页
				scPage: 1
			}
		},
		computed:{
			...mapGetters(['concernedIds']),
		},
		onLoad(e) {
			uni.$on('uAvatarCropper', path => {
				this.avatar = path;
				//path为图片路径
				this.$myMethod.setBgImg(path,{}).then(res =>{
					console.log(res)
				})
			})
			this.id = e.id
			this.getUserSpace()	
		},
		onReady(){
			this.getUserdynamic()
		},
		// 页面上拉触底函数
		onReachBottom() {
			console.log('页面上拉触底函数')
			if(this.status == 'nomore'){
				return
			}
			this.status == 'loading'
			if(this.current == 0){
				this.dtPage ++
				setTimeout(()=>{
					this.getUserdynamic()
				},1000)
			}else{
				this.scPage ++
				setTimeout(()=>{
					this.getUserFavoritesInfo()
				},1000)
			}
		},
		methods:{
			// 子组件改变父组件的值
			changeData(){
				this.dtList = []
				this.getUserdynamic()
			 },
			//获取空间信息
			getUserSpace(){
				this.$u.api.getOtherSpace({
					 otherUserId:this.id
				}).then(res => {
					// console.log(res)
					this.userInfo = userObj(res.data,)
				})
			},
			//动态
			getUserdynamic(){
				if(this.id == this.myId){
					this.$u.api.getUserdynamic({
						pageNo: this.dtPage
					}).then(res => {
						var dtImg = []
						res.data.messes.forEach(item=>{
							if(item.messImage!=null){
								// 去除最后一个逗号
								item.messImage = item.messImage.slice(0, item.messImage.length-1);
								dtImg = item.messImage.split(',')
								item.dynamicImg = dtImg
							}
						})
						this.dtList = this.dtList.concat(res.data.messes)
						if(res.data.messes.length<20){
							this.status = 'nomore'
						}
					})
				}else{
					this.$u.api.getOtherdynamic({
						otherUserId: this.id,
						pageNo: this.dtPage
					}).then(res=>{
						var dtImg = []
						res.data.messes.forEach(item=>{
							if(item.messImage!=null){
								// 去除最后一个逗号
								item.messImage = item.messImage.slice(0, item.messImage.length-1);
								dtImg = item.messImage.split(',')
								item.dynamicImg = dtImg
							}
						})
						this.dtList = this.dtList.concat(res.data.messes)
						if(res.data.messes.length<20){
							this.status = 'nomore'
						}
					})
				}
			},
			//收藏
			getUserFavoritesInfo(){
				if(this.id == this.myId){
					this.$u.api.getUserFavoritesInfo({
						pageNo: this.scPage
					}).then(res=>{
						if(res.data==null){
							return this.status = 'nomore'
						}
						var scImg = []
						res.data.messes.forEach(item=>{
							if(item.messImage!=null){
								// 去除最后一个逗号
								item.messImage = item.messImage.slice(0, item.messImage.length-1);
								scImg = item.messImage.split(',')
								item.scImg = scImg
							}else{
								
							}
						})
						this.scList = this.scList.concat(res.data.messes)
						if(res.data.messes.length<20){
							this.status = 'nomore'
						}
					})
				}else{
					this.$u.api.getOtherStar({
						otherUserId: this.id,
						pageNo: this.scPage
					}).then(res=>{
						if(res.data==null){
							return this.status = 'nomore'
						}
						var scImg = []
						res.data.messes.forEach(item=>{
							if(item.messImage!=null){
								// 去除最后一个逗号
								item.messImage = item.messImage.slice(0, item.messImage.length-1);
								scImg = item.messImage.split(',')
								item.scImg = scImg
							}else{
								
							}
						})
						this.scList = this.scList.concat(res.data.messes)
						if(res.data.messes.length<20){
							this.status = 'nomore'
						}
					})
				}
				
			},
			//返回按钮
			goback(){
				uni.navigateBack({
				    delta: 1
				});
			},
			//设置背景图
			setBgImg(){
				/*uni.navigateTo({
					url:'../../node_modules/uview-ui/components/u-avatar-cropper/u-avatar-cropper?destWidth=300&rectWidth=200&fileType=jpg'
				}) */
				let that = this
 				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera',], //从相册选择
					success:function(chooseImageRes){
						const tempFilePaths = chooseImageRes.tempFilePaths;
						that.$myMethod.setBgImg(tempFilePaths[0],{}).then(res =>{
							console.log(res)
						})
					}
				})
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.current = index;
				this.status = 'loadmore'
				if(index==0){
					this.dtList = []
					this.getUserdynamic()
				}else{
					this.scList = []
					this.getUserFavoritesInfo()
				}
			},
			//跳转设置页面
			userInfoSet(){
				uni.navigateTo({
					url:'./info/userInfoSet'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-box{
		width: 100%;
		min-height: 100%;
		.top-row{
			position: absolute;
			top: 90rpx;
			left: 40rpx;
			right: 40rpx;
			z-index: 10;
			.item{
				flex: 1;
				.icon{
					width: 50rpx;
					height: 50rpx;
					border-radius: 50%;
					position: relative;
					overflow: hidden;
					.null{
						position: absolute;
						top: 0;
						left: 0;
						width: 50rpx;
						height: 50rpx;
						background-color:#82848a;
						opacity: 0; 
					}
				}
			}
		}
		.background{
			width: 100%;
			height: 350rpx;
		}
		.head{
			padding: 0 20rpx 20rpx 20rpx;
			.head-row{
				.pic{
					flex: 2;
				}
				.other{
					flex: 5;
					.edit{
						margin-top: 10rpx;
						.btn{
							width: 450rpx;
							height: 50rpx;
						}
					}
				}
			}
			.info{
				margin-top: 30rpx;
				font-size: 34rpx;
				.name{
					color: #fa3534;
				}
				.grade{
					margin-top: 10rpx;
					text{
						font-size: 24rpx;
						margin-left: 20rpx;
					}
				}
				.autograph{
					margin-top: 10rpx;
					font-size: 24rpx;
					color: #c8c9cc;
				}
			}
		}
		// 动态收藏
		.body{
			.swiper-group{
				position: absolute;
				width: 100vw;
			}
		}
	}
	
</style>
