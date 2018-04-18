<template>
<div class="tableSSPopoverWrapper">
	<div v-if="one">{{ field }}</div>
	<q-popover
		class="TableSSPopover"
		v-model="open"
		v-if="!one"
		ref="tableSSPopover"
		:title="label"
		trigger="hover">
		<ul class="tableSSPopover" v-html="popoverContent"/>
	</q-popover>
	<div v-if="!one" @mouseenter="open = !open" @mouseleave="open = !open" v-html="fieldMany"/>
</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

//`tablePopoverC${columnIndex}R${index}`

export default {
	props: ['one', 'arr', 'fields', 'label'],
	data () {
		return {
			open: false
		}
	},
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


<style lang="stylus">
.TableSSPopover
	box-shadow 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12)

	ul
		padding 0 20px
		display grid
		align-items center
		li
			padding 5px
			list-style none
			&:not(:last-child)
				border-bottom 1px solid #eee
</style>
