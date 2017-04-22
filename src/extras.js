import {PunyMap} from './constructors/puny-map'

export var extras = typeof WeakMap !== 'undefined' ? new WeakMap : new PunyMap //TODO use extras directly
