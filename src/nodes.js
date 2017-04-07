import ENV from './env'

export function text(string) {
	return ENV.document.createTextNode(string)
}
export function fragment() {
	return ENV.document.createDocumentFragment()
}
export function comment(string) {
	return ENV.document.createComment(string)
}
