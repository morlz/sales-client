import moment from 'moment'

let dataObj = {
	adSources: [
		{ value: "1", label: "Реклама" },
		{ value: "2", label: "Рассылка по почте" },
		{ value: "3", label: "Рассылка по телефону" },
		{ value: "4", label: "Интернет" },
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

	lvls: [
		"Нет доступа",
		"Чтение",
		"Создание",
		"Обновление",
		"Удаление"
	],
}


export default dataObj

export let FurnitureSalon = [
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
				`<div class="FurnitureSalon__discount">${data} <s>${row.td.ModelPriceR}</s></div>`
			:	data
	} },
	{ field: "DEKOR", label: "Декор", width: 50 },
	{ field: "Vid_stegki", label: "Стежка", width: 50 },
	/*{ field: "td.DATE_VX", label: "Дни", width: 40, search: false, align: 'right', format: {
		get: data => Math.round((Date.now() - new Date(data).valueOf()) / 0x5265C00), // ms => day
		set: data => undefined
	} }, */
	{ field: "UN", label: "Фаб.н.", width: 60 },
]


export let FurnitureStorage = [
	{ field: "UN", label: "Фаб. №", width: 60 },
	{ field: "MODEL", label: "Модель", width: 100 },
	/*{ field: "td.mestoXR.NAME", label: "Место. хр.", width: 100 },*/
	{ field: "td.TIP", label: "Тип", inline: true, width: 150 },
	{ field: "cloth1.NAME", label: "Ткань 1", width: 150 },
	{ field: "cloth2.NAME", label: "Ткань 2", width: 150 },
	{ field: "cloth3.NAME", label: "Ткань 3", width: 150 },
	{ field: "KAT", label: "Кат.", width: 60 },
	{ field: "td.ModelPriceR", label: "Цена (р)", width: 60 },
	/*{ field: "COMMENT", label: "Примечание", width: 350 },*/
	{ field: "DEKOR", label: "Декор", width: 80 },
	{ field: "Vid_stegki", label: "Стежка", width: 80 },
	{ field: "NAKC", label: "Акция", width: 50 },
	{ field: "td.Sostoynie", label: "Сост.", width: 100 },
	{ field: "td.DATE_CEX", label: "Цех", inline: true, width: 100, format: {
		get: data => moment(data).isValid() ? moment(data).format("DD MMMM YYYY") : data
	} },
	/*{ field: "invoice.N_DOC", label: "Номер заказа", width: 50 },*/
]

export let FurnitureDiscount = [
	//{ field: "td.mestoXR.NAME", label: "Склад", width: 100 },
	{ field: "UN", label: "Фаб.н.", width: 60 },
	{ field: "td.salon.NAME", label: "Салон", width: 100 },
	{ field: "MODEL", label: "Модель", width: 100 },
	{ field: "td.TIP", label: "Тип", inline: true, width: 150 },
	{ field: "cloth1.NAME", label: "Ткань 1", width: 120 },
	{ field: "cloth2.NAME", label: "Ткань 2", width: 120 },
	{ field: "cloth3.NAME", label: "Ткань 3", width: 120 },
	{ field: "KAT", label: "Кат.", width: 50 },
	{ field: "COMMENT", label: "Примечание", width: 200 },
	{ field: "DEKOR", label: "Декор", width: 80 },
	{ field: "Vid_stegki", label: "Стежка", width: 80 },
	{ field: "td.CENA_ZAL", label: "Цена руб.", type: "html", width: 100, format: {
		get: (data, row) => row.td.ModelPriceR > row.td.CENA_ZAL ?
				`<div class="FurnitureDiscount__discount">${data} <s>${row.td.ModelPriceR}</s></div>`
			:	data
	} },
	{ field: "td.DATE_CEX", label: "Цех", inline: true, filter: 'date', width: 100, format: {
		get: data => moment(data).isValid() ? moment(data).format("DD MMMM YYYY") : data
	} },
]

export let DocsShipments = [
	{ field: "invoice.N_DOC", label: "№ Док", width: 80 },
	{ field: "DATEV", label: "Дата ввода", inline: true, filter: 'date', width: 130, format: {
		get: data => moment(data).isValid() ? moment(data).format("DD MMM YYYY") : data
	} },
	{ field: "PL_OTGR", label: "Оплата доставки", inline: true, filter: 'date', width: 130, format: {
		get: data => moment(data).isValid() ? moment(data).format("DD MMM YYYY") : data
	} },
	{ field: "VIDDOST", label: "Вид", width: 100 },
	{ field: "", label: "Примечание", width: 200 },
	{ field: "DATEWORK", label: "В работе", inline: true, filter: 'date', width: 130, format: {
		get: data => moment(data).isValid() ? moment(data).format("DD MMM YYYY") : data
	} },
	{ field: "salon.NAME", label: "Склад", width: 150 },
]

