//请求处理
import config from './config.js'
import store from '../store/index.js'

const install = (Vue, vm) => {
	// 此为自定义配置参数，具体参数见上方说明
	Vue.prototype.$u.http.setConfig({
		...config 
	});
	
	// 请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptor.request = async(config) => {
		// 引用token
		// 方式一，存放在vuex的token，假设使用了uView封装的vuex方式
		// 见：https://uviewui.com/components/globalVariable.html
		// config.header.token = vm.token;
	
		// 方式二，如果没有使用uView封装的vuex方法，那么需要使用$store.state获取
		// config.header.token = vm.$store.state.token;
		config.header.Authorization = vm.$store.state.login.token
		
		// 方式三，如果token放在了globalData，通过getApp().globalData获取
		// config.header.token = getApp().globalData.username;
		
		// 方式四，如果token放在了Storage本地存储中，拦截是每次请求都执行的
		// 所以哪怕您重新登录修改了Storage，下一次的请求将会是最新值
		// const token = uni.getStorageSync('token');
		// config.header.token = token;
	
		/* config.header.Token = 'xxxxxx'; */
		
		// 可以对某个url进行特别处理，此url参数为this.$u.get(url)中的url值
		/* if(config.url == '/user/login') config.header.noToken = true; */
		// 最后需要将config进行return
		// 如果return一个false值，则会取消本次请求
		// if(config.url == '/user/rest') return false; // 取消某次请求
	}
	
	// 响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptor.response = (res) => {
		// console.log(res)
		if(res.code == 200) {
			// res为服务端返回值，可能有code，result等字段
			// 这里对res.result进行返回，将会在this.$u.post(url).then(res => {})的then回调中的res的到
			// 如果配置了originalData为true，请留意这里的返回值
			/* console.log(res) */
			return res;
		} else if(res.code == 217) {
			/* console.log(res) */
			// 假设217为token失效，这里跳转登录
			let accountKey = {username:'',password:''}
			try {
				accountKey =  uni.getStorageSync('accountKey') || {}
			}catch(e){
				console.log(e)
			}
			if(!accountKey.username){
				uni.showToast({
					title: '登录已失效，请重新登录',
					icon: 'none'
				})
				setTimeout(()=>{
					uni.reLaunch({
						url: '/pages/login/login'
					})
				},2500)
				return 
			}
			store.dispatch('login/login',accountKey).then(res =>{	
				if(res.code !== 200 ){
					uni.showToast({
						mask:true,
						icon:'none',
					    title: '登录已失效，请重新登录',
					    duration: 1500,
						success:function(){
							setTimeout(v=>{
								uni.reLaunch({
									url: '/pages/login/login'
								})
							},1500)
						}
					});	
				}
			})
			return res;
		//其他登录被迫下线
		}else if(res.code == 222){
			store.dispatch('login/hanleLoginOut')
			uni.showToast({
				mask:true,
				icon:'none',
			    title: res.msg,
			    duration: 1500,
				success:function(){
					setTimeout(v=>{
						uni.reLaunch({
							url: '/pages/login/login'
						})
					},2000)
				}
			});		
			return res
		}else {
			// 如果返回false，则会调用Promise的reject回调，
			// 并将进入this.$u.post(url).then().catch(res=>{})的catch回调中，res为服务端的返回值
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
			return res
		}
	}

}

export default {
	install
}