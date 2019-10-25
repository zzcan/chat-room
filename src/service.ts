import Taro from '@tarojs/taro'

const devBaseUrl = 'http://localhost:3000'
const prodBaseUrl = 'https://zzcan.xyz/api'
const baseUrl = process.env.NODE_ENV === 'development' ? devBaseUrl : prodBaseUrl

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
      url: `${baseUrl}/login`,
      method: 'GET',
      data: {
        code: loginInfo.code
      }
    })
    if(res.data.code === 200) {
      Taro.setStorageSync('token', res.data.data);
      return true;
    }
  } catch (error) {
    throw Error('login error')
  }
}

export async function test(params: any) {
  try {
    const res = await Taro.request({
      url: `${baseUrl}/test`,
      method: 'POST',
      data: params,
      header: {
        token: Taro.getStorageSync('token')
      }
    });
    return res.data;
  } catch (error) {
    throw Error('test error')
  }
}
