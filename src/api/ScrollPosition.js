class ScrollPosition {
	constructor (options = {}) {
		this.path = options.path || ''
		this._offset = 0
		this._scroll = 0
		this.itemHeight = options.itemHeight || 51
		this.ItemsBeforeViewport = options.ItemsBeforeViewport || 0
		this.convertHandler = null
		this.debug = false
		this.lock = false
	}

	/*
	 *		returns scroll top to show item
	 */

	get scroll () {
		return this._scroll
	}

	/*
	 *		sets real scroll top
	 */

	set scroll (value) {
		if (this.lock) return
		value = value < 0 ? 0 : value
		this._scroll = value
		if (this.debug) console.log(this.path, 'scroll', {
			value,
			scroll: this.scroll,
			offset: this.offset,
			_scroll: this._scroll,
			_offset: this._offset,
		})
	}

	/*
	 * 		returns current item offset
	 */

	get offset () {
		let scroll = this._scroll - (this.itemHeight * this.ItemsBeforeViewport)

		return Math.round((scroll < 0 ? 0 : scroll) / this.itemHeight) + this._offset
	}

	/*
	 * 		set real item offset
	 */

	set offset (value) {
		value = value < 0 ? 0 : value
		this._offset = value
		if (this.debug) console.log(this.path, 'scroll', {
			value,
			scroll: this.scroll,
			offset: this.offset,
			_scroll: this._scroll,
			_offset: this._offset,
		})
	}

	convertOffsetToScroll (count) {
		this._scroll += count * this.itemHeight
		if (typeof this.convertHandler === 'function') {
			this.lock = true
			this.convertHandler(this.scroll, () => this.lock = false)
		}

		if (this.debug) console.warn(this.path, 'convertOffsetToScroll', {
			_scrollOld: this._scroll - count * this.itemHeight,
			'+=': count * this.itemHeight,
			scroll: this.scroll,
			offset: this.offset,
			_scroll: this._scroll,
			_offset: this._offset,
		});
	}
}

class ScrollPositionStore {
	constructor() {
		this._store = {}
		this.ItemsBeforeViewport = 0
		this.itemHeight = 51
	}

	/*
	 *		remove saved scroll from store
	 *		called when menu item clicked
	 */

	unset (path) {
		if (path)
			delete this._store[path]
		else
			this._store = {}

		return this
	}

	/*
	 *		set current real scroll
	 *		called everytime content scrolled
	 */

	setScroll (path, value) {
		this.path(path).scroll = value
		return this
	}

	/*
	 *		return scroll top in current chunk
	 *		getting once when list inited
	 */

	getScroll (path) {
		return this.path(path).scroll
	}

	/*
	 *		set current real offset
	 *		called everytime content loaded
	 */

	setOffset (path, value) {
		this.path(path).offset = value
		return this
	}

	/*
	 *		returns offset to current chunk
	 *		getting once when list inited
	 */

	getOffset (path) {
		return this.path(path).offset
	}

	/*
	 *		receives an item from the store by path
	 *		and ensures that it exists
	 */

	path (path) {
		path = path.replace(/#/g, '')

		if (!this._store[path])
			this._store[path] = new ScrollPosition({
				path,
				itemHeight: this.itemHeight,
				ItemsBeforeViewport: this.ItemsBeforeViewport
			})

		return this._store[path]
	}

	get current () {
		return this.path(document.location.hash)
	}
}



export default new ScrollPositionStore()
