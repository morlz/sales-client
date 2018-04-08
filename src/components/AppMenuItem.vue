<template>
<div
	class="menuItem"
	:is="isLink"
	:to="content.path || ''"
	:class="{ currentRouteItem }"
	@click.stop="clickHandler">
	<div class="menuItem__icon" :style="iconStyle" :class="{ 'menuItem__icon-initial' : initial }" v-ripple="iconRipple"
		@mouseover.stop="mouseEnter"
		@mouseout.stop="mouseLeave">
		<i :is="iconType" :class="content.icon" :name="content.icon"/>
	</div>

	<transition :css="false" @enter="showNameAnimation" @leave="hideNameAnimation">
		<div class="menuItem__name" :style="nameStyles" v-show="nameShow">
			{{ content.name }}
			<q-icon :name="openStateIcon" v-if="openStateIcon" class="menuItem__openStateButton"/>
		</div>
	</transition>

	<q-slide-transition>
		<div class="menuItem__childs" v-if="content.childs" v-show="childsShow" @click.stop>
			<app-menu-item
				v-for="item, index in content.childs"
				ref="childs"
				:key="currentIndex + '-' + index"
				:currentIndex="currentIndex + '-' + index"
				:content="item"
				:recursion-count="recursionCount + 1"
				@spread="spreadHandler($event, index)"
				@spreadTop="spreadTopHandler($event, index)"
				@spreadBottom="spreadBottomHandler($event, index)"
				@current="childCurrentRouteHandler"/>
		</div>
	</q-slide-transition>
</div>
</template>

<script>

import { mapGetters } from 'vuex'
import { tween, timeline, easing } from 'popmotion'
import throttle from 'lodash.throttle'
import { QSlideTransition, Ripple, QIcon, QItem } from 'quasar'

