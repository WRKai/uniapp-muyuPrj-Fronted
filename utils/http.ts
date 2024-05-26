import { useUserStore } from '@/store/user'
// const memberStore = useUserStore()
const baseURL = 'http://8.137.77.183:8889'
const interceptorConfig = {
	invoke(args : UniApp.RequestOptions) {
		// 拼接基地址
		if (args.url.indexOf('http') === -1) args.url = baseURL + args.url
		// 处理请求超时
		args.timeout = 9999
		// 添加请求头
		args.header = {
			...args.header,
		}
		// 添加token
		const token = useUserStore().userinfo?.token
		if (token) args.header.Authorization = token
		return args
	},
}
uni.addInterceptor('request', interceptorConfig)
uni.addInterceptor('uploadFile', interceptorConfig)
// 自己封装响应拦截器的promise化
interface resData<t> {
	status : string
	msg : string
	data : t
}
export const req = <t>(args : UniApp.RequestOptions) => {
	return new Promise<resData<t>>((resolve, reject) => {
		uni.request({
			...args,
			success(res) {
				//   如果成功？
				if (res.statusCode >= 200 && res.statusCode < 300) resolve(res.data as resData<t>)
				// 表示用户权限有误，要求登录
				else if (res.statusCode === 401) {
					useUserStore().updateUserinfo({})
					useUserStore().updateToken('')
					useUserStore().updateGlobalStaticSettings({})
					uni.showToast({
						title: '登录过期，请重新登录',
						icon: "error"
					})
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						})
					}, 666)
					reject(res)
				}
				// 其它错误
				else {
					uni.showToast({
						title: (res.data as resData<t>).msg || '未知错误',
						icon: 'none',
					})
					reject(res)
				}
			},
			//   如果失败？
			fail(err) {
				uni.showToast({
					title: '网络错误',
					icon: 'none',
				})
				reject(err)
			},
		})
	})
}