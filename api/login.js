const login = function(vm) {
	// 此处使用了传入的params参数，一切自定义即可
	
	//登录接口
	const login = (params) => vm.$u.post('user/login',params); 
	//注册获取短信
	const getCode = (params) => vm.$u.post('user/registerVerifyCode',params)
	//注册接口
	const register = (params) => vm.$u.post('user/registerMainInfo',params)
	//注销
	const logOut = (params) => vm.$u.post('user/logOut',params)
	//获取爱好分类
	const getMessTypes = (params) => vm.$u.get('user/getMessTypes',params)
	//发送改密验证码
	const getPasswordVerifyCode = (params) => vm.$u.post('user/passwordVerifyCode',params)
	//用户未登录状态下找回密码
	const resetPassword = (params) => vm.$u.post('user/resetPassword',params)
	// 发送换绑手机号的验证码
	const changePhoneVerifyCode = (params) => vm.$u.post('userCenter/changePhoneVerifyCode',params)
	// 发送登陆验证码
	const loginVerifyCode = (params) => vm.$u.post('user/loginVerifyCode',params)
	// 短信登陆接口
	const phoneLogin = (params) => vm.$u.post('user/noteLogin',params)
	// 获取协议内容
	const getAgreement = (params) => vm.$u.get('user/getAgreement',params)
	// 获取受邀推荐码
	const getRecommendCodeByIp = (params) => vm.$u.get('user/getRecommendCodeByIp',params)
	
	
	//返回接口方法
	return {
		login,
		getCode,
		register,
		logOut,
		getMessTypes,
		getPasswordVerifyCode,
		resetPassword,
		changePhoneVerifyCode,
		loginVerifyCode,
		phoneLogin,
		getAgreement,
		getRecommendCodeByIp
	}
}

export default login