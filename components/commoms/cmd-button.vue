<template>
	<!--按钮-->
	<view class="button u-f-ajc">
		<view class="content" @tap="button">
			<image src="../static/login/buttom.png" mode="widthFix" style="width: 100%;"></image>
			<view class="text u-f-ajc">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			//触发方法
			button() {
				this.$emit('handle')
			}
		}
	}
</script>

<style lang="less" scoped>
	.button{
		margin-top: 50rpx;
		.content{
			width: 680rpx;
			position: relative;
			.text{
				color: #FFFFFF;
				font-weight: bold;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 10%;
			}
		}
	}
</style>