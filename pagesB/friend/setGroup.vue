<template>
	<view>
		<view class="page">
			<view class="group">
				<u-swipe-action :show="item.show" :index="index" 
					v-for="(item, index) in friendGroup" :key="item.groupId" 
					@click="click" @open="open"
					@close="close"
					:options="options" btn-width="120">
					<list-item :title="`${item.head} ${item.length}`"></list-item>
				</u-swipe-action>
				<!-- 添加分组 -->
				<view class="add-item  u-f-ac" v-if="isShowAdd">
					<u-icon name="play-right-fill" color="#cecece" size="34"></u-icon>
					<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
					<u-field  v-model="listItemName" placeholder="请填写分组名称" style=" padding: 0;position: relative;left: -120rpx;" :border-bottom="false" :field-style="{backgroundColor:'#d8d8d8'}">
						<u-button size="mini" slot="right" type="success" @click="addListItem">确定</u-button>
						<u-button style="margin-left: 20rpx;" size="mini" slot="right" type="error" @click="remove">取消</u-button>
					</u-field>
				</view>
				
			</view>
			<show-option :isShowAdd="isShowAdd" @showAdd="isShowAdd = !isShowAdd "></show-option>
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	import listItem from '../components/friend/list-item.vue'
	import showOption from '../components/friend/showOption.vue'
	import { mapGetters } from 'vuex';
 	export default {
		components:{
			showOption,
			listItem
		},
		computed:{
			...mapGetters(['friendGroup'])
		},
		data() {
			return {
				show: false,
				//操作列表
				options: [{
						text: '编辑',
						style: {
							backgroundColor: '#007aff',
							fontSize: '24rpx',
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d',
							fontSize: '24rpx',
						}
					}
				],
				//开启添加列表
				isShowAdd:false,
				//添加列表名字
				listItemName:'',
				// 选择要操作的分组数据
				friendGroupInfo:{},
				// 修改分组标识
				isEdit: false
			}
		},
		created() {
		},
		methods: {
			//编辑分组
			click(index, index1) {
				if (index1 == 1) {
					this.$u.api.delFriendGroup({
						groupId:this.friendGroupInfo.groupId
					}).then(res=>{
						if(res.code==200){
							this.getFriendGroupAll()
						}
						this.$u.toast(res.msg);
					})
				} else {
					// this.friendGroup[index].show = false;
					this.listItemName = this.friendGroupInfo.head
					this.isEdit = true
					this.isShowAdd = true
				}
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.friendGroupInfo = this.friendGroup[index]
				this.friendGroup[index].show = true;
				this.friendGroup.map((val, idx) => {
					if (index != idx) this.friendGroup[idx].show = false;
				})
			},
			// 关闭
			close(index){
				// this.friendGroup[index].show = false;
			},
			//拉取好友列表
			async getFriendGroupAll(){
				await this.$store.dispatch('friend/getFriendGroupAll')
			},
			//添加&编辑分组
			async addListItem(){
				if(this.isEdit==true){
					this.$u.api.updateFriendGroup({
						groupId: this.friendGroupInfo.groupId,
						groupName: this.listItemName
						// groupOrder: 1
					}).then(res=>{
						if(res.code==200){
							this.isEdit = false
							this.isShowAdd = false
							this.getFriendGroupAll()
						}
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					})
				}else{
					let name = this.$u.trim(this.listItemName)
					if(name){
						let res1 = await this.$u.api.addFriendGroup({groupName:name})
						//调用更新好友
						let res2 = await this.$store.dispatch('friend/getFriendGroupAll')
						this.isShowAdd = false	
						this.$refs.uToast.show({
							title: '添加成功',
							type: 'success',
						})
					}else{
						this.$refs.uToast.show({
							title: '请输入正确的分组名字',
							type: 'error',
						})
					}
				}
			},
			//取消添加
			remove(){
				this.listItemName = ''
				this.isShowAdd = false	
			}
		}
	}
</script>

<style lang="less" scoped>
	.page {
		background-color: #f3f4f6;
		height: 100vh;
		padding-top: 20rpx;
	}
	.group {
		width: 710rpx;
		margin: 0 20rpx;
		box-shadow: 1rpx 1rpx 15rpx #C0C0C0;
		.add-item {
			padding: 30rpx 10rpx;
			border-bottom: 1rpx solid #e0e0e0;	
			.title {
				margin-left: 20rpx;
				font-size: 36rpx;
				font-weight: bold;
			}
		}
	}
</style>
