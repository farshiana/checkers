export default {

	getKey(obj){
		return obj.x + "_" + obj.y;
	},

	getCoordinates(key){
		return key.split("_").map((str) => { return parseInt(str); });
	}

}