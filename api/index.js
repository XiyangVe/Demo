const index = function(vm) {
	// 轮播图
	let getSlideshow = (params) => vm.$u.post('slideshow/getSlideshow',params); 
	//tab获取
	let getInfoShopMall = (params) => vm.$u.get('messType',params); 
	// 获取二级分类(tab)
	let getNewsChildTab = (params) => vm.$u.get('messType/secondLevelList',params);
	//获取圈子消息
	let getMessPublish = (params) => vm.$u.get('messPublish',params); 
	//获取消息详情
	let getMessPublishDeta = (params) => vm.$u.get('messPublish/selectPublishById',params); 
	
	//圈子消息点赞与收藏(包括取消)
	let mesFavor = (params) => vm.$u.get('messPublish/updateNum',params); 
	let mesCollection = (params) => vm.$u.get('messPublish/updateCollectNum',params); 
	
	//获取评论
	let getMescomment = (params) => vm.$u.get('mescomment/list',params); 
	//评论新增
	let addMescomment = (params) => vm.$u.post('mescomment/add',params); 
	//回复新增
	let addMescommentrelay = (params) => vm.$u.post('mescommentrelay/add',params); 
	
	//评论点赞
	let mescommentUp = (params) => vm.$u.get('mescomment/updateId',params); 
	
	//回复点赞
	let mescommentrelayUp = (params) => vm.$u.get('mescommentrelay/updateId',params); 
	
	// 圈子关注与未关注信息获取
	let userSort = (params) => vm.$u.get('messType/userSort',params); 
	// 获取视频集合
	let selectUserVidio = (params) => vm.$u.get('messPublish/selectUserVidio',params); 
	// 消息发布删除
	let deleteById = (params) => vm.$u.get('messPublish/delete',params);
	// 关注&&取消圈子
	let updateUserTypes = (params) => vm.$u.get('messType/updateUserTypes',params);
	
	
	
	//返回接口方法
	return {
		getSlideshow,
		getInfoShopMall,
		getNewsChildTab,
		getMessPublish,
		getMessPublishDeta,
		
		mesFavor,
		mesCollection,
		
		getMescomment,
		addMescomment,
		addMescommentrelay,
		
		mescommentUp,
		mescommentrelayUp,
		userSort,
		selectUserVidio,
		deleteById,
		updateUserTypes
		
	}
}
export default index