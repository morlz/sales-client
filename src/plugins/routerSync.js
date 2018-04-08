import { sync } from 'vuex-router-sync'

export default ctx => sync(ctx.store, ctx.router)
