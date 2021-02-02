<template>
	<view>
		<view class="user-info-box">
			<image class="avatar" :src="`${baseUrl}${userInfo.userHeadImage}`" mode="aspectFill"></image>
			<view class="user-name">{{userInfo.nickname}}</view>
		</view>
		<view class="company-information">
			<view class="item">
				<text>企业名称：</text>
				<text>{{companyInfo.company.companyName}}</text>
			</view>
			<view class="item">
				<text>企业地址：</text>
				<text>{{companyInfo.company.companyAddr}}</text>
			</view>
		</view>
		<view class="application-status">
			<image src="../../static/user/loding.png" mode="widthFix"></image>
		</view>
		<view class="create-time">
			{{$u.timeFormat(companyInfo.examineTime, 'yyyy年mm月dd日 hh时MM分ss秒')}}
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default{
		data(){
			return{
				companyInfo:{
					company:{}
				}
			}
		},
		computed:{
			...mapGetters(['userInfo'])
		},
		onLoad() {
			this.getExamineRate()
		},
		methods:{
			// 获取当前用户的企业用户申请进度信息
			getExamineRate(){
				this.$u.api.getExamineRate().then(res=>{
					if(res.code==200){
						this.companyInfo = res.data
					}else{
						uni.showToast({
							title: res.msg,
							icon:"none"
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.user-info-box{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 50rpx 0;
		.avatar{
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			border: 2rpx solid #eee;
		}
		.user-name{
			font-weight: bold;
			font-size: 32rpx;
			padding: 20rpx 0;
		}
	}
	.company-information{
		padding: 20rpx;
		.item{
			padding: 10rpx 0;
		}
	}
	.application-status{
		padding: 20rpx;
		image{
			width: 100%;
			
		}
	}
	.create-time{
		padding: 20rpx;
		font-size: 22rpx;
	}
</style>
