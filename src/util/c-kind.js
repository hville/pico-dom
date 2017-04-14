export function cKind(t) {
	return t == null ? t //eslint-disable-line eqeqeq
		: t.constructor || Object
}
