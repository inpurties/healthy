import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 初始化和全局配置
import './assets/css/global.css'

// 导入字体图标
import './assets/font/iconfont.css'

// 导入axios
import axios from 'axios'

//挂载axios
Vue.prototype.$http = axios
// 配置请求的根路径
axios.defaults.baseURL = 'http://localhost:9000'



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
