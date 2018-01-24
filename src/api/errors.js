import core from '@/api/core'

const errorStatusesDescription = {
	'200': { title: 'Успешно' },
	'201': { title: 'Создано' },
	'202': { title: 'Разрешено' },
	'304': { title: 'Не изменено' },
	'401': { title: 'Не авторизован' },
	'403': { title: 'Доступ запрещён' },
	'404': { title: 'Не найдено' },
	'500': { title: 'Внетреняя ошибка сервера' },
	'503': { title: 'Сервис времено не доступен' },
}

export default {
	getStatusDescription (code) {
		return errorStatusesDescription[code] || {}
	}
}
