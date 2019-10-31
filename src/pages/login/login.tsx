import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { checkSession, login } from '../../service'

const USER_INFO_AUTH = 'scope.userInfo'

export default function Login() {
  const [hasUserInfoAuth, setHasUserInfoAuth] = useState(false)

  useEffect(() => {
    (async function() {
      const { authSetting = {} } = await Taro.getSetting();
      setHasUserInfoAuth(authSetting[USER_INFO_AUTH])
    })()
  }, [])

  const handleLogin = async (params) => {
    const loginSuccess = await login(params);
    if(loginSuccess) {
      Taro.showToast({ title: '登录成功！' })
      Taro.navigateTo({ url: '/pages/game/game' })
    } else {
      Taro.showToast({ title: '登录失败！' })
    }
  }

  const handleCheckSession = async (params) => {
    const token = Taro.getStorageSync('token');
    if(token) {
      const isLogin = await checkSession();
      if(!isLogin) {
        handleLogin(params)
      } else {
        Taro.showToast({ title: '登录成功！' })
        Taro.navigateTo({ url: '/pages/game/game' })
      }
    } else {
      handleLogin(params)
    }
  }

  const handleGetUserInfo = async (e) => {
    let userInfo: any
    if(e.detail && e.detail.userInfo) {
      userInfo = e.detail;
    } else {
      const res = await Taro.getUserInfo()
      userInfo = res
    }
    const { rawData } = userInfo
    handleCheckSession(rawData)
  }

  return (
    <View className="login-box">
      {
        hasUserInfoAuth ?
        <Button onClick={handleGetUserInfo} className="login-btn" type="primary">登录</Button>
        :
        <Button openType="getUserInfo" onGetUserInfo={handleGetUserInfo} className="login-btn" type="primary">登录</Button>
      }
    </View>
  )
}

Login.config = {
  navigationBarTitleText: 'login'
}
