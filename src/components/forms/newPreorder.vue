<template>
<div class="addPreorderFormWrapper" v-if="auth_can(2, 'Preorder')">
	<new-preorder-main-form/>
	<client-select-form/>
	<next-task-form>
		<div class="buttons" slot="buttons">
			<el-button type="primary" @click="onAddForm">Создать предзаказ</el-button>
			<el-button type="danger" @click="goBack">Отмена</el-button>
		</div>
	</next-task-form>
</div>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from 'vuex'
import fieldDescription from '@/static/fieldDescription'
import mixins from '@/components/mixins'

import newPreorderMainForm from '@/components/forms/newPreorderMain.vue'
import clientSelectForm from '@/components/forms/clientSelect.vue'
import nextTaskForm from '@/components/forms/nextTask.vue'

let {
	taskTypes,
} = fieldDescription


export default {
	mixins: [mixins],
	components: {
		newPreorderMainForm,
		clientSelectForm,
		nextTaskForm
	},
	data () {
		return {

		}
	},
	watch: {

	},
	methods: {
		...mapActions([

		]),
		...mapMutations([

		]),
		onAddForm() {

		},
		goBack () {
			this.$emit("goBack")
		}
	},
	computed: {
		...mapGetters([

		]),
		data() {

		}
	}
}
</script>


<style lang="less" scoped>
.addPreorderFormWrapper {
	display: grid;
	grid-gap: 20px;
	grid-template-columns: repeat(auto-fit, minmax(450px, auto));
    h2 {
        margin-left: 20px;
    }
	padding-bottom: 10px;
}

@media screen and (max-width: 1200px) {
    .addPreorderFormWrapper {

    }
}
</style>
