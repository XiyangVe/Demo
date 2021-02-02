<template>
	<view class="">
		<u-navbar :title="title" title-color="#ffffff" back-icon-color="#ffffff" :background="{'background-color':'#6aa8d8'}"
		 height="50" :border-bottom="false">
		</u-navbar>
		<view v-if="title=='加入群聊'">
			<view class="box">
				<u-search v-model="groupName" @input="getGroups" shape="round" :show-action="false" placeholder="请输入群名称" :clearabled="true"
				 width="200px"></u-search>
			</view>
			<view class="">
				<u-subsection :list="list" :current="current" @change="sectionChange"></u-subsection>
			</view>
			<!-- <view style="height: 100px;">
			
			</view> -->
			<view class="list" v-for="item in groupList" @click="toGroupDetail(item.id)">
				<image :src="`${baseUrl}${item.groupHeadImage}`" mode="" class="images"></image>
				<text class="nickname">{{item.groupName}}</text>
			</view>
			<uni-load-more :status="status" :content-text="contentText" color="#979797" />
		</view>
		<view v-else>
			<view class="list" v-for="item in 2">
				<image src="../../static/friend/groups.png" mode="" class="images"></image>
				<text class="nickname">创业群{{item}}</text>
			</view>
			<view style="height: 20upx;background: #F6F6F6;">
				
			</view>
			<view class="GroupAnnouncement">
				群公告<view class="Groimg">
					<image style="width: 42upx;height: 42upx;" src="../../static/notice.png" mode=""></image>
				</view>
			</view>
			<view class="Notice">
				<u-input height="300" :auto-height="true" type="textarea" value="" />
			</view>
			<view class="">
				<u-button type="primary" style="width: 80%;position: fixed;bottom: 20upx;left: 10%;">立即创建</u-button>
			</view>
		</view>
		
	</view>
</template>

<script>
	import $https from '@/utils/lib/https.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		data() {
			return {
				title: '',
				list: [{
						name: '普通群'
					},
					{
						name: '商业群'
					},
				],
				current: 0,
				page: 1,
				pageSize: 10,
				groupList: [],
				groupName: '',
				status: 'more',
				contentText: {
					contentdown: '查看更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				total: 0,
			}
		},
		onLoad(e) {
			if (e.type == 'add') {
				this.title = '加入群聊'
			} else {
				this.title = '创建群聊'
			}
			console.log(e.type)
			this.type = e.type
			this.getUserGroupList()
		},
		// 上拉加载
		onReachBottom() {
			let _self = this
			this.status = 'loading'
			// uni.showNavigationBarLoading()
		
			console.log('reach');
			setTimeout(function() {
				// _self.page++;
				// _self.status = 'more'
				_self.getGroupListtwo();
				uni.hideNavigationBarLoading()
			}, 500);
		},
		methods: {
			//切换群
			sectionChange(index) {
				this.current = index;
				this.getUserGroupList()
			},
			//获取群列表第一次请求的数据
			getUserGroupList() {
				$https.get('/chatGroup/groupQuery?groupType=' + this.current + '&page=' + this.page + '&pageSize=' + this.pageSize)
					.then(res => {
						console.log(res)
						this.groupList = res.data.list
						this.total = res.data.total
					})
			},
			//下拉加载显示数据
			getGroupListtwo() {
				this.pageSize = this.pageSize + 10
				$https.get('/chatGroup/groupQuery?groupType=' + this.current + '&page=' + this.page + '&pageSize=' + this.pageSize)
					.then(res => {
						console.log(res)
						this.groupList = res.data.list
				})
				if (this.pageSize >= this.total){
					this.status='noMore'
					// uni.hideNavigationBarLoading()
				}
			},
			//搜索群
			getGroups() {
				$https.get('/chatGroup/groupQuery?groupName=' +this.groupName+'&groupType='+this.current )
					.then(res => {
						console.log(res)
						this.groupList = res.data.list
					})
			},
			//查看群详情
			toGroupDetail(id){
				uni.navigateTo({
					url:'../../pagesB/groupChat/groupSet?type='+this.type+'&groupId='+id
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.Notice {
		width: 710upx;
		background: #f9f9f9;
		border-radius: 20upx;
		padding: 20upx;
		margin-left: 20upx;
	}
	.GroupAnnouncement {
		margin-top: 20upx;
		padding-left: 20upx;
		font-size: 32upx;
		font-weight: 600;
		display: flex;
	
		.Groimg {
			margin-left: 10upx;
			margin-top: 6upx;
			width: 32upx;
			height: 28upx;
		}
	}
	.box {
		margin: 10px;
	}

	.list {
		display: flex;
		height: 100upx;
		border-bottom: 1px solid #f0f0f0;
	}

	.images {
		width: 64upx;
		height: 64upx;
		margin: 18upx 20upx;
	}

	.nickname {
		line-height: 100upx;
		font-size: 32upx;
		color: #000000;
	}
</style>
