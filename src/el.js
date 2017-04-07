import creator from './util/creator'
import decorate from './decorate'
import ns from './namespaces'

var preset = creator(decorate)

var el = preset()
el.svg = preset({xmlns: ns.svg})
el.preset = preset

export default el
