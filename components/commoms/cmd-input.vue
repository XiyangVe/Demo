<template>
	<view>
		<view v-if="isshow" class="input-box u-f-ajc">
			<view class="input u-f-ac">
				<u-input  :value="value" type="textarea" :focus="isFocus"  @input="handle" 
				height="50" auto-height @blur="blur"  />
			</view>
			<view class="send u-f-ajc">
				<u-button :custom-style="customStyle" :ripple="true" ripple-bg-color="#63abff" size="medium" shape="circle" @click="isSend = true">
					发表
				</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	var setTimeA = null
	var setTimeB = null
	export default {
 		props:{
			value:{
				type:String,
				default:''
			}
		},
		data() {
			return{
				//是否显示输入框
				isshow:false,
				//是否聚焦
				isFocus:false,
				//按钮样式
				customStyle:{
					height: '50rpx',
					width: '30rpx',
					padding:'0rpx 50rpx',
					zIndex:0
				},
				//是否点击发送事件
				isSend:false,
				//评论或者回复
				data:{},
			}
		},
		created() {
			uni.$on('addMescommentrelay',this.isShowInput)
		},
		beforeCreate() {
			uni.$off('addMescommentrelay',)
			clearTimeout(setTimeA)
			clearTimeout(setTimeB)
		},
		methods:{
			//弹出输入框
			isShowInput(data){
				/* console.log(data) */
				this.data = data
				this.isshow = true
				//页面渲染完毕才调用是否聚焦
				setTimeA = this.$nextTick(() => {
					setTimeout(()=>{
						this.isFocus = true
					},200)
				})
			},
			//关闭输入框
			closeInput(){
				this.isshow = false
				this.isFocus = false
			},
			//输入框失去聚焦点
			blur(){
				//先让让发送事件先执行.因为 uni 没有mousedown 方法 只能使用定时器延迟
				setTimeB = setTimeout(()=>{
					//判断是否为发送事件
					if(this.isSend){
						// console.log(this.data)
						this.$emit('send',this.data)
					}
					//否则为普通的失焦事件
					else{
						this.isshow = false
						this.isFocus = false
					}
				},100)
			},
			
			//发送事件 触发父组件事件
			handle(value){
				this.$emit("changeInput",value)
			}
		}
	}
</script>

<style lang="less" scoped>
	//输入盒子
	.input-box{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 9999999;
		background-color: #f0f0f0; 
		.input{
			flex: 5;
			padding: 20rpx 0;
			.u-input {
				width: 90%;
				background-color: #FFFFFF;
				margin-left: 20rpx;
				border-radius: 20rpx;
				padding: 0 100rpx;
			}
		}
		.send{
			flex: 1;
			height: 80rpx;		
		}
	}
</style>
