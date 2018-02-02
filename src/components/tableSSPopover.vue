<template>
<div class="tableSSPopoverWrapper">
	<div v-if="one">{{ field }}</div>
	<el-popover
		v-if="!one"
		ref="tableSSPopover"
		:title="label"
		trigger="hover">
		<ul class="tableSSPopover" v-html="popoverContent"/>
	</el-popover>
	<div v-if="!one" v-popover:tableSSPopover v-html="fieldMany"/>
</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

//`tablePopoverC${columnIndex}R${index}`

export default {
	props: ['one', 'arr', 'fields', 'label'],
	computed: {
		field () {
			return this.fields.map(field => this.arr[0] ? this.arr[0][field] : '').join(" ")
		},
		popoverContent () {
			return this.arr.map(el => this.fields.map(field => el[field]).join(" "))
				.map(el => `<li>${el}</li>`)
				.join("")
		},
		fieldMany () {
			return this.field + `<br>И ещё ${this.arr.length - 1}...`
		}
	}
}
</script>


<style lang="less">

</style>
