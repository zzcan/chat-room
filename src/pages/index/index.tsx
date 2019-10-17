import Taro, { useEffect } from '@tarojs/taro'
import { View, Input, Button } from '@tarojs/components'
import { checkSession, login } from '../../service'
import './index.less'

export default function Index () {
  useEffect(() => {
    Taro.setNavigationBarTitle({ title: 'can' })
    return () => {
      Taro.setNavigationBarTitle({ title: 'chat' })
    }
  }, [])

  const handleLogin = async () => {
    const token = Taro.getStorageSync('token');
    if(token) {
      const isLogin = await checkSession();
      if(!isLogin) {
        await login();
      }
    } else {
      await login();
    }
  }

  const hadleGetUserInfo = (e: any) => {
    console.log(e.detail);
  }
  return (
    <View className='container'>
      <View className='list' onClick={handleLogin}>record</View>
      <Button openType='getUserInfo' lang='zh_CN' onGetUserInfo={hadleGetUserInfo}>获取用户信息</Button>
      <View className='input'>
        <Input type='text' placeholder='Type something' confirm-type='send' focus/>
      </View>
    </View>
  )
}

/**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
Index.config = {
  navigationBarTitleText: 'chat'
}
