<template>
	<div class="list__item controller" :class="{selected: item.selected, edit}" :key="item.id">
		<div>{{ item.id }}</div>
		<div @click="permissions_selectItem({ type: 'controllers', id: item.id})" class="name" v-if="!edit">{{ item.name }}</div>
		<div class="slider" :class="{hide: permissions_controllersSliderHide}" @click="stopProp" v-if="!edit">
			<el-slider v-model="access_level" :step="1" :max="4" @change="permissions_controllerLevelChange({ access_level: $event, item })" :format-tooltip="accessLevel" />
		</div>
		<el-input v-if="edit" v-model="editFields.name"/>
		<div class="buttons" v-if="!edit">
			<el-button size="small" icon="el-icon-edit" @click="edit = true"/>
			<el-button size="small" icon="el-icon-delete" @click="permissions_deleteController(item.id)" />
		</div>

		<div class="buttons" v-if="edit">
			<el-button size="small" icon="el-icon-success" @click="update"/>
			<el-button size="small" icon="el-icon-close" @click="edit = false"/>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import fieldDescription from '@/static/fieldDescription'

let { lvls } = fieldDescription

export default {
	props: ["content"],
	data () {
		return {
			access_level: 0,
			edit: false,
			editFields: {}
		}
	},
	watch: {
		item (n) {
			this.access_level = n.access_level
		}
	},
	methods: {
		...mapActions([
			'permissions_controllerLevelChange',
			'permissions_deleteController',
			'permissions_updateController'
		]),
		...mapMutations([
			"permissions_selectItem"
		]),
		accessLevel: lvl => lvls[lvl],
		stopProp: e => e.stopPropagation(),
		update () {
			this.permissions_updateController(this.editFields)
			this.edit = false
		}
	},
	computed: {
		...mapGetters([
			'permissions_controllersSliderHide',
		]),
		item () {
			this.editFields = Object.assign({}, this.content)
			this.access_level = this.content.access_level
			return this.content || {}
		}
	}
}
</script>


<style lang="less">
	.edit {
		.el-input {
			width: 100%;
			height: 38px;
		}
	}
</style>
