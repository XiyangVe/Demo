//地址
import config from '../utils/config.js'
//token
import store from '../store/index.js'

//构建发送对象
class FromObj {
	constructor(url,name,filePath,fromData,resolve,reject) {
		this.url = url
		this.name = name
		this.filePath = filePath
		this.fromData = fromData
		this.resolve = resolve
		this.reject = reject
	}
	getFromobj(){
		/* console.log(token) */
		let obj = {
			url:this.url,
			header:{
				Authorization:store.state.login.token
			},
			name:this.name,
			formData:this.fromData,
			success: (uploadFileRes) => {
				let res =  JSON.parse(uploadFileRes.data)
				if(res.code !== 200){
					this.reject(res)
					uni.showToast({
					    title: res.msg,
						icon:'none',
					    duration: 2000
					});
 					uni.redirectTo({
					    url: '../pages/login/login'
					}); 
				}else if(res.code === 200){
					this.resolve(res)
				}else{
					this.resolve(res)
				}
			},
			fail:(err)=>{	
				console.log(err)
			},
		}
		//图片为字符串，多图为列表
		if(typeof this.filePath == 'string'){
			Object.assign(obj,{
				filePath:this.filePath,
			})
		}else if(typeof this.filePath == 'object'){
			Object.assign(obj,{
				files:this.filePath,
			})
		}
		// console.log(obj)
		return obj
	}
}
//状态拦截器

const formData = function(){
	//完善信息接口
	//第一个参数文件路径，第二个附件表单属性
	const registerMinorInfo = (filePath = '',fromData) => {
		let url = `${config.baseUrl}/user/registerMinorInfo`
		let name = filePath ? 'headImg' : 'none'
		return new Promise((resolve,reject)=>{
			let fromObj = new FromObj(url, name, filePath, fromData ,resolve, reject)
			uni.uploadFile(fromObj.getFromobj());
		})
	}
	//聊天
	const chat = (filePath = '',fromData) => {
		let url = `${config.baseUrl}/chat/sendInfo`
		let name = filePath ? 'file' : 'none'
		return new Promise((resolve,reject)=>{
			let fromObj = new FromObj(url, name, filePath, fromData ,resolve, reject)
			uni.uploadFile(fromObj.getFromobj());
		})
	}
	//修改个人资料
	const setUserBaseInfo = (filePath = '',fromData) =>{
		let url = `${config.baseUrl}/userCenter/setUserDetails`
		let name = filePath ? 'headImg' : 'none'
		return new Promise((resolve,reject)=>{
			let fromObj = new FromObj(url, name, filePath, fromData ,resolve, reject)
			uni.uploadFile(fromObj.getFromobj());
		})	
	}
	//设置个人空间背景
	const setBgImg  = (filePath = '',fromData) =>{
		let url = `${config.baseUrl}/userCenter/setBgImg`
		let name = filePath ? 'bgImg' : 'none'
		return new Promise((resolve,reject)=>{
			let fromObj = new FromObj(url, name, filePath, fromData ,resolve, reject)
			uni.uploadFile(fromObj.getFromobj());
		})	
	}
	//发布信息
	const addMessPublish = (filePath = [],fromData) =>{
		let url = `${config.baseUrl}/messPublish/add`
		let name = filePath.length > 0 ? 'file' : 'none'
		return new Promise((resolve,reject)=>{
			let fromObj = new FromObj(url, name, filePath, fromData ,resolve, reject)
			uni.uploadFile(fromObj.getFromobj());
		})	
	}
	//商品评论
	const orderRate = (filePath = [],fromData) =>{
		let url = `${config.baseUrl}/shopping/orderRate`
		let name = filePath.length > 0 ? 'file' : 'none'
		return new Promise((resolve,reject)=>{
			let fromObj = new FromObj(url, name, filePath, fromData ,resolve, reject)
			uni.uploadFile(fromObj.getFromobj());
		})	
	}
	// 企业用户认证
	const applyOpenCompany = (filePath = [],fromData) =>{
		let url = `${config.baseUrl}/userCenter/applyOpenCompany`
		let name = filePath.length > 0 ? 'businessLicense' : 'none'
		return new Promise((resolve,reject)=>{
			let fromObj = new FromObj(url, name, filePath, fromData ,resolve, reject)
			uni.uploadFile(fromObj.getFromobj());
		})	
	}
	// 商户用户认证
	const applyOpenMerchant = (filePath = [],fromData) =>{
		let url = `${config.baseUrl}/userCenter/applyOpenMerchant`
		let name = filePath.length > 0 ? 'businessLicense' : 'none'
		return new Promise((resolve,reject)=>{
			let fromObj = new FromObj(url, name, filePath, fromData ,resolve, reject)
			uni.uploadFile(fromObj.getFromobj());
		})	
	}
	
	return {
		registerMinorInfo,
		chat,
		setUserBaseInfo,
		setBgImg,
		addMessPublish,
		orderRate,
		applyOpenCompany,
		applyOpenMerchant
	}
}
export default formData