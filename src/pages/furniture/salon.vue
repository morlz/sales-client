<template>
<div class="mainWrapper">
	<el-container>
		<el-aside>
			<h3>Салон</h3>
			<el-select v-model="currentSalon" filterable placeholder="Салон">
				<el-option v-for="salon, index in salonsList" :key="index" :label="salon.NAME" :value="salon.id" />
			</el-select>

			<el-table v-if="false && currentSelectedSalon.furniture.length" stripe :data="currentSelectedSalon.furniture" @row-click="selectFuriture">
				<el-table-column prop="name" label="Наименование" />
			</el-table>
		</el-aside>
		<el-main>
			<h3>123123</h3>

			<el-tabs tab-position="top">
				<el-tab-pane label="Все">
					<tabless :data="currentFurnitureFormaed" :fieldDescription="furnitureSalonFieldDescription"/>
				</el-tab-pane>

				<el-tab-pane label="Все новые">
					<tabless :data="currentFurnitureFormaed" :fieldDescription="furnitureSalonFieldDescription"/>
				</el-tab-pane>

				<el-tab-pane label="Все проданные">
					<tabless :data="currentFurnitureFormaed" :fieldDescription="furnitureSalonFieldDescription"/>
				</el-tab-pane>

				<el-tab-pane label="Продажи из других салонов">
					<tabless :data="currentFurnitureFormaed" :fieldDescription="furnitureSalonFieldDescription"/>
				</el-tab-pane>
			</el-tabs>
		</el-main>
	</el-container>
</div>
</template>



<script>

import fieldDesription from '@/static/fieldDescription'

let {
	furnitureSalonFieldDescription
} = fieldDesription

import { mapGetters, mapActions, mapMutations } from 'vuex'

import tabless from '@/components/tableSS'

export default {
	components: {
		tabless
	},
	data() {
		return {
			furnitureSalonFieldDescription,
			currentSalon: 0
		}
	},
	watch: {
		currentUserSalon (n) {
			this.currentSalon = n
		}
	},
	computed: {
		...mapGetters([
			'salonsList',
			'salonsListLoading',
			'currentUserSalon'
		]),
		currentFurnitureFormaed () {
			return []
		},
		isAllSalons () {
			return this.currentSalon == 999
		}
	},
	methods: {
		...mapActions([
			'getSalonsList'
		])
	},
	mounted () {
		this.currentSalon = this.currentUserSalon
		this.getSalonsList()
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
