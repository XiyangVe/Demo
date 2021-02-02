<template>
	<view>
		<view class="body">			
			<view v-for="(item, index) in checked" :key="index" class="row ">
				<u-collapse :arrow="false">
					<u-collapse-item :title="`${item.groupName}(${item.friend.length})`" >
						<view class="user-info-box">
							<block v-for="(item2,index2) in item.friend" :key="index2">
								<view class="user-info">
									<view class="u-left">
										<u-image shape="circle" width="50rpx" height="50rpx"
											:src="`${baseUrl}${item2.userHeadImage}`">
										</u-image>
										<view class="user-info-desc">
											<view class="nickname">
												{{item2.nickname}}
											</view>
											<view class="signature">
												{{item2.signature}}
											</view>
										</view>
									</view>
									<view class="right">
										<u-checkbox-group>
											<u-checkbox 
												shape="circle"
												@change="checkboxChange2" 
												:name="item2.id"
												v-model="item2.isShow"
												>
											</u-checkbox>
										</u-checkbox-group>
									</view>
								</view>
							</block>
						</view>
					</u-collapse-item>
				</u-collapse>
				<view class="box">
					<u-checkbox-group>
						<u-checkbox 
							shape="circle"
							@change="checkboxChange" 
							:name="item.groupId"
							v-model="item.show">
						</u-checkbox>
					</u-checkbox-group>
				</view>
				<!-- <list-item :title="`${item.groupName} ${item.friend.length}`"></list-item> -->
			</view>
			<view class="button-box u-f-ajc">
				<!-- <u-button plain :ripple="true" type="primary" ripple-bg-color="#909399" shape="circle" @click="checkedAll" size="medium">
					{{isAll}}
				</u-button> -->
				<u-button plain class="button" type="success" shape="circle" size="medium"  @tap="$refs.inputBox.isShowInput()" >输入内容</u-button>
			</view>
			
			<!--输入盒子-->
			<view class="bottom" style="margin-top: 500rpx;">
				<cmd-input :value="value" ref="inputBox" @changeInput="setInput" @send="service"></cmd-input>
			</view>
		</view>
	</view>
</template>

<script>
	import listItem from '../components/friend/list-item.vue'
	import cmdInput from '../../components/commoms/cmd-input.vue'
	export default {
		components:{
			listItem,
			cmdInput
		},
		data() {
			return {
				//是否全选
				isAll:'全选',
				//输入内容
				value:'',
				checked: [],
				// 选中的分组id
				groupId: '',
				userIds: []
			}
		},
		onLoad() {
			this.getFriendGroupAll()
		},
		methods:{
			// 查看某分组下的好友
			getFriendByGroupId(groupId){
				this.$u.api.getFriendByGroupId({
					groupId:groupId
				}).then(res=>{
					console.log(res)
				})
			},
			// 获取好友列表
			getFriendGroupAll(){
				this.$u.api.getFriendGroupAll().then(res=>{
					console.log(res)
					res.data.forEach(v=>{
						v.show = false
						if(v.friend.length>0){
							v.friend.forEach(item=>{
								item.isShow = false
							})
						}
					})
					this.checked = res.data
				})
			},
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
				if(e.value==true){
					this.checked.map(val => {
						if(e.name==val.groupId){
							// this.groupId = e.name
							val.friend.map(user =>{
								user.isShow=true
								this.userIds.push(user.id)
							})
						}
					})
					console.log(this.userIds)
				}else{
					this.checked.map(val => {
						if(e.name==val.groupId){
							val.friend.map(user =>{
								user.isShow=false
								var index = this.userIds.indexOf(user.id)
								if(index>-1){
									this.userIds.splice(index,1)
								}
							})
						}
					})
					console.log(this.userIds)
				}
				
				
				
				// if(e.value==true){
				// 	this.groupIds.push(e.name)
				// }else{
				// 	var index = this.groupIds.indexOf(e.name)
				// 	if(index>-1){
				// 		this.groupIds.splice(index,1)
				// 	}
				// }
			},
			checkboxChange2(e){
				if(e.value==true){
					this.userIds.push(e.name)
				}else{
					var index = this.userIds.indexOf(e.name)
					if(index>-1){
						this.userIds.splice(index,1)
					}
				}
				this.checked.forEach(v=>{
					if(v.friend.length>0){
						v.friend.map(item=>{
							if(e.name==item.id){
								if(this.userIds.length>0){
									v.show=true
								}else if(this.userIds.length==0){
									v.show = false
								}
							}
						})
					}
				})
				
				console.log(this.userIds)
			},
			// 全选
			checkedAll() {
				if(this.isAll === '全选'){
					this.isAll = '取消全选'
					this.checked.map(val => {
						val.show = true;
						// this.groupIds.push(val.groupId)
					})
				}else{
					this.isAll = '全选'
					this.checked.map(val => {
						val.show = false;
						// this.groupIds = []
					})
				}
			},
			//设置输入值
			setInput(value){
				console.log(value)
				this.value = value
			},
			//被触发的发送信息事件
			async service(){
				console.log(this.value)
				for(var i=0;i<this.userIds.length;i++){
					let time = new Date().getTime()
					let data = {
						//这里要互换
						otherId:this.userIds[i]+'',
						chatType:0,
						newsList:[{
							id:this.myId,
							content:this.value,
							msgType:0,
							createTime: time,
							file:{},
						}]
					}
					this.$store.dispatch('news/handleSend',data)
				}
				//发送消息
				let res = await this.$myMethod.chat('',{
					userIds:this.userIds,
					msgType:0,
					chatType:2,
					content:this.value,
				}) 
				if(res.code !== 200){
					console.log('发送失败')
					this.$store.dispatch('FAIL_SEND',data)
					this.$refs.uToast.show({
						title: '发送失败',
						type: 'error',
						icon:false
					}) 
				}else{
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
					//发送完成之后执行
					setTimeout(()=>{
						this.value = ''
						this.$refs.inputBox.closeInput()
						uni.switchTab({
						    url: '/pages/news/news'
						})
					},2000)
				}
				
			}
		}
	}
</script>

<style lang="less" scoped>
	.body{
		width: 100%;
		// height: 100vh;
		padding-top: 20rpx;
		background-color: #f3f4f6;
		position: relative;
	}
	.row{
		width: 710rpx;
		margin: 0 20rpx;
		padding: 10rpx 20rpx;
		box-shadow: 1rpx 1rpx 15rpx #C0C0C0;
		background-color: #FFFFFF;
		position: relative;
		font-weight: 600;
		.user-info-box{
			.user-info{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10rpx 0;
				.u-left{
					display: flex;
					align-items: center;
					.user-info-desc{
						font-weight: 500;
						margin-left: 20rpx;
						font-size: 22rpx;
						.nickname{
							color: #000000;
						}
						.signature{
							
						}
					}
				}
				.right{
					
				}
				
			}
		}
		.box{
			position: absolute;
			top: 30rpx;
			right: 10rpx;
		}
	}
	.button-box{
		margin-top: 50rpx;
		flex-flow: column;
		.button{
			margin: 20rpx;
		}
	}
	.bottom{
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
	}
</style>
