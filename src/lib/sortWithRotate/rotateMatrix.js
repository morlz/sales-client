export default matrix => {
	let tmp = []

	matrix.map((el, index) => {
		el.map((el2, index2) => {
			if (!tmp[index2])
				tmp[index2] = []

			tmp[index2][index] = el2
		})
	})

	return tmp
}
