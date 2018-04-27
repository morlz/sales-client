export default td => {
	return {
		id: td.ID,
		price: td.CENA_ZAL,
		kat: td.furniture.KAT,
		model: td.furniture.MODEL,
		type: td.furniture.TIP,
		discount: td.SKIDKA,
		discountType: td.S_TYPE,
		dekor: td.furniture.DEKOR,
		stegka: td.furniture.Vid_stegki,
		cloth1: td.furniture.cloth1 ? td.furniture.cloth1 : td.furniture.TKAN,
		cloth2: td.furniture.cloth2 ? td.furniture.cloth2 : td.furniture.KOMP,
		cloth3: td.furniture.cloth3 ? td.furniture.cloth3 : td.furniture.KOMP1,
		comment: td.furniture.COMMENT,
		dax: !!+td.VDAX,
		shipment_id: td.NZVR,
		rowType: 'td'
	}
}
