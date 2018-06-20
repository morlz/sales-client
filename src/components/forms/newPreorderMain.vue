<template>
	<q-card class="NewPreorderMain">
		<q-card-title>Основная информация предзаказа</q-card-title>

		<q-card-main class="NewPreorderMain__inner">
			<q-field helper="Рекламный источник">
				<q-select v-model="form.source" :options="adSource_listSelect" filter/>
			</q-field>

			<q-field>
				<q-input v-model="form.budget" float-label="Бюджет"/>
			</q-field>

			<q-field helper="Вероятность">
				<q-rating v-model="form.chance" :max="5" size="30px"/>
			</q-field>

			<q-field>
				<q-input v-model="form.description" float-label="Примечание" type="textarea"/>
			</q-field>
		</q-card-main>
	</q-card>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from 'vuex'
import { QRating } from 'quasar'

export default {
	components: {
		QRating
	},
	data () {
		return {
			form: {
				source: "",
				budget: "",
				chance: 3,
				description: ""
			}
		}
	},
	watch: {
		local_preorder_mainForm (n) {
			this.preorder_add_set(n)
		}
	},
	computed: {
		...mapGetters([
			'adSource_listSelect'
		]),
		local_preorder_mainForm () {
			return Object.assign({}, this.form)
		}
	},
	methods: {
		...mapActions([
			'adSource_getList'
		]),
		...mapMutations([
			'preorder_add_set'
		])
	},
	mounted () {
		this.adSource_getList()
	}
}
</script>


<style lang="stylus">
.NewPreorderMain
	&__inner
		display grid
		grid-gap 10px
</style>
