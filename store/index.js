
 
export const state = () =>({
  language: 'zh-CN', // 站点默认语言
  test: 'test',
});

export const mutations = {
  setLanguage(state, lang) {
    state.language = lang;
    if (process.browser) { // 非服务端渲染时执行
      localStorage.setItem("language", lang);
    }
  },
  setTest(state, test) {
    state.test = test;
  },
};
