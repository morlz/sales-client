<template>
	<div
		class="tableCollapsible__row"
		:class="{
			tableCollapsible__rowOpenBordered: open && borderOpen,
			tableCollapsible__rowHover: !head,
			'tableCollapsible__row-head': head
		}">
		<div
			class="tableCollapsible__rowColumns"
			@click="open = !head ? !open : false"
			v-ripple="!head"
			:class="{
				'cursor-pointer': !head,
				tableCollapsible__rowColumnsHead: head,
				tableCollapsible__rowColumnOpen: open,
				'tableCollapsible__rowColumns-mobile': app_view_mobile
			}">
			<slot/>
		</div>

		<q-slide-transition>
			<div class="tableCollapsible__rowCollapcible" v-if="open">
				<slot name="content" :row="row"/>
			</div>
		</q-slide-transition>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import {
	QSlideTransition,
	Ripple
} from 'quasar'

export default {
	props: {
		row: {
			type: [Object, Array]
		},
		head: {
			type: Boolean,
			default: a => false
		},
		borderOpen: {
			type: Boolean,
			default: a => false
		}
	},
	data() {
		return {
			open: false
		}
	},
	watch: {
		open (n) {
			n ? this.$emit('open', this.row) : this.$emit('close', this.row)
		}
	},
	components: {
		QSlideTransition
	},
	directives: {
		Ripple
	},
	computed: {
		...mapGetters([
			'app_view_mobile'
		])
	},
	methods: {
		close () {
			this.open = false
		}
	},
	mounted () {
		this.$on('wannaClose', this.close)
	},
	beforeDestroy () {
		this.$off('wannaClose', this.close)
	}
}
</script>


<style lang="less">
.tableCollapsible {
	&__row {
		border: 1px solid transparent;
		transition: all 0.3s ease-in-out;
	}

	&__rowColumns {
		position: relative;
		word-wrap: break-word;
		display: grid;
		min-height: 45px;
		box-sizing: border-box;
		grid-gap: 10px;
		grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
		padding: 5px 15px;
		align-items: center;
		transition: all 0.3s ease-in-out;

		&-mobile {
			padding: 5px 2px;
		}
	}

	&__rowColumnEnd {
		justify-self: end;
	}

	&__rowColumnsHead {
		color: #027be3;
	}

	&__rowCollapcible {

	}

	&__rowOpenBordered {
		border: 1px solid rgba(2,123,227, 0.5);
	}

	&__rowOpen {

	}

	&__rowHover {
		&:hover {
			background: #ecf5ff;
		}
	}
}
</style>
