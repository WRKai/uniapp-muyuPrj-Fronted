<script setup lang="ts">
	import { ref } from "vue";
	import { onReady } from '@dcloudio/uni-app'
	import { req } from "@/utils/http"
	import { useUserStore } from "@/store/user"
	const userStore = useUserStore()
	// 表单ref对象
	const formRef = ref<any>()
	// 表单内容（数据双向绑定）
	const formData = ref<any>({
		username: '',
		password: '',
		rePassword: ''
	})
	// 校验规则
	const rules = {
		username: {
			rules: [{
				required: true,
				errorMessage: '请输入用户名',
			}, {
				pattern: /^\S{1,20}$/,
				errorMessage: '请输入正确格式的用户名'
			}]
		},
		password: {
			rules: [{
				required: true,
				errorMessage: '请输入密码',
			}, {
				pattern: /^\S{6,20}$/,
				errorMessage: '请输入正确格式的密码'
			}]
		},
		rePassword: {
			rules: [{
				required: true,
				errorMessage: '请重复密码'
			}, {
				validateFunction: (rule, value, data, callback) => (formData.value.rePassword === formData.value.password),
				errorMessage: '两次密码不一致'
			}]
		}
	}
	// 绑定表单规则
	onReady(() => formRef.value.setRules(rules))
	// 提交表单回调
	const submitForm = async () => {
		try {
			// 如果不是注册模式：把隐藏的“重复密码”表单自动补全，以通过验证
			if (!isRegisterMode.value) {
				formData.value.rePassword = formData.value.password
			}
			// 验证
			await formRef.value!.validate!()
			let res : any = null
			if (isRegisterMode.value) {
				res = await req({
					url: '/api/register',
					method: "POST",
					data: formData.value
				})
				console.log(res);
				uni.showToast({
					title: res.msg,
					icon: 'success',
					mask: true
				})
				setTimeout(() => {
					isRegisterMode.value = false
					formData.value.password = ''
				}, 666)
			}
			else {
				res = await req({
					url: '/api/login',
					method: "POST",
					data: formData.value
				})
				// 保存用户信息
				userStore.updateUserinfo(res.data)
				userStore.updateToken(res.data.token)
				userStore.updateGlobalStaticSettings(JSON.parse(res.data.globalStaticSettings))
				console.log(res);
				// 提示用户成功
				uni.showToast({
					title: res.msg,
					icon: 'success',
					mask: true
				})
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}, 666)
			}
		} catch (e) {
			console.dir(e);
			// 假如是“表单有误”的错误
			if (e instanceof Array)
				uni.showToast({
					title: '表单内容有误',
					icon: 'error'
				})
		}
	}
	//是否注册模式
	const isRegisterMode = ref(false)
	// 处理模式切换
	const dealModeSwitch = () => {
		isRegisterMode.value = !isRegisterMode.value
		formData.value.rePassword = ''
	}
	var animating = false
	const dealQiaoMuYu = () => {
		// 判断是否在执行提示动画？
		if (!animating) {
			animating = true
			animation1.scale(0.75, 0.75).step()
			animation1Data.value = animation1.export()
			setTimeout(() => {
				animation1.scale(1.25, 1.25).step()
				animation1Data.value = animation1.export()
			}, 60)
			setTimeout(() => {
				animation1.scale(1, 1).step()
				animation1Data.value = animation1.export()
				animating = false
			}, 120)
		}
		if (!innerAudioContext.paused)
			innerAudioContext.stop()
		innerAudioContext.play()
	}
	// 音频设置
	const innerAudioContext = uni.createInnerAudioContext()
	innerAudioContext.src = '../../static/muyu.mp3'
	// 敲木鱼的动画
	const animation1Data = ref()
	const animation1 = uni.createAnimation({
		duration: 60
	})
</script>
<template>

	<view class="img-ctr" @click="dealQiaoMuYu">
		<image src="@/static/muyu.jpg" class="muyu" :animation="animation1Data"></image>
	</view>
	<view class="page-title">
		云木鱼
	</view>
	<view class="form-background">
		<uni-forms ref="formRef" :model="formData">
			<uni-forms-item name="username" class="forms-sub-item">
				<text class="label" style="min-width: 1vw;color: #fff;margin-bottom: 1vw;">用户名</text>
				<uni-easyinput type="text" v-model="formData.username" placeholder="请输入用户名" class="input" />
			</uni-forms-item>
			<uni-forms-item name="password" class="forms-sub-item">
				<text class="label" style="min-width: 1vw;color: #fff;margin-bottom: 1vw;">密码</text>
				<uni-easyinput type="password" v-model="formData.password" placeholder="请输入密码" class="input" />
			</uni-forms-item>
			<view v-show="isRegisterMode">
				<uni-forms-item name="rePassword" class="forms-sub-item">
					<text class="label" style="min-width: 1vw;color: #fff;margin-bottom: 1vw;">重复密码</text>
					<uni-easyinput type="password" v-model="formData.rePassword" placeholder="请重复密码" class="input" />
				</uni-forms-item>
			</view>
		</uni-forms>
		<view class="modeSwitch">
			<text @click="dealModeSwitch">{{isRegisterMode?'已注册? 去登录':'尚无账号? 去注册'}}</text>
		</view>
		<button @click="submitForm">{{isRegisterMode?'注册':'登录'}}</button>
	</view>
</template>


<style lang="scss">
	.form-background {
		background-color: #2f2f2f;
		padding: 6vw;
		margin: 4vw;
		border-radius: 1vw;
		box-shadow: 1vw 1vw 4vw 0.5vw dimgray;

		.forms-sub-item {
			.label {
				min-width: 1vw;
				color: #fff;
				margin-bottom: 1vw;

			}
		}
	}

	.img-ctr {
		min-height: 36vw;
		display: flex;
		justify-content: center;

		.muyu {
			height: 36vw;
			width: 36vw;
		}
	}

	.page-title {
		color: aliceblue;
		font-size: 9vw;
		text-align: center;
		margin-top: 1.6vw;
	}

	.modeSwitch {
		color: #f6c667;
		min-width: 10vw;
		height: 10vw;
		text-align: center;
		line-height: 10vw;
		margin-bottom: 4vw;
	}
</style>