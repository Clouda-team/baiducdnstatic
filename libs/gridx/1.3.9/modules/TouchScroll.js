define([
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/_base/event",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/touch",
	"../core/_Module"
], function(declare, win, event, dom, domConstruct, touch, _Module){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: touchScroll.
		//		Make desktop grid scrollable by touch in mobile devices.
		// description:
		//		No bouncing and sliding effect now.
	});
=====*/

	return declare(_Module, {
		name: 'touchScroll',

		required: ['vScroller', 'hScroller'],

		constructor: function(){
			var t = this,
				g = t.grid,
				bn = g.bodyNode;
			t.vWrapper = domConstruct.create('div', {
				'class': 'gridxTouchScrollVWrapper'
			}, g.mainNode);
			t.vInner = domConstruct.create('div', {
				'class': 'gridxTouchScrollVBar'
			}, t.vWrapper);
			t.hWrapper = domConstruct.create('div', {
				'class': 'gridxTouchScrollHWrapper'
			}, g.mainNode);
			t.hInner = domConstruct.create('div', {
				'class': 'gridxTouchScrollHBar'
			}, t.hWrapper);
			t.batchConnect(
				[bn, touch.press, '_start'],
				[bn, touch.move, '_scroll'],
				[win.doc, touch.release, '_end']);
		},

		_start: function(e){
			var t = this,
				g = t.grid,
				vScrollerNode = g.vScrollerNode,
				hScrollerNode = g.hScrollerNode;
			//Start touch scroll only on mobile devices where the scroll bar can not be shown
			if((vScrollerNode.style.display != 'none' && vScrollerNode.offsetWidth == 1) ||
				(hScrollerNode.style.display != 'none' && hScrollerNode.offsetHeight == 1)){
				var vns = t.vInner.style,
					hns = t.hInner.style,
					bn = g.bodyNode,
					h = bn.clientHeight,
					w = bn.clientWidth,
					sh = vScrollerNode.scrollHeight,
					sw = hScrollerNode.scrollWidth;
				t._last = e;
				dom.setSelectable(g.domNode, false);
				t.vWrapper.style.height = (h - 4) + 'px';
				t.hWrapper.style.width = (w - 4) + 'px';
				vns.height = h * (h - 4) / sh + 'px';
				hns.width = w * (w - 4) / sw + 'px';
				vns.opacity = 1;
				hns.opacity = 1;
				t._vr = (h - 4) / sh;
				t._hr = (w - 4) / sw;
				event.stop(e);
			}
		},

		_scroll: function(e){
			var t = this,
				g = t.grid,
				hn = g.hScrollerNode,
				vn = g.vScrollerNode,
				last = t._last;
			if(last){
				vn.scrollTop += last.clientY - e.clientY;
				hn.scrollLeft += last.clientX - e.clientX;
				t.vInner.style.top = vn.scrollTop * t._vr + 'px';
				t.hInner.style.left = hn.scrollLeft * t._hr + 'px';
				t._last = e;
				event.stop(e);
			}
		},

		_end: function(e){
			var t = this;
			if(t._last){
			t._last = null;
				dom.setSelectable(t.grid.domNode, true);
				t.vInner.style.opacity = 0;
				t.hInner.style.opacity = 0;
				event.stop(e);
			}
		}
	});
});
