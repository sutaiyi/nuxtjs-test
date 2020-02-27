import Vue from 'vue'
// 输入框只允许输入正整数
Vue.directive('Int', {
  bind: function (el) {
    // const input = el.getElementsByTagName('input')[0]
    el.onkeyup = function () {
      if (el.value.length === 1) {
        el.value = el.value.replace(/[^1-9]/g, '')
      } else {
        el.value = el.value.replace(/[^\d]/g, '')
      }
      trigger(el, 'input')
    }
    el.onblur = function () {
      if (el.value.length === 1) {
        el.value = el.value.replace(/[^1-9]/g, '')
      } else {
        el.value = el.value.replace(/[^\d]/g, '')
      }
      trigger(el, 'input')
    }
  }
});

// 事件代理
const trigger = (el, type) => {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}
