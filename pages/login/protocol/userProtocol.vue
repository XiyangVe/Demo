<template>
	<view class="protocol-content">
		<view class="item">
			<view class="title">
				<!-- 用户协议 -->
				{{agreement}}
			</view>
			<view class="content">
				<view class="p-view">
					请您仔细阅读以下条款，并确认您已完全理解本协议之规定，
					尤其是免除及限制责任的条款、知识产权条款、
					法律适用及争议解决条款。
				</view>
				<view class="p-view">
					若您对本声明或本协议任何条款有异议，
					请停止注册或使用简书网（jianshu.com，包括手机、电脑等移动设备客户端，下同）
					所提供的全部服务。
				</view>
			</view>
			<view class="title">
				一、协议的接受、变更与补充
			</view>
			<view class="content">
				<view class="p-view">
					1、勾选本协议前选项框并点击“注册”，将视为您签署了本协议，表明您自愿接受本协议全部条款的约束，本协议将构成您与上海佰集科技有限公司及其经营的“简书”平台（以下统称“简书”，包括相关关联方）之间具有约束力的法律文件。无论您是进入简书浏览网页，还是在简书上发布任何内容，或者是直接或通过各类方式（如站外API引用等）间接使用简书网服务和数据的行为，都将被视作已无条件接受本声明所涉全部内容。
					作者：简书
					链接：https://www.jianshu.com/p/c44d171298ce
					来源：简书
					著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
				</view>
				<view class="p-view">
					2、若您对本声明或本协议任何条款有异议，
					请停止注册或使用简书网（jianshu.com，包括手机、电脑等移动设备客户端，下同）
					所提供的全部服务。
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				agreement: ''
			}
		},
		onLoad() {
			this.getAgreement()
		},
		methods:{
			getAgreement(){
				this.$u.api.getAgreement({
					agreementName: '用户服务协议'
				}).then(res=>{
					console.log(res)
					this.agreement = res.data.agreement
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.protocol-content{
		padding: 20rpx;
		.item{
			.title{
				font-size: 30rpx;
				font-weight: 600;
				padding: 10rpx 0;
			}
			.content{
				font-size: 26rpx;
				.p-view{
					padding: 10rpx 0;
				}
			}
		}
	}
</style>
