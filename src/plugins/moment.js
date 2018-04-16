import moment from 'moment'

export default ctx => (moment.locale('ru'), ctx.Vue.prototype.$moment = moment)
