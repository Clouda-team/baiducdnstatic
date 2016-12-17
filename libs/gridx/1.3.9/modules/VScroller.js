define([
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/event",
	"dojo/_base/sniff",
	"dojo/query",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/keys",
	"dojox/html/metrics",
	"../core/_Module"
], function(declare, Deferred, event, has, query, domGeo, domClass, domStyle, keys, metrics, _Module){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: vScroller.
		//		This module provides basic vertical scrolling logic for grid.
		// description:
		//		This module will make the grid body render all rows without paging.
		//		So it is very fast for small client side store, and might be extremely slow
		//		for large server side store.

		scrollToRow: function(rowVisualIndex, toTop){
			// summary:
			//		Scroll the grid until the required row is in view.
			// description:
			//		This job will be an asynchronous one if the lazy-loading and lazy-rendering are used.
			// rowVisualIndex: Integer
			//		The visual index of the row
			// toTop: Boolean?
			//		If set this to true, the grid will try to scroll the required row to the top of the view.
			//		Otherwise, the grid will stop scrolling as soon as the row is visible.
			// returns:
			//		A deferred object indicating when the scrolling process is finished. This will be useful
			//		when using lazy-loading and lazy-rendering.
		}
	});
=====*/

	var st = 'scrollTop';

	return declare(_Module, {
		name: 'vScroller',

		forced: ['view', 'body', 'vLayout', 'columnWidth'],

		optional: ['pagination'],
	
		constructor: function(){
			var t = this,
				g = t.grid,
				dn = t.domNode = g.vScrollerNode;
			t.stubNode = dn.firstChild;
			if(g.autoHeight){
				dn.style.display = 'none';
				if(has('ie') < 8){
					dn.style.width = '0px';
				}
			}else if(!has('mac')){
				var w = metrics.getScrollbar().w,
					ltr = g.isLeftToRight();
				dn.style.width = w + 'px';
				dn.style[ltr ? 'right' : 'left'] = -w + 'px';
				if(has('ie') < 8){
					t.stubNode.style.width = (w + 1) + 'px';
				}
			}else{
				domClass.add(g.domNode, 'gridxMac');
			}
		},

		preload: function(args){
			this.grid.hLayout.register(null, this.domNode, 1);
		},

		load: function(args, startup){
			var t = this,
				g = t.grid,
				bd = g.body,
				dn = t.domNode,
				bn = g.bodyNode;
			t.batchConnect(
				[t.domNode, 'onscroll', '_doScroll'],
				[bn, 'onmousewheel', '_onMouseWheel'],
				[g.mainNode, 'onkeypress', '_onKeyScroll'],
				has('ff') && [bn, 'DOMMouseScroll', '_onMouseWheel']);
			t.aspect(g, '_onResizeEnd', '_onBodyChange');
			t.aspect(bd, 'onForcedScroll', '_onForcedScroll');
			t.aspect(bd, 'onRender', '_onBodyChange');
			t.aspect(g.header, 'onRender', '_onBodyChange');
			if(!g.autoHeight){
				t.aspect(bd, 'onEmpty', function(){
					var ds = dn.style;
					ds.display = 'none';
					ds.width = '';
					if(has('ie') < 8){
						ds.width = t.stubNode.style.width = '0px';
					}
					g.hLayout.reLayout();
					g.hScroller.refresh();
				});
			}
			startup.then(function(){
				t._updatePos();
				Deferred.when(t._init(args), function(){
					t.domNode.style.width = '';
					t.loaded.callback();
				});
			});
		},
	
		//Public ----------------------------------------------------
		scrollToRow: function(rowVisualIndex, toTop){
			var d = new Deferred(),
				bn = this.grid.bodyNode,
				dn = this.domNode,
				dif = 0,
				n = query('[visualindex="' + rowVisualIndex + '"]', bn)[0],
				finish = function(success){
					setTimeout(function(){
						d.callback(success);
					}, 5);
				};
			if(n){
				var no = n.offsetTop,
					bs = bn[st];
				if(toTop){
					dn[st] = no;
					finish(true);
					return d;
				}else if(no <= bs){
					dif = no - bs;
				}else if(no + n.offsetHeight > bs + bn.clientHeight){
					dif = no + n.offsetHeight - bs - bn.clientHeight;
				}else{
					finish(true);
					return d;
				}
				dn[st] += dif;
			}
			finish(!!n);
			return d;
		},

		scroll: function(top){
			this.domNode.scrollTop = top;
		},

		position: function(){
			return this.domNode.scrollTop;
		},
	
		//Protected -------------------------------------------------
		_init: function(){
			return this._onForcedScroll();
		},

		_update: function(){
			var t = this,
				g = t.grid,
				dn = t.domNode,
				bn = g.bodyNode;

			if(!g.autoHeight){
				var bd = g.body,
					toShow = (bn.scrollHeight > bn.clientHeight) ||
						//This is to fix some rare issue that vscroller missing. #10267
						//Logically this should not happen because virtual scroller has buffers.
						//And this logic should not be put in non-virtual scroller either.
						//FIXME: need more investigation.
						(bn.scrollHeight == bn.clientHeight && bd.renderCount < g.view.visualCount),
					ds = t.domNode.style,
					scrollBarWidth = metrics.getScrollbar().w + (has('webkit') ? 1 : 0);//Fix a chrome RTL defect
				if(has('ie') < 8){
					//In IE7 if the node is not wider than the scrollbar, 
					//the scroll bar buttons and the empty space in the scroll bar won't be clickable.
					//So add some extra px to make it wider. +1 is enough for classic theme. +2 is enough for XP theme.
					var w = toShow ? (scrollBarWidth + 2) + 'px' : '0px';
					t.stubNode.style.width = w;
					ds.width = w;
				}else{
					ds.width = '';
				}
				var display = toShow ? 'block' : 'none';
				var changed = display != (domStyle.get(t.domNode, 'display') || 'block');
				ds.display = display;
				if(t._updatePos() || changed){
					g.hLayout.reLayout();
				}
			}else{
				if(domStyle.get(dn, 'display') !== 'none'){
					dn.style.display = 'none';
					g.hLayout.reLayout();
				}
			}
		},

		_updatePos: function(){
			var g = this.grid,
				dn = this.domNode,
				ds = dn.style,
				ltr = g.isLeftToRight(),
				mainBorder = domGeo.getBorderExtents(g.mainNode),
				attr = ltr ? 'right' : 'left',
				oldValue = ds[attr];
			ds[attr] = -(dn.offsetWidth + (ltr ? mainBorder.r : mainBorder.l)) + 'px';
			return oldValue != ds[attr];
		},

		_doScroll: function(){
			this.grid.bodyNode[st] = this.domNode[st];
		},

		_onMouseWheel: function(e){
			if(this.grid.vScrollerNode.style.display != 'none'){
				var rolled = typeof e.wheelDelta === "number" ? e.wheelDelta / 3 : (-40 * e.detail); 
				this.domNode[st] -= rolled;
				event.stop(e);
			}
		},

		_onBodyChange: function(){
			var t = this,
				g = t.grid;
			t._update();
			//IE7 Needs setTimeout
			setTimeout(function(){
				if(!g.bodyNode){
					//fix FF10 - g.bodyNode will be undefined during a quick recreation
					return;
				}
				t.stubNode.style.height = g.bodyNode.scrollHeight + 'px';
				t._doScroll();
				//FIX IE7 problem:
				g.vScrollerNode[st] = g.vScrollerNode[st] || 0;
			}, 0);
		},

		_onForcedScroll: function(){
			var t = this,
				view = t.grid.view,
				body = t.grid.body;
			return t.model.when({
				start: view.rootStart,
				count: view.rootCount
			}, function(){
				body.renderRows(0, view.visualCount);
			});
		},

		_onKeyScroll: function(evt){
			var t = this,
				g = t.grid,
				bd = g.body,
				bn = g.bodyNode,
				focus = g.focus,
				sn = t.domNode,
				ctrlKey = g._isCtrlKey(evt),
				rowNode;
			if(bn.childNodes.length && (!focus || focus.currentArea() == 'body')){
				if(evt.keyCode == keys.HOME && ctrlKey){
					sn[st] = 0;
					rowNode = bn.firstChild;
					bd._focusCellCol = 0;
				}else if(evt.keyCode == keys.END && ctrlKey){
					sn[st] = sn.scrollHeight - sn.offsetHeight;
					rowNode = bn.lastChild;
					bd._focusCellCol = g._columns.length - 1;
				}else if(evt.keyCode == keys.PAGE_UP){
					if(!sn[st]){
						rowNode = bn.firstChild;
					}else{
						sn[st] -= sn.offsetHeight;
					}
				}else if(evt.keyCode == keys.PAGE_DOWN){
					if(sn[st] >= sn.scrollHeight - sn.offsetHeight){
						rowNode = bn.lastChild;
					}else{
						sn[st] += sn.offsetHeight;
					}
				}else{
					return;
				}
				if(focus){
					if(rowNode){
						bd._focusCellRow = parseInt(rowNode.getAttribute('visualindex'), 10);
						focus.focusArea('body', 1);	//1 as true
					}else{
						setTimeout(function(){
							var rowNodes = bn.childNodes,
								start = 0,
								end = rowNodes.length - 1,
								containerPos = domGeo.position(bn),
								i, p,
								checkPos = function(idx){
									var rn = rowNodes[idx],
										pos = domGeo.position(rn);
									if(evt.keyCode == keys.PAGE_DOWN){
										var prev = rn.previousSibling;
										if((!prev && pos.y >= containerPos.y) || pos.y == containerPos.y){
											return 0;
										}else if(!prev){
											return -1;
										}else{
											var prevPos = domGeo.position(prev);
											if(prevPos.y < containerPos.y && prevPos.y + prevPos.h >= containerPos.y){
												return 0;
											}else if(prevPos.y > containerPos.y){
												return 1;
											}else{
												return -1;
											}
										}
									}else{
										var post = rn.nextSibling;
										if((!post && pos.y + pos.h <= containerPos.y + containerPos.h) ||
											pos.y + pos.h == containerPos.y + containerPos.h){
											return 0;
										}else if(!post){
											return 1;
										}else{
											var postPos = domGeo.position(post);
											if(postPos.y <= containerPos.y + containerPos.h &&
													postPos.y + postPos.h > containerPos.y + containerPos.h){
												return 0;
											}else if(postPos.y > containerPos.y + containerPos.h){
												return 1;
											}else{
												return -1;
											}
										}
									}
								};
							//Binary search the row to focus
							while(start <= end){
								i = Math.floor((start + end) / 2);
								p = checkPos(i);
								if(p < 0){
									start = i + 1;
								}else if(p > 0){
									end = i - 1;
								}else{
									rowNode = rowNodes[i];
									break;
								}
							}
							if(rowNode){
								bd._focusCellRow = parseInt(rowNode.getAttribute('visualindex'), 10);
								focus.focusArea('body', 1);	//1 as true
							}
						}, 0);
					}
				}
				event.stop(evt);
			}
		}
	});
});
