<template>
	<view class="">
		<view class="p-2">
			<u-collapse>
				<u-collapse-item :title="item.seekAddr" v-for="(item, index) in seekHelpList" :key="index">
					<view class="">
						{{item.seekHelpContent}}
					</view>
					<view class="flex align-center justify-between font-sm mt-2">
						<text>{{item.seekHelperPhone}}</text>
						<text>{{item.seekHelpTime}}</text>
					</view>
				</u-collapse-item>
			</u-collapse>
		</view>
		
		<uni-fab 
			horizontal="right"
			@fabClick="fabClick"
		></uni-fab>
	</view>
</template>

<script>
	import { uniFab  } from '@dcloudio/uni-ui'
	import { mapState } from 'vuex'
	export default {
		components:{
			uniFab
		},
		computed:{
			...mapState({
				maps:state=>state.goods.maps
			})
		},
		data(){
			return{
				seekHelpList: []
			}
		},
		onLoad() {
			this.getSeekHelpList()
		},
		methods:{
			fabClick(){
				uni.navigateTo({
					url:'./index'
				})
			},
			// 获取用户求助列表
			getSeekHelpList(){
				this.$https.get('/seekHelp/list',{
					// #ifdef APP-PLUS
					addr: this.maps.address.poiName + this.maps.address.streetNum,
					// #endif
					addr: '重庆市渝中区文化馆(中山三路)107附5号'
				}).then(res=>{
					console.log(res)
					this.seekHelpList = res.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
