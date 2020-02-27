import Decimal from 'decimal.js';
import moment from 'moment';
import store from '@/store'
import { account, common, commons } from "@/service"
import { EosModel } from '@/utils/eos';
// host判断
export function dealHost() {
  let env = 'formal'; // formal - 正式 | test - 测试
  const host = process.env.NODE_ENV;
  switch (host) {
    case 'test':
    case 'development':
    case 'tron':
    case 'texth5':
      env = 'test';
      break;
    default:
      env = 'formal';
      break;
  }
  return env;
}

// 科学计数法转数值 - 处理 1e-7 这类精度问题
export function getFullNum(num) {
  // 处理非数字
  if (isNaN(num)) {
    return num;
  }
  // 处理不需要转换的数字
  const str = String(num);
  if (!/e/i.test(str)) {
    return num;
  }
  return Number(num).toFixed(18).replace(/\.?0+$/, '');
}

// 返回小数位后几位 截取
// number 数值
// p 位数
export function toFixed(number, pp) {
  if (!pp) pp = 4;
  let num = isNaN(number) || !number ? 0 : number;
  let p = isNaN(number) || !number ? 4 : pp;
  num = getFullNum(num);
  var n = (num + '').split('.'); // eslint-disable-line
  var x = n.length > 1 ? n[1] : ''; // eslint-disable-line
  if (x.length > p) { // eslint-disable-line
    x = x.substr(0, p); // eslint-disable-line
  } else { // eslint-disable-line
    x += Array(p - x.length + 1).join('0'); // eslint-disable-line
  } // eslint-disable-line
  return n[0] + (x == '' ? '' : '.' + x); // eslint-disable-line
}

// 获取url参数
export function GetUrlPara() {
  const url = document.location.toString();
  const arrUrl = url.split('?');
  if (arrUrl.length === 1) {
    return {
      dapp: 'moreWallet',
    };
  }
  const para = arrUrl[1];
  const qureyArr = para.split('&');
  const params = {};
  for (let i = 0; i < qureyArr.length; i += 1) {
    const arr = qureyArr[i].split('=');
    params[arr[0]] = arr[1];
  }
  return params;
}

// time 时间戳 p 截取位数
export function toLocalTime(time, p) {
  if(p){
    return moment(time).format('YYYY-MM-DD HH:mm:ss').substr(0, p)
  }
  return moment(time).format('YYYY-MM-DD HH:mm:ss')
}

/*
 ** 加法函数，用来得到精确的加法结果
 ** 返回值：arg1 + arg2的精确结果 Number 型
*/
export function accAdd(arg1, arg2) {
  return new Decimal(arg1).add(new Decimal(arg2)).toNumber()
}

/*
 ** 减法函数，用来得到精确的减法结果
 ** 返回值：arg1 - arg2的精确结果 Number 型
*/
export function accSub(arg1, arg2) {
  return new Decimal(arg1).sub(new Decimal(arg2)).toNumber();
}

/*
 ** 乘法函数，用来得到精确的乘法结果
 ** 返回值：arg1 * arg2的精确结果 Number 型
*/
export function accMul(arg1, arg2) {
  if (!arg1 || !arg2) {
    return 0
  }
  return new Decimal(arg1).mul(new Decimal(arg2)).toNumber();
}

/*
 ** 除法函数，用来得到精确的除法结果
 ** 返回值：arg1 / arg2的精确结果 Number 型
*/
export function accDiv(arg1, arg2) {
  if (!arg1 || !arg2) {
    return 0
  }
  return new Decimal(arg1).div(new Decimal(arg2)).toNumber();
}

/*
 ** 向上取整
 ** 返回值：arg Number 型
*/
export function integer(arg) {
  if (!arg) {
    return 0
  }
  return Math.ceil(arg);
}

/**
 * 爆仓倒计时
 * 已180s为一个折扣等级
 * @export
 * @param {*} begindtime 抢拍开始时间
 * @returns
 */
export function countdown(begindtime, nowTime) {
  const t = Date.parse(nowTime) - Date.parse(begindtime);
  let realSeconds = Math.floor((t / 1000) % 180); // 一分钟剩下的秒数
  let seconds = Math.floor((t / 1000)); // 相差的秒数
  let status = false; // 是否显示倒计时
  let lever = '9'; // 折扣等级
  let remainSeconds = 0; // 剩余时间
  if ( seconds >= 0 && seconds <= 720 ) {
    remainSeconds = 720 - seconds; // 剩余时间
    status = true;
    const currentLever = parseInt(Number(seconds / 180));
    switch (currentLever) {
      case 0:
        lever = 0;
        break
      case 1:
        lever = 1;
        break
      case 2:
        lever = 2;
        break
      case 3:
        lever = 3;
        break
      default: break
    }
  } else status = false;
  realSeconds = 180 - realSeconds;
  return { status, lever, realSeconds, remainSeconds };
}

