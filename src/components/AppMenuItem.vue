<template>
<div class="menuItem" @click="clickHandler" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
	<div class="menuItem__icon">
		<i :class="content.icon"/>
	</div>

	<div class="menuItem__name" :style="nameStyles" v-if="name.show">
		{{ content.name }}
	</div>

	<div class="menuItem__childs" v-if="content.childs && open">
		<app-menu-item v-for="item, index in content.childs"
			:key="prefix + '-' + index"
			:content="item"
			:prefix="prefix + '-' + `${index}|${content.childs.length}`"
			ref="childs"
			@in="mouseInHandler($event, index)"
			@out="mouseOutHandler($event, index)"/>
	</div>
</div>
</template>

<script>

export default {
	name: 'AppMenuItem',
	props: {
		content: {
			type: Object,
			required: true
		},
		prefix: {
			type: String,
			required: true
		}
	},
	data () {
		return {
			open: false,
			name: {
				show: false,
				animated: false,
				timeouts: {
					show: false,
					hide: false
				},
				left: 50,
				scale: 1
			}
		}
	},
	computed: {
		nameStyles () {
			return {
				left: `${this.name.left}px`,
				transform: `scale(${this.name.scale})`
			}
		}
	},
	methods: {
		clickHandler (e) {
			e.stopPropagation()
			this.open ? this.$emit('close') : this.$emit('open')
		},
		_open () {
			this.open = true
		},
		_close () {
			this.open = false
		},
		mouseEnter () {
			this.$emit('in', this.prefix)
		},
		mouseLeave () {
			this.$emit('out', this.prefix)
		},
		showName (delay = 0) {
			if (!this.name.timeouts.show)
				this.name.timeouts.show = setTimeout(a => {
					this.showNameAnimation()
					this.name.timeouts.show = false
				}, delay)
		},
		hideName (delay = 0) {
			if (!this.name.timeouts.hide)
				this.name.timeouts.hide = setTimeout(a => {
					this.hideNameAnimation()
					this.name.timeouts.hide = false
				}, delay)
		},
		showNameAnimation () {
			setTimeout(() => {
				this.name.show = true
			}, 300)
		},
		hideNameAnimation () {
			setTimeout(() => {
				this.name.show = false
			}, 300)
		},
		mouseInHandler (e, index) {
			this.$emit('in', this.prefix + (e ? e : ''))
		},
		mouseOutHandler (e, index) {
			this.$emit('out')
		}
	},
	mounted () {
		this.$on('open', e => this._open())
		this.$on('close', e => this._close())
		this.$on('name.show', delay => this.showName(delay))
		this.$on('name.hide', delay => this.hideName(delay))
	},
	beforeDestroy () {
		this.$off('open', e => this._open())
		this.$off('close', e => this._close())
		this.$off('name.show', delay => this.showName(delay))
		this.$off('name.hide', delay => this.hideName(delay))
	}
}
</script>


<style lang="less">
@menuItem-icon-width: 50px;
@menuItem-height: 50px;

.menuItem {
	position: relative;
	min-height: @menuItem-height;

	&__icon {
		width: @menuItem-icon-width;
		height: @menuItem-height;
		display: grid;
		align-items: center;
		justify-content: center;
	}

	&__name {
		position: absolute;
		top: 0;
		//left: @menuItem-icon-width;
		height: @menuItem-height;
		line-height: @menuItem-height;
	}

	&__childs {
		padding-left: 15px;
		position: relative;
	}
}
</style>
