
module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#f00' },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],
  /*
  ** Plugins to load before mounting the App
  ** plugins/router 配置路由全局管控
  */
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/router',
    '@/plugins/lang'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/proxy'
  ],
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  // 代理配置
  proxy: {
    '/api': {
      target: process.env.NODE_ENV !== 'production' ? 'http://192.168.8.3:8070' : 'https://newdex.vip',
      pathRewrite: {
        '^/api' : '/api'
      }
    }
  },
  
  server: {
    port: 2300, // default: 3000
    host: '0.0.0.0' // default: localhost
  }
}
