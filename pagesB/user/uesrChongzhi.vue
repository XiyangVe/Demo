<template>
	<view>
		<!-- 分段器 -->
		<uni-segmented-control :current="current" 
		:values="items" 
		@clickItem="onClickItem" 
		style-type="text" 
		active-color="#0077FF"></uni-segmented-control>
		<!--积分充值模块-->
		<view class="content" v-if="current === 0">
			<view class="money u-f-ajc">
				<view style="flex: 3; font-size: 34rpx;font-weight: bold;">充值积分</view>
				<view v-show="chooseMoney.active" class="number">{{integral}}</view>
				<view v-show="inputMoney.active" class="number">{{integral}}</view>
			</view>
			
			<!--充值方式-->
			<view class="choose u-f-ac">
				<!--选择充值-->
				<view class="item u-f-ajc" v-for="(item,index) in choose" :key="index" 
				:data-index="index" @tap="hanleMoney" :class="item.active ? 'active' : '' ">
					{{item.value}}元
				</view>
				<!--输入充值-->
				<view class="item u-f-ajc">
					<input @input="handleInput" type="number" maxlength="7" v-model="inputMoney.value" placeholder="其他金额" placeholder-style="font-size: 28rpx;" />
				</view>
			</view>
			
			<!--支付方式-->
			<view class="way">
				<view>支付方式</view>
				<radio-group @change="radioChange">
					<view class="item u-f-ajs">
						<view style="flex: 8;" class="u-f-ac">
							<u-icon name="zhifubao-circle-fill" color="#2979ff" size="58" ></u-icon>
							<text>支付宝</text>
						</view>
						<radio style="transform: scale(0.8);" value="zfb" checked="true" />
					</view>
					<view class="item u-f-ajs">
						<view style="flex: 8;" class="u-f-ac">
							<u-icon name="weixin-circle-fill" color="#51c300" size="58" ></u-icon>
							<text>微信</text>
						</view>
						<radio style="transform: scale(0.8);" value="wx"  />
					</view>
				</radio-group>
			</view>
			
			<!--充值按钮-->
			<view class="pay">
				<button type="primary" :disabled="disabled" @tap="pay">立即充值</button>
			</view>
			
		</view>
		<!-- 余额充值模块 -->
		<view class="p-2" v-if="current === 1">
			<view class="mt-5 flex align-center">
				<text class="font-md font-weight-bolder flex-1" style="color: #b7b7b7;">充值余额</text>
				<input v-model="balance" class="border-bottom flex-3 font-lg font-weight-bolder" type="number" maxlength="7"/>
			</view>
			<!--充值按钮-->
			<view class="flex justify-center align-end" style="height: 500rpx;">
				<button @click="balancePay" class="rounded-circle" style="width: 650rpx;height: 91rpx;" type="primary">立即充值</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				items: ['积分充值','余额充值'],
				current: 0,
				// 充值余额
				balance: 0,
				
				//选择充值的金额
				choose:[{
					value:'109',
					active:true
				},{
					value:'298',
					active:false
				},{
					value:'498',
					active:false
				},{
					value:'801',
					active:false
				},{
					value:'997',
					active:false
				},{
					value:'1498',
					active:false
				},{
					value:'1998',
					active:false
				},{
					value:'2998',
					active:false
				}],
				//输入的金额
				chooseMoney:{
					active:true,
					value:'109'
				},
				inputMoney:{
					active:false,
					value:''
				},
				//输入方式
				way:'zfbzf',
				key:'',
				// RMB与积分比例
				blNum: '',
				// 最终要充值的积分
				integral: 0,
				// 防止用户多次请求
				disabled: false
			}
		},
		watch:{

		},
		computed:{
		},
		onLoad() {
			this.getIntegralRatio()
		},
		onShow() {
			
		},
		methods: {
			// 分段器点击事件
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
			// 余额充值
			balancePay(){
				this.$https.get('/pay/balanceRecharge',{
					rechargeAmount: this.balance
				}).then(res => {
					uni.requestPayment({
					    provider: 'alipay',
						// 支付宝订单数据
					    orderInfo: res.data,
					    success: (res) => {
							uni.showToast({
								title: "支付成功"
							})
							uni.$emit('update',{msg:'充值成功'})
					    },   
					    fail: (err) => {
							uni.showToast({
								title: "支付失败",
								icon: "none"
							})
					    }
					});
				})
			},
			// 查询RMB与积分比例
			getIntegralRatio(){
				this.$u.api.getIntegralRatio().then(res=>{
					this.blNum = res.data
					this.integral = parseInt(res.data)*parseInt(this.chooseMoney.value)
				})
			},
			// 选择金额
			hanleMoney(e){
				let {index} =  e.currentTarget.dataset
				let choose = this.choose
				choose[index].active = true
				choose.forEach((v,id)=>{
					//#ifdef APP-PLUS
					if(index !== id)
					//#endif 
					//#ifdef H5
					if(index !== `${id}`)
					//#endif
					{
						v.active = false 
					}
				})
				//选择时候把输入清空 
				this.choose = choose
				this.chooseMoney = choose[index]
				// console.log(this.choose)
				// 金额转换成积分
				this.integral = parseInt(this.chooseMoney.value)* parseInt(this.blNum)
				
				if(this.inputMoney.active){
					this.inputMoney = {
						active:false,
						value:''
					} 
				}
			},
			//输入时候把选择金额清空
			handleInput(){
				// 输入金额转换成积分
				var reg = /^\+?[1-9]\d*$/;
				let isNumber = reg.test(this.inputMoney.value)
				if(!isNumber){
					uni.showToast({
						title: '只能充值整数',
						icon:"none"
					})
					this.inputMoney.value = ''
					this.integral = 0
				}else if(this.inputMoney.value==''){
					this.integral = 0
				}else{
					this.integral = parseInt(this.inputMoney.value)*parseInt(this.blNum)
				}
				
				
				this.choose.forEach(v=>{
					v.active = false
				})
				this.inputMoney.active = true
				if(this.chooseMoney.active){
					this.chooseMoney = {
						active:false,
						value:'0'
					}
				}
			},
			//支付方式选择
			radioChange(e){
				this.way = e.detail.value
			},
			pay(){
				this.disabled = true
				this.$u.api.getZfbPay({
					integral: this.integral
				}).then(res=>{
					if(res.code==200){
						this.disabled = false
						this.key = res.data
						uni.requestPayment({
						    provider: 'alipay',
						    orderInfo: this.key,
							//微信、支付宝订单数据
						    success: function (res) {
						        // console.log('success:' + JSON.stringify(res));
								uni.showToast({
									title: "支付成功"
								})
						    },   
						    fail: function (err) {
						        // console.log('fail:' + JSON.stringify(err));
								uni.showToast({
									title: "支付失败",
									icon: "none"
								})
						    }
						});
					}else{
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
					
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.content{
		width: 690rpx;
		margin: 30rpx;
		.money{
			margin-top: 50rpx;
			color:#b7b7b7;
			.number{
				height: 80rpx;
				flex: 9;
				color: #333333;
				font-size: 46rpx;
				border-bottom: 1rpx solid #eeeeee;
				margin-left: 10rpx;
				font-weight: bold;
			}
		}
		.choose{
			margin-top: 25rpx;
			flex-wrap: wrap;
			align-content: flex-start;
			.item{
				width: 200rpx;
				height: 100rpx;
				border-radius: 15rpx;
				margin-top: 20rpx;
				border: 1rpx solid #707070;
				input{
					width: 120rpx;
					font-size: 28rpx;
					font-weight: bold; 
					color: red;
				}
			}
			.item:nth-child(3n-1){
				margin: 20rpx 20rpx 0 20rpx;
			}
			.active{
				background-color: #0077ff;
				color: #FFFFFF;
			}
		}
		//充值方式
		.way{
			margin-top: 50rpx;
			font-weight: bolder;
			.item{
				padding: 20rpx 0;
				border-bottom: 1rpx solid #eeeeee;
				text{
					margin-left: 10rpx;
					font-size: 24rpx;
				}
			}
		}
		.pay{
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			padding-bottom: 30rpx;
			button{
				width: 650rpx;
				border-radius: 50rpx;
				background-color: ;
			}
		}
	}
</style>