export let DocsInvoices = [
	{ field: "N_DOC", label: "Номер документа", width: 85 },
	{ field: "DATE", label: "Дата оформления", inline: true, filter: 'date', width: 130, format: {
		get: data => moment(data).isValid() ? moment(data).format("DD MMM YYYY") : data
	} },
	{ field: "currentShipment.PL_OTGR", width: 130, type: 'array', filter: 'date',
		fields: { output: 'shipments.PL_OTGR' }, label: "Дата отгрузки", inline: true, format: {
		get: data => moment(data).isValid() && typeof data == 'string' ? moment(data).format("DD MMM YYYY") : data
	} },
	{ field: "manager.fio", label: "Менеджер", width: 200, search: false,
		filterFormat: {
			get: filters => (filters['manager.fio'] || {}).value,
			set: fio => {
				if (!fio)
					return { 'manager.fio': null }

				return {
					'manager.fio': {
						type: 'virtual',
						fields: [
							'manager.FIO',
							'manager.IMY',
							'manager.OTCH'
						],
						value: fio
					}
				}
			}
		}
	},
	{ field: "client.fio", label: "Клиент", width: 200, search: false,
		fields: { output: 'client.lastname' },
		filterFormat: {
			get: filters => (filters['client.fio'] || {}).value,
			set: fio => {
				if (!fio)
					return { 'client.fio': null }

				return {
					'client.fio': {
						type: 'virtual',
						fields: [
							'client.lastname',
							'client.name',
							'client.patronymic'
						],
						value: fio
					}
				}
			}
		}
	},
	{ field: "adSource.NAME", label: "Р. Ист.", width: 100 },
	{ field: "storage.NAME", label: "Салон", width: 150 },
]

export let CRMClients = [
	{ field: "lastname", label: "Фамилия", type: "string", width: 150 },
	{ field: "name", label: "Имя", type: "string", width: 150 },
	{ field: "patronymic", label: "Отчество", type: "string", width: 150 },
	{ field: "manager.fio", label: "Менеджер", type: "string", width: 150, filterFormat: {
		get: filters => (filters['manager.fio'] || {}).value,
		set: fio => {
			if (!fio)
				return { 'manager.fio': null }

			return {
				'manager.fio': {
					type: 'virtual',
					fields: [
						'manager.FIO',
						'manager.IMY',
						'manager.OTCH'
					],
					value: fio
				}
			}
		}
	} },
	{ field: "salon.NAME", label: "Салон", type: "string", width: 150 },
	{ field: "created_at", label: "Создан", inline: true, width: 120, filter: 'date', format: {
		get: data => moment(data).isValid() ? moment(data).format("DD MMM YYYY HH:mm:ss") : data
	} },
	{ field: "notactiveDate", label: "Неактивен", type: "string", width: 100, fields: { output: 'notactive' } },
]

export let CRMPreorders = [
	//{field: "id", label: "№", type: "number" },
	{ field: "client.lastname", label: "Фамилия", width: 100 },
	{ field: "client.name", label: "Имя", width: 100 },
	{ field: "client.patronymic", label: "Отчество", width: 100 },
	{ field: "created_at", label: "Дата создания", inline: true, filter: 'date', width: 100, format: {
		get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY HH:mm:ss") : data
	}},
	{ field: "status.title", label: "Статус", type: "string", width: 100 },
	{ field: "manager.fio", label: "Менеджер", type: "string", width: 150, filterFormat: {
		get: filters => (filters['manager.fio'] || {}).value,
		set: fio => {
			if (!fio)
				return { 'manager.fio': null }

			return {
				'manager.fio': {
					type: 'virtual',
					fields: [
						'manager.FIO',
						'manager.IMY',
						'manager.OTCH'
					],
					value: fio
				}
			}
		}
	} },
	{ field: "salon.NAME", label: "Салон", width: 120 },
	{ field: "calc_summ", label: "Сумма расчета", type: "number", width: 100 },
	{ field: "prepay_summ", label: "Сумма предзаказа", type: "number", width: 100 },
]

