<template>
	<view>
		<!--日程的具体内容-->
		<view class="body">
			<view class="title u-f-ajc">
				<input v-model="title" />
			</view>
			<view class="content">
				<view class="event u-f-ajs">
					<view style="flex: 12;">全天事件：</view>
					<switch style="transform: scale(0.6);flex: 1;" :checked="isallday===0" @change="switch1Change" />
				</view>

				<view class="flex justify-between">
					<view style="flex: 3;">开始时间：</view>
					<view style="flex: 4;color: #979797;" class="flex justify-end">
						<view>{{starttime}}</view>
						<view class="arrow u-f-ajc" @click="calendarShow=true">
							<u-icon name="arrow-right" color="#FFFFFF" size="20" ></u-icon>
						</view>
					</view>
				</view>

				<view class="flex justify-between">
					<view style="flex: 3;">结束时间：</view>
					<view style="flex: 4;color: #979797;" class="flex justify-end">
						<view>{{endtime}}</view>
						<view class="arrow u-f-ajc" @click="calendarShow2=true">
							<u-icon name="arrow-right" color="#FFFFFF" size="20" ></u-icon>
						</view>
						
					</view>
				</view>

				<view class="py-2 flex justify-between">
					<view>频率：</view>
					<view class="radio-group">
						<radio-group @change="pinlvRadioChange">
							<label class="u-f-ac" v-for="(item, index) in pinlvItems" :key="item.value">
								<view>
									<radio :value="item.value" :checked="index === pinlvCurrent" />
								</view>
								<view>{{item.name}}</view>
							</label>
						</radio-group>
					</view>
				</view>

				<view class="py-4 u-f-ajs">
					<view style="flex: 3;">提醒时间：</view>
					<view style="flex: 4;color: #979797;" class="flex justify-end">
						<view>{{noticeString}}</view>
						<view class="arrow u-f-ajc" @click="calendarShow3=true">
							<u-icon name="arrow-right" color="#FFFFFF" size="20" ></u-icon>
						</view>
					</view>
				</view>

				<view class="remarks u-f-ac">
					<view class="flex-3">备注:</view>
					<input v-model="remarks" />
				</view>

				<view class="type u-f-ac">
					<view class="flex-3">类型:</view>
					<view class="choose-type u-f-ac" @click="show = true">{{typeName}}</view>
				</view>
			</view>
		</view>
		<!--按钮-->
		<view class="preserve">
			<button type="primary" @tap="preserve">保存</button>
		</view>
		<u-select v-model="show" mode="single-column" :list="list" @confirm="confirm"></u-select>
		<!-- 日历 -->
		<u-picker v-model="calendarShow" mode="time" :params="params" @confirm="calendarChange"></u-picker>
		<u-picker v-model="calendarShow2" mode="time" :params="params2" @confirm="calendarChange2"></u-picker>
		<u-picker v-model="calendarShow3" mode="time" :params="params3" @confirm="calendarChange3"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//标题
				title: '',
				// 是否全天事件:0是1否
				isallday: 0,
				// 日程开始时间
				starttime: '',
				// 日程结束时间
				endtime: '',
				// 日程提醒时间
				noticeString: '',
				// 日程类型
				type: 0,
				// 控制日历插件显示隐藏
				calendarShow: false,
				calendarShow2: false,
				calendarShow3: false,
				// 日历插件需要显示的参数
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				params2: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				params3: {
					year: false,
					month: false,
					day: false,
					hour: true,
					minute: true,
					second: true
				},
				//频率
				pinlvItems: Object.freeze([{
						value: 'one',
						name: '一次性活动'
					},
					{
						value: 'weekdays',
						name: '周一至周五',
					},
					{
						value: 'everyDay',
						name: '每天',
					}
				]),
				pinlvCurrent: 0,
				//备注
				remarks: '',
				//类型选择
				show: false,
				typeName: '未分类',
				list: [
					{
						value: '0',
						label: '未分类'
					},
					{
						value: '1',
						label: '旅游'
					},
					{
						value: '2',
						label: '工作'
					},
					{
						value: '3',
						label: '生活'
					},
					{
						value: '4',
						label: '个人'
					}
				],
				// 修改日程
				editScheduleid: null
			}
		},
		onReady() {
			if(this.editScheduleid===null){
				let time = new Date().getTime()
				let starttime = this.$u.timeFormat(time, 'yyyy-mm-dd hh:MM:ss')
				this.starttime = starttime
				let time2 = new Date().getTime() + 1*24*60*60*1000
				let endtime = this.$u.timeFormat(time2, 'yyyy-mm-dd hh:MM:ss')
				this.endtime = endtime
			}
		},
		onLoad(e) {
			if(e.type){
				console.log(this.$store.state.index.scheduleInfo)
				uni.setNavigationBarTitle({
				　　title: '修改'
				})
				this.title = this.$store.state.index.scheduleInfo.scheduletitle
				this.starttime = this.$store.state.index.scheduleInfo.starttime
				this.endtime = this.$store.state.index.scheduleInfo.endtime
				this.noticeString = this.$store.state.index.scheduleInfo.date
				this.remarks = this.$store.state.index.scheduleInfo.remarks
				this.pinlvCurrent = this.$store.state.index.scheduleInfo.rate
				this.isallday = this.$store.state.index.scheduleInfo.isallday
				this.editScheduleid = this.$store.state.index.scheduleInfo.id
			}
		},
		methods: {
			// 日历选择事件
			calendarChange(e){
				this.starttime = e.year + '-' + e.month + '-' + e.day + ' '
				+ e.hour + ':' + e.minute + ':' + e.second
			},
			calendarChange2(e){
				this.endtime = e.year + '-' + e.month + '-' + e.day + ' '
				+ e.hour + ':' + e.minute + ':' + e.second
			},
			calendarChange3(e){
				this.noticeString = e.hour + ':' + e.minute + ':' + e.second
			},
			//滑动选择器
			switch1Change(e) {
				if(e.detail.value == false){
					this.isallday = 1
				}else{
					this.isallday = 0
				}
			},
			//频率单项选择器
			pinlvRadioChange(evt) {
				for (let i = 0; i < this.pinlvItems.length; i++) {
					if (this.pinlvItems[i].value === evt.target.value) {
						this.pinlvCurrent = i;
						break;
					}
				}
				console.log(this.pinlvCurrent)
			},
			//选择类型回调
			confirm(e) {
				this.type = e[0].value
				this.typeName = e[0].label
			},
			//保存按钮
			preserve() {
				if(this.noticeString == '')
				return uni.showToast({
					title: "请选择提醒时间",
					icon: "none"
				})
				// 如果id为空则是新增否则是修改
				if(this.editScheduleid===null){
					this.$https.post('/schedule/add',{
						scheduletitle: this.title,
						isallday: this.isallday,
						starttime: this.starttime,
						endtime: this.endtime,
						noticeString: this.noticeString,
						rate: this.pinlvCurrent,
						type: this.type,
						remarks: this.remarks
					}).then(res=>{
						uni.showToast({
							title: res.msg
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta: 1
							})
						},2000)
					})
				}else{
					this.$https.post('/schedule/update',{
						id: this.editScheduleid,
						scheduletitle: this.title,
						isallday: this.isallday,
						starttime: this.starttime,
						endtime: this.endtime,
						noticeString: this.noticeString,
						rate: this.pinlvCurrent,
						type: this.type,
						remarks: this.remarks
					}).then(res=>{
						uni.showToast({
							title: res.msg
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta: 2
							})
						},2000)
					})
				}
				
				
				
				
				return;
				const jyJPush = uni.requireNativePlugin('JY-JPush');
				jyJPush.android_addLocalNotification({
					builderId:"1", // builderId 编号，自己定义，如果不管，可以全部传递1
					content: "推送内容",
					title: "生日",
					notificationId: "1", // 消息ID，需要为数字，后续可以通过这个取消,
					year: "2019", // 预约发送的时间，若小于当前时间，则立即发送；若大于当前时间，则预约时间，时间到了就发送；但是APP需要在前台
					month: "12",
					day: "02",
					hour: "21",
					minute: "20",
					second: "21"
					},result=> {
					uni.showToast({
					icon:'none',
					title: JSON.stringify(result)
					})
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.body {
		width: 710rpx;
		margin: 50rpx 20rpx;
		.title {
			border-bottom: 1rpx solid #f0f0f0;
			input {
				width: 600rpx;
				border: 1rpx solid #007AFF;
				padding: 10rpx 15rpx;
				border-radius: 15rpx;
				margin-bottom: 30rpx;
			}
		}
		.content {
			margin-top: 30rpx;
			font-weight: bold;
			.radio-group {
				radio {
					transform: scale(0.7);
				}
				label {
					color: #a1a1a1;
				}
			}
			.remarks {
				input {
					flex: 8;
					height: 130rpx;
					border: 1rpx solid #d9d9d9;
					border-radius: 10rpx;
				}
			}
			.type {
				.choose-type {
					flex: 8;
					height: 60rpx;
					border: 1rpx solid #d9d9d9;
					border-radius: 10rpx;
					color: #bbbbbb;
					padding: 10rpx;
				}
			}
			.arrow{
				width: 35rpx;
				height: 35rpx;
				background-color: #c8c9cc;
				border-radius: 50%;
				margin-left: 10rpx;
			}
		}

		.content>view {
			margin-bottom: 15rpx;

		}

		.content> :nth-last-child(-n+3) {
			margin: 20rpx 0;
		}
	}

	.preserve {
		margin: 30rpx;
		width: 690rpx;

		button {
			color: #FFFFFF;
			border-radius: 50rpx;
		}
	}
</style>
