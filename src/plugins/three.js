//import path from 'path'

/*
const load = (arr, path) => arr.map(el => require(`${path}/${el}.js`))
const recursiveLoad = (from, currentPath = 'three.examples') => Object
	.keys(from)
	.map(key => Array.isArray(from[key]) ? load(from[key], currentPath + '/' + key) : recursiveLoad(from[key], currentPath + '/' + key))

recursiveLoad({
	loaders: [
		'BinaryLoader'
	]
})*/



export default c => {
	require('three.examples/BufferGeometryUtils.js')
	require('three.examples/loaders/BinaryLoader.js')
	require('three.examples/loaders/GLTFLoader.js')
	require('three.examples/loaders/DDSLoader.js')

	window.THREE = THREE
	window.scene = null
}
