import Vue from 'vue'
import Router from 'vue-router'
import * as firebase from 'firebase/app'
import Home from '@/views/Home.vue'
import Monster from '@/views/Monster.vue'
import MonsterList from '@/views/monster/List.vue'
import MonsterView from '@/views/monster/View.vue'
import MonsterAdd from '@/views/monster/Add.vue'
import Vuex from '@/views/Vuex.vue'
import VuexTest from '@/views/vuex/Test.vue'
import VuexTodo from '@/views/vuex/Todo.vue'
import VuexBoxOffice from '@/views/vuex/BoxOffice.vue'
import NotFound from '@/views/NotFound.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'

Vue.use(Router)

/*
몬스터 홈(=리스트):
기본 URL/monster

몬스터 보기:
기본 URL/monster/view/1 (숫자만 입력 가능)

몬스터 추가하기:
기본 URL/monster/add
*/

const router = new Router({
	/*
	hash 모드와 history 모드의 차이점
	hash 모드: 기본 URL/#/monster
	history 모드: 기본 URL/monster
	
	hash 모드는 URL에 #가 붙으며, URL이 변경될 때 페이지가 다시 로드되지 않습니다.
	한 번 로드한 컴포넌트를 재사용하기 때문에 URL의 파라미터가 변경되어도 내부 컴포넌트의 라이프사이클 훅을 다시 호출하지 않는 것입니다.
	history 모드는 URL에 #가 없으며, HTML5 history.pushState API를 활용함, 잘못된 페이지에 접속하면 404 오류를 반환, 서버에서 대체 경로를 설정해주어야 함
	*/
	
	mode: 'history',
	routes: [
		{ path: '/', name: 'home', meta: { title: '첫 화면' }, component: Home },
		{ path: '/monster', meta: { title: '몬스터' }, component: Monster,
			children: [
				{ path: '', name: 'monster', meta: { title: '몬스터 리스트' }, component: MonsterList },
				{ path: 'view/:id(\\d+)', name: 'monsterView', meta: { title: '몬스터 정보 보기', useMenu: false }, component: MonsterView, props: true },
				{ path: 'add', name: 'monsterAdd', meta: { title: '몬스터 추가하기' }, component: MonsterAdd }
			]
		},
		{ path: '/vuex', meta: { title: 'Vuex 실습' }, component: Vuex,
			children: [
				{ path: 'example', name: 'vuexTest', meta: { title: 'Vuex 기초' }, component: VuexTest },
				{ path: 'todo', name: 'vuexTodo', meta: { title: 'Vuex To Do List' }, component: VuexTodo },
				{ path: 'boxoffice', name: 'vuexBoxOffice', meta: { title: 'Vuex 박스오피스', requireAuth: true }, component: VuexBoxOffice }
			]
		},
		{ path: '/login', name: 'login', meta: { title: '로그인', useMenu: false }, component: Login },
		{ path: '/profile', name: 'profile', meta: { title: '내 정보', useMenu: true }, component: Profile },
		{ path: '/404', name: 'notFound', meta: { title: '페이지를 찾을 수 없습니다.', useMenu: false }, component: NotFound },
		{ path: '*', meta: { title: '페이지를 찾을 수 없습니다.', useMenu: false }, component: NotFound },
	]
})

router.beforeEach((to, from, next) => {
	console.log(`라우트 이동 시 무조건 beforeEach() 호출`)
	let isRequireAuth = to.matched.some((route) => {
		return route.meta.requireAuth
	})
	if (isRequireAuth) {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				next()
			} else {
				alert(`로그인이 필요한 페이지입니다.\n로그인 해 주세요!`)
				next({ path: '/login' })
			}
		})
	} else {
		console.log(`일반 페이지입니다.`)
		next()
	}
})

export default router
