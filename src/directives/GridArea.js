export default {
	bind (el, binding, vnode) {
		el.style['grid-area'] = binding.value
	}
}
