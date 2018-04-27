export default zak => {
	let price = +zak.CENA.substr(0, zak.CENA.length - 3)

	console.log(zak.SKIDKA);

	return {
		...zak,
		cloth1: zak.cloth1 ? zak.cloth1.NAME || zak.TKAN : zak.TKAN,
		cloth2: zak.cloth2 ? zak.cloth2.NAME || zak.KOMP : zak.KOMP,
		cloth3: zak.cloth3 ? zak.cloth3.NAME || zak.KOMP1 : zak.KOMP1,
		SKIDKA: +zak.SKIDKA ?
					zak.SKIDKA + +zak.S_TYPE == 0 ?
											zak.SKIDKA + '%'
										:	zak.SKIDKA + ' руб.'
				:	0,
		itogSumm: +zak.SKIDKA ?
					+zak.S_TYPE ? price - +zak.SKIDKA : price - (price * +zak.SKIDKA / 100)
				:	price
	}
}
