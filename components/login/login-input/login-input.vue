<template>
	<view>
		<!--输入内容-->
		<view class="input u-f-ajc">
			<view class="content">
				<!--手机号(注册，忘记密码)-->
				<view v-if="type === 'register' || type === 'repawd'" class="info u-f-ac">
					<view class="icon u-f-ajc">
						<u-icon name="phone-fill" color="#727c8e" size="40"></u-icon>
					</view>
					<view class="input">
						<view class="title">请输入手机号</view>
						<view class="u-f-ac">
							<input :value="phone"  :focus="true" maxlength="11" style="flex: 7;"  @input="$emit('setPhone',$event.target.value)"/>
							<text class="u-f-ajc" v-if="type === 'repawd'" @tap="$emit('getNewpawd')">
								点击获取验证码
							</text>
						</view>
					</view>
				</view>
				
				<!--账号（注册，登录）-->
				<view v-if="type === 'register' || type === 'login'" class="info u-f-ac">
					<view class="icon u-f-ajc">
						<u-icon name="account" color="#727c8e" size="45"></u-icon>
					</view>
					<view class="input">
						<view class="title">账号</view>
						<input :value="user" :focus="true" @input="$emit('setUser',$event.target.value)" />	
					</view>
				</view>
				
				<!--密码（注册，登录，忘记密码）-->
				<view v-if="type === 'register' || type === 'login' || type === 'newpawd'" class="info u-f-ac">
					<view class="icon u-f-ajc">
						<u-icon name="lock-fill" color="#727c8e" size="45"></u-icon>
					</view>
					<view class="input">
						<view class="title">密码</view>
						<input :value="password"   password  @input="$emit('setPassword',$event.target.value)" />
					</view>
				</view>
				<!--入推荐人（注册）-->
				<view  v-if="type === 'register'" class="info u-f-ac">
					<view class="icon u-f-ajc">					
					<u-icon name="plus-people-fill" color="#727c8e" size="45"></u-icon>
					</view>
					<view class="input">
						<view class="title">推荐码(非必填)</view>
						<input :value="friendCode"   @input="$emit('setFriend',$event.target.value)"/>
					</view>
				</view>
				<!--验证码（注册，忘记密码）-->
				<view  v-if="type === 'code' || type ==='repawd'" class="info u-f-ac">
					<view class="icon u-f-ajc">
						<image src="../../static/login/code.png" mode="widthFix" style="width: 40rpx;"></image>
					</view>
					<view class="input">
						<view class="title">验证码</view>
						<input :value="code" :focus="true"   @input="$emit('setCode',$event.target.value)"  />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			type:{
				type:String,
				default:''
			},
			phone:{
				type:String,
				default:''
			},
			user:{
				type:String,
				default:''
			},
			password:{
				type:String,
				default:''
			},
			friendCode:{
				type:String,
				default:''
			},
			code:{
				type:String,
				default:''
			},
		},
		data() {
			return {

			}
		},
		methods:{
		}
	}
</script>

<style lang="less" scoped>
	.input{
		.content{
			width: 680rpx;
			border-radius: 15rpx;
			box-shadow: 1rpx 1rpx 15rpx #CCCCCC;
			font-size: 24rpx;
			color: #C0C0C0;
			.info{
				margin-bottom: 10rpx;
				.title{
					color: #82848a;
				}
				.icon{
					flex: 1;
				}
				.input{
					margin: 10rpx;
					flex: 7;
					//忘记密码额外配置
					text{
						position: relative;
						left: 0;
						flex: 4; 
						color: #FFFFFF;
						background-color: #007AFF; 
						padding: 10rpx;
						border-radius: 15rpx;
					}
				}
			}
		}
	}
</style>
