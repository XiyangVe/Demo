// $u.mixin.js
import store from "@/store"
import config from '../utils/config.js'

module.exports = {
	created() {

	},
	computed: {
		//文件基本地址拼接
		baseUrl: () => `${config.baseUrl}/file/`,
		//登录状态
		loginState:() =>{
			try{
				return store.state.login.loginState
			}catch(e){
				console.log(e)
			} 
		},
		//个人基本信息混入
		myId: () => {
			try{
				return store.state.user.userInfo.id
			}catch(e){
				console.log(e)
			} 
		},
		myName: () => {
			try{
				return store.state.user.userInfo.nickname
			}catch(e){
				console.log(e)
			} 
		},
		myImg: () => {
			try{
				return store.state.user.userInfo.userHeadImage
			}catch(e){
				console.log(e)
			} 
		},
		//用户等级
		level: () =>{
			try{
				return store.state.user.userInfo.level
			}catch(e){
				console.log(e)
			} 
		}
		
	}
}