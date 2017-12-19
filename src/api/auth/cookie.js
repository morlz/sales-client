import Cookies from 'js-cookie'

export default {
	getAuth (){
		return Cookies.getJSON("auth")
	},
	setAuth (auth){
		//console.log("set", auth);
		return Cookies.set("auth", auth)
	}
}
