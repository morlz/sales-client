<template>
	<div class="tableCollapsible__row">
		<div class="tableCollapsible__rowColumns" @click="open = !head ? !open : false" v-ripple="!head" :class="{ 'cursor-pointer' : !head, tableCollapsible__rowColumnsHead: head }">
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
import {
	QSlideTransition,
	Ripple
} from 'quasar'

export default {
	props: {
		row: {
			type: Object
		},
		head: {
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

	}

	&__rowColumns {
		position: relative;
		display: grid;
		min-height: 45px;
		box-sizing: border-box;
		grid-gap: 10px;
		grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
		padding: 5px 15px;
		align-items: center;
		transition: all 0.3s ease-in-out;
	}

	&__rowColumnEnd {
		justify-self: end;
	}

	&__rowColumnsHead {
		color: #027be3;
	}

	&__rowCollapcible {

	}
}

.tableCollapsible .cursor-pointer {
	&:hover {
		background: #ecf5ff;
	}
}
</style>
