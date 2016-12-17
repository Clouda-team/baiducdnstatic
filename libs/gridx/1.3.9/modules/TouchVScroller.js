define([
	"dojo/_base/kernel",
	"dojo/_base/Deferred",
	"dojo/_base/declare",
	"dojo/query",
	"dojo/dom-class",
	"./VScroller",
	"dojox/mobile/scrollable"
], function(kernel, Deferred, declare, query, domClass, VScroller, Scrollable){
	kernel.experimental('gridx/modules/TouchVScroller');

/*=====
	return declare(VScroller, {
		// summary:
		//		module name: vScroller.
		//		A vertical scroller only for touch devices.
		// description:
		//		Using dojox/mobile/scrollable, and no lazy-rendering (all rows are rendered out).
	});
=====*/

	return declare(VScroller, {
		constructor: function(){
			if(this.grid.touch){
				domClass.add(this.grid.domNode, 'gridxTouchVScroller');
				this.domNode.style.width = '';
			}
		},

		scrollToRow: function(rowVisualIndex, toTop){
			if(this.grid.touch){
				var d = new Deferred(),
					rowNode = query('[visualindex="' + rowVisualIndex + '"]', this.grid.bodyNode)[0];
				if(rowNode){
					this._scrollable.scrollIntoView(rowNode, toTop);
				}
				d.callback();
				return d;
			}
			return this.inherited(arguments);
		},

		scroll: function(top){
			if(this.grid.touch){
				this._scrollable.scrollTo({ y: top });
			}else{
				this.inherited(arguments);
			}
		},

		position: function(){
			if(this.grid.touch){
				return this._scrollable.getPos().y;
			}else{
				return this.inherited(arguments);
			}
		},

		_init: function(){
			if(this.grid.touch){
				var t = this,
					g = t.grid,
					view = g.view,
					h = g.header.innerNode,
					mainNode = g.mainNode,
					bodyNode = g.bodyNode,
					scrollableArgs = g.vScroller.arg("scrollable") || {},
					scrollable = t._scrollable = new Scrollable(scrollableArgs);
				h.style.height = h.firstChild.offsetHeight + 'px';
				scrollable.init({
					domNode: mainNode,
					containerNode: bodyNode,
					scrollDir: g.hScrollerNode.style.display == 'none' ? 'v' : 'vh',
					noResize: true
				});
				function getLayerParent(){
					var layerParent = g.layer && g.layer._wrapper1.firstChild;
					return layerParent && layerParent.firstChild;
				}
				t.aspect(scrollable, 'scrollTo', function(to){
					if(typeof to.x == "number"){
						var translateStr = scrollable.makeTranslateStr({x: to.x});
						h.firstChild.style.webkitTransform = translateStr;
						h.firstChild.style.transform = translateStr;

						var layerParent = getLayerParent();
						if(layerParent){
							layerParent.style.webkitTransform = translateStr;
							layerParent.style.transform = translateStr;
						}
					}
				});
				t.aspect(scrollable, 'slideTo', function(to, duration, easing){
					scrollable._runSlideAnimation({
						x: scrollable.getPos().x
					}, {
						x: to.x
					}, duration, easing, h.firstChild, 2);	//2 means it's a containerNode

					var layerParent = getLayerParent();
					if(layerParent){
						scrollable._runSlideAnimation({
							x: scrollable.getPos().x
						}, {
							x: to.x
						}, duration, easing, layerParent, 2);	//2 means it's a containerNode
					}
				});
				t.aspect(scrollable, 'stopAnimation', function(){
					domClass.remove(h.firstChild, 'mblScrollableScrollTo2');

					var layerParent = getLayerParent();
					if(layerParent){
						domClass.remove(layerParent, 'mblScrollableScrollTo2');
					}
				});
				t.aspect(g.hScroller, 'refresh', function(){
					scrollable._h = bodyNode.scrollWidth > mainNode.clientWidth;
//                    scrollable._v = bodyNode.scrollHeight > mainNode.clientHeight;
				});
				t._onBodyChange = function(){
					g.hLayout.reLayout();
					g.vLayout.reLayout();
				};
//                t._onForcedScroll = function(){};
				t.model.when({
					start: view.rootStart,
					count: view.rootCount
				}, function(){
					g.body.renderRows(0, view.visualCount);
				});
			}else{
				this.inherited(arguments);
			}
		}
	});
});
