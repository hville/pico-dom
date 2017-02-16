module.exports = function flatConcat(arr, val) { //TODO ugly
	if (Array.isArray(val)) for (var i=0; i<val.length; ++i) flatConcat(arr, val[i])
	else arr.push(val)
	return arr
}
