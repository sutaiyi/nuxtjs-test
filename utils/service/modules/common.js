import https from '../axios'

// 获取公共接口
export function getCommonParam() {
  return new Promise((resolve, reject) => {
    https.get('/common/getCommonParam').then((res) => {
      let result = Object.assign(res, {});
      resolve({ status: !result.code, result });
    }, err => {
      reject(err)
    })
  })
}