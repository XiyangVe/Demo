import $C from '../config.js';
import $store from '@/store/index.js';

export default {
    // 全局配置
    common:{
        baseUrl:$C.baseUrl,
        header:{
            'Content-Type':'application/json;charset=UTF-8',
        },
        data:{},
        method:'GET',
        dataType:'json',
        token:true
    },
    // 请求 返回promise
    request(options = {}){
        // 组织参数
        options.url = this.common.baseUrl + options.url
        options.header = options.header || this.common.header
        options.data = options.data || this.common.data
        options.method = options.method || this.common.method
        options.dataType = options.dataType || this.common.dataType
        options.token = options.token === false ?  false : this.common.token

        // 请求之前验证...
        // token验证
        if (options.token) {
            let token = uni.getStorageSync('localToken')
            // 二次验证
            if (!token) {
                uni.showToast({ title: '请先登录', icon: 'none' });
                // token不存在时跳转
				setTimeout(()=>{
					return uni.reLaunch({
					    url: '/pages/login/login',
					});
				},2000)
            }
            // 往header头中添加token
            options.header.Authorization = token
        }
        
		// 加载中
		// uni.showLoading({
		// 	title: '加载中...',
		// 	mask: true
		// })
		// 请求
        return new Promise((resolve,reject)=>{
            // 请求中...
            uni.request({
                ...options,
                success(res) {
                    // 服务端失败
                    if(res.statusCode !== 200){
						uni.showToast({
							title: res.data.error || '服务端失败',
							icon: 'none'
						})
                        return reject(res.data) 
                    }
                    // 其他验证...
					if(res.data.code !== 200){
						uni.showToast({
						    title: res.data.msg,
						    icon: 'none'
						})
						return reject(res.data)
					}
                    // 成功
                    resolve(res.data)
                },
                fail(err) {
                    uni.showToast({ title: err.errMsg || '请求失败', icon: 'none' });
                    return reject(err)
                },
				complete() {
					// uni.hideLoading()
				}
            });
        })
    },
    // get请求
    get(url,data = {},options = {}){
        options.url = url
        options.data = data
        options.method = 'GET'
        return this.request(options)
    },
    // post请求
    post(url,data = {},options = {}){
        options.url = url
        options.data = data
        options.method = 'POST'
        return this.request(options)
    },
    // delete请求
    del(url,data = {},options = {}){
        options.url = url
        options.data = data
        options.method = 'DELETE'
        return this.request(options)
    }
}