<template>
<div class="mainWrapper">
	<el-container>
		<el-aside>
			<h3>Салон</h3>
			<el-select v-model="currentSalon" placeholder="Салон">
				<el-option v-for="salon, index in allSalons" :key="index" :label="salon.label" :value="salon.value"></el-option>
			</el-select>
			<el-table v-if="currentSelectedSalon.furniture && currentSelectedSalon.furniture.length" stripe :data="currentSelectedSalon.furniture" @row-click="selectFuriture">
				<el-table-column prop="name" label="Наименование" />
			</el-table>
		</el-aside>
		<el-main>
			<h3>{{ currentFurniure.name }}</h3>

			<el-tabs tab-position="top">
				<el-tab-pane label="Все">
					<tabless :data="currentFurnitureFormaed" :fieldDescription="fieldDescription" v-if="currentFurniure" />
				</el-tab-pane>

				<el-tab-pane label="Все новые">
					<tabless :data="currentFurnitureFormaed" :fieldDescription="fieldDescription" v-if="currentFurniure" />
				</el-tab-pane>

				<el-tab-pane label="Все проданные">
					<tabless :data="currentFurnitureFormaed" :fieldDescription="fieldDescription" v-if="currentFurniure" />
				</el-tab-pane>

				<el-tab-pane label="Продажи из других салонов">
					<tabless :data="currentFurnitureFormaed" :fieldDescription="fieldDescription" v-if="currentFurniure" />
				</el-tab-pane>
			</el-tabs>
		</el-main>
	</el-container>
	<el-container>
		<el-main v-if="currentFurnitureDetailsFormated">
			<h3>Информация по выбранной модели</h3>
			<el-button>В корзину</el-button>
			<el-button>Перевести в салон</el-button>
			<el-button>Перевести на другой склад</el-button>
			<el-table :data="currentFurnitureDetailsFormated">
				<el-table-column prop="name" label="Наименование" />
				<el-table-column prop="value" label="Значение" />
			</el-table>
		</el-main>
	</el-container>
</div>
</template>



<script>
let allSalons = [{
		label: "test",
		value: 1,
		furniture: [{
				name: "123",
				salon: "asd",
				price: 1234
			},
			{
				name: "ladya",
				salon: "123123",
				price: 222
			},
			{
				name: "sofa",
				salon: "aasffsd",
				cloth2: "kk",
				price: 33333
			},
		]
	},
	{
		label: "testasdf",
		value: 1123,
		furniture: []
	},
	{
		label: "testsadf",
		value: 3,
		furniture: []
	},
	{
		label: "t123t",
		value: 451,
		furniture: []
	},
]

let fieldDescription = [{
		field: "id",
		label: "№ зак."
	},
	{
		field: "salon",
		label: "Салон"
	},
	{
		field: "fab",
		label: "Фаб.н."
	},
	{
		field: "storage",
		label: "М.хр."
	},
	{
		field: "isp",
		label: "Исп."
	},
	{
		field: "timeInStorage",
		label: "Дней на складе"
	},
	{
		field: "cloth1",
		label: "Ткань 1"
	},
	{
		field: "cloth2",
		label: "Ткань 2"
	},
	{
		field: "cloth3",
		label: "Ткань 3"
	},
	{
		field: "cat",
		label: "Кат"
	},
	{
		field: "decor",
		label: "Декор"
	},
	{
		field: "steska",
		label: "Стежка"
	},
	{
		field: "price",
		label: "Цена руб."
	},
]

import { mapMutations } from 'vuex'

import tabless from '@/components/tableSS'

export default {
	components: {
		tabless
	},
	data() {
		return {
			currentSalon: 1,
			currentFurniure: false,
			currentFurnitureDetails: false,
			allSalons,
			fieldDescription
		}
	},
	computed: {
		currentSelectedSalon() {
			return this.allSalons.find(el => el.value == this.currentSalon)
		},
		currentFurnitureDetailsFormated() {
			if (!this.currentFurnitureDetails) return false
			let resArr = []
			this.fieldDescription.map(el => {
				resArr.push({
					name: el.label,
					value: this.currentFurnitureDetails[el.name]
				})
			})
			return resArr
		},
		currentFurnitureFormaed() {
			return [this.currentFurniure]
		}
	},
	methods: {
		selectFuriture(data) {
			this.currentFurniure = data
			this.closeMenu()
		},
		selectFuritureForDetails(data) {
			this.currentFurnitureDetails = data
		},
		...mapMutations([
			'closeMenu'
		])
	}
}
</script>



<style lang="less" scoped>
	.el-main {
		padding: 0;
	}
	.buttons {
		margin: 0 0 10px 0;
	}
</style>
