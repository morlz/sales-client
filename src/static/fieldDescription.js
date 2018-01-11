let dataObj = {
	tasksManyFieldDescription: [
		//{ field: "id", label: "№", type: "string" },
		{ field: "fio", label: "ФИО", type: "string" },
		{ field: "description", label: "Задача", type: "string" },
		{ field: "date", label: "Дата", type: "string" },
		{ field: "manager", label: "Ответсвенный", type: "string" },
		{ field: "tasktype", label: "Тип", type: "string" },
		{ field: "end_date", label: "Выполнена", type: "string" },
		{ field: "SALON", label: "Салон", type: "string" },
	],

	recordsManyFieldDescription: [
		//{field: "id", label: "№", type: "number" },
		{ field: "fio", label: "ФИО", type: "string" },
		{ field: "created_at", label: "Дата создания", type: "string" },
		{ field: "status", label: "Статус", type: "string" },
		{ field: "manager", label: "Менеджер", type: "string", filterOptions: ['Вася', 'Петя'], filterDropdown: true },
		{ field: "salon", label: "Салон", type: "string" },
		{ field: "calc_summ", label: "Сумма расчета", type: "number" },
		{ field: "prepay_summ", label: "Сумма предзаказа", type: "number" },
	],

	adSources: [
		{ value: "1", label: "Реклама" },
		{ value: "2", label: "Рассылка по почте" },
		{ value: "3", label: "Рассылка по телефону" },
		{ value: "4", label: "Интернет" },
	],

	taskTypes: [
		{ value: "1", label: "Контакт" },
		{ value: "2", label: "Заказ" },
		{ value: "3", label: "Отказ" },
		{ value: "4", label: "Напоминание" },
	],

	clientManyFieldDescription: [
		//{ field: "id", label: "№", type: "number" },
		{ field: "fio", label: "ФИО", type: "string" },
		{ field: "gender", label: "Пол", type: "string" }, //filterOptions: [{ value: 0, text: "Женский" }, { value: 1, text: "Мужской" }], filterDropdown: true
		{ field: "manager", label: "Менеджер", type: "string" },
		{ field: "salon", label: "Салон", type: "string" },
		{ field: "created_at", label: "Создан", type: "string", inputFormat: 'YYYYMMDD', outputFormat: 'MMM Do YY' },
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
		{ field: "summ", label: "Сумма", type: "number" },
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
		{ field: "id", label: "№ зак." },
		{ field: "salon", label: "Салон" },
		{ field: "UN", label: "Фаб.н." },
		{ field: "mXR", label: "М.хр." },
		{ field: "TIP", label: "Тип" },
		{ field: "ISP", label: "Исп." },
		{ field: "DATE_VX", label: "Дней на складе" },
		{ field: "cOSNOVA", label: "Ткань 1" },
		{ field: "cKOMP", label: "Ткань 2" },
		{ field: "cKOMP2", label: "Ткань 3" },
		{ field: "KAT", label: "Кат" },
		{ field: "DEKOR", label: "Декор" },
		{ field: "stegka", label: "Стежка" },
		{ field: "CENA_ZAL", label: "Цена руб." },
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
		{ field: "TIP", label: "Тип" },
		{ field: "TKAN", label: "Ткань 1" },
		{ field: "cKOMP", label: "Ткань 2" },
		{ field: "KOMP1", label: "Ткань 3" },
		{ field: "KAT", label: "Кат." },
		{ field: "COMMENT", label: "Примечание" },
		{ field: "DEKOR", label: "Декор" },
		{ field: "stegka", label: "Стежка" },
		{ field: "NAKC", label: "Акция" },
		{ field: "Sostoynie", label: "Сост." },
		{ field: "DATE_CEX", label: "Цех" },
		{ field: "cNDOC", label: "Номер заказа" },
	],

	discountFieldDescription: [
		{ field: "mXR", label: "Склад" },
		{ field: "UCH_N", label: "Уч. №" },
		{ field: "UN", label: "Фаб.н." },
		{ field: "TIP", label: "Тип" },
		{ field: "ISP", label: "Исп." },
		{ field: "TKAN", label: "Ткань 1" },
		{ field: "cKOMP", label: "Ткань 2" },
		{ field: "KOMP1", label: "Ткань 3" },
		{ field: "KAT", label: "Кат." },
		{ field: "COMMENT", label: "Примечание" },
		{ field: "DEKOR", label: "Декор" },
		{ field: "stegka", label: "Стежка" },
		{ field: "CENA_ZAL", label: "Цена руб." },
		{ field: "DATE_CEX", label: "Цех" },
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
		{ field: "salon", label: "Салон" },
	]
}


export default dataObj
