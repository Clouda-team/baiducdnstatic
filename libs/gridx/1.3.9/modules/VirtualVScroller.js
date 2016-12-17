define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/sniff",
	"dojo/_base/event",
	"dojo/_base/Deferred",
	// "dojo/query",
	'../support/query',
	"dojo/keys",
	"./VScroller",
	"../core/_Module"
], function(declare, lang, array, has, event, Deferred, query, keys, VScroller, _Module){

/*=====
	return declare(VScroller, {
		// summary:
		//		module name: vScroller.
		//		This module implements lazy-rendering when virtically scrolling grid.
		// description:
		//		This module takes a DOMNode-based way to implement lazy-rendering.
		//		It tries to remove all the DOMNodes that are out of the grid body viewport,
		//		so that the DOMNodes in grid are always limited to a very small number.

		// buffSize: Integer
		//		The count row nodes that should be maintained above/below the grid body viewport.
		//		The total count row nodes consists of the count of rows that are visible, and buffSize * 2.
		buffSize: 5,

		// lazy: Boolean
		//		If this argument is set to true, the grid will not fetch data during scrolling.
		//		Instead, it'll fetch data after the scrolling process is completed (plus a timeout).
		//		This is useful when a large slow server side data store is used, because frequent
		//		data fetch requests are avoided.
		lazy: false,

		// lazyTimeout: Number
		//		This is the timeout for the "lazy" argument.
		lazyTimeout: 50
	});
=====*/
	
	return declare(VScroller, {
		constructor: function(grid, args){
			if(grid.autoHeight){
				lang.mixin(this, new VScroller(grid, args));
			}else{
				this._scrolls = [];
			}
		},

		destroy: function(){
			this.inherited(arguments);
			//clear all the timeouts, avoid possible errors.
			clearTimeout(this._lazyScrollHandle);
			clearTimeout(this._pVirtual);
		},

		//Public ----------------------------------------------------
		buffSize: 5,
		
		lazy: false,
		
		lazyTimeout: 50,
	
		scrollToRow: function(rowVisualIndex, toTop){
			var d = new Deferred(), t = this, s = t._scrolls,
				f = function(){
					t._subScrollToRow(rowVisualIndex, d, toTop);
				};
			s.push(d);
			t._lazy = t.arg('lazy');
			t.lazy = false;
			if(s.length > 1){
				s[s.length - 2].then(f);
			}else{
				f();
			}
			return d;
		},

		//Private -------------------------------------------------
		_subScrollToRow: function(rowVisualIndex, defer, toTop){
			var t = this,
				dif = 0,
				rowHeight = t._avgRowHeight,
				bn = t.grid.bodyNode,
				dn = t.domNode,
				bst = bn.scrollTop,
				dst = dn.scrollTop,
				bnHeight = bn.clientHeight,
				node = query('[visualindex="' + rowVisualIndex + '"]', bn)[0],
				focus = t.grid.focus,
				finish = function(success){
					if(success && !node.getAttribute('rowid')){
						//Row is not loaded yet, so row height might still change.
						defer.scrollContext = [rowVisualIndex, defer, toTop];
					}else{
						t._scrolls.splice(array.indexOf(t._scrolls, defer), 1);
						//since we've changed the focus row index, re-focus it.
						if(focus && focus.currentArea() == 'body'){
							focus.focusArea('body', 1);	//1 as true
						}
						t.lazy = t._lazy;
						defer.callback(success);
					}
				};
			if(node){
				var offsetTop = node.offsetTop;
				if(node.offsetHeight >= bnHeight){
					//Special check for rows that are higher than grid body.
					if(offsetTop == bst){
						finish(true);
						return;
					}else{
						dif = offsetTop - bst;
					}
				}else if(offsetTop + node.offsetHeight > bst + bnHeight){
					dif = offsetTop - bst;
					if(!toTop){
						dif += node.offsetHeight - bnHeight;
					}
				}else if(offsetTop < bst || (toTop && offsetTop > bst)){
					dif = offsetTop - bst;
				}else{
					finish(true);
					return;
				}
			}else if(bn.childNodes.length){
				//Find a visible node.
				var n = bn.firstChild;
				while(n && n.offsetTop < bst){
					n = n.nextSibling;
				}
				var idx = n && n.getAttribute('visualindex');
				if(n && rowVisualIndex < idx){
					dif = (rowVisualIndex - idx) * rowHeight;
				}else{
					n = bn.lastChild;
					while(n && n.offsetTop + n.offsetHeight > bst + bnHeight && n != bn.firstChild){
						n = n.previousSibling;
					}
					idx = n && n.getAttribute('visualindex');
					if(n && rowVisualIndex > idx){
						dif = (rowVisualIndex - idx) * rowHeight;
					}else{
						finish(false);
						return;
					}
				}
			}else{
				finish(false);
				return;
			}
			var istop = dst === 0 && dif < 0,
				isbottom = dst >= dn.scrollHeight - dn.offsetHeight && dif > 0;
			if(istop || isbottom){
				t._doVirtualScroll(1);
			}else{
				var oldScrollTop = dn.scrollTop,
					scrollTop = oldScrollTop + (dif > bn.offsetHeight ? dif / t._ratio : dif);
				//If scrollTop to too big, the browser will scroll it back to top, so add extra check here.
				if(scrollTop > dn.scrollHeight){
					scrollTop = dn.scrollHeight;
				}
				dn.scrollTop = scrollTop;
				//If scrolling has no effect, we are already at the edge and no luck.
				if(dn.scrollTop == oldScrollTop){
					finish(false);
					return;
				}
			}
			if((istop && bn.firstChild.getAttribute('visualindex') == 0) ||
					(isbottom && bn.lastChild.getAttribute('visualindex') == t.grid.view.visualCount - 1)){
				finish(false);
				return;
			}
			setTimeout(function(){
				t._subScrollToRow(rowVisualIndex, defer, toTop);
			}, 5);
		},
	
		_init: function(args){
			var t = this;
			t._avgRowHeight = t.grid.body.arg('defaultRowHeight') || 24;
			t._rowHeight = {};
			t._syncHeight();
			t.connect(t.grid, '_onResizeEnd', function(){
				t._doScroll(0, 1);
			});
			t._doScroll(0, 1, 1);
		},
	
		_doVirtualScroll: function(forced){
			var t = this,
				dn = t.domNode,
				a = dn.scrollTop,
				deltaT = a - (t._lastScrollTop || 0),
				neighborhood = 2;
			
			if(forced || deltaT){
				t._lastScrollTop = a;
	
				var buffSize = t.arg('buffSize'),
					scrollRange = dn.scrollHeight - dn.offsetHeight,
					body = t.grid.body,
					view = t.grid.view,
					visualStart = 0,	//visualStart is always zero
					visualEnd = visualStart + view.visualCount,
					bn = t.grid.bodyNode,
					firstRow = bn.firstChild,
					firstRowTop = firstRow && firstRow.offsetTop - deltaT,
					lastRow = bn.lastChild,
					lastRowBtm = lastRow && lastRow.offsetTop - deltaT + lastRow.offsetHeight,
					bnTop = bn.scrollTop,
					bnBtm = bnTop + bn.clientHeight,
					h = t._avgRowHeight,
					pageRowCount = Math.ceil(dn.offsetHeight / h) + 2 * buffSize,
					ratio = t._ratio,
					nearTop = a <= neighborhood,
					nearBottom = Math.abs(a - scrollRange) <= neighborhood,
					start, end, pos, d;
				//In IE7 offsetTop will be -1 when grid is hidden
				if((bnTop == bnBtm && !bnBtm) || (lastRow && lastRow.offsetTop < 0)){
					//The grid is not correctly shown, so we just ignore.
					return;
				}
				if(firstRow && firstRowTop > bnTop && firstRowTop < bnBtm){
					//Add some rows to the front
					end = body.renderStart;
					d = Math.ceil((firstRowTop - bnTop) * ratio / h) + buffSize;
					start = nearTop ? visualStart : Math.max(end - d, visualStart);
					pos = "top";
				}else if(lastRow && lastRowBtm > bnTop && lastRowBtm < bnBtm){
					//Add some rows to the end
					start = body.renderStart + body.renderCount;
					d = Math.ceil((bnBtm - lastRowBtm) * ratio / h) + buffSize;
					end = nearBottom && a ? visualEnd : Math.min(start + d, visualEnd);
					pos = "bottom";
					
					if(deltaT === 0 && start == visualEnd){
						//If the last row in the grid has very big height and then change 
						//to normal or very small height, need to add rows to the front.
						//this usually appear in DOD, especially GridInGrid mode
						
						end = body.renderStart;
						d = Math.ceil((firstRowTop - bnTop) * ratio / h) + buffSize;
						start = nearTop ? visualStart : Math.max(end - d, visualStart);
						pos = "top";
					}
				}else if(!firstRow || firstRowTop > bnBtm || !lastRow || lastRowBtm < bnTop){
					//Replace all
					if(a <= scrollRange / 2){
						start = nearTop ? visualStart : visualStart + Math.max(Math.floor(a * ratio / h) - buffSize, 0);
						end = Math.min(start + pageRowCount, visualEnd);
					}else{
						end = nearBottom ? visualEnd : visualEnd + Math.min(pageRowCount - Math.floor((scrollRange - a) * ratio / h), 0);
						start = Math.max(end - pageRowCount, visualStart);
					}
					pos = "clear";
				}else if(firstRow){
					//The body and the scroller bar may be mis-matched, so force to sync here.
					if(nearTop){
						var firstRowIndex = body.renderStart;
						if(firstRowIndex > visualStart){
							start = visualStart;
							end = firstRowIndex;
							pos = "top";
						}
					}else if(nearBottom){
						var lastRowIndex = body.renderStart + body.renderCount - 1;
						if(lastRowIndex < visualEnd - 1){
							start = lastRowIndex + 1;
							end = visualEnd;
							pos = "bottom";
						}
					}
				}
				
				if(typeof start == 'number' && typeof end == 'number'){
					//Only need to render when the range is valid
					body.renderRows(start, end - start, pos);
					if(a && start < end){
						//Scroll the body to hide the newly added top rows.
						var n = query('[visualindex="' + end + '"]', bn)[0];
						if(n){
							deltaT += n.offsetTop;
						}
					}
				}
				//Ensure the position when user scrolls to end points
				if(nearTop){
					bn.scrollTop = 0;
				}else if(nearBottom || a > scrollRange){
					//with huge store, a will sometimes be > scrollRange
					bn.scrollTop = bn.scrollHeight;
				}else if(pos != "clear"){
					bn.scrollTop += deltaT;
				}
			}
			t._doVirtual();
		},
		
		_doScroll: function(e, forced, noLazy){
			var t = this;
			//FIXME: this _lock flag is ugly. This flag is only to avoid accidentlly triggering onscroll event handling
			// especially when using Layer.js to drill down.
			if(!t._lock || forced){
				if(!noLazy && t.arg('lazy') && !forced && !t._byMouseWeel){
					if(t._lazyScrollHandle){
						clearTimeout(t._lazyScrollHandle);
					}
					t._lazyScrollHandle = setTimeout(lang.hitch(t, t._doVirtualScroll, forced), t.arg('lazyTimeout'));
				}else{
					t._doVirtualScroll(forced);
					t._byMouseWeel = false;
				}
			}
		},
	
		_onMouseWheel: function(e){
			if(this.grid.vScrollerNode.style.display != 'none'){
				var rolled = typeof e.wheelDelta === "number" ? e.wheelDelta / 3 : (-40 * e.detail); 
				this.domNode.scrollTop -= rolled;
				this._byMouseWeel = true;
				event.stop(e);
			}
		},
	
		_onBodyChange: function(){
			var t = this;
			t._update();
			t._doScroll(0, 1);
			//If some scrollToRow requests are pending, resume them.
			array.forEach(t._scrolls, function(d){
				if(d && d.scrollContext){
					//delete scrollContext to avoid firing multiple times.
					var scrollContext = d.scrollContext;
					delete d.scrollContext;
					t._subScrollToRow.apply(t, scrollContext);
				}
			});
		},
	
		_onForcedScroll: function(){
			this._rowHeight = {};
			this._doScroll(0, 1);
		},

		//Private ---------------------------------------------------
		_avgRowHeight: 24,
		_rowHeight: null,
		_ratio: 1,
	
		_syncHeight: function(){
			var t = this,
				h = t._avgRowHeight * t.grid.view.visualCount,
				maxHeight = 1342177;
			if(has('ff')){
				maxHeight = 17895697;
			}else if(has('webkit')){
				maxHeight = 134217726;
			}
			if(h > maxHeight){
				t._ratio = h / maxHeight;
				h = maxHeight;
			}
			var dn = t.domNode,
				bn = t.grid.bodyNode,
				//remember the scroll bar position
				oldScrollTop = dn.scrollTop,
				isBottom = oldScrollTop >= dn.scrollHeight - dn.offsetHeight;
			t.stubNode.style.height = h + 'px';
			//Update last scrolltop, to avoid firing _doVirtualScroll with incorrect delta.
			if(t._lastScrollTop){
				//If we were at bottom, should keep us at bottom after height change.
				dn.scrollTop = isBottom ? dn.scrollHeight : oldScrollTop;
				t._lastScrollTop = dn.scrollTop;
			}
			//Force body scrollTop to sync with vscroller
			if(dn.scrollTop >= dn.scrollHeight - dn.offsetHeight){
				bn.scrollTop = bn.scrollHeight;
			}else if(!dn.scrollTop){
				bn.scrollTop = 0;
			}
		},
	
		_doVirtual: function(){
			var t = this;
			clearTimeout(t._pVirtual);
			t._pVirtual = setTimeout(function(){
				t._updateRowHeight();
			}, 100);
		},
	
		_updateRowHeight: function(mode){
			//Update average row height and unrender rows
			var t = this,
				preCount = 0,
				postCount = 0,
				g = t.grid,
				bd = g.body,
				bn = g.bodyNode,
				buff = t.buffSize * t._avgRowHeight,
				st = bn.scrollTop,
				top = st - buff,
				bottom = st + bn.clientHeight + buff,
				rh = t._rowHeight,
				ret = 0;
	
			array.forEach(bn.childNodes, function(n){
				var oh = n.offsetHeight;
				rh[n.getAttribute('rowid')] = oh;
				// Save the offsetHeight of this row so that we don't have to get offsetHeight again during
				// Body::unrenderRows(), which is a very expensive operation
				n.setAttribute("data-rowHeight", oh);
				if(n.offsetTop > bottom){
					++postCount;
				}else if(n.offsetTop + n.offsetHeight < top){
					++preCount;
				}
			});
			if(mode != 'post'){
				bd.unrenderRows(preCount);
				ret = preCount;
			}
			if(mode != 'pre'){
				bd.unrenderRows(postCount, 'post');
				ret = postCount;
			}
	
			var p, h = 0, c = 0;
			for (p in rh) {
				h += rh[p];
				++c;
			}
			if(h && c){
				t._avgRowHeight = h / c;
				t._syncHeight();
			}
			return ret;
		},

		_onKeyScroll: function(evt){
			var t = this,
				bd = t.grid.body,
				view = t.grid.view,
				focus = t.grid.focus,
				sn = t.domNode,
				ctrlKey = t.grid._isCtrlKey(evt),
				st = 'scrollTop',
				r,
				fc = '_focusCellRow';
			if(!focus || focus.currentArea() == 'body'){
				if(evt.keyCode == keys.HOME && ctrlKey){
					bd._focusCellCol = 0;
					bd[fc] = 0;
					sn[st] = 0;
					bd._focusCell();
				}else if(evt.keyCode == keys.END && ctrlKey){
					bd._focusCellCol = t.grid._columns.length - 1;
					bd[fc] = view.visualCount - 1;
					sn[st] = t.stubNode.clientHeight - bd.domNode.offsetHeight;
					bd._focusCell();
				}else if(evt.keyCode == keys.PAGE_UP){
					r = bd[fc] = Math.max(bd.renderStart - bd.renderCount, 0);
					t.scrollToRow(r);
				}else if(evt.keyCode == keys.PAGE_DOWN){
					r = bd[fc] = Math.min(view.visualCount - 1, bd.renderStart + bd.renderCount);
					t.scrollToRow(r, 1);	//1 as true
				}else{
					return;
				}
				event.stop(evt);
			}
		}
	});
});
