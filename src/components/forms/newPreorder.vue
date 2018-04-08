<template>
<div class="addPreorderFormWrapper" v-if="auth_can(2, 'Preorder')">
	<new-preorder-main-form/>
	<client-select-form/>
	<next-task-form scenario="CREATE_PREORDER">
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
import mixins from '@/mixins'

import newPreorderMainForm from '@/components/forms/newPreorderMain.vue'
import clientSelectForm from '@/components/forms/SelectClient'
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
