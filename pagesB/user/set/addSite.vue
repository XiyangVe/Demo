<template>
	<view class="wrap">
		<u-navbar back-icon-name="close" back-icon-size="32" title="编辑收获地址"   height="50" :border-bottom="false" style="font-weight: bold;">
			<view class="slot-wrap" :style="{color: isSend ? '#f29100' :'#fcbd71' }" @tap="preserve">
				保存
			</view>
		</u-navbar>
		<view class="top">
			<view class="item">
				<view class="left">收货人</view>
				<input type="text" placeholder-class="line" v-model="name" placeholder="请填写收货人姓名" />
			</view>
			<view class="item">
				<view class="left">手机号码</view>
				<input type="text" placeholder-class="line" v-model="phone" placeholder="请填写收货人手机号" />
			</view>
			<view class="item" @tap="showRegionPicker">
				<view class="left">所在地区</view>
				<input style="width: 100%;" disabled type="text" placeholder-class="line" v-model="region"  placeholder="省市区县、乡镇等" />
			</view>
			<view class="item address">
				<view class="left">详细地址</view>
				<textarea type="text" placeholder-class="line"  v-model="addrDetail" placeholder="街道、楼牌等" />
			</view>
		</view>
		<view class="bottom">
			<view class="tag">
				<view class="left">标签</view>
				<view class="right">
					<block v-for="item in tag" :key="item.text">
						<text class="tags" :style="{backgroundColor: item.isactive ? '#a0cfff' : '' }"
						:data-text="item.text"  @click="setTap">{{item.text}}</text>
					</block>
				</view>
			</view>
			<view class="default">
				<view class="left">
					<view class="set">设置默认地址</view>
					<view class="tips">提醒：每次下单会默认推荐该地址</view>
				</view>
				<view class="right"><switch color="red" :checked="defaultAdress" @change="setDefault" /></view>
			</view>
			<!--删除地址-->
			<view class="delete u-f-ajc" v-if="addressId !== ''">
				<u-button style="width: 300rpx;" type="error" @tap="deleteAddress">删除地址</u-button>
			</view>
		</view>
		<!--区域-->
		<u-picker mode="region" ref="uPicker" v-model="show" @confirm="regionAddress"/>
		
		<u-toast ref="uToast" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			addressId:'',
			name:'',
			phone:'',
			//区域
			region:'',
			// 区域编码
			regionCode: '',
			//详细地址
			addrDetail:'',
			//标签
			tag:[
				{
					text:'家',
					isactive:true,
				},
				{
					text:'公司',
					isactive:false,
				},
				{
					text:'学校',
					isactive:false,
				}
			],
			//是否默认
			defaultAdress:true,
			//区域选择框
			show:false,
			isSend:false,
		};
	},
	computed:{
		input:function(){
			const {name,phone,region,addrDetail} = this
			return {name,phone,region,addrDetail}
		}
	},
	watch:{
		input:function(val){
			let isPhone = this.$u.test.mobile(val.phone)
			if(val.name && val.region && val.addrDetail && isPhone) this.isSend = true
			else this.isSend = false
		}
	},
	onLoad(e) {
 		if(e.isedit ===  'true'){
			this.addressId = e.addressId
			this.name = e.name 
			this.phone = e.phone
			this.region = e.region,
			this.regionCode = e.regionCode,
			this.addrDetail = e.addrDetail,
			this.defaultAdress = e.defaultAdress === 'true' ? true : false
			this.tag.forEach( v => {
				if(e.tag === v.text){
					v.isactive = true
				}else{
					v.isactive = false
				}
			})
		}
	},
	methods: {
		//设置标签
		setTap(e){
			let {text} = e.currentTarget.dataset
			this.tag.forEach( v =>{
				if(v.text === text){
					v.isactive = true
				}else{
					v.isactive = false
				}
			})
		},
		showRegionPicker() {
			this.show = true;
		},
		regionAddress(e){
			console.log(e)
			this.regionCode = e.area.value
			let region = ''
 			for(let i in e){
				region = region + e[i].label
			}
			this.region = region
		},
		//是否默认
		setDefault() {
			this.defaultAdress = !this.defaultAdress
		},
		//设置接口对象
		setAddressObj(){
			let addrTag = this.tag.filter( v =>{
				return v.isactive
			})
			return {
				id:this.addressId,
				recPerson:this.name,
				recPersonPhone:this.phone,
				region:this.region,
				regionCode: this.regionCode,
				addrDetail:this.addrDetail,
				addrTag:addrTag[0].text,
				isDefaultAddr:this.defaultAdress ? '1' : '0'
			}
		},
		//提示
		tips(res){
			this.$refs.uToast.show({
				title: res.msg,
				type: res.code === 200 ? 'success' : 'error',
				duration:1000,
				url: res.code === 200 ? '/pagesB/user/set/address' : ''
			})
		},
		//保存收货地址
		preserve(){
			if(!this.isSend){
				this.$refs.uToast.show({
					title: '请输入正确地址信息',
					type: 'warning',
				})	
				return
			}
			let addressObj = this.setAddressObj()
			this.$u.throttle(v=>{
				if(!this.addressId){
					this.$u.api.addAddress(addressObj).then(res => {
						this.tips(res)
					})
				}else{
					this.$u.api.changeAddress(addressObj).then(res =>{
						this.tips(res)
					})
				}
			}, 1500)
		},
		//删除地址
		deleteAddress(){
			this.$u.api.deleteAddress({
				addressId:this.addressId
			}).then(res =>{
				this.tips(res)
			})
		}
	}
};
</script>

