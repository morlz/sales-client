<template>
	<el-card class="card mainInfo">
		<h2 slot="header">Основная информация</h2>

		<el-form label-width="100px">
			<el-form-item label="Источник">
				<el-select v-model="form.source" placeholder="Выбирите рекламный источник">
					<el-option v-for="item in adSources" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>

			<el-form-item label="Бюджет">
				<el-input v-model="form.butget" placeholder="Бюджет" />
			</el-form-item>

			<el-form-item label="Веростность">
				<el-rate v-model="form.chance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" />
			</el-form-item>

			<el-form-item label="Примечание">
				<el-input type="textarea" v-model="form.description" placeholder="Примечание" />
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from 'vuex'
import fieldDescription from '@/static/fieldDescription'

let {
	adSources
} = fieldDescription

export default {
	data () {
		return {
			adSources,
			form: {
				source: "",
				butget: "",
				chance: 3,
				description: ""
			}
		}
	},
	watch: {

	},
	methods: {
		...mapActions([

		]),
		...mapMutations([

		])
	},
	computed: {
		...mapGetters([

		])
	}
}
</script>


<style lang="less" scoped>


@media screen and (max-width: 1200px) {

}
</style>
