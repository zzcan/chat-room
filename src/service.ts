import Taro from '@tarojs/taro'


export async function checkSession() {
  try {
    await Taro.checkSession();
    return true;
  } catch (error) {
    return false;
  }
}

export async function wxLogin() {
  try {
    const res = await Taro.login();
    return res;
  } catch (error) {
    throw Error('wxLogin error')
  }
}

export async function login() {
  try {
    const loginInfo = await wxLogin();
    const res = await Taro.request({
      url: 'http://localhost:3000/login',
      method: 'GET',
      data: {
        code: loginInfo.code
      }
    })
    if(res.data.code === 200) {
      Taro.setStorageSync('token', res.data.data);
    }
  } catch (error) {
    throw Error('login error')
  }
}
