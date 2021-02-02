const video = function(vm) {
	//接口方法
	/* let getSearch = (params) => vm.$u.get('personalized/djprogram',params); */
	
	const getRandomVidio = (params) => vm.$u.get('messPublish/randomVidio',params);
	
	//返回接口方法
	return {
		/* getSearch, */
		getRandomVidio
	}
}

export default video