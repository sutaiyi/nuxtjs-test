<template>
  <div class="container">
    <div>
      <logo />
      <h2 class="subtitle">
        nuxtjs 
      </h2>
      <div class="links">
        <a href="javascript:;" @click="handleToTest('test')" target="_blank" class="button--green">
          进入路由测试
        </a>
      </div>
      <div class="boxmain">
        <div class="box axiosbox">
          <el-button @click="handleAxiosTest">Axios 数据请求 Test</el-button>
          <div style="margin: 20px 0 0">
            <pre v-if="axiosResult">{{axiosResult}}</pre>
          </div>
        </div>

        <div class="box langbox">
          <el-tooltip class="item" effect="dark" content="请选择语言" placement="top">
            <el-button>{{$t('public.intlization')}}</el-button>
          </el-tooltip>
          <div style="margin: 20px 0 0">
            <el-select v-model="langValue" placeholder="请选择"
            @change="handleLangChange">
              <el-option
                v-for="item in langOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="box langbox">
          <el-button @click="handleToTest('test')">
            Vuex Store 状态管理
            <span class="el-icon-aim"></span>
          </el-button>
          <div style="margin: 20px 0 0">
            当前值：{{$store.state.test}}
          </div>
          <p>&nbsp;</p>
          <el-input v-model="testStoreInput"
          @input="handleChangeTestStore"
          placeholder="请输入内容"></el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import { common } from "~/utils/service"

export default {
  head () {
    return {
      title: 'Nuxtjs test',
      meta: [
        { name: 'Nuxtjs test <name>', content: 'Nuxtjs test <content>' }
      ]
    }
  },
  data() {
    return {
      axiosResult: null,
      langOptions: [{
        value: 'en',
        label: 'EN'
      }, {
        value: 'ko',
        label: '한국어'
      }, {
        value: 'zh-TW',
        label: '繁體'
      }, {
        value: 'zh-CN',
        label: '简体'
      }],
      langValue: null,
      testStoreInput: '',
    }
  },
  components: {
    Logo
  },
  fetch() {
  },
  created() {
  },
  mounted() {
    // 国际化 初始化
    const language = localStorage.getItem('language') ||
    this.$store.state.language;
    this.langValue = language;
    this.handleLangChange();
  },

  methods: {
    // 路由测试
    handleToTest(name) {
      console.log(this.$route, this.$router, name);
      this.$router.push({ name })
    },
    // axios 数据请求 测试
    async handleAxiosTest() {
      const { status, result } = await common.getCommonParam();
      this.axiosResult = { status, result };
    },

    // vue i18n 国际化
    async handleLangChange() {
      this.$i18n.locale = this.langValue;
      await this.$store.commit('setLanguage', this.langValue);
    },

    // Vuex store 测试
    handleChangeTestStore() {
      this.$store.commit('setTest', this.testStoreInput)
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.boxmain {
  display: flex;
  padding: 50px;

  

  .box {
    padding: 0 30px;

    pre {
      padding: 10px;
      background: #f5f5f5;
      border: 1px solid #dedede;
      text-align: left;
      border-radius: 5px;
    }
  }
}
</style>
