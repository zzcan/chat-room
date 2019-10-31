import Taro from '@tarojs/taro'

const devBaseUrl = 'http://10.12.19.5:3000'
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
    throw new Error('wxLogin error')
  }
}

export async function login(rawUserInfo) {
  try {
    const loginInfo = await wxLogin();
    const res = await Taro.request({
      url: `${baseUrl}/user/login`,
      method: 'POST',
      data: {
        code: loginInfo.code,
        rawUserInfo,
      }
    })
    if(res.data.code === 200) {
      Taro.setStorageSync('token', res.data.data.sessionKey);
      Taro.setStorageSync('userInfo', JSON.stringify(res.data.data.userInfo));
      return true;
    }
  } catch (error) {
    throw new Error('login error')
  }
}

export async function update(rawUserInfo: string) {
  try {
    const res = await Taro.request({
      url: `${baseUrl}/user/update`,
      method: 'POST',
      data: { rawUserInfo },
      header: {
        token: Taro.getStorageSync('token')
      }
    });
    if(res.data.code === 200) {
      Taro.setStorageSync('userInfo', res.data.data);
    }
  } catch (error) {
    throw new Error('update error')
  }
}

export async function test() {
  try {
    await Taro.request({
      url: `${baseUrl}/test`,
      method: 'GET',
    });

  } catch (error) {
    throw new Error('update error')
  }
}
