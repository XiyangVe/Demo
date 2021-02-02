const user = function(vm) {
	//拉取个人中心数据
	const getUserInfo = (params) => vm.$u.get('userCenter/getUserCenterInfo',params);
	//个人资料
	const getUserBaseInfo = (params) => vm.$u.get('userCenter/getUserDetails',params);
	//用户等级
	const getUserLevel = (params) => vm.$u.get('userCenter/getLevelDetails',params);
	//地址列表
	const getAddress = (params) => vm.$u.get('userCenter/getAddress',params);	
	const changeAddress = (params) => vm.$u.post('userCenter/changeAddress',params);
	const addAddress = (params) => vm.$u.post('userCenter/addAddress',params);
	const deleteAddress = (params) => vm.$u.post('userCenter/deleteAddress',params);	
	// 获取用户隐私设置
	const getUserPersonalSetting = (params) => vm.$u.get('userCenter/getUserPersonalSetting',params);
	// 更改用户隐私设置
	const setUserPersonalSetting = (params) => vm.$u.post('userCenter/setUserPersonalSetting',params);
	// 用户登录状态下更改密码
	const changePassword = (params) => vm.$u.post('userCenter/changePassword',params);
	// 用户换绑手机号
	const reBindPhone = (params) => vm.$u.post('userCenter/reBindPhone',params);
	// 备份手机通讯录
	const addInPhoneRows = (params) => vm.$u.post('/inPhone/addInPhoneRows',params);
	// 获取服务器备份的通讯录
	const getUserIdInPhoneRows = (params) => vm.$u.get('/inPhone/getUserIdInPhoneRows',params);
	// 修改数据库通讯录
	const updateByPhoneId = (params) => vm.$u.post('/inPhone/updateByPhoneId',params);
	
	
	
	
	//用户空间
	const getUserSpace = (params) => vm.$u.get('/userCenter/getPersonalSpaceUserInfo',params);
	// 获取登陆用户的个人空间需要的动态信息
	const getUserdynamic = (params) => vm.$u.get('/userCenter/getPersonalSpaceDynamicInfo',params);
	// 获取登陆用户的个人空间需要的收藏信息
	const getUserFavoritesInfo = (params) => vm.$u.get('/userCenter/getPersonalSpaceCollectInfo',params);
	//其他用户空间
	const getOtherSpace = (params) => vm.$u.get('/userCenter/getOtherPersonalSpaceUserInfo',params);
	// 获取其它用户的个人空间的动态信息
	const getOtherdynamic = (params) => vm.$u.get('/userCenter/getOtherPersonalSpaceDynamicInfo',params);
	// 获取其他用户的个人空间需要的收藏信息
	const getOtherStar = (params) => vm.$u.get('/userCenter/getOtherPersonalSpaceCollectInfo',params);
	
	//我的关注与粉丝
	const getUserContacts = (params) => vm.$u.get('userCenter/getLoginUserConcernersAndFans',params);
	//他的关注
	const getOtherContacts = (params) => vm.$u.get('userCenter/getOtherUserConcernersAndFans',params);
	
	//支付接口
	const getZfbPay = (params) => vm.$u.get('pay/pointsRechargeAli',params);
	//RMB与积分比例
	const getIntegralRatio = (params) => vm.$u.get('base/integralRatio',params);
	
	/**
	 * 企业认证
	 */
	//用户根据关键词获取公司列表
	const getCompanyList = (params) => vm.$u.get('userCenter/findCompany',params);
	// 申请加入企业
	const applyJoinCompany = (params) => vm.$u.post('userCenter/applyJoinCompany',params);
	// 获取当前用户的企业用户申请进度信息
	const getExamineRate = (params) => vm.$u.get('userCenter/getExamineRate',params);
	// 获取当前用户所在的企业信息
	const getCompanyInfo = (params) => vm.$u.get('userCenter/getCompanyInfo',params);
	// 员工退出企业
	const quitCompany = (params) => vm.$u.post('userCenter/quitCompany',params);
	// 企业管理者注销企业
	const cancelCompany = (params) => vm.$u.post('userCenter/cancelCompany',params);
	
	
	// 删除文件&图片
	const delFile = (params) => vm.$u.get('base/delFile',params);
	
	
	//返回接口方法
	return {
		getUserInfo,
		getUserBaseInfo,
		getUserLevel,
		
		getAddress,
		changeAddress,
		addAddress,
		deleteAddress,
		getUserPersonalSetting,
		setUserPersonalSetting,
		changePassword,
		reBindPhone,
		addInPhoneRows,
		getUserIdInPhoneRows,
		updateByPhoneId,
		
		getUserSpace,
		getUserdynamic,
		getUserFavoritesInfo,
		
		getOtherSpace,
		getOtherdynamic,
		getOtherStar,
		
		getUserContacts,
		getOtherContacts,
		
		getZfbPay,
		getIntegralRatio,
		// 企业申请&加入
		getCompanyList,
		applyJoinCompany,
		getExamineRate,
		getCompanyInfo,
		quitCompany,
		cancelCompany,
		// 删除文件&图片
		delFile
	}
}

export default user