<template>
<div class="test">
	<div class="test__layout">
		<q-toolbar color="orange" v-ga="'h'">
			<q-toolbar-title @click="p">Тест</q-toolbar-title>
		</q-toolbar>

		<div class="test__autoSelect" v-ga="'as'" v-show="false">
			<q-list>
				<q-item v-for="auto, index in autos" :key="index">
					<q-item-main>{{ auto.name }}</q-item-main>
				</q-item>
			</q-list>
		</div>

		<div class="test__workSpace" v-ga="'ws'">
			<test-tile :invoice="invoice" v-for="invoice, index in invoices" :key="index" @drag="setActive(index)" :style="{ 'z-index' : invoice.z }"/>
		</div>
	</div>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import {
	QToolbar,
	QToolbarTitle,
	QList,
	QItem,
	QItemMain,
	QCard,
	QCardTitle,
	QCardMain
} from 'quasar'
import { pointer } from 'popmotion'
import testTile from '@/components/pages/test/testTile.vue'


export default {
	data() {
		return {
			autos: [
				{ name: "aaa", space: "300", maxWeight: "900" },
				{ name: "aaa2", space: "300", maxWeight: "1300" },
				{ name: "aaa3", space: "500", maxWeight: "200" },
				{ name: "aaa4", space: "3600", maxWeight: "800" },
			],
			invoices: [
				{
					z: 1,
					show: false,
					client: {
						name: "Иван",
						lastname: "Кочетков",
						patronymic: "Петрович"
					},
					content: [
						{ un: 123, name: "divan", weight: 300, space: 200 },
						{ un: 124, name: "divan 2", weight: 320, space: 200 },
					]
				},
				{
					z: 1,
					show: false,
					client: {
						name: "Василий",
						lastname: "Петров",
						patronymic: "Генадич"
					},
					content: [
						{ un: 123, name: "divan", weight: 300, space: 200 },
					]
				},
				{
					z: 1,
					show: false,
					client: {
						name: "Ибрагим",
						lastname: "Кузнецов",
						patronymic: "Эльдарыч"
					},
					content: [
						{ un: 123, name: "divan", weight: 300, space: 400 },
						{ un: 124, name: "divan 2", weight: 320, space: 100 },
						{ un: 423, name: "divan 4", weight: 120, space: 2000 },
						{ un: 5345, name: "divan 5", weight: 620, space: 5400 },
						{ un: 67867, name: "divan 6", weight: 30020, space: 1 },
					]
				}
			],
			dragZIndexMax: 100
		}
	},
	components: {
		QToolbar,
		QToolbarTitle,
		QList,
		QItem,
		QItemMain,
		QCard,
		QCardTitle,
		QCardMain,
		testTile
	},
	watch: {

	},
	computed: {

	},
	methods: {
		tileEnter: (el, done) => {
			console.log(el);
			setTimeout(() => {
				done ? done() : null
			}, 300)
		},
		p () {
			this.invoices.push({
				z: 1,
				show: false,
				client: {
					name: "Ибрагим",
					lastname: "Кузнецов",
					patronymic: "Эльдарыч"
				},
				content: [
					{ un: 123, name: "divan", weight: 300, space: 400 },
					{ un: 124, name: "divan 2", weight: 320, space: 100 },
					{ un: 423, name: "divan 4", weight: 120, space: 2000 },
					{ un: 5345, name: "divan 5", weight: 620, space: 5400 },
					{ un: 67867, name: "divan 6", weight: 30020, space: 1 },
				]
			})
		},
		setActive (index) {
			this.invoices[index].z = ++this.dragZIndexMax
		}
	},
}
</script>


<style lang="less">
.test {
	height: 100%;
	&__layout {
		height: 100%;
		display: grid;
		grid-template: 	"h	h"	50px
						"as	ws"	1fr
					~"/" min-content 1fr;
	}

	&__autoSelect {
		width: 150px;
	}

	&__workSpace {
		height: 100%;
		position: relative;
		display: grid;
		align-content: start;
		grid-template-columns: repeat(auto-fit, minmax(300px, auto));
	}

	&__moutionTile {
		position: relative;
		color: black;
		background: #F9FBE7;
		cursor: move;
	}
}
.appWrapper .app .main {
	padding: 0;
	margin: 0;
	overflow: auto;
}
</style>