export default {
	name: 'AppMenuItem',
	props: {
		content: {
			type: Object,
			required: true
		},
		currentIndex: {
			type: String,
			default: a => "0"
		},
		initial: {
			type: Boolean,
			default: a => false
		},
		recursionCount: {
			type: Number,
			default: a => 0
		}
	},
	components: {
		QSlideTransition,
		QIcon
	},
	directives: {
		Ripple
	},
	data () {
		return {
			visualize: '#fff',
			open: false,
			spreadTimeout: false,
			name: {
				show: false,
				_show: false,
				styles: {
					left: -200,
					scale: 0.7,
					opacity: 0
				},
				_tween: false,
				duration: 300
			},
			speed: 30
		}
	},
	watch: {
		app_view_desktop (n) {
			n ? this.$emit('name.hide') : this.$emit('name.show')
		}
	},
	computed: {
		...mapGetters ([
			'app_view_desktop',
			'nav_namesShow'
		]),
		nameStyles () {
			return {
				left: `${this.name.styles.left}px`,
				transform: `scale(${this.name.styles.scale})`,
				opacity: this.name.styles.opacity,
				width: `${this.nameWidth}px`,
				'padding-left': `${this.iconPaddingLeft}px`,
				'padding-right': `${this.iconPaddingRight}px`,
				'box-shadow': !this.app_view_desktop ? 'none' : '2px 4px 3px -1px rgba(0, 0, 0, 0.2)'
			}
		},
		iconStyle () {
			return {
				//background: this.visualize,
				'padding-left': `${this.iconPaddingLeft}px`,
				'padding-right': `${this.iconPaddingRight}px`
			}
		},
		iconType () {
			if (!this.content.icon) return 'i'
			return this.content.icon.indexOf('el-icon') == 0 ? 'i' : 'q-icon'
		},
		iconPaddingLeft () {
			return this.recursionCount * 15
		},
		iconPaddingRight () {
			let p = 30 - this.recursionCount * 15
			if (p < 0) return 0
			return p
		},
		iconRipple () {
			return typeof this.content.click == 'function' && !this.app_view_desktop
		},
		nameWidth () {
			return 220
		},
		currentRouteItem () {
			return this.$route.path == this.content.path
		},
		isLink () {
			return this.content.path ? QItem : 'div'
		},
		childsShow () {
			return this.open || this.initial
		},
		nameShow () {
			return this.name.show
		},
		openStateIcon () {
			return 	this.content.childs ?
						this.open ?
							'keyboard_arrow_up'
						:	'keyboard_arrow_down'
					:	false
		}
	},
	methods: {
		clickHandler (e) {
			if (typeof this.content.click == 'function')
				if ( this.content.click(e, this.content) ) return

			this.open ? this.$emit('close') : this.$emit('open')

			if (this.initial)
				return this.applyBottom(!this.open)

			if (this.content.path)
				router.push(this.content.path)

		},
		_open () {
			this.open = true
		},
		_close () {
			this.open = false
		},
		mouseEnterThrottled (e) {
			return throttle(this.mouseEnter, 50)
		},
		mouseLeaveThrottled (e) {
			return throttle(this.mouseLeave, 50)
		},
		mouseEnter (e) {
			if (!this.app_view_desktop || this.nav_namesShow) return
			this.showName(0, 1)
			//this.$emit('spread', true)
		},
		mouseLeave (e) {
			if (!this.app_view_desktop || this.nav_namesShow) return
			this.hideName(0, 1)
			//this.$emit('spread', false)
		},
		showName (delay = 0, duration) {
			setTimeout(a => {
				if (duration) this.name.duration = duration
				this.name.show = true
				if (duration) setTimeout(a => this.name.duration = 300, duration)
			}, delay)
		},
		hideName (delay = 0, duration) {
			setTimeout(a => {
				if (duration) this.name.duration = duration
				this.name.show = false
				if (duration) setTimeout(a => this.name.duration = 300, duration)
			}, delay)
		},
		showNameAnimation (el, complete) {
			if (this.name._tween) this.name._tween.stop()
			//tween({ from: this.name.styles, to: { left: 50, scale: 1 }, duration: 300 })
			timeline([
				[
					{ track: 'left', from: this.name.styles.left, to: 50 + 30, duration: this.name.duration, ease: easing.easeOut },
					{ track: 'opacity', from: this.name.styles.opacity, to: 1, duration: this.name.duration, ease: easing.easeOut },
				],
				{ track: 'scale', from: this.name.styles.scale, to: 1, duration: this.name.duration },
			])
			.start({ update: v => this.name.styles = v, complete })
		},
		hideNameAnimation (el, complete) {
			//this.name._tween = tween({ from: this.name.styles, to: { left: -50, scale: 0.8 }, duration: 300 })
			timeline([
				{ track: 'scale', from: this.name.styles.scale, to: 0.7, duration: this.name.duration },
				[
					{ track: 'left', from: this.name.styles.left, to: -200, duration: this.name.duration, ease: easing.easeIn  },
					{ track: 'opacity', from: this.name.styles.opacity, to: 0, duration: this.name.duration, ease: easing.easeIn  }
				]
			])
			.start({ update: v => this.name.styles = v, complete })
		},
		// apply for prev child
		spreadTop (e, index) {
			this.visualize = e ? 'lightblue' : 'lightred'
			if (this.$refs.childs[index - 1]) {
				this.applyPrevChild(e, index)
			} else {
				if (this.$refs.childs[index])
					this.applySelf(e)
				this.$emit('spreadTop', e)
			}
		},
		//apply for next child
		spreadBottom (e, index) {
			this.visualize = e ? 'lightblue' : 'lightred'

			if (this.$refs.childs[index + 1]) {
				this.applyNextChild(e, index)
			} else {
				this.$emit('spreadBottom', e)
			}
		},
		//apply top for current item
		applyTop (e, index) {
			this.visualize = e ? 'green' : 'red'

			if (this.$refs.childs) {
				if (index != undefined) {
					this.applyPrevChild(e, index)
				} else {
					this.applyLastChild(e)
				}
			} else {
				this.$emit('spreadTop', e)
				this.applySelf(e)
			}
		},
		//apply bottom for current item
		applyBottom (e, index) {
			this.visualize = e ? 'green' : 'red'

			if (this.$refs.childs) {
				if (index != undefined) {
					this.applyNextChild(e, index)
				} else {
					this.applySelf(e)
					setTimeout(() => {
						this.applyFirstChild(e)
					}, this.speed)
				}
			} else {
				this.$emit('spreadBottom', e)
				this.applySelf(e)
			}
		},
		applyPrevChild (e, index) {
			if (this.$refs.childs[index - 1])
				this.$refs.childs[index - 1].$emit('applyTop', e)
		},
		applyNextChild (e, index) {
			if (this.$refs.childs[index + 1])
				this.$refs.childs[index + 1].$emit('applyBottom', e)
		},
		applyLastChild (e) {
			if (this.$refs.childs)
				this.$refs.childs[this.$refs.childs.length - 1].$emit('applyTop', e)
		},
		applyFirstChild (e) {
			if (this.$refs.childs)
				this.$refs.childs[0].$emit('applyBottom', e)
		},
		//child wanna spread for next and prev childs
		spreadHandler (e, index) {
			this.visualize = e ? 'blue' : 'white'
			//handle open

			this.removeSpreadHandlers()

			// распростронение от 1 ребёнка
			if (this.spreadTimeout)
				clearTimeout(this.spreadTimeout)

			this.spreadTimeout = setTimeout(() => {
				this.applyTop(e, index + 1)
				this.applyBottom(e, index - 1)
			}, 100)
		},
		removeSpreadHandlers () {
			if (this.$refs.childs)
				this.$refs.childs.map(vm => vm.spreadTimeout ? clearTimeout(vm.spreadTimeout) : null)

			if (this.$parent)
				this.$parent.spreadTimeout ? clearTimeout(this.$parent.spreadTimeout) : null
		},
		//child emit spread top
		spreadTopHandler (e, index) {
			setTimeout(a => this.spreadTop(e, index), this.speed)
		},
		//child emit spread bottom
		spreadBottomHandler (e, index) {
			setTimeout(a => this.spreadBottom(e, index), this.speed)
		},
		applySelf (e) {
			e ? this.$emit('name.show') : this.$emit('name.hide')
		},
		childCurrentRouteHandler () {
			this.open = true
			this.$emit('current')
		}
	},
	mounted () {
		this.$on('open', this._open)
		this.$on('close', this._close)
		this.$on('name.show', this.showName)
		this.$on('name.hide', this.hideName)
		this.$on('applyTop', this.applyTop)
		this.$on('applyBottom', this.applyBottom)
		if (this.currentRouteItem)
			this.$emit('current')

		if (!this.app_view_desktop)
			this.$emit('name.show')
	}
}
</script>

