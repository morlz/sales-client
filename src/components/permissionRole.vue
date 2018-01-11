<template>
	<div class="list__item role" :class="{selected: item.selected, edit}">
		<div>{{ item.id }}</div>
		<div @click="permissions_selectItem({ type: 'roles', id: item.id})" class="name" v-if="!edit">{{ item.name }}</div>
		<div class="slider" :class="{hide: permissions_rolesSliderHide}" @click="stopProp" v-if="!edit">
			<el-slider v-model="access_level" :step="1" :max="4" @change="permissions_roleLevelChange({ access_level: $event, item })" :format-tooltip="accessLevel" />
		</div>
		<el-input v-if="edit" v-model="editFields.name"/>
		<div class="buttons" v-if="!edit">
			<el-button size="small" icon="el-icon-edit" @click="edit = true" v-if="auth_can(3, 'Role')"/>
			<el-button size="small" icon="el-icon-delete" @click="permissions_deleteRole(item.id)" v-if="auth_can(4, 'Role')"/>
		</div>

		<div class="buttons" v-if="edit">
			<el-button size="small" icon="el-icon-success" @click="update" v-if="auth_can(3, 'Role')"/>
			<el-button size="small" icon="el-icon-close" @click="edit = false"/>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import fieldDescription from '@/static/fieldDescription'
import mixins from '@/components/mixins'

let { lvls } = fieldDescription

export default {
	mixins: [mixins],
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
			'permissions_roleLevelChange',
			'permissions_deleteRole',
			'permissions_updateRole'
		]),
		...mapMutations([
			"permissions_selectItem"
		]),
		accessLevel: lvl => lvls[lvl],
		stopProp: e => e.stopPropagation(),
		update () {
			this.permissions_updateRole(this.editFields)
			this.edit = false
		}
	},
	computed: {
		...mapGetters([
			'permissions_rolesSliderHide',
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
