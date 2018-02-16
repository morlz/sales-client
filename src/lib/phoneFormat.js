//const re = /(?:([\d]{1,}?))??(?:([\d]{1,3}?))??(?:([\d]{1,3}?))??(?:([\d]{2}))??([\d]{2})$/
const re = /(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/

const handle = (all, a, b, c, d, e) =>
	(a ? a + " (" : "") +
	(b ? b + ") " : "") +
	(c ? c + "-" : "") +
	(d ? d + "-" : "") +
	e

export default phone => phone.replace(re, handle)


/*

function* genFactory (phone) {
	for (var i = 0; i < phone.length; i++) {
		yield phone[i]
	}
}

const v = gen => gen.next().value || ''

export default phone => {
	let g = genFactory(phone)
	return `${v(g)} (${v(g)}${v(g)}${v(g)}) ${v(g)}${v(g)}${v(g)} ${v(g)}${v(g)} ${v(g)}${v(g)}`
}


*/
