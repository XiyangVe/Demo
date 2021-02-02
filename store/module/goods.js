// 积分商城
import $H from '@/utils/lib/https.js';

const state = {
	//商城商品分类
	goodsSort: [],
	//地址&经纬度
	maps:{}, 
	//选中的商品信息
	goodsChekInfo:{}, 
	//订单详情数据
	orderDetail:{},  
	//商品评论详情数据
	goodsPlInfo:{},
	// 商品分享时需要传的数据
	goodsDesc:{},
	// 用户购物车数据
	shoppingCartData: {},
	// 商户信息
	storeInfo: {},
	// 多商户商城选中的购物车id集合
	cartIds: [],
	// 选择要评论的商品数据
	commentGoodsInfo: {},
	// 购买商品时选择地址id
	addrId: null
}
const mutations = {
	// 获取购买商品时选择地址id
	getAddrId(state,id){
		state.addrId = id
	},
	// 获取要评论的商品数据
	getCommentGoodsInfo(state,data){
		state.commentGoodsInfo = data
	},
	setGoodsSort(state,data){
		state.goodsSort = data
	},
	setMaps(state,data){
		state.maps = data
	},
	setChekGoodsInfo(state,data){
		state.goodsChekInfo = data
	},
	setOrderDetails(state,data){
		state.orderDetail = data
	},
	setGoodsPlInfo(state,data){
		state.goodsPlInfo = data
	},
	setGoodsDesc(state,data){
		state.goodsDesc = data
	},
	// 获取商户信息
	getStoreInfo(state,data){
		state.storeInfo = data
	}
}
const actions = {
	/**
	 * 获取用户购物车
	 * 在VueX里调用接口用了单独的接口请求方式
	 * */ 
	getUserShoppingCart({state},data){
		$H.get('/cart/getUserCart',{
			page: data.page,
			pageSize: data.pageSize
		}).then(res=>{
			state.shoppingCartData = res.data
		})
	},
	getCartIds({state},data){
		state.cartIds = data
	},
	
}
export default {
	namespaced: true,
	state,
	mutations,
	actions
}