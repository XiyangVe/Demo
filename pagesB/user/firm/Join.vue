<template>
	<view>
		<view class="join-search-box">
			<u-search placeholder="搜索企业账号或名称" v-model="keyword" @custom="searchClick()"></u-search>
		</view>
		<view class="join-search-list">
			<block v-for="(item,index) in dataList" :key="index">
				<view class="name">
					{{item.companyName}}
				</view>
				<view class="right" @click="toDesc(item)">
					<view>详情</view>
					<view class="icon">
						<u-icon name="arrow-right-double" color="#FF6969" size="28"></u-icon>
					</view>
				</view>
			</block>
		</view>
		<view class="desc-box">
			<u-popup v-model="descShow" mode="bottom" 
						:mask-close-able="false"	
						border-radius="50"
						closeable @close="popupClose">
				<view class="desc-box-item">
					<view class="name">企业名字：</view>
					<view>{{qyDesc.companyName}}</view>
				</view>
				<view class="desc-box-item">
					<view class="name">企业法人：</view>
					<view>{{qyDesc.idcardName}}</view>
				</view>
				<view class="desc-box-item">
					<view class="name">企业地址：</view>
					<view>{{qyDesc.companyAddr}}</view>
				</view>
				<view class="btn" @click="applyJoinCompany(qyDesc.id)">
					申请加入
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				pageNo: 1,
				dataList:[],
				descShow: false, //控制企业详情显示隐藏
				qyDesc:{},   //点击的企业详情数据
			};
		},
		methods:{
			searchClick(){
				uni.showLoading({
					title: '搜索中',
					mask:true
				})
				this.$u.api.getCompanyList({
					companyName: this.keyword,
					pageNo: this.pageNo
				}).then(res=>{
					if(res.code==200){
						if(res.data.companys.length==0){
							uni.showToast({
								title:"没有相关企业",
								icon:"none"
							})
						}else{
							this.dataList = res.data.companys
						}
					}else{
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				})
			},
			// 去详情页面
			toDesc(item){
				this.descShow = true
				this.qyDesc = item
			},
			// 申请加入企业
			applyJoinCompany(id){
				this.$u.api.applyJoinCompany({
					companyId:id
				}).then(res=>{
					if(res.code==200){
						this.descShow = false
						setTimeout(function(){
							uni.switchTab({
							    url: '/pages/user/user'
							})
						},3000)
					}
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
				})
			},
			popupClose(){
				console.log("关闭弹出层")
			}
		}
	}
</script>

<style lang="scss" scoped>
	.join-search-box{
		padding: 20rpx 50rpx;
	}
	.join-search-list{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 40rpx;
		.name{
			font-weight: 600;
		}
		.right{
			display: flex;
			align-items: center;
			.icon{
				background-color: #EEEEEE;
				border-radius: 50%;
				width: 40rpx;
				height: 40rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 20rpx;
				margin-left: 10rpx;
			}
		}
	}
	// 企业详情
	.desc-box{
		.desc-box-item{
			display: flex;
			align-items: center;
			padding: 20rpx;
			.name{
				color: #777777;
				font-weight: 600;
			}
		}
		.btn{
			margin: 50rpx 10vw;
			width: 80vw;
			height: 86rpx;
			line-height: 86rpx;
			text-align: center;
			background: #0077FF;
			box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
			border-radius: 60rpx;
			color: #FFFFFF;
			font-weight: 600;
		}
	}
</style>
