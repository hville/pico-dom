export default function assignOpts(tgt, src) {
	if (src) for (var i=0, ks=Object.keys(src); i<ks.length; ++i) {
		var opt = ks[i]
		switch (opt) {
			case 'xmlns': case 'input':
				tgt[opt] = src[opt]
				break
			case 'attrs': case 'props': case 'extra':
				if (!tgt[opt]) tgt[opt] = {}
				var si = src[opt]
				for (var j=0, kss=Object.keys(si); j<kss.length; ++j) tgt[opt][kss[j]] = si[kss[j]]
		}
	}
	return tgt
}
