var co = require('./co')
/*
cell.update(val, idx)
body.update(arr, srt)
table.update([{tbody: [arr, srt]}])
*/
var tableData = {
	val: {ra: {ca: 'aa', cb: 'ab'}, rb: {ca: 'ba', cb: 'bb'}},
	srt: [['ra', 'rb'], ['ca', 'cb']],
	sel: ['rb', 'ca']
}
var config = {
	tbody: co('tbody', {view: tbodyView}),
	brow: co('tr', {view: browView}),
	bcell: co('td', {view: bcellView}),
	binput: co('input', {view: binputView})
}
var table = co('table', {view: tableView}, config,
	config.caption,
	config.thead,
	config.tbody,
	config.tfoot
)
function tableView(tdata) {
	config.data = tdata
	this.updateChildren(tdata.val)
}
table.update(tableData)

//... LIB

function tbodyView(v) {
	this.keys = config.tdata.srt[0]
	this.fromTemplate(config.brow, v, this.keys)
}
function browView(v) {
	this.keys = config.tdata.srt[1]
	this.selected = (this.key === config.sel[0])
	this.fromTemplate(config.bcell, v, this.keys)
}
function bcellView(v, i) {
	this.el.tabIndex = i
	this.selected = (this.key === config.sel[1])
	this.focus = (this.selected && this.parent.selected)
	if (!this.focus) this.el.textContent = v.toFixed(2)
	else this.fromTemplate(config.binput, v)
}
function binputView(v) {
	this.el.value = v
}
