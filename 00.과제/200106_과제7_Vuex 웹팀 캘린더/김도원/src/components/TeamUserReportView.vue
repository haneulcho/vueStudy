<template>
	<div>
		<div class="group">
			<h2 v-if="user.part == 'design'"><v-icon>color_lens</v-icon>디자인 파트</h2>
			<h2 v-else-if="user.part == 'ui'"><v-icon>crop</v-icon>UI 파트</h2>
			<h2 v-else-if="user.part == 'dev'"><v-icon>developer_mode</v-icon>개발 파트</h2>
			<h2 v-else>등록된 파트가 없습니다.</h2>

			<h3>{{ user.name }}</h3>

			<p>최다 협업상</p>
			<ul>
				<li v-for="(user, index) in result" :key="user.name" v-if="index < 3">{{user.name}}: {{user.count}}</li>
			</ul>
			<template v-if="user.lastProjects.length">
				<p class="txt_count">2018.05 ~ 2019.12 담당 프로젝트 수 <span class="count">{{ user.lastProjects.length }}</span>건 (Full <span class="count">{{ getFullpageCount(user.lastProjects) }}</span>건)</p>
				<ProjectTable :list="user.lastProjects" />
			</template>
			<v-btn class="btn_goBack" depressed dark small @click="goToUserList"><v-icon>chevron_left</v-icon> 목록</v-btn>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import ProjectTable from '@/components/common/ProjectTable.vue'

export default {
	components: {
		ProjectTable
	},
	data: () => ({
		ui: {},
		design: {},
		dev: {},
		result: {}
	}),
	created() {
		if (!this.projects.length) {
			this.fetchProject()
		}

		this.concatAllPartner()
	},
	computed: {
		...mapState('calendar', [
			'users'
		]),
		...mapGetters('report', [
			'projects'
		]),
		...mapGetters('calendar', [
			'getUser', 'getFullpageCount'
		]),
		user() {
			return this.getUser(this.$route.params.id)
		}
	},
	methods: {
		...mapActions('report', [
			'fetchProject', 'fetchLastProject'
		]),
		...mapActions('calendar', [
			'goToUserList'
		]),
		cooperPartnerUi(){

			this.ui = this.user.lastProjects.map( (item, idx) => {
				return item.ui
			}).reduce(function (allNames, name) { 
				if (name in allNames) {
					allNames[name]++
				}
				else {
					allNames[name] = 1
				}
				return allNames
			}, {})

		},
		cooperPartnerDev(){

			this.dev = this.user.lastProjects.map( (item, idx) => {
				return item.dev
			}).reduce(function (allNames, name) { 
				if (name in allNames) {
					allNames[name]++
				}
				else {
					allNames[name] = 1
				}
				return allNames
			}, {})


		},
		cooperPartnerDesign(){
			this.design = this.user.lastProjects.map( (item, idx) => {
				return item.design
			}).reduce(function (allNames, name) { 
				if (name in allNames) {
					allNames[name]++
				}
				else {
					allNames[name] = 1
				}
				return allNames
			}, {})

		},
		concatAllPartner(){

			this.cooperPartnerDesign()
			this.cooperPartnerUi()
			this.cooperPartnerDev()

			this.result = Object.entries({...this.design, ...this.ui, ...this.dev}).map( (item) => {
				var obj = {
					name : item[0],
					count : item[1]
				}
				return obj
			}).filter( (item) => {
				return (item.name !== this.user.name) && (item.name !== '-')
			}).sort( (a, b) => b.count - a.count )

		}
	}
}
</script>

<style scoped>
	.group {clear:both;overflow:hidden;margin-bottom:25px}
	.group:first-child {margin-top:10px}
	.group:last-child {margin-bottom:0}
	.group > h2 {margin-bottom:10px;color:#32325d}
	.group > h2 .v-icon {margin-right:3px;vertical-align:-3.5px;color:#32325d}
	.group .btn_goBack {display:block;width:75px;height:40px;margin:20px auto 0;border-radius:6.5px;background:linear-gradient(50deg,#6f68e4 0,#2dcecc 100%) !important;box-shadow:0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08) !important}
	.group .btn_goBack >>> .v-icon {line-height:18px}
	.group > h3 {float:left;margin-right:15px;font-size:1.7rem;font-weight:bold;color:#6b6ae4}
	.group > p {position:relative;font-size:0.9rem;color:#525f7f}
	.group > p.txt_count {float:left;margin-bottom:20px}
	.group > h3, .group > p {line-height:28px}
	.group > p:after {display:block;content:'';clear:both}
	.group .count {color:#f5365c;font-weight:bold}
</style>