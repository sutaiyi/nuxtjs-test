/* eslint-disable */
import CFClient from './cfws';
import moment from 'moment';
import store from '@/store';
import { toFixed } from '@/utils/public'

const env = process.env.NODE_ENV;
// kline ws
let klineUri = 'wss://ws.danchor.io'; // 正式地址
if (env !== 'production') {
  klineUri = `ws://${process.env.VUE_APP_BASEURL}:${process.env.VUE_APP_PORT3}`; // eos测试站 测试数据
  // klineUri = 'wss://nws.340wan.com/ws'; // 测试站点 使用正式数据
}
const client = new CFClient({
  env,
  uri: klineUri,
  debug: false
});

// 服务端数据 ws
let serveDataUri = 'wss://pws.danchor.io/websocket'; // 正式地址
console.log('正式地址');
console.log(process.env.VUE_APP_BASEURL);
if (env !== 'production') {
  serveDataUri = `ws://${process.env.VUE_APP_BASEURL}:${process.env.VUE_APP_PORT4}/websocket`; // eos测试站 测试数据
  // serveDataUri = 'wss://nws.340wan.com/ws'; // 测试站点 使用正式数据
}

const clientServe = new CFClient({
  env,
  uri: serveDataUri,
  debug: false
});


const Io = {
  lastSubscribe: null,
  subscribeCallback: null,
  // 稳定币 k线图部分
  cfwsKline: function (params, subscribe, callback) {
    var me = this;
    let resolution = params.resolution;
    delete params.resolution;
    client.ready(function() {
      var type = 'minute'
      if (resolution == '5') {
        type = 'minute5'
      } else if (resolution == '15') {
        type = 'minute15'
      } else if (resolution == '30') {
        type = 'minute30'
      } else if (resolution == '60') {
        type = 'hour'
      } else if (resolution == '240') {
        type = 'hour4'
      } else if (resolution == '1D') {
        type = 'day'
      } else if (resolution == '1W') {
        type = 'week'
      } else if (resolution == '1M') {
        type = 'month'
      }
      var wsCallback = function(data) {
        const res = {
            resolution: resolution,
            symbol: params.symbol,
            klines: []
        };
        if (data.length > 0) {
          data.forEach(e => {
            res.klines.push({
              date: me.dataFormat(e[0]),
              open: Number(toFixed(e[1], 4)),
              close: Number(toFixed(e[2], 4)),
              high: Number(toFixed(e[3], 4)),
              low: Number(toFixed(e[4], 4)),
              time: e[0] * 1000
              // volume: Number(e[5].toFixed(0))
            })
          });
        }
        callback(res, 'all');
        res.klines = [];
      }
      params.symbol = params.symbol.toLowerCase();
      //请求k线数据
      client.request('kline.' + type, params, function(err, data) {
        if (err) {
          return;
        }
        wsCallback(data)
      })

      if (!subscribe) return;
      client.subscribe(`kline.${type}.${params.symbol}` , params, function(data) {
        const item = {
          date: me.dataFormat(data.id),
          open: Number(toFixed(data.open, 4)),
          close: Number(toFixed(data.close, 4)),
          high: Number(toFixed(data.high, 4)),
          low: Number(toFixed(data.low, 4)),
          time: data.id * 1000,
          // volume: Number(data.amount.toFixed(0))
        }
        const res = {
          resolution: resolution,
          symbol: params.symbol,
          klines: [item],
        };
        callback(res, 'one');
      })
    })
  },

  // 取消交易对所有推送
  cfwsUnsubscribe: function(params) {
    let unscribe = '*';
    client.ready(function() {
      if (params) {
        unscribe = params.toLowerCase();
      }
      client.unsubscribe(unscribe);
    });
  },

  // 取消服务端所有推送
  clientServeUnsubscribe: function(params) {
    let unscribe = '*';
    clientServe.ready(function() {
      if (params) {
        unscribe = params.toLowerCase();
      }
      clientServe.unsubscribe(unscribe);
    });
  },

  // 账号退出
  accountOut: function(account) {
    const chain = store.state.app.scatter.chain || 'eos';
    clientServe.ready(function() {
      clientServe.unsubscribe('account.message', { account, chain });
    });
  },

  //绑定账号
  accountBind: function(account) {
    const chain = store.state.app.scatter.chain || 'eos';
    clientServe.ready(function() {
      clientServe.subscribe('account.message', { account, chain })
    });
  },

  /*
  * 监听订单变动
  * @param way start 开始监听 stop 停掉监听
  */
  addListenerOrder: function(obj, callback) {
    clientServe.ready(function() {
      if (typeof obj !== 'string' && obj.way === 'stop') {
        clientServe.removeListener(obj.listener);
        return;
      }
      const listener = clientServe.addListener('account.message', function(res){
        store.dispatch('setWsOrderListen', {
          res: res,
          listener: listener,
          t: Math.random()
        })
        res.listener = listener;
        callback(res)
      });
      store.dispatch('setWsOrderListen', {
        res: {},
        listener: listener,
        t: Math.random()
      })
    })
  },

  /*
  * 监听网站暂停服务
  */
  addListenerRefresh: function() {
    clientServe.ready(function() {
      clientServe.addListener('refresh', () => {
        window.alert('The system is upgrading, please wait a moment');
        window.location.reload();
      });
    })
  },
  
  // 时间戳转换
  dataFormat(fdata) {
    return moment.unix(fdata).format('YYYY-MM-DD HH:mm:ss');
  },

  // 搜索功能
  searchWs(params, callback) {
    clientServe.ready(function() {
      clientServe.request('market.markets', { coin: params.coin, key: params.key }, function(err, data) {
        callback(err, data)
      });
    })
  },

  // 订阅爆仓记录
  margincall: function(callback) {
    clientServe.ready(function() {
      clientServe.subscribe('margincall', function(res) {
        callback(res)
      })
    });
  },

  // 取消订阅爆仓记录
  margincallOut: function() {
    clientServe.ready(function() {
      clientServe.unsubscribe('margincall');
    });
  },

  // 订阅价格指数
  subscribePrice: function(callback) {
    client.ready(function() {
      client.subscribe('price.eos-usn', res => {
        callback(res)
      })
    });
  },

  // 订阅newdex价格指数
  subscribeNewdexPrice: function(callback) {
    client.ready(function() {
      client.subscribe('newdex.price.eos-usn', res => {
        callback(res)
      })
    });
  },
}

export default Io