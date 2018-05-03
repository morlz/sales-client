<template>
<div class="NewPreorderForm" v-if="auth_can(2, 'Preorder')">
	<new-preorder-main-form/>
	<client-select-form/>
	<next-task-form scenario="CREATE_PREORDER">
		<div class="buttons" slot="buttons">
			<q-btn color="primary" @click="onAddForm">Создать предзаказ</q-btn>
			<q-btn color="secondary" @click="goBack" flat>Отмена</q-btn>
		</div>
	</next-task-form>
</div>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from 'vuex'
import fieldDescription from '@/static/fieldDescription'
import { AuthMixin } from '@/mixins'

import newPreorderMainForm from '@/components/forms/newPreorderMain.vue'
import clientSelectForm from '@/components/forms/SelectClient'
import nextTaskForm from '@/components/forms/nextTask.vue'

let {
	taskTypes,
} = fieldDescription


export default {
	mixins: [AuthMixin],
	components: {
		newPreorderMainForm,
		clientSelectForm,
		nextTaskForm
	},
	methods: {
		...mapActions([
			'preorder_createNew'
		]),
		onAddForm() {
			this.preorder_createNew()
		},
		goBack () {
			this.$emit("goBack")
		}
	},
}
</script>


<style lang="stylus" scoped>
.NewPreorderForm
	padding 10px
	display grid
	grid-gap 10px
	grid-template-columns repeat(auto-fit, minmax(300px, 1fr))
    h2
		margin-left 20px


</style>
