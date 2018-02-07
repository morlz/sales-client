export default td => {
	if (!td.furniture) return {}

	let price = +td.CENA_ZAL.substr(0, td.CENA_ZAL.length - 3)

	return {
		...td,
		cloth1: td.furniture.cloth1 ? td.furniture.cloth1.NAME || td.furniture.TKAN : td.furniture.TKAN,
		cloth2: td.furniture.cloth2 ? td.furniture.cloth2.NAME || td.furniture.KOMP : td.furniture.KOMP,
		cloth3: td.furniture.cloth3 ? td.furniture.cloth3.NAME || td.furniture.KOMP1 : td.furniture.KOMP1,
		MODEL: td.furniture.MODEL,
		TIP: td.furniture.TIP,
		KAT: td.furniture.KAT,
		CENA: td.CENA_ZAL,
		Vid_stejki: td.furniture.Vid_stegki,
		DEKOR: td.furniture.DEKOR,
		COMMENT: td.furniture.COMMENT,
		TKAN: td.furniture.TKAN,
		KOMP:  td.furniture.KOMP,
		KOMP1: td.furniture.KOMP1,
		S_TYPE: td.S_TYPE,
		SKIDKA: +td.SKIDKA ?
					td.SKIDKA + +td.S_TYPE == 0 ?
											td.SKIDKA + 'руб.'
										:	td.SKIDKA + '%'
				:	0,
		itogSumm: +td.SKIDKA ?
					+td.S_TYPE ? price - +td.SKIDKA : price - (price * +td.SKIDKA / 100)
				:	price
	}
}
