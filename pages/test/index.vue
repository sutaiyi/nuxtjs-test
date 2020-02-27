<template>
  <div>
      <h2>This Test</h2>
      <p>------------</p>
      <nuxt-link to="/">首页(nuxt-link)</nuxt-link>
      <p>------------</p>
      <router-link to="/">首页(router-link)</router-link>
      <p>------------</p>
      <div>
        <a href="javascript:;" @click="handleToDetail(id)">进入详情({{id}})</a>
      </div>
      <p>----- Vuex Store-------</p>
      <div>
        <el-button @click="$router.push('/')">
            Vuex Store 状态管理
            <span class="el-icon-aim"></span>
            {{$store.state.test}}
          </el-button>
      </div>
  </div>
</template>

<script>
export default {
  head () {
    return {
      title: 'test',
      meta: [
        { hid: 'test1', name: 'test2', content: 'test3' }
      ]
    }
  },
  data() {
    return {
      id: 1000023
    }
  },
  methods: {
    handleToDetail(id) {
      this.$router.push({
        name: 'test-id',
        params: { id }
      })
    }
  },
}
</script>