<template>
	<view>
		<!--自定义导航栏-->
		<u-navbar back-icon-color="#fe7533" title="我的发布" title-color="#fe7533" :background="background" height="50" :border-bottom="false">
			<view class="slot-wrap">
				<u-icon name="plus" color="#fe7533" size="40" @click="$refs.modal.running()"></u-icon>
			</view>
		</u-navbar>
		<!-- 添加发布 -->
		<right-top-modal type="release" ref="modal"></right-top-modal>
		
		<!--列表内容-->
		<release-list :list="lists" @callFather="activeSon"></release-list>
	</view>
</template>

<script>
	import rightTopModal from '../../../components/commoms/rightTop-modal.vue'
	import releaseList from '../../components/user/release-list.vue'
	export default {
		components:{
			rightTopModal,
			releaseList
		},
		data(){
			return{
				background:Object.freeze({	
					// 渐变色
					backgroundImage: 'linear-gradient(45deg, rgb(167, 192, 220), rgb(70, 205, 178))'
				}),
				lists:[]
			}
		},
		onLoad() {
			this.getUserdynamic()
		},
		methods:{
			activeSon(){
				this.getUserdynamic()
			},
			getUserdynamic(){
				this.$u.api.getUserdynamic({
					pageNo: 1
				}).then(res=>{
					if(res.code==200){
						var fabuImg = []
						res.data.messes.forEach(item=>{
							if(item.messImage!=null){
								// 去除最后一个逗号
								item.messImage = item.messImage.substring(0, item.messImage.lastIndexOf(','));
								fabuImg = item.messImage.split(',')
								item.addFbImg = fabuImg
							}else{
								// console.log('没有图片')
							}
						})
						this.lists = res.data.messes
						// console.log(this.lists)
					}
				})
			}
		},
		onHide() {
			this.$refs.modal.hide()
		},
	}
</script>

<style lang="less" scoped>
	.slot-wrap {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex: 1;
		padding: 0 30rpx;
	}
	
</style>
