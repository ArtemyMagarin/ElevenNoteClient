var DataStorage = function() {
	this.d = new Object()
}

DataStorage.prototype.add = function(key, value) {
	console.log(key, value)
	console.log(this.d)
	this.d[key] = value
}

DataStorage.prototype.getData = function() {
	return this.d
};
