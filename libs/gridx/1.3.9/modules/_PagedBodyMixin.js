define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/query",
	"dojo/_base/array",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"dojo/_base/Deferred",
	"dojo/_base/sniff",
	"dijit/a11y"
], function(declare, lang, query, array, domConstruct, domGeo, domClass, Deferred, has, a11y){

/*=====
	return declare([], {
		// summary:
		// description:

		// pageSize: Integer
		//		The row count in one page. Default to the pageSize of grid cache. If using cache has no pageSize, default to 20.
		//		Users can directly set grid parameter pageSize to set both the cache pageSize and the body pageSize.
		//		If using bodyPageSize, it'll be different from the cache page size, but that's also okay.
		pageSize: 20,

		// quickRefresh: Boolean
		//		When refresh, scroll to top first
		quickRefresh: false
	});
=====*/

	return declare([], {
		preload: function(){
			var t = this,
				g = t.grid,
				view = g.view;
			view.paging = 1;
			view.rootStart = 0;
			t._autoPageSize = t.arg('pageSize') == 'auto' || g.pageSize == 'auto';
			t.pageSize = t.pageSize || t.model._cache.pageSize || 20;
			view.rootCount = t.pageSize;
			domClass.remove(t.domNode, 'gridxBodyRowHoverEffect');
			t.connect(t.domNode, 'onscroll', function(e){
				g.hScrollerNode.scrollLeft = t.domNode.scrollLeft;
			});
			t.aspect(t.model, 'onSizeChange', '_onSizeChange');
			
			t.aspect(g, 'onHScroll', '_onHScroll');

			if(t.arg('createBottom')){
				t._bottomNode = domConstruct.create('div', {
					'class': 'gridxBodyBottom'
				});
				t.createBottom(t._bottomNode);
				t.connect(t._bottomNode, 'onmouseover', function(){
					query('> .gridxRowOver', t.domNode).removeClass('gridxRowOver');
				});
			}
			if(t.arg('createTop')){
				t._topNode = domConstruct.create('div', {
					'class': 'gridxBodyTop'
				});
				t.createTop(t._topNode);
				t.connect(t._topNode, 'onmouseover', function(){
					query('> .gridxRowOver', t.domNode).removeClass('gridxRowOver');
				});
			}
			t._initFocus();
		},
		
		_onHScroll: function(left){
			//TODO logic when scroll in horizontal
		},

		_onSizeChange: function(size){
			this.grid.view.updateRootRange(0, size < this.pageSize ? size : this.pageSize);
		},

		_initFocus: function(){
			var t = this,
				focus = t.grid.focus,
				doFocus = function(node, evt, step){
					if(node.parentNode){
						focus.stopEvent(evt);
						var elems = a11y._getTabNavigable(node),
							n = elems[step < 0 ? 'last' : 'first'];
						if(n){
							n.focus();
						}
						return !!n;
					}else{
						return false;
					}
				},
				doBlur = function(node, evt, step){
					if(node.parentNode){
						var elems = a11y._getTabNavigable(node);
						return evt ? evt.target == (step < 0 ? elems.first : elems.last) : true;
					}else{
						return true;
					}
				};
			t.inherited(arguments);
			if(t._topNode){
				focus.registerArea({
					name: 'bodyTop',
					priority: 0.9999,
					focusNode: t._topNode,
					scope: t,
					doFocus: lang.partial(doFocus, t._topNode),
					doBlur: lang.partial(doBlur, t._topNode)
				});
			}
			if(t._bottomNode){
				focus.registerArea({
					name: 'bodyBottom',
					priority: 1.0001,
					focusNode: t._bottomNode,
					scope: t,
					doFocus: lang.partial(doFocus, t._bottomNode),
					doBlur: lang.partial(doBlur, t._bottomNode)
				});
			}
		},

		load: function(args, startup){
			var t = this,
				view = t.grid.view;
			if(view._err){
				t._loadFail(view._err);
			}
			startup.then(function(){
				if(t._autoPageSize){
					var rowCount = parseInt(t.grid.mainNode.offsetHeight / t.arg('defaultRowHeight', 24) * 1.5, 10);
					t.pageSize = rowCount;
					view.updateRootRange(0, rowCount);
				}
				t.loaded.callback();
			});
		},

		refresh: function(start){
			var t = this,
				loadingNode = t.grid.loadingNode,
				d = new Deferred();
			delete t._err;
			domClass.add(loadingNode, 'gridxLoading');
			t.grid.view.updateVisualCount().then(function(){
				try{
					t.renderStart = 0;
					var rc = t.renderCount = t.grid.view.visualCount;
					if(typeof start == 'number' && start >= 0){
						var count = rc - start,
							n = query('> [visualindex="' + start + '"]', t.domNode)[0],
							uncachedRows = [],
							renderedRows = [];
						if(n){
							var rows = t._buildRows(start, count, uncachedRows, renderedRows);
							if(rows){
								domConstruct.place(rows, n, 'before');
							}
						}
						while(n && (!t._bottomNode || n !== t._bottomNode)){
							var tmp = n.nextSibling,
								vidx = parseInt(n.getAttribute('visualindex'), 10),
								id = n.getAttribute('rowid');
							domConstruct.destroy(n);
							if(vidx >= start + count){
								t.onUnrender(id);
							}
							n = tmp;
						}
						array.forEach(renderedRows, t.onAfterRow, t);
						Deferred.when(t._buildUncachedRows(uncachedRows), function(){
							t.onRender(start, count);
							domClass.remove(loadingNode, 'gridxLoading');
							d.callback();
						});
					}else{
						t.renderRows(0, rc, 0, 1);
						domClass.remove(loadingNode, 'gridxLoading');
						d.callback();
					}
				}catch(e){
					t._loadFail(e);
					domClass.remove(loadingNode, 'gridxLoading');
					d.errback(e);
				}
			}, function(e){
				t._loadFail(e);
				domClass.remove(loadingNode, 'gridxLoading');
				d.errback(e);
			});
			return d;
		},

		renderRows: function(start, count, position){
			var t = this,
				g = t.grid,
				uncachedRows = [],
				renderedRows = [],
				n = t.domNode,
				en = g.emptyNode;
			if(t._err){
				return;
			}
			if(count > 0){
				en.innerHTML = t.arg('loadingInfo', g.nls.loadingInfo);
				en.style.zIndex = '';
				var str = t._buildRows(start, count, uncachedRows, renderedRows);
				t.renderStart = start;
				t.renderCount = count;
				n.scrollTop = 0;
				//FIX ME: has('ie')is not working under IE 11
				//use has('trident') here to judget IE 11
				if(has('ie') || has('trident')){
					//In IE, setting innerHTML will completely destroy the node,
					//But CellWidget still need it.
					while(n.childNodes.length){
						n.removeChild(n.firstChild);
					}
				}
				n.innerHTML = str;
				if(t._topNode && g.view.rootStart > 0){
					if(str){
						n.insertBefore(t._topNode, n.firstChild);
					}else{
						n.appendChild(t._topNode);
					}
				}
				if(t._bottomNode && g.view.rootStart + g.view.rootCount < g.model.size()){
					n.appendChild(t._bottomNode);
				}
				n.scrollLeft = g.hScrollerNode.scrollLeft;
				if(!str){
					en.style.zIndex = 1;
				}else{
					en.innerHTML = '';
				}
				if(!t._skipUnrender){
					t.onUnrender();
				}
				array.forEach(renderedRows, t.onAfterRow, t);
				Deferred.when(t._buildUncachedRows(uncachedRows), function(){
					t.onRender(start, count);
				});
			}else if(!{top: 1, bottom: 1}[position]){
				n.scrollTop = 0;
				//FIX ME: has('ie')is not working under IE 11
				//use has('trident') here to judget IE 11
				if(has('ie') || has('trident')){
					//In IE, setting innerHTML will completely destroy the node,
					//But CellWidget still need it.
					while(n.childNodes.length){
						n.removeChild(n.firstChild);
					}
				}
				n.innerHTML = '';
				if(!t._skipUnrender){
					t.onUnrender();
				}
				if(!t.model.size()){
					en.innerHTML = t.arg('emptyInfo', g.nls.emptyInfo);
					en.style.zIndex = 1;
					t.onEmpty();
					t.model.free();
				}else{
					n.appendChild(t._bottomNode);
				}
			}
		},

		onRender: function(/*start, count*/){
			//FIX #8746
			var t = this;
			var bn = t.domNode;
			query('.gridxBodyFirstRow', bn).removeClass('gridxBodyFirstRow');
			if(t._topNode){
				var firstRow = t._topNode.nextSibling;
				if(firstRow && firstRow != t._bottomNode){
					domClass.add(firstRow, 'gridxBodyFirstRow');
				}
			}
			query('.gridxBodyLastRow', bn).removeClass('gridxBodyLastRow');
			if(t._bottomNode){
				var lastRow = t._bottomNode.previousSibling;
				if(lastRow && lastRow != t._topNode){
					domClass.add(lastRow, 'gridxBodyLastRow');
				}
			}
		},

		_load: function(isPost){
			var t = this,
				g = t.grid,
				m = t.model,
				view = g.view,
				pageSize = t.arg('pageSize'),
				btnNode = isPost ? t._bottomNode : t._topNode,
				start = view.rootStart,
				count = view.rootCount,
				newRootStart = isPost ? start : start < pageSize ? 0 : start - pageSize,
				newRootCount = isPost ? count + pageSize : start + count - newRootStart,
				finish = function(renderStart, renderCount){
					t._busy(isPost);
					t._onLoadFinish(!isPost, renderStart, renderCount, function(){
						t.onRender(renderStart, renderCount);
						if(g.indirectSelect){
							//FIXME: this breaks encapsulation!
							g.indirectSelect._onSelectionChange();
						}
					});
				};
			t._busy(isPost, 1);
			m.when({
				start: isPost ? start + count : newRootStart,
				count: isPost ? pageSize : start - newRootStart
			}, function(){
				var totalCount = m.size();
				if(isPost && newRootStart + newRootCount > totalCount){
					newRootCount = totalCount - newRootStart;
				}
				view.updateRootRange(newRootStart, newRootCount).then(function(){
					var renderStart = isPost ? t.renderCount : 0,
						renderCount = view.visualCount - t.renderCount;
					t.renderStart = 0;
					t.renderCount = view.visualCount;
					if(renderCount){
						var toFetch = [];
						for(var i = 0; i < renderCount; ++i){
							var rowInfo = view.getRowInfo({visualIndex: renderStart + i});
							if(!m.isId(rowInfo.id)){
								toFetch.push({
									parentId: rowInfo.parentId,
									start: rowInfo.rowIndex,
									count: 1
								});
							}
						}
						m.when(toFetch, function(){
							var renderedRows = [],
								scrollHeight = g.bodyNode.scrollHeight,
								str;
							str = t._buildRows(renderStart, renderCount, [], renderedRows);
							if(btnNode){
								domConstruct.place(str, btnNode, isPost ? 'before' : 'after');
							}else{
								domConstruct.place(str, t.domNode, isPost ? 'last' : 'first');
							}
							if(!isPost){
								g.bodyNode.scrollTop += g.bodyNode.scrollHeight - scrollHeight;
							}
							if(isPost && btnNode && btnNode.parentNode ? view.rootStart + view.rootCount >= totalCount : view.rootStart === 0){
								t.domNode.removeChild(btnNode);
							}
							array.forEach(renderedRows, t.onAfterRow, t);
							finish(renderStart, renderCount);
						});
					}else{
						if(isPost && btnNode && btnNode.parentNode && view.rootStart + view.rootCount >= totalCount){
							t.domNode.removeChild(btnNode);
						}
						if(!isPost){
							query('.gridxBodyFirstRow').removeClass('gridxBodyFirstRow');
						}
						finish(renderStart, renderCount);
					}
				});
			});
		}
	});
});
