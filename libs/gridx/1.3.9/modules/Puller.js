define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/query",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/aspect",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/dom-geometry",
	"dojo/keys",
	"../core/_Module"
], function(kernel, declare, query, lang, has, aspect, domConstruct, domClass, domStyle, domGeo, keys, _Module){
	kernel.experimental('gridx/modules/Puller');

	return _Module.register(
	declare(_Module, {
		name: 'puller',

		forced: ['vScroller'],
		//node: null,

		load: function(){
			this.bind(this.arg('node'));
			this.loaded.callback();
		},

		bind: function(node){
			var t = this;
			var g = t.grid;
			t.unbind();
			if(node && node != t.node){
				t.node = node;
				t.innerNode = node.firstChild;
				g.vScroller.loaded.then(function(){
					var scrollable = g.vScroller._scrollable;
					if(scrollable){
						t._height = t.node.clientHeight;
						t._binds = [
							t.aspect(scrollable, 'onTouchStart', function(){
								t.node.style.height = t.node.clientHeight + 'px';
								domClass.add(t.node, 'gridxPuller');
								domClass.add(t.innerNode, 'gridxPullerInner');
								t._pos = scrollable.getPos();
								t._stage = 1;
							}),
							t.aspect(scrollable, 'scrollTo', function(to){
								if(typeof to.y == 'number' && t._stage == 1){
									var delta = to.y - t._pos.y;
									var oldh = t.node.clientHeight;
									var h = oldh + delta;
									if(h < 0){
										h = 0;
									}else if(h > t._height){
										h = t._height;
									}
									delta = h - oldh;
									t._pos = to;
									t.node.style.height = h + 'px';
									g.mainNode.style.height = (g.mainNode.clientHeight - delta) + 'px';
									g.vLayout.reLayout();
								}
							}),
							t.aspect(scrollable, 'onTouchEnd', function(){
								if(t.node.clientHeight < t._height / 2){
									t._slide(0);
								}else if(t.node.clientHeight >= t._height / 2){
									t._slide(1);
								}else{
									t._stage = 0;
								}
							}, t, 'before')
						];
					}
				});
			}
		},

		unbind: function(){
			var t = this;
			if(t._binds){
				for(var i = 0; i < t._binds.length; ++i){
					t._binds[i].remove();
				}
				domClass.remove(t.node, 'gridxPuller');
				domClass.remove(t.innerNode, 'gridxPullerInner');
				t.node.style.height = '';
				t.grid.vLayout.reLayout();
				t._binds = t.node = null;
			}
		},

		_slide: function(toShow){
			var t = this;
			var g = t.grid;
			var targetHeight = toShow ? t._height : 0;
			t._stage = 2;
			domClass.add(t.node, 'gridxPullerAnim');
			domClass.add(g.mainNode, 'gridxPullerAnim');
			setTimeout(function(){
				var h = t.node.offsetHeight - targetHeight;
				t.node.style.height = targetHeight + 'px';
				g.mainNode.style.height = (g.mainNode.clientHeight + h) + 'px';
				setTimeout(function(){
					domClass.remove(t.node, 'gridxPullerAnim');
					domClass.remove(g.mainNode, 'gridxPullerAnim');
					g.vLayout.reLayout();
					t._stage = 0;
				}, 500);
			}, 10);
		}
	}));

});
