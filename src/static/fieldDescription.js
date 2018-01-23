let dataObj = {
	tasksManyFieldDescription: [
		//{ field: "id", label: "№", type: "string" },
		{ field: "contacts", label: "Контакты", type: "array", fields: ['fio'] },
		{ field: "description", label: "Задача", type: "string" },
		{ field: "date", label: "Дата", type: "string" },
		{ field: "managerresponsible.FIO", label: "Ответсвенный", type: "string" },
		{ field: "type.title", label: "Тип", type: "string" },
		{ field: "end_date", label: "Выполнена", type: "string" },
		{ field: "salon.NAME", label: "Салон", type: "string" },
	],

	recordsManyFieldDescription: [
		//{field: "id", label: "№", type: "number" },
		{ field: "contactFaces", label: "Контакты", type: "array", fields: ['fio'] },
		{ field: "created_at", label: "Дата создания", type: "string" },
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
		{ field: "created_at", label: "Создан", type: "string" },
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
		{ field: "td.ID", label: "№ зак." },
		{ field: "td.salon.NAME", label: "Салон" },
		{ field: "MODEL", label: "Модель" },
		{ field: "UN", label: "Фаб.н." },
		{ field: "td.mestoXR.NAME", label: "М.хр." },
		{ field: "td.TIP", label: "Тип" },
		{ field: "ISP", label: "Исп." },
		{ field: "td.DATE_VX", label: "Дней на складе" },
		{ field: "TKAN", label: "Ткань 1" },
		{ field: "KOMP", label: "Ткань 2" },
		{ field: "KOMP1", label: "Ткань 3" },
		{ field: "KAT", label: "Кат" },
		{ field: "DEKOR", label: "Декор" },
		{ field: "Vid_stegki", label: "Стежка" },
		{ field: "td.CENA_ZAL", label: "Цена руб." },
	],

	invoicesFieldDescription: [
		{ field: "N_DOC", label: "Номер документа" },
		{ field: "DATE", label: "Дата оформления" },
		{ field: "PL_OTGR", label: "Дата отгрузки" },
		{ field: "manager", label: "Менеджер" },
		{ field: "client", label: "Клиент" },
		{ field: "adSource", label: "Рекламный источник" },
		{ field: "storage", label: "Склад" },
	],

	shipmentsFieldDescription: [
		{ field: "N_DOC", label: "№ Док" },
		{ field: "DATEV", label: "Дата ввода" },
		{ field: "PL_OTGR", label: "Оплата доставки" },
		{ field: "VIDDOST", label: "Вид" },
		{ field: "", label: "Примечание" },
		{ field: "DATEWORK", label: "В работе" },
		{ field: "NAME", label: "Склад" },
	],

	storageFieldDescription: [
		{ field: "UCH_N", label: "Уч №" },
		{ field: "UN", label: "Фаб. №" },
		{ field: "MODEL", label: "Модель" },
		{ field: "td.mestoXR.NAME", label: "Место. хр." },
		{ field: "td.TIP", label: "Тип" },
		{ field: "TKAN", label: "Ткань 1" },
		{ field: "KOMP", label: "Ткань 2" },
		{ field: "KOMP1", label: "Ткань 3" },
		{ field: "KAT", label: "Кат." },
		{ field: "COMMENT", label: "Примечание" },
		{ field: "DEKOR", label: "Декор" },
		{ field: "Vid_stegki", label: "Стежка" },
		{ field: "NAKC", label: "Акция" },
		{ field: "td.Sostoynie", label: "Сост." },
		{ field: "td.DATE_CEX", label: "Цех" },
		{ field: "invoice.N_DOC", label: "Номер заказа" },
	],

	discountFieldDescription: [
		{ field: "td.mestoXR.NAME", label: "Склад" },
		{ field: "UCH_N", label: "Уч. №" },
		{ field: "UN", label: "Фаб.н." },
		{ field: "td.salon.NAME", label: "Салон" },
		{ field: "MODEL", label: "Модель" },
		{ field: "td.TIP", label: "Тип" },
		{ field: "ISP", label: "Исп." },
		{ field: "TKAN", label: "Ткань 1" },
		{ field: "KOMP", label: "Ткань 2" },
		{ field: "KOMP1", label: "Ткань 3" },
		{ field: "KAT", label: "Кат." },
		//{ field: "COMMENT", label: "Примечание" },
		{ field: "DEKOR", label: "Декор" },
		{ field: "Vid_stegki", label: "Стежка" },
		{ field: "td.CENA_ZAL", label: "Цена руб." },
		{ field: "td.DATE_CEX", label: "Цех" },
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
		{ field: "ID", label: "ИД" },
		{ field: "UN", label: "Уч №" },
		{ field: "td.MODEL", label: "Модель" },
		{ field: "td.TIP", label: "Тип" },
		{ field: "td.CENA_ZAL", label: "Цена" },
	],

	cartPopupNewFieldDescription: [
		{ field: "ID", label: "ИД" },
		{ field: "id_zak", label: "Ид заказа" },
		{ field: "zak.NEWNAME", label: "Модель" },
		{ field: "zak.TIP", label: "Тип" },
		{ field: "zak.CENA", label: "Цена" },
	]
}


export default dataObj
