// immutable templates, svg elements
import {svg, template} from '../module'

var ic_circle = template( // template used to pre-resolve the node structure
	svg('svg', {
		attrs: {
			fill: '#000000',
			height: '24',
			viewBox: '0 0 24 24',
			width: '24'
		}},
		svg('path', {
			attrs: {
				d: 'M0 0h24v24H0z',
				fill: 'none'
			}}
		)
	).node
)

export var ic_add = ic_circle.child( //ic_add_circle_outline_black_36px
	svg('path').attr('d',
		'M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'
	).node
)

export var ic_clear = ic_circle.child( //ic_clear_black_36px
	svg('path').attr('d',
		'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
	).node
)

export var ic_remove = ic_circle.child( //ic_remove_circle_outline_black_36px
	svg('path').attr('d',
		'M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'
	).node
)
