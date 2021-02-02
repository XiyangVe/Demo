const news = function(vm) {
		
	// 此处使用了传入的params参数，一切自定义即可
	let sendSocketMessage = (params) => vm.$u.post('chat/sendInfo',params,); 
	//接收
	let getSocketMessage = (params) => vm.$u.get('chat/getOfflineMessages',params,); 
	//返回接口方法
	return {
		sendSocketMessage,
		getSocketMessage
	}
}

export default news