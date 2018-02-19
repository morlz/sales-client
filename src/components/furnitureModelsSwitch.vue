<template>
	<q-toggle v-model="showModels" label="Список моделей слева"/>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { QToggle } from 'quasar'

export default {
	methods: {
		...mapMutations([
			'main_auth_settings_set'
		])
	},
	components: {
		QToggle
	},
	computed: {
		...mapGetters([
			'main_auth_settings'
		]),
		showModels: {
			get () {
				return this.main_auth_settings.showModels
			},
			set (n) {
				this.main_auth_settings_set({ type: 'showModels', data: n })
			}
		}
	}
}
</script>


<style lang="less"></style>
