import Taro, { useEffect } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import './index.less'

export default function Index () {
  useEffect(() => {
    Taro.setNavigationBarTitle({ title: 'can' })
    return () => {
      Taro.setNavigationBarTitle({ title: 'chat' })
    }
  }, [])
  return (
    <View className='container'>
      <View className='list'>record</View>
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
