import moment from 'moment'

let dataObj = {
	tasksManyFieldDescription: [
		//{ field: "id", label: "№", type: "string" },
		{ field: "contacts", label: "Контакты", type: "array", fields: ['fio'], width: 200 },
		{ field: "description", label: "Задача", type: "string", width: 200 },
		{ field: "date", label: "Дата", type: "string", inline: true, width: 100, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY") : data
		} },
		{ field: "managerresponsible.FIO", label: "Ответственный", width: 150, type: "string" },
		{ field: "type.title", label: "Тип", type: "string", width: 100 },
		{ field: "end_date", label: "Выполнена", type: "string", width: 100, inline: true, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY HH:mm:ss") : data
		} },
		{ field: "salon.NAME", label: "Салон", type: "string", width: 100 },
	],

	recordsManyFieldDescription: [
		//{field: "id", label: "№", type: "number" },
		{ field: "contactFaces", label: "Контакты", type: "array", fields: ['fio'], width: 200 },
		{ field: "created_at", label: "Дата создания", inline: true, width: 100, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY HH:mm:ss") : data
		}},
		{ field: "status.title", label: "Статус", type: "string", width: 100 },
		{ field: "manager.FIO", label: "Менеджер", type: "string", width: 100 },
		{ field: "salon.NAME", label: "Салон", type: "string", width: 120 },
		{ field: "calc_summ", label: "Сумма расчета", type: "number", width: 100 },
		{ field: "prepay_summ", label: "Сумма предзаказа", type: "number", width: 100 },
	],

	adSources: [
		{ value: "1", label: "Реклама" },
		{ value: "2", label: "Рассылка по почте" },
		{ value: "3", label: "Рассылка по телефону" },
		{ value: "4", label: "Интернет" },
	],

	clientManyFieldDescription: [
		//{ field: "id", label: "№", type: "number" },
		{ field: "contacts", label: "Контакты", type: "array", fields: ['fio'], width: 200 },
		{ field: "manager.FIO", label: "Менеджер", type: "string", width: 150 },
		{ field: "salon.NAME", label: "Салон", type: "string", width: 150 },
		{ field: "created_at", label: "Создан", inline: true, width: 120, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY HH:mm:ss") : data
		} },
		{ field: "notactive", label: "Неактивен", type: "string", width: 100 },
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
		{ field: "td.lastPlace.invoice.N_DOC", label: "№ док.", width: 80 },
		{ field: "td.salon.NAME", label: "Салон", width: 120},
		{ field: "MODEL", label: "Модель", width: 100},
		{ field: "td.TIP", label: "Тип", width: 150, inline: true },
		{ field: "cloth1.NAME", label: "Ткань 1", width: 150, fields: { output: 'cloth1.NAME' } },
		{ field: "cloth2.NAME", label: "Ткань 2", width: 150, fields: { output: 'cloth2.NAME' } },
		{ field: "cloth3.NAME", label: "Ткань 3", width: 150, fields: { output: 'cloth3.NAME' } },
		{ field: "KAT", label: "Кат", width: 30, },
		{ field: "td.CENA_ZAL", label: "Цена руб.", width: 70, type: "html", format: {
			get: (data, row) => row.td.ModelPriceR > row.td.CENA_ZAL ?
					`<div class="oneFurnitureWrapper__discount">${data} <s>${row.td.ModelPriceR}</s></div>`
				:	data
		} },
		{ field: "DEKOR", label: "Декор", width: 50 },
		{ field: "Vid_stegki", label: "Стежка", width: 50 },
		{ field: "td.DATE_VX", label: "Дни", width: 40, search: false, align: 'right', format: {
			get: data => Math.round((Date.now() - new Date(data).valueOf()) / 0x5265C00), // ms => day
			set: data => undefined
		} },
		{ field: "UN", label: "Фаб.н.", width: 60 },
	],

	invoicesFieldDescription: [
		{ field: "N_DOC", label: "Номер документа", width: 80 },
		{ field: "DATE", label: "Дата оформления", inline: true, width: 100, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY") : data
		} },
		{ field: "shipments", type: 'array', width: 100, fields: ['PL_OTGR'], label: "Дата отгрузки", inline: true, format: {
			get: data => moment(data).isValid() && typeof data == 'string' ? moment(data).format("DD-MM-YYYY") : data
		} },
		{ field: "manager.fio", label: "Менеджер", width: 150, search: false },
		{ field: "client.fio", label: "Клиент", width: 150, search: false },
		{ field: "adSource.NAME", label: "Р. Ист.", width: 100 },
		{ field: "storage.NAME", label: "Салон", width: 150 },
	],

	shipmentsFieldDescription: [
		{ field: "invoice.N_DOC", label: "№ Док", width: 80 },
		{ field: "DATEV", label: "Дата ввода", inline: true, width: 120, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY") : data
		} },
		{ field: "PL_OTGR", label: "Оплата доставки", inline: true, width: 120, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY") : data
		} },
		{ field: "VIDDOST", label: "Вид", width: 100 },
		{ field: "", label: "Примечание", width: 200 },
		{ field: "DATEWORK", label: "В работе", inline: true, width: 120, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY") : data
		} },
		{ field: "salon.NAME", label: "Склад", width: 150 },
	],

	storageFieldDescription: [
		{ field: "UN", label: "Фаб. №", width: 60 },
		{ field: "MODEL", label: "Модель", width: 100 },
		{ field: "td.mestoXR.NAME", label: "Место. хр.", width: 100 },
		{ field: "td.TIP", label: "Тип", inline: true, width: 150 },
		{ field: "cloth1.NAME", label: "Ткань 1", width: 150 },
		{ field: "cloth2.NAME", label: "Ткань 2", width: 150 },
		{ field: "cloth3.NAME", label: "Ткань 3", width: 150 },
		{ field: "KAT", label: "Кат.", width: 60 },
		{ field: "td.ModelPriceR", label: "Цена (р)", width: 60 },
		{ field: "COMMENT", label: "Примечание", width: 350 },
		{ field: "DEKOR", label: "Декор", width: 80 },
		{ field: "Vid_stegki", label: "Стежка", width: 80 },
		{ field: "NAKC", label: "Акция", width: 50 },
		{ field: "td.Sostoynie", label: "Сост.", width: 100 },
		{ field: "td.DATE_CEX", label: "Цех", inline: true, width: 100, format: {
			get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY") : data
		} },
		{ field: "invoice.N_DOC", label: "Номер заказа", width: 50 },
	],

	discountFieldDescription: [
		{ field: "td.mestoXR.NAME", label: "Склад", width: 100 },
		{ field: "UN", label: "Фаб.н.", width: 60 },
		{ field: "td.salon.NAME", label: "Салон", width: 100 },
		{ field: "MODEL", label: "Модель", width: 100 },
		{ field: "td.TIP", label: "Тип", inline: true, width: 150 },
		{ field: "cloth1.NAME", label: "Ткань 1", width: 120 },
		{ field: "cloth2.NAME", label: "Ткань 2", width: 120 },
		{ field: "cloth3.NAME", label: "Ткань 3", width: 120 },
		{ field: "KAT", label: "Кат.", width: 50 },
		//{ field: "COMMENT", label: "Примечание" },
		{ field: "DEKOR", label: "Декор", width: 80 },
		{ field: "Vid_stegki", label: "Стежка", width: 80 },
		{ field: "td.CENA_ZAL", label: "Цена руб.", type: "html", width: 100, format: {
			get: (data, row) => row.td.ModelPriceR > row.td.CENA_ZAL ?
					`<div class="oneFurnitureWrapper__discount">${data} <s>${row.td.ModelPriceR}</s></div>`
				:	data
		} },
		{ field: "td.DATE_CEX", label: "Цех", inline: true, width: 100, format: {
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
