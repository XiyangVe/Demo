const integral = function(vm) {
	//方法
	/* let getSearch = (params) => vm.$u.get('personalized/djprogram',params); */
	//商品模块
	//商品分类
	const goodsSort = (params) => vm.$u.get('shopping/goodsSort',params)
	// 查询商品
	const queryGoods = (params) => vm.$u.post('shopping/queryGoods',params)
	// 订单查询
	const orderTracking = (params) =>vm.$u.post('shopping/orderTracking',params)
	// 商品详情
	const commodityDetails = (params) =>vm.$u.post('shopping/commodityDetails',params)
	// 商品规格
	const goodsSpecification = (params) =>vm.$u.get('shopping/goodsSpecification',params)
	// 获取选中的商品信息
	const getChekCommodityInfo = (params) =>vm.$u.post('shopping/commodityInfo',params)
	// 提交订单
	const submitOrder = (params) =>vm.$u.post('shopping/submitOrder',params)
	// 取消订单
	const cancelOrder = (params) =>vm.$u.get('shopping/cancelOrder',params)
	// 积分兑换
	const exchange = (params) =>vm.$u.get('shopping/commodityExchange',params)
	// 确定收货
	const confirmReceipt = (params) =>vm.$u.get('shopping/confirmReceipt',params)
	// 物流信息
	const logisticsInfo = (params) =>vm.$u.get('shopping/logisticsInfo',params)
	// 商品评价
	const orderRate = (params) =>vm.$u.post('shopping/orderRate',params)
	// 商品评价列表
	const productReviewsList = (params) =>vm.$u.post('shopping/productReviews',params)
	// 商品评价回复
	const commentReply = (params) =>vm.$u.post('shopping/commentReply',params)
	// 获取商品评价回复列表
	const queryCommentReply = (params) =>vm.$u.get('shopping/queryCommentReply',params)
	
	
	// 积分商城-积分赠送
	const giveIntegral = (params) =>vm.$u.post('/userCenter/bonusScore',params)
	
	/**多商户商城相关接口*/ 
	// 添加到购物车
	const addShoppingCart = (params) =>vm.$u.post('/cart/add',params)
	// 获取用户购物车
	// const getUserShoppingCart = (params) =>vm.$u.get('/cart/getUserCart',params)
	
	
	//返回接口方法
	return {
		goodsSort,
		queryGoods,
		orderTracking,
		commodityDetails,
		goodsSpecification,
		getChekCommodityInfo,
		submitOrder,
		cancelOrder,
		exchange,
		confirmReceipt,
		logisticsInfo,
		orderRate,
		productReviewsList,
		commentReply,
		queryCommentReply,
		
		giveIntegral,
		addShoppingCart,
		// getUserShoppingCart
	}
}

export default integral