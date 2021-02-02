<template>
	<view class="p-2">
		<view class="" v-if="isShow">
			<u-radio-group v-model="value" @change="radioGroupChange">
				<view class="flex flex-column w-100">
					<block v-for="(item, index) in list" :key="index" >
						<view class="flex align-center justify-between py-1">
							<view class="">
								{{item.name}}
							</view>
							<u-radio
								@change="radioChange(item.id)" 
								v-model="item.checked" 
								:name="item.name">
							</u-radio>
						</view>
					</block>
				</view>
			</u-radio-group>
			<view class="text-center mt-5 p-5">
				<u-button @click="next">下一步</u-button>
			</view>
		</view>
		<!-- 点击下一步后的内容 -->
		<view class="" v-else>
			<view class="flex align-centers">
				<text class="text-body flex-1">联系电话：</text>
				<input v-model="seekHelpData.seekHelperPhone" class="border-bottom flex-3" type="number"/>
			</view>
			<!-- <view class="flex align-centers pt-5">
				<text class="text-body flex-1">求助地点：</text>
				<view class="border-bottom flex-3">
					{{seekHelpData.seekAddr}}
				</view>
			</view> -->
			<view class="py-5 flex align-centers">
				<text class="flex-1">求助时间：</text>
				<view class="border-bottom flex-3" @click="validDateShow = true">
					{{validDate}}
				</view>
			</view>
			<view class="">
				<view class="pb-2">求助内容：</view>
				<textarea v-model="seekHelpData.seekHelpContent" class="border" style="width: 100%;"></textarea>
			</view>
			<view class="text-center mt-5 p-5">
				<u-button @click="seekHelp">立即求助</u-button>
			</view>
		</view>
		<!--日历-->
		<u-calendar v-model="validDateShow" mode="date" @change="change"  :min-date="minTime" :max-date="maxTime"  ></u-calendar> 
	</view>
</template>

<script>
	export default {
		computed:{
			//最大最小
			minTime:function(){
				let time = new Date().getTime() + 24*60*60*1000
				let minTime = this.$u.timeFormat(time, 'yyyy-mm-dd')
				return minTime
			}, 
			maxTime:function(){
				let time = new Date().getTime() + 15*24*60*60*1000
				let maxTime = this.$u.timeFormat(time, 'yyyy-mm-dd')
				return maxTime
			}
		},
		data(){
			return{
				isShow: true,
				validDateShow:false,
				validDate: '',
				list: [
					{
						name: '向政府中心求助',
						checked: false,
						id: 0,
						
					},
					{
						name: '向100米以内的朋友求助',
						checked: false,
						id: 1
					},
					{
						name: '向200米以内的朋友求助',
						checked: false,
						id: 2
					},
					{
						name: '向300米以内的朋友求助',
						checked: false,
						id: 3
					},
					{
						name: '向500米以内的朋友求助',
						checked: false,
						id: 5
					},
					{
						name: '向1000米以内的朋友求助',
						checked: false,
						id: 10
					}
				],
				value: '向政府中心求助',
				seekHelpData:{
					seekHelperPhone: '',
					ranger: 0,
					seekHelpContent: '',
					seekHelpPrescription: '',
					seekAddr: ''
				}
			}
		},
		onShow() {
			// #ifdef APP-PLUS
			var that = this
			uni.getLocation({
			    type: 'gcj02',
				geocode: true,
			    success: function (res) {
					that.seekHelpData.seekAddr = res.address.poiName + res.address.streetNum
			    }
			})
			// #endif
		},
		methods:{
			// 选中某个单选框时，由radio时触发
			radioChange(id) {
				this.seekHelpData.ranger = id
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				// console.log(e)
			},
			// 下一步
			next() {
				this.isShow = false
			},
			change(e) {
				this.validDate = e.result
				let overTime = `${e.result} 23:59:59`
				this.seekHelpData.seekHelpPrescription = overTime
			},
			// 立即求助
			seekHelp(){
				if(this.seekHelpData.seekHelperPhone===''){
					return uni.showToast({
						title: '请输入联系电话',
						icon: 'none'
					})
				}
				if(this.seekHelpData.seekAddr===''){
					return uni.showToast({
						title: '请开启GPS',
						icon: 'none'
					})
				}
				if(this.seekHelpData.seekHelpPrescription===''){
					return uni.showToast({
						title: '请选择求助时间',
						icon: 'none'
					})
				}
				if(this.seekHelpData.seekHelpContent===''){
					return uni.showToast({
						title: '请输入求助内容',
						icon: 'none'
					})
				}
				this.$https.post('/seekHelp/add',this.seekHelpData).then(res=>{
					uni.showToast({
						title:res.msg
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta: 1
						})
					},2000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
