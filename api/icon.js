var pico = require('../index')

var el = pico.el

module.exports = el.svg('svg[viewBox="0 0 32 32"]',
	el.svg('path.path1', {attributes: {
		d: 'M6.806 31.619c0.49-1.602 1.232-3.858 2.226-7.122 4.33-0.699 6.122 0.558 8.872-4.454-2.232 0.698-4.923-1.294-4.778-2.157 0.144-0.864 6.261 0.622 10.264-5.181-5.046 1.134-6.662-1.365-6.011-1.742 1.502-0.872 5.963-0.362 8.341-2.725 1.226-1.216 1.798-4.174 1.301-5.23-0.6-1.274-4.251-3.174-6.264-2.997-2.013 0.179-5.17 7.822-6.106 7.762s-1.123-3.422 0.51-6.549c-1.723 0.778-4.88 3.198-5.87 5.267-1.845 3.85 0.173 12.677-0.474 12.992-0.648 0.314-2.826-4.053-3.475-6.032-0.888 3.034-0.909 6.074 1.686 10.112-0.979 2.65-1.514 5.699-1.595 7.25-0.038 1.242 1.157 1.507 1.373 0.806z'
	}})
)
