define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/_base/Deferred",
	"./Body",
	"./_PagedBodyMixin"
], function(declare, lang, domClass, Deferred, Body, _PagedBodyMixin){

/*=====
	return declare(Body, {
		// summary:
		//		module name: body.
		//		
		// description:
		//		
	});
=====*/

	return declare([Body, _PagedBodyMixin], {
		preload: function(){
			this.inherited(arguments);
			var t = this,
				g = t.grid,
				dn = t.domNode,
				load = function(){
					t._load(1);
				};
			t.connect(dn, 'onscroll', function(e){
				var lastNode = dn.lastChild;
				if(lastNode.offsetTop + lastNode.offsetHeight <= dn.scrollTop + dn.offsetHeight){
					clearTimeout(t._loadHandler);
					t._loadHandler = setTimeout(load, 10);
				}
			});
			t.aspect(g, '_onResizeEnd', function(){
				if(t._checkSpace()){
					t._load(1);
				}
			});
			g.vScroller.loaded.then(function(){
				var scrollable = g.vScroller._scrollable;
				if(scrollable){
					t.aspect(scrollable, 'slideTo', function(to, duration){
						if(to.y < g.mainNode.offsetHeight - g.bodyNode.offsetHeight + dn.lastChild.offsetHeight){
							clearTimeout(t._loadHandler);
							t._loadHandler = setTimeout(load, duration * 1000);
						}
					});
				}
			});
		},

		_checkSpace: function(){
			var bn = this.domNode;
			return bn.lastChild == this._bottomNode && bn.lastChild.offsetTop + bn.lastChild.offsetHeight < bn.scrollTop + bn.offsetHeight;
		},

		onRender: function(/*start, count*/){
			var t = this;
			t.inherited(arguments);
			if(t._checkSpace()){
				t._load(1);
			}
		},

		createBottom: function(bottomNode){
			bottomNode.innerHTML = '<span class="gridxLoadingMore"></span>' + this.arg('loadMoreLoadingLabel', this.grid.nls.loadMoreLoading);
		},

		refresh: function(){
			var inherited = lang.hitch(this, this.inherited, arguments);
			if(this.arg('quickRefresh')){
				domClass.add(this.grid.loadingNode, 'gridxLoading');
				var scrollable = this.grid.vScroller._scrollable;
				if(scrollable){
					var pos = scrollable.getPos();
					scrollable.scrollTo({x: pos.x, y: 0});
				}
				var d = new Deferred();
				this.grid.view.updateRootRange(0, this.pageSize).then(function(){
					inherited().then(function(){
						d.callback();
					}, function(e){
						d.errback(e);
					});
				});
				return d;
			}else{
				return inherited();
			}
		},

		_busy: function(){},

		_onLoadFinish: function(isPost, start, count, callback){
			callback();
		}
	});
});
