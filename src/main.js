import Vue from 'vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from '@/plugins/vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import App from './App.vue'
import VueOffline from 'vue-offline'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

Vue.component('VueSlider', VueSlider)

Vue.use(VueOffline)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  firebase,
  render: function (h) { return h(App) }
}).$mount('#app')