<style lang="less">
@menuItem-width: 50px;
@menuItem-height: 50px;
@menuItem-background: #fff;
@menuItem-background-hover: #ecf5ff;
@menuItem-icon-width: 50px;
@menuItem-icon-height: 50px;
@menuItem-icon-color: #027be3;
@menuItem-name-width: 250px;

.currentRouteItem {
	.menuItem {
		&__icon, &__name {
			background: @menuItem-background-hover;
		}
	}
}

.menuItem {
	position: relative;
	min-height: @menuItem-height;
	width: @menuItem-width;
	cursor: pointer;
	user-select: none;


	&:hover {
		> .menuItem {
			&__icon, &__name {
				background:	@menuItem-background-hover;
			}
		}
	}

	&__icon {
		width: @menuItem-icon-width;
		height: @menuItem-height;
		font-size: 26px;
		display: grid;
		align-items: center;
		justify-content: center;
		background: @menuItem-background;
		color: @menuItem-icon-color;
		box-sizing: content-box;
		z-index: 2500;
		position: relative;
		transition: box-shadow 0.1s ease-in-out,
					background-color 0.1s ease-in-out;
		pointer-events: all;
		i {
			pointer-events: none;
		}
	}

	&__name {
		position: absolute;
		top: 0;
		left: 0;
		width: @menuItem-name-width;
		height: @menuItem-height;
		line-height: @menuItem-height;

		//border: 1px solid red;
		box-sizing: border-box;
		background: @menuItem-background;
		z-index: 2000;
		pointer-events: all;
		transition: box-shadow 0.1s ease-in-out,
					background-color 0.1s ease-in-out;
	}

	&__childs {
		position: relative;
		width: 310px;
		pointer-events: none;
	}

	&__openStateButton {
		position: absolute;
		top: ~"calc(50% - 8px)";
		right: 10px;
	}
}
</style>
