import {creator} from './util/creator'
import {decorate} from './decorate'
import {namespaces} from './namespaces'

var presetElement = creator(decorate)

export var createElement = presetElement()
createElement.svg = presetElement({xmlns: namespaces.svg})
createElement.preset = presetElement
