const path = require('path')
const fs = require('promise-fs')
const fse = require('fs-extra')
const sharp = require('sharp')
const sizeOf = require('image-size')

const options = {
	input: path.resolve('input'),
	output: path.resolve('output'),
	max: 768,
	extensions: /\.je?pg$/
}

const formatFile = async filePath =>
	new Promise((resolve, reject) => {
		if (!filePath.match(options.extensions))
			resolve()

		let fullPathInput = path.join(options.input, filePath)
		let fullPathOutput = path.join(options.output, filePath)

		let image = sharp(fullPathInput)

		image.metadata()
			.then(({ width, height }) => {
				let scale = Math.max(width, height) / options.max
				if (scale < 1)
					scale = 1

				fse.outputFile(fullPathOutput, '', () => {
					image
						.resize(Math.round(width / scale), Math.round(height / scale))
						.toFile(fullPathOutput)
						.then(data => {
							console.log('file', filePath)
							resolve()
						})
						.catch(err => console.log('save file error', err))
				})
			})
			.catch(err => console.log('metadata error', err, fullPathInput))
	})

const checkItem = (el, folderPath) =>
	new Promise((resolve) => {
		fs.lstat( path.join(options.input, folderPath, el) )
			.then(stats => {
				if (stats.isDirectory())
					return resolve(el)

				formatFile( path.join(folderPath, el) )
					.then(resolve)
					.catch(err => console.log(el, err))
			})
	})

const checkContents = (contents, folderPath) => Promise.all(contents.map(el => checkItem(el, folderPath)))
const mapFolders = (folders, folderPath) => Promise.all( folders.map( el => formatFolder( path.join(folderPath, el) ) ) )

const formatFolder = folderPath =>
	new Promise((resolve, reject) => {
		if (!fs.existsSync(path.join(options.input, folderPath)))
			resolve()

		fs.readdir(path.join(options.input, folderPath))
			.then(contents => checkContents(contents, folderPath))
			.then(folders => mapFolders(folders.filter(el => el), folderPath))
			.then(resolve)
	})


formatFolder('/')
