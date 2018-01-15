<template>
	<el-switch
		class="showModelsSelect"
		v-model="showModels"
		active-text="Список моделей слева"
		inactive-text="Список моделей в таблице">
	</el-switch>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
	methods: {
		...mapMutations([
			'auth_settings_showModelsSet'
		])
	},
	computed: {
		...mapGetters([
			'auth_settings'
		]),
		showModels: {
			get () {
				return this.auth_settings.showModels
			},
			set (n) {
				this.auth_settings_showModelsSet(n)
			}
		}
	}
}
</script>


<style lang="less"></style>
