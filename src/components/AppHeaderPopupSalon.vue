<template>
<div class="salonWrapper">
	<template v-if="auth_can(1, 'Salon')">
		<select-current-salon-form v-model="modal"/>

		<q-btn class="salonPopoverToggleButton" flat wait-for-ripple @click="modal = !modal">
			<q-icon name="fa-building" v-if="app_view_mobile"/>
			<template v-if="!app_view_mobile">
				{{ auth_currentSalon ? auth_currentSalon.NAME : '...' }}
			</template>
		</q-btn>
	</template>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'
import SelectCurrentSalonForm from '@/components/forms/SelectCurrentSalon'
import { AuthMixin } from '@/mixins'

export default {
	components: {
		SelectCurrentSalonForm
	},
	mixins: [AuthMixin],
	data() {
		return {
			modal: false,
		}
	},
	computed: {
		...mapGetters([
			'app_view_mobile',
			'auth_currentSalon'
		])
	}
}
</script>


<style lang="less">
.salonWrapper {
    .salonPopoverToggleButton {
        cursor: pointer;
        box-sizing: border-box;
        color: #fff;
        transition: all 0.3s ease-in-out;
        background-color: #027be3;
		&:hover {
			background-color: #1565c0;
		}
    }
}
</style>
