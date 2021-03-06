import 'babel-polyfill'
import Vue from 'vue'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App.vue'
import store from './store'
import router from './router'

Vue.config.productionTip = false
Vue.use(BootstrapVue)

new Vue({
	store,
	router,
	render: h => h(App)
}).$mount('#app')
