import moment from 'moment'

let dataObj = {
	tasksManyFieldDescription: [
		//{ field: "id", label: "№", type: "string" },
		{ field: "contacts", label: "Контакты", type: "array", fields: ['fio'] },
		{ field: "description", label: "Задача", type: "string" },
		{ field: "date", label: "Дата", type: "string", inline: true, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY") : data
		} },
		{ field: "managerresponsible.FIO", label: "Ответсвенный", type: "string" },
		{ field: "type.title", label: "Тип", type: "string" },
		{ field: "end_date", label: "Выполнена", type: "string", inline: true, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY HH:mm:ss") : data
		} },
		{ field: "salon.NAME", label: "Салон", type: "string" },
	],

	recordsManyFieldDescription: [
		//{field: "id", label: "№", type: "number" },
		{ field: "contactFaces", label: "Контакты", type: "array", fields: ['fio'] },
		{ field: "created_at", label: "Дата создания", inline: true, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY HH:mm:ss") : data
		}},
		{ field: "status.title", label: "Статус", type: "string" },
		{ field: "manager.FIO", label: "Менеджер", type: "string" },
		{ field: "salon.NAME", label: "Салон", type: "string" },
		{ field: "calc_summ", label: "Сумма расчета", type: "number" },
		{ field: "prepay_summ", label: "Сумма предзаказа", type: "number" },
	],

	adSources: [
		{ value: "1", label: "Реклама" },
		{ value: "2", label: "Рассылка по почте" },
		{ value: "3", label: "Рассылка по телефону" },
		{ value: "4", label: "Интернет" },
	],

	clientManyFieldDescription: [
		//{ field: "id", label: "№", type: "number" },
		{ field: "contacts", label: "Контакты", type: "array", fields: ['fio'] },
		{ field: "manager.FIO", label: "Менеджер", type: "string" },
		{ field: "salon.NAME", label: "Салон", type: "string" },
		{ field: "created_at", label: "Создан", inline: true, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY HH:mm:ss") : data
		} },
		{ field: "notactive", label: "Неактивен", type: "string" },
	],

	clientContactsFieldDescription: [
		//{ field: "id", label: "№", type: "number" },
		{ field: "fio", label: "ФИО", type: "string" },
		//{ field: "gender", label: "Пол", type: "number" },
		{ field: "regard", label: "Отношение", type: "string" },
		{ field: "phone", label: "Телефон", type: "string" },
		//{ field: "disableSMS", label: "Откл. sms", type: "number" },
		{ field: "email", label: "Email", type: "string" },
		//{ field: "disableEMAIL", label: "Откл. письм.", type: "number" },
		//{ field: "lost", label: "Потерян", type: "number" },
	],

	clientTasksFieldDescription: [
		{ field: "id", label: "№", type: "string" },
		{ field: "description", label: "Задача", type: "string" },
		{ field: "date", label: "Дата", type: "string" },
		{ field: "type", label: "Тип", type: "string" },
		{ field: "end_date", label: "Выполнена", type: "string" },
		{ field: "result", label: "Результат", type: "string" },
		{ field: "salon", label: "Салон", type: "string" },
	],

	clientPreordersFieldDescription: [
		{ field: "id", label: "№", type: "number" },
		{ field: "created_at", label: "Дата создания", type: "string" },
		{ field: "status", label: "Статус", type: "string" },
		{ field: "manager", label: "Менеджер", type: "string", filterOptions: ['Вася', 'Петя'], filterDropdown: true },
		{ field: "salon", label: "Салон", type: "string" },
		{ field: "budget", label: "Бюждет", type: "number" },
		{ field: "calc_summ", label: "Сумма расчета", type: "number" },
		{ field: "prepay_summ", label: "Сумма предзаказа", type: "number" }
	],

	furnitureSalonFieldDescription: [
		{ field: "td.salon.NAME", label: "Салон" },
		{ field: "MODEL", label: "Модель" },
		{ field: "td.TIP", label: "Тип", inline: true },
		{ field: "cloth1", label: "Ткань 1", fields: { output: 'cloth1.NAME' } },
		{ field: "cloth2", label: "Ткань 2", fields: { output: 'cloth2.NAME' } },
		{ field: "cloth3", label: "Ткань 3", fields: { output: 'cloth3.NAME' } },
		{ field: "KAT", label: "Кат" },
		{ field: "td.CENA_ZAL", label: "Цена руб.", type: "html", format: {
			get: (data, row) => row.td.ModelPriceR > row.td.CENA_ZAL ?
					`<div class="oneFurnitureWrapper__discount">${data} <s>${row.td.ModelPriceR}</s></div>`
				:	data
		} },
		{ field: "DEKOR", label: "Декор" },
		{ field: "Vid_stegki", label: "Стежка" },
		{ field: "td.DATE_VX", label: "Дни", search: false, align: 'right', format: {
			get: data => Math.round((Date.now() - new Date(data).valueOf()) / 0x5265C00), // ms => day
			set: data => undefined
		} },
		{ field: "UN", label: "Фаб.н." },
	],

	invoicesFieldDescription: [
		{ field: "N_DOC", label: "Номер документа" },
		{ field: "DATE", label: "Дата оформления", inline: true, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY") : data
		} },
		{ field: "shipments", type: 'array', fields: ['PL_OTGR'], label: "Дата отгрузки", inline: true, format: {
			get: data => moment(data).isValid() && typeof data == 'string' ? moment(data).format("DD-MM-YYYY") : data
		} },
		{ field: "manager.fio", label: "Менеджер", search: false },
		{ field: "client.fio", label: "Клиент", search: false },
		{ field: "adSource.NAME", label: "Рекламный источник" },
		{ field: "storage.NAME", label: "Салон" },
	],

	shipmentsFieldDescription: [
		{ field: "invoice.N_DOC", label: "№ Док" },
		{ field: "DATEV", label: "Дата ввода", inline: true, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY") : data
		} },
		{ field: "PL_OTGR", label: "Оплата доставки", inline: true, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY") : data
		} },
		{ field: "VIDDOST", label: "Вид" },
		{ field: "", label: "Примечание" },
		{ field: "DATEWORK", label: "В работе", inline: true, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY") : data
		} },
		{ field: "salon.NAME", label: "Склад" },
	],

	storageFieldDescription: [
		{ field: "UN", label: "Фаб. №" },
		{ field: "MODEL", label: "Модель" },
		{ field: "td.mestoXR.NAME", label: "Место. хр." },
		{ field: "td.ModelPriceR", label: "Цена (р)" },
		{ field: "td.TIP", label: "Тип", inline: true },
		{ field: "cloth1", label: "Ткань 1" },
		{ field: "cloth2", label: "Ткань 2" },
		{ field: "cloth3", label: "Ткань 3" },
		{ field: "KAT", label: "Кат." },
		{ field: "COMMENT", label: "Примечание" },
		{ field: "DEKOR", label: "Декор" },
		{ field: "Vid_stegki", label: "Стежка" },
		{ field: "NAKC", label: "Акция" },
		{ field: "td.Sostoynie", label: "Сост." },
		{ field: "td.DATE_CEX", label: "Цех", inline: true, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY") : data
		} },
		{ field: "invoice.N_DOC", label: "Номер заказа" },
	],

	discountFieldDescription: [
		{ field: "td.mestoXR.NAME", label: "Склад" },
		{ field: "UN", label: "Фаб.н." },
		{ field: "td.salon.NAME", label: "Салон" },
		{ field: "MODEL", label: "Модель" },
		{ field: "td.TIP", label: "Тип", inline: true },
		{ field: "ISP", label: "Исп." },
		{ field: "cloth1", label: "Ткань 1" },
		{ field: "cloth2", label: "Ткань 2" },
		{ field: "cloth3", label: "Ткань 3" },
		{ field: "KAT", label: "Кат." },
		//{ field: "COMMENT", label: "Примечание" },
		{ field: "DEKOR", label: "Декор" },
		{ field: "Vid_stegki", label: "Стежка" },
		{ field: "td.CENA_ZAL", label: "Цена руб.", type: "html", format: {
			get: (data, row) => row.td.ModelPriceR > row.td.CENA_ZAL ?
					`<div class="oneFurnitureWrapper__discount">${data} <s>${row.td.ModelPriceR}</s></div>`
				:	data
		} },
		{ field: "td.DATE_CEX", label: "Цех", inline: true, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY") : data
		} },
	],

	lvls: [
		"Нет доступа",
		"Чтение",
		"Создание",
		"Обновление",
		"Удаление"
	],

	personalFieldDescription: [
		{ field: "LOGIN", label: "Логин" },
		{ field: "FIO", label: "Фамилия" },
		{ field: "IMY", label: "Имя" },
		{ field: "OTCH", label: "Отчество" },
		{ field: "S_DATE", label: "Дата создания" },
		{ field: "RABOTAET", label: "Работает" },
		{ field: "roles", label: "Роли", type: 'array', fields: ['name'] },
		{ field: "salon.NAME", label: "Салон" },
	],

	cartPopupExistFieldDescription: [
		{ field: "UN", label: "Уч №" },
		{ field: "td.MODEL", label: "Модель" },
		{ field: "td.TIP", label: "Тип" },
		{ field: "td.CENA_ZAL", label: "Цена" },
	],

	cartPopupNewFieldDescription: [
		{ field: "id_zak", label: "Ид заказа" },
		{ field: "zak.NEWNAME", label: "Модель" },
		{ field: "zak.TIP", label: "Тип" },
		{ field: "zak.CENA", label: "Цена" },
	]
}


export default dataObj