// 返回链接
export function getReqUrl() {
  const env = process.env.NODE_ENV;
  let linkUrl = '';
  switch (env) {
    case 'tron':
    case 'test':
    case 'development':
      linkUrl = `http://${process.env.VUE_APP_BASEURL}:${process.env.VUE_APP_PORT1}`
      break;
    default:
      linkUrl = location.origin;
      break;
  }
  return linkUrl;
}

/**
 *
 * 标准时间转化为 YYYY/MM/DD HH:mm:ss
 * @export moment.js
 * @param timestamp Object 或者 String
 * @returns Object 或者 String
 */
export function timestampToTime(timestamp) {
  if (typeof timestamp === 'object') {
    timestamp.forEach((item, index) => {
      timestamp[index] = moment(item).format('YYYY-MM-DD HH:mm:ss')
    });
  } else {
    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
  }
  return timestamp
}

// 将科学计数法转换为小数
export function toNonExponential(num) {
  if (num === null) {
    return 0;
  }
  if (isNaN(num)) {
    return 0;
  }
  var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/); // eslint-disable-line
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
}

/**
 * 时间戳后台生成(毫秒)
 */
export async function getTimestamp(callback) {
  const {status, result} = await common.getTimestamp();
  if (status) {
    callback(result);
  }
}
/* 邮箱验证 */
export function validateEmail(str) {
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  return reg.test(str);
}

/**
 * 用户授权
 *
 * @export
 * @param {*} t: scoped 作用域
 * @param {*} callback 执行回调
 * @returns
 */
export function authorized(t, callback) {
  const self = t;
  const token = localStorage.getItem('Frontend-Token');
  if (token) {
    callback('success');
    return;
  }
  const scat = store.state.app.scatter;
  if (scat && !scat.identity) {
    self.$message.error(self.$t('public.signIn'));
    return;
  }
  getTimestamp((timestamp) => {
    EosModel.arbitrarySignature(self, timestamp, async (res) => {
      if (res.isError) {
        localStorage.setItem('Frontend-Token', '');
        self.$message.error('Authorization error please try again later');
        callback('error', res.isError);
        // console.log('钱包签名问题'); // eslint-disable-line
        return;
      }
      // 后台授权判断 verifySign
      const { status, result } = await account.verify(res);
      if (!status) {
        self.$message.error('Authorization error please try again later');
        localStorage.setItem('Frontend-Token', '');
        callback('error', '服务端验证出错');
        // console.log('服务端验证出错'); // eslint-disable-line
        return;
      }
      localStorage.setItem('Frontend-Token', result.token);
      callback('success', res);
    });
  });
}

/**
 * 跳转对应链上的区块浏览器
 *
 * @export
 * @param {*} id trxid | account | token
 * @param {*} chain 所属链
 * @param {*} type 'tx' | 'account' | 'token'
 * @returns
 */
export function toBrowser(id, chain, type) {
  if (chain === 'tron') {
    if (type === 'token') {
      const arr = id.split('-');
      if (arr[2].length === 34) {
        window.open(`${store.state.sys.blockBrowser[chain].token20}${arr[2]}`);
        return;
      }
      window.open(`${store.state.sys.blockBrowser[chain][type]}${arr[2]}`);
      return
    }
  }
  // console.log(`${store.state.sys.blockBrowser[chain][type]}${id}`)
  if (!chain || chain === 'eos') {
    window.open(`${store.state.sys.blockBrowser.eos[type]}${id}`);
    return;
  }
  window.open(`${store.state.sys.blockBrowser[chain][type]}${id}`);
}

/**
 * 深拷贝
 *
 * @export
 * @param {*} data 拷贝的数据
 * @returns
 */
export function deepClone(data){
  const type = typeof(data);
  let obj;
  if (type === 'array'){
      obj = []
  } else if (type === 'object'){
      obj = {}
  } else {
      return data
  }
  if (type === 'array'){
      for(var i = 0, len = data.length; i < len; i++){
          obj.push(deepClone(data[i]))
      }
  } else if (type === 'object'){
      for(var key in data){
          obj[key] = deepClone(data[key])
      }
  }
  return obj;
}