export let CRMTasks = [
	//{ field: "id", label: "№", type: "string" },
	{ field: "client.lastname", label: "Фамилия", width: 100 },
	{ field: "client.name", label: "Имя", width: 100 },
	{ field: "client.patronymic", label: "Отчество", width: 100 },
	{ field: "description", label: "Задача", type: "string", width: 200 },
	{ field: "date", label: "Дата", type: "string", inline: true, filter: 'date', width: 100, format: {
		get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY") : data
	} },
	{ field: "managerresponsible.fio", label: "Ответственный", width: 150, filterFormat: {
		get: filters => (filters['managerresponsible.fio'] || {}).value,
		set: fio => {
			if (!fio)
				return { 'managerresponsible.fio': null }

			return {
				'managerresponsible.fio': {
					type: 'virtual',
					fields: [
						'managerresponsible.FIO',
						'managerresponsible.IMY',
						'managerresponsible.OTCH'
					],
					value: fio
				}
			}
		}
	} },
	{ field: "type.title", label: "Тип", type: "string", width: 100 },
	{ field: "end_date", label: "Выполнена", type: "string", width: 100, inline: true, filter: 'date', format: {
		get: data => moment(data).isValid() ? moment(data).format("DD-MM-YYYY HH:mm:ss") : data
	} },
	{ field: "salon.NAME", label: "Салон", type: "string", width: 100 },
]

export let CRMVisitors = [
	{ field: 'manager.fio', label: 'Менеджер', width: 200 },
	{ field: 'salon.name', label: 'Салон', width: 150 },
	{ field: 'date', label: 'Дата', filter: 'date', width: 180 },
	{ field: 'description', label: 'Описание', width: 300 },
]

export let AdminPersonal = [
	{ field: "LOGIN", label: "Логин", width: 80 },
	{ field: "FIO", label: "Фамилия", width: 100 },
	{ field: "IMY", label: "Имя", width: 100 },
	{ field: "OTCH", label: "Отчество", width: 100 },
	{ field: "S_DATE", label: "Дата создания", filter: 'date', width: 100 },
	{ field: "RABOTAET", label: "Работает", width: 50 },
	{ field: "roles", label: "Роли",  fields: { output: 'roles.name' }, width: 120 },
	{ field: "salon.NAME", label: "Салон", width: 120 },
]

export let InfoCardSofaHead = [
	{ fields: ["model", "type"], label: "Наименование" },
	{ field: "kat", label: "Категория" },
	{ field: "instance.price", label: "Цена" },
	{ field: "stegka", label: "Стёжка" },
	{ field: "dekor", label: "Декор" },
	{ field: 'instance', label: 'Доставка', format: {
		get: row => `<div style="color: ${row.shipment_id ? 'green' : 'red'};">${row.shipment_id ? 'Назначена' : 'Не назначена'}</div>`
	} }
]

export let InfoCardInvoices = [
	{ field: 'N_DOC', label: 'Номер документа' },
	{ field: 'DATE', label: 'Дата заказа' },
	{ field: 'manager.fio', label: 'Менеджер' },
	{ field: 'salon.name', label: 'Салон' }
]

export let InfoCardPreorders = [
	{ field: "created_at", label: "Дата создания", type: "string" },
	{ field: "status.title", label: "Статус", type: "string" },
	{ field: "manager.fio", label: "Менеджер", type: "string"},
	{ field: "salon.NAME", label: "Салон", type: "string" },
	{ field: "budget", label: "Бюждет", type: "number" },
	{ field: "calc_summ", label: "Сумма расчета", type: "number" },
	{ field: "prepay_summ", label: "Сумма предзаказа", type: "number" }
]

export let InfoCardTasks = [
	{ field: "description", label: "Задача", type: "string" },
	{ field: "result", label: "Результат", type: "string" },
	{ field: "date", label: "Дата", type: "string" },
	{ field: "type", label: "Тип", type: "string" },
	{ field: "end_date", label: "Выполнена", type: "string" },
	{ field: "salon", label: "Салон", type: "string" },
]

export let CartPopupExist = [
	{ field: "ID", label: "Фаб.н." },
	{ field: "td.MODEL", label: "Модель" },
	{ field: "td.TIP", label: "Тип" },
	{ field: "td.CENA_ZAL", label: "Цена" },
]

export let CartPopupNew = [
	{ field: "id_zak", label: "Ид строки" },
	{ field: "zak.NEWNAME", label: "Модель" },
	{ field: "zak.TIP", label: "Тип" },
	{ field: "zak.CENA", label: "Цена" },
]

/*
{ field: "shipments", width: 100, fields: ['PL_OTGR'], label: "Дата отгрузки", inline: true, format: {
	get: data => moment(data).isValid() && typeof data == 'string' ? moment(data).format("DD-MM-YYYY") : data
} },

{ field: "contacts", label: "Контакты", type: "array", fields: ['fio'], width: 200 },
*/
