export var defaultView = typeof window !== 'undefined' ? window : void 0

export function setDefaultView(win) {
	if (win) defaultView = win
	return defaultView
}
