import * as VueGoogleMaps from 'vue2-google-maps'

const load = {
	key: 'AIzaSyAATHorjelWuNs0vz9wLrEhtGkwQa5NiQc',
	//v: 'OPTIONAL VERSION NUMBER',
	libraries: 'places',
}


export default ctx => ctx.Vue.use(VueGoogleMaps, { load })
