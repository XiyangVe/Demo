<template>
	<view class="page">
		<!-- <scroll-view scroll-y="true"> -->
			<!-- :style="{height:height}" -->
			<view class="boxes"  v-for="item in list">
				<view class="notice">
					2020-07-08 08:00:08
				</view>
				<view class="box">
					<view class="title">气象系统2.61更新说明</view>
					<view class="details">#增加了信息发布模块</view>
					<view class="details">#优化了个人中心</view>
					<view class="details">消息处理模块化，更加易于管理</view>
					<view class="details">#首页优化更新</view>
				</view>
			</view>
		<!-- </scroll-view> -->


	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [1, 2,2,4],
				height: 0,
			}
		},
		 // beforeCreate () {
		 //    document.querySelector('body').setAttribute('style', 'background:red')
		 //  },
		methods: {
			// getHeight() {
			// 	let _this = this;
			// 	uni.getSystemInfo({
			// 		success(res) {
			// 			console.log(res)
			// 			_this.phoneHeight = res.windowHeight;
			// 			console.log(res.windowHeight);
			// 		}
			// 	});
			// }
		}
	}
</script>

<style scoped>
	.page{
		height: 100vh;
		background-color: #f6f6f6;
	}
	.notice {
		text-align: center;
		margin-bottom: 5upx;
		font-size: 20upx;
		color: #979797;
	}

	.box {
		width: 90%;
		height: auto;
		padding: 20upx;
		border-radius: 10px;
		background: white;
		margin: 0 auto;
	}

	.boxes {
		margin-bottom: 20upx;
	}

	.title {
		font-size: 32upx;
		color: #000000;
		font-weight: 400;
		margin-bottom: 20upx;
	}

	.details {
		color: #979797;
		font-size: 28upx;
	}
	
</style>