// 内嵌使用
export function getTargetOrigin() {
  const embedUrl = localStorage.getItem('embedUrl');
  if (embedUrl) {
    const paUrl = JSON.parse(embedUrl);
    const targetOrigin = decodeURIComponent(paUrl.origin);
    return targetOrigin;
  }
  const paUrl = GetUrlPara(window.location.href);
  localStorage.setItem('embedUrl', JSON.stringify(paUrl));
  const targetOrigin = decodeURIComponent(paUrl.origin);
  return targetOrigin;
}

function regConfig(config, type) {
  if (!config.maintain) {
    return false;
  }
  if (!config[type]) {
    return false;
  }
  return true;
}

// 免CPU操作 type: 'issue' | 'repay' | 'deposit' | 'withdraw' , [actionName: 'transfer' | 'xxxx']
export async function pushActionWithoutCPU(params, cb) {
  // 服务器状态判断
  const res = await getCommonParam();
  const config = res.baseConfig;
  if (!regConfig(config, params.type)) {
    cb(false)
    return;
  }
  // 判断免CPU次数
  let isFreeCpuWhite = true;
  const {status, result} = await account.getRemainFreeCount();
  if (!status) {
    cb(false)
    return
  }
  if (Number(result.remainFreeCount) <= 0) { // 次数不足
    isFreeCpuWhite = false; // 执行非免CPU
    params.useFreeCpu = false;
  }
  if (!isFreeCpuWhite) {
    // 执行非免CPU操作
    EosModel[params.actionName || 'transfer'](params, (res) => {
      cb(!res.code, res)
    })
    return;
  }
  // 执行免CPU操作
  params.useFreeCpu = true;
  EosModel[params.actionName || 'transfer'](params, async (res) => {
    if (res.code) {
      cb(false, res);
      return
    }
    const {status, result} = await commons.pushTxWithoutCPU(res);
    if (!status) {
      cb(false, result)
      return;
    }
    cb(true, result)
  })
}

/**
 * 获取系统配置
 *
 * @export
 * @returns result
 */
export async function getCommonParam() {
  const { status, result } = await common.getCommonParam();
  if (status) {
    const nodeChecked = {
      eos: result.eosNode,
      timer: new Date().getTime()
    }
    store.dispatch('setNodeChecked', nodeChecked); // 默认节点配置
    const toAccount = result.stableContractAccount;
    store.dispatch('setToAccount', toAccount); // 配置转账接收账户
    const config = result.baseConfig || {};
    store.dispatch('setBaseConfig', config); // 服务基本配置
    return result
  }
}

// zendesk跳转
export function hrefZendesk(id, type) {
  const lang = store.state.app.language.toLowerCase();
  let newtype = 'articles';
  if (type) {
    newtype = type
  }
  let url = `https://newdex.zendesk.com/hc/en-us/${newtype}/${id}`;
  if (lang !== 'en') {
    url = `https://newdex.zendesk.com/hc/${lang}/${newtype}/${id}`;
  }
  // window.location.href = url;
  window.open(url)
}

/**
 * 返回iframe外层地址
 *
 * @export
 * @param {*}
 * @returns
 */
export function handleParentUrl() {
  const env = process.env.NODE_ENV;
  const urlParams = {
    'development': `http://${process.env.VUE_APP_BASEURL}:2022`, // 测试环境
    'production': 'https://danchor.io' // 生成环境
  }
  let linkUrl = '';
  switch (env) {
    case 'development':
      linkUrl = urlParams['development']
      break;
    case 'production':
      linkUrl = urlParams['production']
      break;
    default:
      linkUrl = location.origin;
      break;
  }
  return linkUrl
}

/**
 * 计算剩余可拍数量
 *
 * @export
 * @param {*} marginPrincipal 筹集目标数量
 * @param {*} auctionIncome 已筹金额
 * @param {*} eosPrice eos价格指数
 * @param {*} snapshot 当前折扣
 * @returns
 */
export function calcRemaiTake(marginPrincipal, auctionIncome, eosPrice, snapshot) {
  const price = toFixed(accMul(Number(eosPrice), Number(snapshot)));
  const counts = accSub(Number(marginPrincipal), Number(auctionIncome));
  let remainNum = toFixed(accDiv((integer(accMul(accDiv(counts, price), 10000))), 10000));
  if (Number(counts)) {
    if (!Number(remainNum)) {
      remainNum = 0.0001;
    }
  }
  return remainNum
}