export default zak => {
	return {
		price: zak.CENA,
		kat: zak.KAT,
		model: zak.MODEL,
		type: zak.TIP,
		discount: zak.SKIDKA,
		discountType: zak.S_TYPE,
		dekor: zak.DEKOR,
		stegka: zak.Vid_stegki,
		cloth1: zak.cloth1 ? zak.cloth1 : zak.TKAN,
		cloth2: zak.cloth2 ? zak.cloth2 : zak.KOMP,
		cloth3: zak.cloth3 ? zak.cloth3 : zak.KOMP1,
		comment: zak.COMMENT
	}
}
