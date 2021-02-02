<template>
	<view>
<!--导航-->
		<cmd-navbar></cmd-navbar>
		<!-- {{friends}} -->
<!--    {{showList}} 
		{{allNewsList}} -->
		<!--消息内容-->
		<view class="body">
<!-- 				<view class="item" v-for="(item, index) in showList">
				<view class="pic">
					<u-image :src=" `${baseUrl}${item.pic}`" mode="widthFix" style="width: 100rpx;" shape="circle"></u-image>
				</view>
			</view> -->
			<u-swipe-action :show="item.show" :index="item.id" 
				v-for="(item, index) in showList" :key="item.id" 
				@click="click" @open="open"
				:options="options" btn-width="130"
			>		
				<view class="item u-border-bottom u-f-ac" :data-toName="item.title" :data-toImg="item.pic" :data-toId="item.id"
				@tap="navigateToChat">		
						<view class="left u-f-ac">
							<view class="pic">
								<u-image :src=" `${baseUrl}${item.pic}`" mode="widthFix" style="width: 100rpx;" shape="circle"></u-image>
							</view>
							<view class="info">
								<view class="title">
									{{item.title}}
								</view>
								<!--文字信息-->
								<view v-if="item.msgType === 0" class="content u-line-1">
									{{item.content}}
								</view>
								<!--图片-->
								<view v-if="item.msgType === 1" class="content">
									[图片]
								</view>
							</view>
						</view>
						<view class="right">
							<view class="time">
								{{item.time | timeFrom}}
							</view>
							<view class="icon" v-show="item.newNumber !== 0">
								<u-tag :text="item.newNumber" size="mini" type="error" shape="circle"  mode="dark"/>
							</view>
						</view>		
				</view>
			</u-swipe-action>		
			<u-button @tap="fanfa">按钮</u-button>
		</view>
	</view>
</template>

<script>
	import toLogin from '../commoms/cmd-toLogin.vue'
	import cmdNavbar from '../commoms/cmd-navbar.vue'
	import { mapGetters } from 'vuex';
	export default {
		components:{
			toLogin,
			cmdNavbar
		},
		data() {
			return {
				//操作栏
				options: [
					{
						text: '置顶',
						style: {
							backgroundColor: '#999999'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				list:[]
			}
		},
		computed:{
			//所有消息列表,需要展示的id，好友头像 
			...mapGetters(['friends','allNewsList','showNewsListId']),
			//需要展示的东西
			showList:function(){

				let list = []
				let friend
				let news
				try{
					this.showNewsListId.forEach( id => {
						//查询好友列表
						friend = this.friends.filter(v => v.id == id )
						//查询消所有息列表
						let newsObj = this.allNewsList.filter(v => v.otherId == id)
						let obj = {
							id,
							type:'new',
							title: friend[0].nickname,
							pic: friend[0].userHeadImage,
							//这里的时间和内容要向消息列表 newsList（数组中） 最后一个元素去取
							//消息类别
							msgType:newsObj[0].newsList[newsObj[0].newsList.length-1].msgType,
							content: newsObj[0].newsList[newsObj[0].newsList.length-1].content,
							time: newsObj[0].newsList[newsObj[0].newsList.length-1].createTime,
							newNumber:newsObj[0].noMsgNumber,
							show: false,
						}
						console.log(obj)
						list = [...list,obj]
					})
				}catch(e){
					console.log(e)
				} 
				return list			
			}
		},
		watch:{
			showList:{
				deep:true, //深度监听设置为 true
				handler:function(newV,oldV){
			      this.list = newV
				}
			}
		},
		methods: {
			fanfa(){
				let time = new Date().getTime()
				let data = {
					//这里要互换
					otherId:'4',
					chatType:0,
					newsList:[{
						id:'5',
						content:'这个内容啊',
						msgType:0,
						createTime: time,
						file:{},
					}]
				}
				this.$store.dispatch('news/handleSend',data)
			},
			//置顶与删除
			click(index, index1) {
				if(index1 == 1) {
					this.$store.commit('news/SET_SHOW_NEW_LISTID',{id:index,way:'delete'})
					this.$u.toast(`删除成功`);
				} else {
					this.$store.commit('news/SET_SHOW_NEW_LISTID',{id:index,way:'top'})
					this.$u.toast(`置顶成功`);
				}
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				console.log(this.allNewsList )
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
/* 				this.list[index].show = true;
				this.list.map((val, idx) => {
					if(index != idx) this.list[idx].show = false;
				}) */
			},
			//跳转聊天页面
			navigateToChat(e){
				console.log(e) 
				let toId = e.currentTarget.dataset.toid
				let toName = e.currentTarget.dataset.toname 
				let toImg = e.currentTarget.dataset.toimg
				uni.navigateTo({
					url: `../../pagesA/news/chat?toId=${toId}&toName=${toName}&toImg=${toImg}`
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.body{
		width: 690rpx;
		margin: 30rpx;
		.item{ 
			margin-top: 20rpx;
			.left{
				flex: 3;
				.info{
					margin-left: 20rpx;
					.title{
						font-size: 34rpx;
					}
					.content{
						max-width: 480rpx;
						font-size: 30rpx;
						color: #909399;
					}
				}
			}
			.right{
				flex: 1;
				color: #909399;
				.time{
					display: flex;
					justify-content: flex-end;
					margin-bottom: 15rpx;
				}
				.icon{
					display: flex;
					justify-content: flex-end;
				}
			}
		}
	}

</style>