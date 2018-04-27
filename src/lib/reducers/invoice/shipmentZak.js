export default zak => {
	return {
		id: zak.ID,
		invoice_id: zak.INVOICE_ID,
		price: zak.CENA,
		priceOpt: zak.cenaOpt,
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
		comment: zak.COMMENT,
		dax: !!+zak.V_DAX,
		shipment_id: zak.NZV,
		rowType: 'zak'
	}
}
