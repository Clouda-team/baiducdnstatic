(function(){
	var w = window,
		d = document,
		l = w.location,
		h = l.href,
		i = h.indexOf('?'),
		q = i > -1,
		b = 'RTL',
		p = q && h.substr(i + 1).split(/#/)[0].split(/&/)[0].split('='),	//LIMITATION: dir must be the first parameter...
		v = d.getElementsByTagName('html')[0].dir = 
			p && p[0] == 'dir' &&
					(p[1] || '').replace(/[^\w]/g, '').toUpperCase() == b ?	//replace() to avoid XSS attack...
						b : '';
	v = v == b ? '' : b;
	p = d.createElement('a');
	p.innerHTML = "<input type='button' style='position:fixed;top:0;right:0;width:5em;' value='" + (v || 'LTR') + "' />";
	p.firstChild.onclick = function(){
		l.href = (q ? h.substr(0, i) : h) + (v && '?dir=' + v);
	};
	w.onload = function(){
		d.body.appendChild(p.firstChild);
	};
})();
