<template>
	<div class="mainWrapper">
		<el-tabs tab-position="top">
			<el-tab-pane label="Все">
				<tabless :data="someData" :fieldDescription="fieldDescription" :key="1" />
			</el-tab-pane>

			<el-tab-pane label="Оплаченые">
				<tabless :data="oplata" :fieldDescription="fieldDescription" :key="2" />
			</el-tab-pane>

			<el-tab-pane label="Не оплаченые">
				<tabless :data="neOplata" :fieldDescription="fieldDescription" :key="3" />
			</el-tab-pane>

			<el-tab-pane label="Закрытые">
				<tabless :data="closed" :fieldDescription="fieldDescription" :key="4" />
			</el-tab-pane>

			<el-tab-pane label="Подиум">
				<tabless :data="podium" :fieldDescription="fieldDescription" :key="5" />
			</el-tab-pane>

			<el-tab-pane label="Экспорт в 1с">
				<tabless :data="c1" :fieldDescription="fieldDescription" :key="6" />
			</el-tab-pane>

			<el-tab-pane label="Отказ">
				<tabless :data="otkaz" :fieldDescription="fieldDescription" :key="7" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>



<script>

	// счета


let someData = [
	{ id: 1, name: "Вася", phone: "12344", email: "1asasddf@sdf.dd", somedata: "11111", oplata: 1, closed: 1, c1: 1, podium: 1, otkaz: 1 },
	{ id: 2, name: "юля", phone: "12312344", email: "s@ssssdf.dd", somedata: "123123", oplata: 1, closed: 0, c1: 1, podium: 0, otkaz: 0 },
	{ id: 123, name: "Галя", phone: "56712344", email: "asd@sdf.dd", somedata: "5354", oplata: 0, closed: 0, c1: 1, podium: 0, otkaz: 0 },
	{ id: 4, name: "Петя", phone: "164562344", email: "1asвdf@sdf.dd", somedata: "56767", oplata: 0, closed: 1, c1: 1, podium: 0, otkaz: 0 },
	{ id: 5, name: "ыва", phone: "12456344", email: "1asasddf@sdf.dd", somedata: "fgh", oplata: 1, closed: 0, c1: 1, podium: 0, otkaz: 1 },
	{ id: 77, name: "Вавввввся", phone: "14562344", email: "1aasвыаdsdf@sdf.dd", somedata: "2342", oplata: 1, closed: 1, c1: 1, podium: 1, otkaz: 0 },
	{ id: 727, name: "234234", phone: "14562311244", email: "1aaваsdsdf@sdf.dd", somedata: "2342", oplata: 0, closed: 0, c1: 0, podium: 1, otkaz: 1 },
	{ id: 771, name: "Вавввввся", phone: "1456223344", email: "1aasdsdf@sываdf.dd", somedata: "2342", oplata: 1, closed: 1, c1: 1, podium: 1, otkaz: 0 },
]

let fieldDescription = [
	{ field: "id", label: "id", type: "number" },
	{ field: "name", label: "Имя", type: "string" },
	{ field: "phone", label: "Телефон", type: "string" },
	{ field: "email", label: "Email", type: "string" },
	{ field: "somedata", label: "любые даные", type:"string" },
	{ field: "oplata", label: "Оплата", type:"boolean" },
	{ field: "lalalal", label: "фывфыв", type:"string" },
	{ field: "lalalal", label: "фывфыв", type:"string" },
	{ field: "lalalal", label: "фывфыв", type:"string" },
]


import tabless from '@/components/tableSS.vue'

export default {
	data () {
		return {
			someData,
			fieldDescription
		}
	},
	components: {
		tabless
	},
	computed: {
		data () {
			return this.someData
		},
		oplata () {
			return this.data.filter(el => el.oplata)
		},
		neOplata () {
			return this.data.filter(el => !el.oplata)
		},
		closed () {
			return this.data.filter(el => !el.closed)
		},
		podium () {
			return this.data.filter(el => el.podium)
		},
		c1 () {
			return this.data.filter(el => el.c1)
		},
		otkaz () {
			return this.data.filter(el => el.otkaz)
		}
	}
}

</script>



<style lang="less" scoped>


</style>
