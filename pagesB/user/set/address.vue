<template>
	<view>
		<view class="null u-f-ajc" v-if="show">
			暂无收获地址
			<u-icon name="car" style="margin-left: 10rpx;" size="50"></u-icon>
		</view>
		<view hover-class="bg-light" class="item" v-for="(res, index) in siteList" :key="index" @click="chooseAddr(res.addressId)">
			<view class="top">
				<view class="name">{{ res.name }}</view>
				<view class="phone">{{ res.phone }}</view>
				<view class="tag">
					<text v-for="(item, index) in res.tag" :key="index" :class="{red:item=='默认'}">{{ item }}</text>
				</view>
			</view>
			<view class="bottom">
				<view>
					<text>{{res.region}}</text>
					<text style="margin-left: 20rpx;">{{res.addrDetail}}</text>
				</view>
				<view :data-index="index" @tap.stop="toedit">
					<u-icon name="edit-pen" :size="40" color="#999999" ></u-icon>
				</view>		
			</view>
		</view>
		<view class="addSite" @tap="toAddSite">
			<view class="add">
				<u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon>新建收货地址
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show:false,
			siteList: [],
			isFromMall: false
		};
	},
	onShow() {
		this.getData();
	},
	onLoad(e) {
		// 如果是从商城跳转过来选择地址就要把地址id返回
		if(e.type){
			this.isFromMall = true
		}
	},
	methods: {
		// 选择地址
		chooseAddr(id){
			if(this.isFromMall == true){
				this.$store.commit('goods/getAddrId',id)
				uni.navigateBack({
					delta: 1
				})
			}
		},
		getData() {
			this.$u.api.getAddress().then(res =>{
				this.siteList = res.data.map( v =>{
					let tag = v.isDefaultAddr ? ['默认'] : []
					tag = [...tag,v.addrTag]
					return {
						addressId:v.id,
						name:v.recPerson,
						phone:v.recPersonPhone,
						tag,
						region:v.region,
						regionCode:v.regionCode,
						addrDetail:v.addrDetail
					}
				})
				if(this.siteList.length === 0) this.show = true
			})
		},
		toAddSite(){
			uni.navigateTo({
			    url: './addSite'
			});
		},
		toedit(e){
			/* console.log(e) */
			let {index} = e.currentTarget.dataset
			let addressObj = this.siteList[index]
			let tag = this.siteList[index].tag.filter( v => v !== '默认')
			let defaultAdress = this.siteList[index].tag.some(v => v === '默认')
			this.$u.route({
				url: '/pagesB/user/set/addSite',
				params: {
					isedit:true,
					addressId:addressObj.addressId,
					name: addressObj.name,
					phone: addressObj.phone,
					tag: tag[0],
					region: addressObj.region,
					regionCode: addressObj.regionCode,
					addrDetail: addressObj.addrDetail,
					defaultAdress,
				}
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.null{
	margin-top: 30rpx;
	font-size: 36rpx;
}
.item {
	padding: 40rpx 20rpx;
	.top {
		display: flex;
		font-weight: bold;
		font-size: 34rpx;
		.phone {
			margin-left: 60rpx;
		}
		.tag {
			display: flex;
			font-weight: normal;
			align-items: center;
			text {
				display: block;
				width: 60rpx;
				height: 34rpx;
				line-height: 34rpx;
				color: #ffffff;
				font-size: 20rpx;
				border-radius: 6rpx;
				text-align: center;
				margin-left: 30rpx;
				background-color:rgb(49, 145, 253);
			}
			.red{
				background-color:red
			}
		}
	}
	.bottom {
		display: flex;
		margin-top: 20rpx;
		font-size: 28rpx;
		justify-content: space-between;
		color: #999999;
	}
}
.addSite {
	display: flex;
	justify-content: space-around;
	width: 600rpx;
	line-height: 100rpx;
	position: absolute;
	bottom: 30rpx;
	left: 80rpx;
	background-color: red;
	border-radius: 60rpx;
	font-size: 30rpx;
	.add{
		display: flex;
		align-items: center;
		color: #ffffff;
		.icon{
			margin-right: 10rpx;
		}
	}
}
</style>
