// DOM Items
import {default as picoDOM} from './env' //document, window
import {default as namespaces} from './namespaces'
import {fragment, text, comment} from './nodes'

picoDOM.namespaces = namespaces
picoDOM.fragment = fragment
picoDOM.text = text
picoDOM.comment = comment

// Element Items
import {default as decorators} from './decorators'
import {default as element} from './el'

picoDOM.decorators = decorators
picoDOM.element = element

// Component Items
import {default as extra} from './extra'
import {default as Component} from './component'
import {default as component} from './co'

picoDOM.extra = extra
picoDOM.Component = Component
picoDOM.component = component

// List
import {default as list} from './list'

picoDOM.list = list

export default picoDOM
