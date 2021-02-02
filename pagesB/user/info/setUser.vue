<template>
	<view>
		<u-navbar back-icon-name="arrow-leftward" back-icon-size="35" back-icon-color="#ffffff" title-color="#ffffff"  :title="title"   height="50" :border-bottom="false" style="font-weight: bold;"
		:background="{backgroundColor: '#6aa8d8'}">
			<view class="slot-wrap" @tap="preserve">
				完成
			</view>
		</u-navbar>
		<view class="content">
			<view class="input">
				<u-input v-if="title === '修改昵称'"  v-model="nickname" :maxlength="maxlength" type="text" />
				<u-input v-else v-model="signature" height="70" :maxlength="maxlength" type="textarea" />
			</view>
			<view class="remain">
				{{remain}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'修改昵称',
				nickname:'',
				signature:'',
				maxlength:0,
			}
		},
		computed:{
			hasContent:function(){
				return this.nickname ||  this.signature ? true : false
			},
			remain:function(){
				if(this.title === '修改昵称'){
					return this.maxlength - this.nickname.length
				}else{
					return this.maxlength - this.signature.length
				}
			}
		},
		onLoad(e) {
			console.log(e)
			this.nickname = e.nickname
			this.signature = e.signature
			if(e.key === 'setNickname'){
				this.title = '修改昵称'
				this.maxlength = 12
			}else{
				this.title = '设置签名'
				this.maxlength = 30
			}
		},
		methods:{
			preserve(){
				console.log(this.signature)
				console.log(this.nickname)
				this.$myMethod.setUserBaseInfo('',{
					signature:this.signature,
					nickname:this.nickname,
				}).then(res => {
					console.log(res)
					if(res.code === 200) {
						uni.navigateBack({
							delta: 1
						});
					}
				}).catch(res =>{
					console.log(res)
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.slot-wrap {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex: 1;
		padding: 0 30rpx;
		font-size: 32rpx;
		font-weight: normal;
		color: #FFFFFF;
	}
	.content{
		background-color: #FFFFFF;
		padding: 20rpx;
		z-index: 99;
		.remain{
			display: flex;
			justify-content: flex-end;
		}
	}
</style>
