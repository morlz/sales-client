<template>
	<q-datetime
		v-bind="$props"
		:day-names="i18n_days"
		:month-names="i18n_months"
		ok-label="Ок"
		clear-label="Очистить"
		cancel-label="Отмена"
		@input="handleEvent('input', $event)"/>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import { QDatetime } from 'quasar'

export default {
	props: ['value'],
	components: {
		QDatetime
	},
	computed: {
		...mapGetters([
			'i18n_months',
			'i18n_days'
		]),
	},
	methods: {
		handleEvent(name, value) {
			this.$emit(name, value)
		}
	}
}
</script>


<style lang="less">

</style>
