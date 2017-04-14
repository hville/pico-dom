import {creator} from './util/creator'
import {decorate} from './decorate'
import {namespaces} from './namespaces'

var preset = creator(decorate)

export var createElement = preset()
createElement.svg = preset({xmlns: namespaces.svg})
createElement.preset = preset
