import Vue from "vue";
import VueI18n from 'vue-i18n'
import messages from '~/utils/lang'
// import ElementLocale from 'element-ui/lib/locale'
Vue.use(VueI18n)

export default ({ app, store }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: store.state.language,
    fallbackLocale: store.state.language,
    messages
  });
  
  app.i18n.path = (link) => {
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${link}`;
    }
    return `/${app.i18n.locale}/${link}`;
  }
  // // 配置element-ui的组件国际化
  // ElementLocale.i18n((key, value) => app.i18n.t(key, value))
}