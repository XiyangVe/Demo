//api 入口文件
import login from './login.js'
import index from './index.js'
import video from './video.js'
import friend from './friend.js'
import news from './news.js'
import user from './user.js'
import weather from './weather.js'
import integral from './integral.js'
import upFromData from './upFromData.js'


const install = (Vue, vm) => {
	//导入各个接口
	const loginMd = login(vm)
	const indexMd = index(vm)
	const videoMd = video(vm)
	const friendMd = friend(vm)
	const newsMd = news(vm)
	const userMd = user(vm)
	const weatherMd = weather(vm)
	const integralMd = integral(vm)
	//上传接口
	const fromData = upFromData()
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	//实例挂载的.$u方法
	vm.$u.api = {
		...loginMd,
		...indexMd,
		...videoMd,
		...friendMd,
		...newsMd,
		...userMd,
		...weatherMd,
		...integralMd,	
	};
	//挂载其他全局api方法 
    Vue.prototype.$myMethod = {
		// 逻辑...
		//上传api需要单独配置
		...fromData,
		//登录
		login: loginMd.login,
		// 手机登录
		phoneLogin: loginMd.phoneLogin,
		// 退出登录
		logOut:loginMd.logOut,
		//离线消息
		getSocketMessage:newsMd.getSocketMessage,
		//个人信息
		getUserInfo:userMd.getUserInfo,
		//好友列表
		getFriendGroupAll:friendMd.getFriendGroupAll,
	}
}

export default {
	install
}