<style lang="scss" scoped>
/deep/ .line {
	color: $u-light-color;
	font-size: 28rpx;
}
.wrap {
	background-color: #f2f2f2;
	.slot-wrap {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex: 1;
		padding: 0 30rpx;
		font-size: 32rpx;
		font-weight: normal;
	}
	.top {
		background-color: #ffffff;
		border-top: solid 2rpx $u-border-color;
		padding: 22rpx;
		.item {
			display: flex;
			font-size: 32rpx;
			line-height: 100rpx;
			align-items: center;
			border-bottom: solid 2rpx $u-border-color;
			.left {
				width: 180rpx;
			}
			input {
				text-align: left;
			}
		}
		
		.address {
			padding: 20rpx 0;
			textarea {
				// width: 100%;
				height: 150rpx;
				background-color: #f7f7f7;
				line-height: 60rpx;
				margin: 40rpx auto;
				padding: 20rpx;
			}
		}
		.site-clipboard {
			padding-right: 40rpx;
			textarea {
				// width: 100%;
				height: 150rpx;
				background-color: #f7f7f7;
				line-height: 60rpx;
				margin: 40rpx auto;
				padding: 20rpx;
			}
			.clipboard {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 26rpx;
				color: $u-tips-color;
				height: 80rpx;
				.icon {
					margin-top: 6rpx;
					margin-left: 10rpx;
				}
			}
		}
	}
	.bottom {
		margin-top: 20rpx;
		padding: 40rpx;
		padding-right: 0;
		background-color: #ffffff;
		font-size: 28rpx;
		.tag {
			display: flex;
			.left {
				width: 160rpx;
			}
			.right {
				display: flex;
				flex-wrap: wrap;
				.tags {
					width: 140rpx;
					padding: 16rpx 8rpx;
					border: solid 2rpx $u-border-color;
					text-align: center;
					border-radius: 50rpx;
					margin: 0 10rpx 20rpx;
					display: flex;
					font-size: 28rpx;
					align-items: center;
					justify-content: center;
					color: $u-content-color;
					line-height: 1;
				}
				.plus {
					//padding: 10rpx 0;
				}
			}
		}
		.default {
			margin-top: 50rpx;
			display: flex;
			justify-content: space-between;
			border-bottom: solid 2rpx $u-border-color;
			line-height: 64rpx;
			.tips {
				font-size: 24rpx;
			}
			.right {
			}
		}
		.delete{
			margin-top: 50rpx;
		}
	}
}
</style>
