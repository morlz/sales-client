export default item => ((+item / 1000).toFixed() + '')
		.split('').reverse()
		.reduce((prev, el, index) => index % 3 ? [...prev, el] : [...prev, ' ', el], [])
		.reverse().join('').trim() + '.'
		+ ((+item / 1000) % 1).toFixed(2).substr(2, 2)
