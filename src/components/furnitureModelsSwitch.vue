<template>
	<q-toggle v-model="showModels" label="Список моделей слева"/>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { QToggle } from 'quasar'

export default {
	methods: {
		...mapMutations([
			'auth_settings_showModelsSet'
		])
	},
	components: {
		QToggle
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
