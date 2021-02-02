<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			//监听网络变化
			uni.onNetworkStatusChange(function (res) {
				if(!res.isConnected){
					uni.showToast({
					    title: '网络不给力',
					    duration: 2000,
						icon:'none',
					});
				}
			});
			try{
				let token = uni.getStorageSync('localToken') || false
				if(token){
					//尝试拉取个人信息
					this.$store.dispatch('user/getUserInfo') 
				}
			}catch(e){
				//TODO handle the exception
				console.log(e)
			}
		},
		onShow: function() {
			console.log('App Show')
			uni.getLocation({
				type: 'gcj02',
				geocode: true,
				success: (res) => {
					this.$store.commit('goods/setMaps',res)
				}
			})
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	
	/*引入uview库*/
	/* #ifndef APP-PLUS-NVUE */
	@import "uview-ui/index.scss";
	/*引入公共样式*/
	@import '/styles/common.css';
	/* #endif */
	
	@import '/styles/nvue/free.css';
</style>
