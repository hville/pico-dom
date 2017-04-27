export function concatPatch(patch) {
	var extra = this
	extra.patch = extra.patch ? extra.patch.concat(patch) : Array.prototype.concat.call(patch)
	return this
}

export function updatePatch(v,k,o) {
	if (this.patch) for (var i=0; i<this.patch.length; ++i) this.patch[i].call(this, v,k,o)
	return this
}
