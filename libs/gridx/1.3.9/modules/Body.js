define([
	"dojo/_base/declare",
	// "dojo/query",
	'../support/query',
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/_base/Deferred",
	"dojo/_base/sniff",
	"dojo/on",
	"dojo/keys",
	"../core/_Module"
//    "dojo/NodeList-dom",
//    "dojo/NodeList-traverse"
], function(declare, query, array, lang, json, domConstruct, domClass, 
			Deferred, has, on, keys, _Module){

/*=====
	Row.node = function(){
		// summary:
		//		Get the dom node of this row.
		// returns:
		//		DOMNode|null
	};

	Cell.node = function(){
		// summary:
		//		Get the dom node of this cell.
		// returns:
		//		DOMNode|null
	};

	Cell.contentNode = function(){
		// summary:
		//		Get the dom node in this cell that actually contains data.
		//		This function is useful if some modules (e.g. Tree) wraps cell data with some extra html.
		// returns:
		//		DOMNode|null
	};

	var Body = declare(_Module, {
		// summary:
		//		module name: body.
		//		The body UI of grid.
		// description:
		//		This module is in charge of row rendering. It should be compatible with virtual/non-virtual scroll, 
		//		pagination, details on demand, and even tree structure.

		// loadingInfo: String
		//		The loading message shown in grid body. Default to use nls files.
		loadingInfo: '',

		// emptyInfo: String
		//		The message shown in grid body when there's no row to show. Default to use nls files.
		emptyInfo: '',

		// loadFailInfo: String
		//		The error message shown in grid body when there's some error orrured during loading. Default to use nls files.
		loadFailInfo: '',

		// rowHoverEffect: Boolean
		//		Whether to show a visual effect when mouse hovering a row.
		rowHoverEffect: true,

		// renderedIds: Object
		//		This object contains the current renderred rows Ids.
		//		For grid not using virtualVSroller, this is equal to current row ids in the grid body.
		renderedIds: {},
		// stuffEmptyCell: Boolean
		//		Whether to stuff a cell with &nbsp; if it is empty.
		stuffEmptyCell: true,

		// renderWholeRowOnSet: Boolean
		//		If true, the whole row will be re-rendered even if only one field has changed.
		//		Default to false, so that only one cell will be re-rendered editing that cell.
		renderWholeRowOnSet: false,

		// compareOnSet: Function
		//		When data is changed in store, compare the old data and the new data of grid, return true if
		//		they are the same, false if not, so that the body can decide whether to refresh the corresponding cell.
		compareOnSet: function(v1, v2){},

		getRowNode: function(args){
			// summary:
			//		Get the DOM node of a row
			// args: View.__RowInfo
			//		A row info object containing row index or row id
			// returns:
			//		The DOM node of the row. Null if not found.
		},

		getCellNode: function(args){
			// summary:
			//		Get the DOM node of a cell
			// args: View.__CellInfo
			//		A cell info object containing sufficient info
			// returns:
			//		The DOM node of the cell. Null if not found.
		},

		refresh: function(start){
			// summary:
			//		Refresh the grid body
			// start: Integer?
			//		The visual row index to start refresh. If omitted, default to 0.
			// returns:
			//		A deferred object indicating when the refreshing process is finished.
		},

		refreshCell: function(rowVisualIndex, columnIndex){
			// summary:
			//		Refresh a single cell
			// rowVisualIndex: Integer
			//		The visual index of the row of this cell
			// columnIndex: Integer
			//		The index of the column of this cell
			// returns:
			//		A deferred object indicating when this refreshing process is finished.
		},

		// renderStart: [readonly] Integer
		//		The visual row index of the first renderred row in the current body
		renderStart: 0,

		// renderCount: [readonly] Integer
		//		The count of renderred rows in the current body.
		renderCount: 0,
	
		// autoUpdate: [private] Boolean
		//		Update grid body automatically when onNew/onSet/onDelete is fired
		autoUpdate: true,

		onAfterRow: function(row){
			// summary:
			//		Fired when a row is created, data is filled in, and its node is inserted into the dom tree.
			// row: gridx.core.Row
			//		A row object representing this row.
		},
		
		onRowHeightChange: function(row){
			// summary:
			//		Fired when a row node's height is changed.
			//		This is different from onAfterRow since the row node is already there but the style/height is changed.
			//
			// row: gridx.core.Row | rowId
			//		A row object representing this row or rowId.
		},

		onAfterCell: function(cell){
			// summary:
			//		Fired when a cell is updated by cell editor (or store data change), or by cell refreshing.
			//		Note this is not fired when rendering the whole grid. Use onAfterRow in that case.
			// cell: grid.core.Cell
			//		A cell object representing this cell
		},

		onRender: function(start, count, flag){
			// summary:
			//		Fired everytime the grid body content is rendered or updated.
			// start: Integer
			//		The visual index of the start row that is affected by this rendering. If omitted, all rows are affected.
			// flag: Object
			//		Some info can be carried by the flag attribute.
			// count: Integer
			//		The count of rows that is affected by this rendering. If omitted, all rows from start are affected.
		},

		onUnrender: function(){
			// summary:
			//		Fired when a row is unrendered (removed from the grid dom tree).
			//		Usually, this event is only useful when using virtual scrolling.
			// id: String|Number
			//		The ID of the row that is unrendered.
		},

		onCheckCustomRow: function(row, output){
			// summary:
			//		Fired before creating every row, giving user a chance to customize the entire row.
			// row: grid.core.Row
			//		A row object representing this row
			// output: Object
			//		If the given row should be customized, set output[row.id] to truthy.
		},

		onBuildCustomRow: function(row, output){
			// summary:
			//		Fired if onCheckCustomRow decides to customize this row.
			// row: grid.core.Row
			//		A row object representing this row
			// output: Object
			//		Set output[row.id] = some html string to render the row.
		},

		onDelete: function(){
			// summary:
			//		Fired when a row in current view is deleted from the store.
			//		Note if the deleted row is not visible in current view, this event will not fire.
			// id: String|Number
			//		The ID of the deleted row.
			// index: Integer
			//		The index of the deleted row.
		},

		onSet: function(row){
			// summary:
			//		Fired when a row in current view is updated in store.
			// row: gridx.core.Row
			//		A row object representing the updated row.
		},

		onMoveToCell: function(){
			// summary:
			//		Fired when the focus is moved to a body cell by keyboard.
			// tags:
			//		private
		},

		onEmpty: function(){
			// summary:
			//		Fired when there's no rows in current body view.
		},

		onLoadFail: function(){
			// summary:
			//		Fire when there's an error occured when loading data.
		},

		onForcedScroll: function(){
			// summary:
			//		Fired when the body needs to fetch more data, but there's no trigger to the scroller.
			//		This is an inner mechanism to solve some problems when using virtual scrolling or pagination.
			//		This event should not be used by grid users.
			// tags:
			//		private
		},

		collectCellWrapper: function(){
			// summary:
			//		Fired when a cell is being rendered, so as to collect wrappers for the content in this cell.
			//		This is currently an inner mechanism used to implement widgets in cell and tree node.
			// tags:
			//		private
			// wrappers: Array
			//		An array of functions with signature function(cellData, rowId, colId) and should return a string to replace
			//		cell data. The connectors of this event should push a new wrapper function in this array.
			//		The functions in this array can also carry a number typed "priority" property.
			//		The wrappers will be executed in ascending order of this "priority" function.
			// rowId: String|Number
			//		The row ID of this cell
			// colId: String|Number
			//		The column ID of this cell.
		}
	});

	return Body;
=====*/

	return declare(_Module, {
		name: "body",

		forced: ['view'],

		constructor: function(){
			var t = this,
				g = t.grid,
				dn = t.domNode = g.bodyNode;
			t._cellCls = {};
			t.renderedIds = {};
			if(t.arg('rowHoverEffect')){
				domClass.add(dn, 'gridxBodyRowHoverEffect');
			}
			g.emptyNode.innerHTML = t.arg('loadingInfo', g.nls.loadingInfo);
			g._connectEvents(dn, '_onEvent', t);
			t.aspect(t.model, 'onDelete', '_onDelete');
			t.aspect(t.model, 'onSet', '_onSet');
			if(!g.touch){
				t.aspect(g, 'onRowMouseOver', '_onRowMouseOver');
				t.connect(g.mainNode, 'onmouseleave', function(){
					query('> .gridxRowOver', t.domNode).removeClass('gridxRowOver');
				});
				t.connect(g.mainNode, 'onmouseover', function(e){
					if(e.target == g.bodyNode){
						query('> .gridxRowOver', t.domNode).removeClass('gridxRowOver');
					}
				});
			}
			t.aspect(g.model, 'setStore', function(){
				t.refresh();
			});
		},

		preload: function(){
			this._initFocus();
		},

		load: function(args){
			var t = this,
				view = t.grid.view;
			t.aspect(view, 'onUpdate', 'lazyRefresh');
			if(view._err){
				t._loadFail(view._err);
			}
			t.loaded.callback();
		},

		destroy: function(){
			this.inherited(arguments);
			this.domNode.innerHTML = '';
			this._destroyed = true;
		},

		rowMixin: {
			node: function(){
				return this.grid.body.getRowNode({
					rowId: this.id
				});
			}
		},

		cellMixin: {
			node: function(){
				return this.grid.body.getCellNode({
					rowId: this.row.id,
					colId: this.column.id
				});
			},
			contentNode: function(){
				var node = this.node();
				return node && query('.gridxCellContent', node)[0] || node;
			}
		},

		rowHoverEffect: true,

		stuffEmptyCell: true,

		renderWholeRowOnSet: false,

		renderStart: 0,

		renderCount: 0,

		autoUpdate: true,

		renderedIds: {},

		compareOnSet: function(v1, v2){
			return typeof v1 == 'object' && typeof v2 == 'object' ?
				json.toJson(v1) == json.toJson(v2) :
				v1 === v2;
		},

		addClass: function(rowId, colId, cls){
			var cellCls = this._cellCls,
				r = cellCls[rowId] = cellCls[rowId] || {},
				c = r[colId] = r[colId] || [];
			if(array.indexOf(c, cls) < 0){
				c.push(cls);
				domClass.add(this.getCellNode({
					rowId: rowId,
					colId: colId
				}), cls);
			}
		},

		removeClass: function(rowId, colId, cls){
			var cellCls = this._cellCls,
				r = cellCls[rowId],
				c = r && r[colId],
				idx = c && array.indexOf(c, cls);
			if(idx >= 0){
				c.splice(idx, 1);
				domClass.remove(this.getCellNode({
					rowId: rowId,
					colId: colId
				}), cls);
			}
		},

		getRowNode: function(args){
			//FIX ME: has('ie')is not working under IE 11
			//use has('trident') here to judget IE 11
			if(this.model.isId(args.rowId) && (has('ie') || has('trident'))){
				return this._getRowNode(args.rowId);
			}else{
				var rowQuery = this._getRowNodeQuery(args);
				return rowQuery && query('> ' + rowQuery, this.domNode)[0] || null;	//DOMNode|null
			}
		},

		getCellNode: function(args){
			var t = this,
				colId = args.colId,
				cols = t.grid._columns,
				r = t._getRowNodeQuery(args);
			if(r){
				if(!colId && cols[args.colIndex]){
					colId = cols[args.colIndex].id;
				}
				var c = " [colid='" + colId + "'].gridxCell";
				//FIX ME: has('ie')is not working under IE 11
				//use has('trident') here to judget IE 11
				if(t.model.isId(args.rowId) && (has('ie') || has('trident'))){
					var rowNode = t._getRowNode(args.rowId);
					return rowNode && query(c, rowNode)[0] || null;
				}else{
					return query(r + c, t.domNode)[0] || null;
				}
			}
			return null;
		},

		refresh: function(start){
			var t = this,
				loadingNode = t.grid.loadingNode,
				d = new Deferred();
			delete t._err;
			clearTimeout(t._sizeChangeHandler);
			domClass.toggle(t.domNode, 'gridxBodyRowHoverEffect', t.arg('rowHoverEffect'));

			// cache visual ids
			// t.renderedIds = {};
			
			// domClass.add(loadingNode, 'gridxLoading');
			t._showLoadingMask();
			t.grid.view.updateVisualCount().then(function(){
				try{
					var rs = t.renderStart,
						rc = t.renderCount,
						vc = t.grid.view.visualCount;
					if(rs + rc > vc){
						if(rc < vc){
							rs = t.renderStart = vc - rc;
						}else{
							rs = t.renderStart = 0;
							rc = vc;
						}
					}
					if(typeof start == 'number' && start >= 0){
						start = rs > start ? rs : start;
						var count = rs + rc - start,
							n = query('> [visualindex="' + start + '"]', t.domNode)[0],
							uncachedRows = [],
							renderedRows = [];
						if(n){
							var rows = t._buildRows(start, count, uncachedRows, renderedRows);
							if(rows){
								domConstruct.place(rows, n, 'before');
							}
						}
						var rowIds = {};
						array.forEach(renderedRows, function(row){
							rowIds[row.id] = 1;
						});
						while(n){
							var tmp = n.nextSibling,
								id = n.getAttribute('rowid');
							if(!rowIds[id]){
								//Unrender this row only when it is not being rendered now.
								//Set a special flag so that RowHeader won't destroy its nodes.
								//FIXME: this is ugly...
								t.onBeforeUnrender(id);
								t.onUnrender(id, 'refresh');
								t.renderedIds[id] = undefined;
							}
							domConstruct.destroy(n);
							// t.renderedIds[id] = undefined;
							n = tmp;
						}
						array.forEach(renderedRows, t.onAfterRow, t);
						Deferred.when(t._buildUncachedRows(uncachedRows), function(){
							t.onRender(start, count);
							t.onForcedScroll();
							// domClass.remove(loadingNode, 'gridxLoading');
							t._hideLoadingMask();
							d.callback();
						});
					}else{
						t.renderRows(rs, rc, 0, 1);
						t.onForcedScroll();
						// t._hideLoadingMask();
						// domClass.remove(loadingNode, 'gridxLoading');
						d.callback();
					}
				}catch(e){
					t._loadFail(e);
					// domClass.remove(loadingNode, 'gridxLoading');
					t._hideLoadingMask();
					d.errback(e);
				}
			}, function(e){
				t._loadFail(e);
				// domClass.remove(loadingNode, 'gridxLoading');
				t._hideLoadingMask();
				d.errback(e);
			});
			return d;
		},

		refreshCell: function(rowVisualIndex, columnIndex){
			var d = new Deferred(),
				t = this,
				m = t.model,
				g = t.grid,
				col = g._columns[columnIndex],
				cellNode = col && t.getCellNode({
					visualIndex: rowVisualIndex,
					colId: col.id
				});
			if(cellNode){
				var rowCache,
					rowInfo = g.view.getRowInfo({visualIndex: rowVisualIndex}),
					idx = rowInfo.rowIndex,
					pid = rowInfo.parentId;
				m.when({
					start: idx,
					count: 1,
					parentId: pid
				}, function(){
					rowCache = m.byIndex(idx, pid);
					if(rowCache){
						rowInfo.rowId = m.indexToId(idx, pid);
						var cell = g.cell(rowInfo.rowId, col.id, 1),
							isPadding = g.tree && g.tree.isPaddingCell(rowInfo.rowId, col.id);
						cellNode.innerHTML = t._buildCellContent(col, rowInfo.rowId, cell, rowVisualIndex, isPadding);
						t.onAfterCell(cell);
					}
				}).then(function(){
					d.callback(!!rowCache);
				});
				return d;
			}
			d.callback(false);
			return d;
		},

		lazyRefresh: function(){
			var t = this;
			clearTimeout(t._sizeChangeHandler);
			t._sizeChangeHandler = setTimeout(function(){
				if(!t._destroyed){
					t.refresh();
				}
			}, 10);
		},

		renderRows: function(start, count, position/*?top|bottom*/, isRefresh){
			var t = this,
				g = t.grid,
				str = '',
				uncachedRows = [], 
				renderedRows = [],
				n = t.domNode,
				en = g.emptyNode,
				emptyInfo = t.arg('emptyInfo', g.nls.emptyInfo),
				finalInfo = '';
			if(t._err){
				return;
			}
			if(count > 0){
				// en.innerHTML = t.arg('loadingInfo', g.nls.loadingInfo);
				// en.style.zIndex = '';
				if(position != 'top' && position != 'bottom'){
					t.model.free();
				}
				if(position == 'top'){
					str = t._buildRows(start, count, uncachedRows, renderedRows);
					t.renderCount += t.renderStart - start;
					t.renderStart = start;
					domConstruct.place(str, n, 'first');
					//unrender out-of-range rows immediately, so that CellWidget can reuse the widgets.
					//FIXME: need a better solution here!
					if(g.cellWidget && g.vScroller._updateRowHeight){
						var oldEnd = t.renderStart + t.renderCount,
							postCount = g.vScroller._updateRowHeight('post');
						if(oldEnd - postCount < start + count){
							count = oldEnd - postCount - start;
						}
					}
				}else if(position == 'bottom'){
					str = t._buildRows(start, count, uncachedRows, renderedRows);
					t.renderCount = start + count - t.renderStart;
					domConstruct.place(str, n, 'last');
					//unrender out-of-range rows immediately, so that CellWidget can reuse the widgets.
					//FIXME: need a better solution here!
					if(g.cellWidget && g.vScroller._updateRowHeight){
						g.vScroller._updateRowHeight('pre');
						if(t.renderStart > start){
							start = t.renderStart;
							count = t.renderCount;
						}
					}
				}else{
					t.renderStart = start;
					t.renderCount = count;
					//If is refresh, try to maintain the scroll top
					var scrollTop = isRefresh ? n.scrollTop : 0;
					//unrender before destroy nodes, so that other modules have a chance to detach nodes.
					if(!t._skipUnrender){
						//only when we do have something to unrender
						t.onBeforeUnrender();
						t.onUnrender();
					}
					// while(n.firstChild){
					// 	id = n.firstChild.getAttribute('rowid');
					// 	n.removeChild(n.firstChild);
					// 	if(g.model.isId(id)){
					// 		t.renderedIds[id] = undefined;
					// 	}
					// }
					// reset renderedIds since all rows in body are destroyed
					t.renderedIds = {};
					str = t._buildRows(start, count, uncachedRows, renderedRows);
					n.innerHTML = str;
					n.scrollTop = scrollTop;
					n.scrollLeft = g.hScrollerNode.scrollLeft;
					finalInfo = str ? "" : emptyInfo;
					if(!str){
						en.style.zIndex = 1;
					}
				}
				array.forEach(renderedRows, t.onAfterRow, t);
				Deferred.when(t._buildUncachedRows(uncachedRows), function(){
					if(!t._err){
						en.innerHTML = finalInfo;
					}
					t._hideLoadingMask();
					t.onRender(start, count);
				});
			}else if(!{top: 1, bottom: 1}[position]){
				var id  = 0;
				n.scrollTop = 0;
				//unrender before destroy nodes, so that other modules have a chance to detach nodes.
				if(!t._skipUnrender){
					//only when we do have something to unrender
					t.onBeforeUnrender();
					t.onUnrender();
				}
				while(n.firstChild){
					id = n.firstChild.getAttribute('rowid');
					n.removeChild(n.firstChild);
				}
				//reset renderedIds since all rows in body are destroyed.
				t.renderedIds = {};
				en.innerHTML = emptyInfo;
				en.style.zIndex = 1;
				t._hideLoadingMask();
				t.onEmpty();
				t.model.free();
			}
		},

		unrenderRows: function(count, preOrPost){
			if(count > 0){
				//Just remove the nodes from DOM tree instead of destroying them,
				//in case other logic still needs these nodes.
				var t = this, m = t.model, i = 0, id, bn = t.domNode;
				if(preOrPost == 'post'){
					for(; i < count && bn.lastChild; ++i){
						id = bn.lastChild.getAttribute('rowid');
						if(m.isId(id)){
							m.free(id);
							t.onBeforeUnrender(id);
							t.onUnrender(id);
						}else{
							//sometimes, unrendered row has id as null(happens in vv)
							//this will make rowHeader unsync with rows
							//explicitly tell rowHeader to treat this tricky scenerio
							t.onBeforeUnrender(id);
							t.onUnrender(id, undefined, 'post');
						}
						domConstruct.destroy(bn.lastChild);
						t.renderedIds[id] = undefined;
					}
				}else{
					var tp = bn.scrollTop;
					for(; i < count && bn.firstChild; ++i){
						id = bn.firstChild.getAttribute('rowid');
						var rh = bn.firstChild.getAttribute("data-rowHeight");
						tp -= rh ? parseInt(rh, 10) : bn.firstChild.offsetHeight;
						if(m.isId(id)){
							m.free(id);
							t.onBeforeUnrender(id);
							t.onUnrender(id);
						}else{
							t.onBeforeUnrender(id);
							t.onUnrender(id , undefined, 'pre');
						}
						domConstruct.destroy(bn.firstChild);
						t.renderedIds[id] = undefined;
					}
					t.renderStart += i;
					bn.scrollTop = tp > 0 ? tp : 0;
				}
				t.renderCount -= i;
				//Force check cache size
				m.when();
			}
		},

		//Events--------------------------------------------------------------------------------
		onAfterRow: function(){/* row */},

		onRowHeightChange: function(/*id*/){},

		onAfterCell: function(){/* cell */},

		onRender: function(/*start, count, flag*/){
			//FIX #8746
			var bn = this.domNode;
			if(has('ie') < 9 && bn.childNodes.length){
				query('> gridxLastRow', bn).removeClass('gridxLastRow');
				domClass.add(bn.lastChild, 'gridxLastRow');
			}
		},

		onBeforeUnrender: function(/* id, refresh, preOrPost*/){},

		onUnrender: function(/* id, refresh, preOrPost*/){},

		onDelete: function(/*id, index*/){},

		onSet: function(/* row */){},

		onMoveToCell: function(){},

		onEmpty: function(){},

		onLoadFail: function(){},

		onForcedScroll: function(){},

		collectCellWrapper: function(/* wrappers, rowId, colId */){},

		//Private---------------------------------------------------------------------------
		_showLoadingMask: function(){
			var t = this,
				g = t.grid,
				ln = g.loadingNode,
				en = g.emptyNode;

			domClass.add(ln, 'gridxLoading');
			en.innerHTML = g.nls.loadingInfo;
			en.style.zIndex = 1;
		},

		_hideLoadingMask: function(){
			var t = this,
				g = t.grid,
				ln = g.loadingNode,
				en = g.emptyNode;

			domClass.remove(ln, 'gridxLoading');
			// en.innerHTML = g.nls.loadingInfo;
			en.style.zIndex = '';
		},

		_getRowNodeQuery: function(args){
			var r, m = this.model, escapeId = this.grid._escapeId;
			if(m.isId(args.rowId)){
				r = "[rowid='" + escapeId(args.rowId) + "']";
			}else if(typeof args.rowIndex == 'number' && args.rowIndex >= 0){
				r = "[rowindex='" + args.rowIndex + "']" + (m.isId(args.parentId) ? "[parentid='" + escapeId(args.parentId) + "']" : '');
			}else if(typeof args.visualIndex == 'number' && args.visualIndex >= 0){
				r = "[visualindex='" + args.visualIndex + "']";
			}
			return r && r + '.gridxRow';
		},

		_getRowNode: function(id){
			//TODO: this should be resolved in dojo.query!
			//In IE, some special ids (with special charactors in it, e.g. "+") can not be queried out.
			for(var i = 0, rows = this.domNode.childNodes, row; row = rows[i]; ++i){
				if(row.getAttribute('rowid') == id){
					return row;
				}
			}
			return null;
		},

		_loadFail: function(e){
			console.error(e);
			var en = this.grid.emptyNode;
			en.innerHTML = this.arg('loadFailInfo', this.grid.nls.loadFailInfo);
			en.style.zIndex = 1;
			this.domNode.innerHTML = '';
			this._err = e;
			this.onEmpty();
			this.onLoadFail(e);
		},

		_buildRows: function(start, count, uncachedRows, renderedRows){
			var t = this,
				end = start + count,
				s = [],
				g = t.grid,
				w = t.domNode.scrollWidth,
				columns = g.columns(),
				encode = this.grid._encodeHTML,
				i = start;

			for(; i < end; ++i){
				var rowInfo = g.view.getRowInfo({visualIndex: i}),
					row = g.row(rowInfo.rowId, 1);
				s.push('<div class="gridxRow ', i % 2 ? 'gridxRowOdd' : '',
					'" role="row" visualindex="', i);
				t.renderedIds[rowInfo.rowId] = 1;
				if(row){
					t.model.keep(row.id);
					s.push('" rowid="', encode(row.id),
						'" rowindex="', rowInfo.rowIndex,
						'" parentid="', encode(rowInfo.parentId),
						'">', t._buildCells(row, i, columns),
					'</div>');
					renderedRows.push(row);
				}else{
					s.push('"><div class="gridxRowDummy" style="width:', w, 'px;"></div></div>');
					rowInfo.start = rowInfo.rowIndex;
					rowInfo.count = 1;
					uncachedRows.push(rowInfo);
				}
			}
			return s.join('');
		},

		_buildUncachedRows: function(uncachedRows){
			var t = this;
			return uncachedRows.length && t.model.when(uncachedRows, function(){
				try{
					array.forEach(uncachedRows, t._buildRowContent, t);
				}catch(e){
					t._loadFail(e);
				}
			}).then(null, function(e){
				t._loadFail(e);
			});
		},

		_buildRowContent: function(rowInfo){
			var t = this,
				n = query('> [visualindex="' + rowInfo.visualIndex + '"]', t.domNode)[0];
			if(n){
				var row = t.grid.row(rowInfo.rowIndex, 0, rowInfo.parentId);
				if(row){
					t.model.keep(row.id);
					n.setAttribute('rowid', row.id);
					n.setAttribute('rowindex', rowInfo.rowIndex);
					n.setAttribute('parentid', rowInfo.parentId || '');
					n.innerHTML = t._buildCells(row, rowInfo.visualIndex);
					t.renderedIds[row.id] = 1;
					t.onAfterRow(row);
				}else{
					console.error('Error in Body._buildRowContent: Row is not in cache: ' + rowInfo.rowIndex);
				}
			}
		},

		onCheckCustomRow: function(row, output){},

		onBuildCustomRow: function(row, output){},

		_buildCells: function(row, visualIndex, cols){
			var t = this,
				rowId = row.id,
				sb = ['<table class="gridxRowTable" role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>'],
				output = {};
			t.onCheckCustomRow(row, output);
			if(output[rowId]){
				output = {};
				t.onBuildCustomRow(row, output);
				sb.push('<td class="gridxCustomRow" aria-readonly="true" role="gridcell" tabindex="-1">',
					t._wrapCellData(output[rowId], rowId),
					'</td>');
			}else{
				var g = t.grid,
					isFocusedRow = g.focus.currentArea() == 'body' && t.model.idToIndex(t._focusCellRow) === visualIndex,
					rowData = t.model.byId(rowId).data,
					columns = g._columns,
					cellCls = t._cellCls[rowId] || {};
				for(var i = 0, len = columns.length; i < len; ++i){
					var col = columns[i],
						colId = col.id,
						colWidth = col.width,
						isPadding = g.tree && g.tree.isPaddingCell(rowId, colId),
						customCls = col['class'],
						cellData = rowData[colId],
						customClsIsFunction = customCls && lang.isFunction(customCls),
						styleIsFunction = col.style && lang.isFunction(col.style),
						needCell = customClsIsFunction || styleIsFunction || (!isPadding && col.decorator),
						cell = needCell && g.cell(row, cols && cols[i] || colId, 1);

					var cellContent = t._buildCellContent(col, rowId, cell, visualIndex, isPadding, cellData),
						testNode = domConstruct.create('div', {innerHTML: cellContent}), isEmpty,
						testNodeInnerText = testNode.innerText,
						testNodeContent = (testNodeInnerText !== undefined && testNodeInnerText !== null) ? testNodeInnerText : testNode.textContent;
						testNodeContent = testNodeContent.trim ? testNodeContent.trim() : testNodeContent.replace(/\s/g, '');
						isEmpty = testNodeContent === '&nbsp;' || !testNodeContent;

					testNode = '';

					sb.push('<td aria-readonly="true" role="gridcell" tabindex="-1" aria-describedby="',
						col._domId,'" colid="', colId, '" class="gridxCell ',
						isFocusedRow && t._focusCellCol === i ? 'gridxCellFocus ' : '',
						isPadding ? 'gridxPaddingCell ' : '',
						col._class || '', ' ',
						(customClsIsFunction ? customCls(cell) : customCls) || '', ' ',
						cellCls[colId] ? cellCls[colId].join(' ') : '',
						' " style="width:', colWidth, ';min-width:', colWidth, ';max-width:', colWidth, ';',
						g.getTextDirStyle(colId, cellData),
						(styleIsFunction ? col.style(cell) : col.style) || '',
						//when cell content is empty, need to add aria-labssel
						isEmpty? '" aria-label="empty cell' : '',
						'">', cellContent,
					'</td>');
				}
			}
			sb.push('</tr></table>');
			return sb.join('');
		},

		_buildCellContent: function(col, rowId, cell, visualIndex, isPadding, cellData){
			var r = '',
				data = cellData === undefined && cell ? cell.data() : cellData;
			if(!isPadding){
				var s = col.decorator ? col.decorator(data, rowId, visualIndex, cell) : data;
				r = this._wrapCellData(s, rowId, col.id);
			}
			return (r === '' || r === null || r === undefined) && (has('ie') < 8 || this.arg('stuffEmptyCell')) ? '&nbsp;' : r;
		},

		_wrapCellData: function(cellData, rowId, colId){
			var wrappers = [];
			this.collectCellWrapper(wrappers, rowId, colId);
			var i = wrappers.length - 1;
			if(i > 0){
				wrappers.sort(function(a, b){
					return (a.priority || 0) - (b.priority || 0);
				});
			}
			for(; i >= 0; --i){
				cellData = wrappers[i].wrap(cellData, rowId, colId);
			}
			return cellData;
		},

		//Events-------------------------------------------------------------
		_onEvent: function(eventName, e){
			var g = this.grid,
				evtCell = 'onCell' + eventName,
				evtRow = 'onRow' + eventName, evtName;

			this._decorateEvent(e);
			if(e.rowId){
				if(e.columnId){
					g[evtCell](e);
					on.emit(e.target, 'cell' + eventName, e);
				}
				g[evtRow](e);
				on.emit(e.target, 'row' + eventName, e);
			}
		},

		_decorateEvent: function(e){
			//clean decorates from bubble
			//need to re-decorate the event when bubbling
			var atrs = ['rowId', 'columnId', 'rowIndex', 'visualIndex', 'columnIndex', 'parentId', 'cellNode'];
			array.forEach(atrs, function(atr){
				if(atr in e){ 
					delete e[atr]; 
				}
			});
			
			var n = e.target || e.originalTarget,
				g = this.grid,
				tag;
			for(; n && n != g.bodyNode; n = n.parentNode){
				tag = n.tagName && n.tagName.toLowerCase();
				if(tag == 'td' && domClass.contains(n, 'gridxCell') && 
					n.parentNode.parentNode.parentNode.parentNode.parentNode === g.bodyNode){
						
					var col = g._columnsById[n.getAttribute('colid')];
					e.cellNode = n;
					e.columnId = col.id;
					e.columnIndex = col.index;
				}
				if(tag == 'div' && domClass.contains(n, 'gridxRow') && n.parentNode === g.bodyNode){
					e.rowId = n.getAttribute('rowid');
					e.parentId = n.getAttribute('parentid');
					e.rowIndex = parseInt(n.getAttribute('rowindex'), 10);
					e.visualIndex = parseInt(n.getAttribute('visualindex'), 10);
				}
				if(tag == 'table' && domClass.contains(n, 'gridxRowTable') && n.parentNode.parentNode === g.bodyNode){
					n = n.parentNode;
					e.rowId = n.getAttribute('rowid');
					e.parentId = n.getAttribute('parentid');
					e.rowIndex = parseInt(n.getAttribute('rowindex'), 10);
					e.visualIndex = parseInt(n.getAttribute('visualindex'), 10);
					return;
				}
			}
		},

		//Store Notification-------------------------------------------------------------------
		_onDelete: function(id, index, treePath){
			var t = this;
			//only necessary for child row deletion.
			if(treePath && treePath.length > 1){
				t.lazyRefresh();
			}
		},

		_onSet: function(id, index, rowCache, oldCache){
			var t = this;
			if(t.autoUpdate && rowCache){
				var g = t.grid,
					row = g.row(id, 1),
					rowNode = row && row.node();
				if(rowNode){
					var curData = rowCache.data || rowCache._data(),
						oldData = oldCache.data || oldCache._data(),
						cols = g._columns,
						renderWhole = t.arg('renderWholeRowOnSet'),
						compareOnSet = t.arg('compareOnSet');
					if(renderWhole){
						rowNode.innerHTML = t._buildCells(row, row.visualIndex());
						t.onAfterRow(row);
						t.onSet(row);
						t.onRender(index, 1);
					}else{
						array.forEach(cols, function(col){
							if(!compareOnSet(curData[col.id], oldData[col.id])){
								var isPadding = g.tree && g.tree.isPaddingCell(id, col.id),
									cell = row.cell(col.id, 1);
								//Support for Bidi begin
								if('auto' === (col.textDir || g.textDir)){
									var textDirValue = g.getTextDir(col.id, cell.node().innerHTML);
									if(textDirValue){
										cell.node().style.direction = textDirValue;
									}
								}
								//Support for Bidi end
								cell.node().innerHTML = t._buildCellContent(col, id, cell, row.visualIndex(), isPadding);
								t.onAfterCell(cell);
							}
						});
					}
				}
			}
		},

		//-------------------------------------------------------------------------------------
		_onRowMouseOver: function(e){
			var preNode = query('> div.gridxRowOver', this.domNode)[0],
				rowNode = this.getRowNode({rowId: e.rowId});
			if(preNode != rowNode){
				if(preNode){
					domClass.remove(preNode, 'gridxRowOver');
				}
				if(rowNode){
					domClass.add(rowNode, 'gridxRowOver');
				}
			}
		},
		//GridInGrid-------------------------------------------------------------------------------------
		_isDescendantRowNode: function(node){
			return node.parentNode === this.grid.bodyNode;
		},
		
		_isDescendantCellNode: function(node){
			return node.parentNode.parentNode.parentNode.parentNode.parentNode === this.grid.bodyNode;
		},

		//Focus------------------------------------------------------------------------------------------
		_focusCellCol: 0,
		_focusCellRow: 0,

		_initFocus: function(){
			var t = this,
				g = t.grid,
				focus = g.focus;
			focus.registerArea({
				name: 'body',
				priority: 1,
				focusNode: t.domNode,
				scope: t,
				doFocus: t._doFocus,
				doBlur: t._blurCell,
				onFocus: t._onFocus,
				onBlur: t._blurCell
			});
			t.connect(g.mainNode, 'onkeydown', function(evt){
				if(focus.arg('enabled') && focus.currentArea() == 'body'){
					var dk = keys,
						ctrlKey = g._isCtrlKey(evt);
					if(evt.keyCode == dk.HOME && !ctrlKey){
						t._focusCellCol = 0;
						t._focusCell();
						focus.stopEvent(evt);
					}else if(evt.keyCode == dk.END && !ctrlKey){
						t._focusCellCol = g._columns.length - 1;
						t._focusCell();
						focus.stopEvent(evt);
					}else if(!g.tree || !ctrlKey){
						focus._noBlur = 1;	//1 as true
						var arr = {}, dir = g.isLeftToRight() ? 1 : -1;
						arr[dk.LEFT_ARROW] = [0, -dir, evt];
						arr[dk.RIGHT_ARROW] = [0, dir, evt];
						arr[dk.UP_ARROW] = [-1, 0, evt];
						arr[dk.DOWN_ARROW] = [1, 0, evt];
						t._moveFocus.apply(t, arr[evt.keyCode] || []);
						focus._noBlur = 0;	//0 as false
					}
				}
			});
			t.aspect(g, 'onCellClick', function(evt){
				t._focusCellRow = t.model.indexToId(evt.visualIndex);
				t._focusCellCol = evt.columnIndex;
			});
			t.aspect(t, 'onRender', function(start, count){
				var currentArea = focus.currentArea();
				if(focus.arg('enabled')){
					if(currentArea == 'body'){
						var rowIdx = t.model.idToIndex(t._focusCellRow);						
						if(rowIdx >= start &&
							rowIdx < start + count){
							t._focusCell();
						}
					}else{
						focus.focusArea(currentArea, 1);
					}
				}
			});
			t.connect(g.emptyNode, 'onfocus', function(){
				focus.focusArea('body');
			});
		},

		_doFocus: function(evt){
			return this._focusCell(evt) || this._focusCell(0, -1, -1);
		},

		_focusCell: function(evt, rowVisIdx, colIdx){
			var t = this,
				g = t.grid;
			g.focus.stopEvent(evt);
			colIdx = colIdx >= 0 ? colIdx : t._focusCellCol;
			rowVisIdx = rowVisIdx >= 0 ? rowVisIdx : t.model.idToIndex(t._focusCellRow);
			var colId = g._columns[colIdx] ? g._columns[colIdx].id : undefined,
				n = t.getCellNode({
					visualIndex: rowVisIdx,
					colId: colId
				}) || t.getCellNode({
					visualIndex: 0,
					colId: colId
				});
			if(n){
				t._blurCell();
				domClass.add(n, 'gridxCellFocus');
				t._focusCellRow = t.model.indexToId(rowVisIdx);
				t._focusCellCol = colIdx;
				g.header._focusHeaderId = colId;
				
				if(has('ie') < 8){
					//In IE7 focus cell node will scroll grid to the left most.
					//So save the scrollLeft first and then set it back.
					//FIXME: this still makes the grid body shake, any better solution?
					var scrollLeft = g.bodyNode.scrollLeft;
					n.focus();
					g.bodyNode.scrollLeft = scrollLeft;
				}else{
					n.focus();
				}
				g.hScroller.scrollToColumn(colId, n.parentNode.parentNode.parentNode.parentNode);//this is for columnlock hack
			}else if(!g.rowCount()){
				g.emptyNode.focus();
				return true;
			}
			return n;
		},

		_moveFocus: function(rowStep, colStep, evt){
			if(rowStep || colStep){
				var r, c,
					t = this,
					g = t.grid, 
					columnCount = g._columns.length,
					vc = g.view.visualCount,
					//IE8 will destroy this event object after setTimeout
					e = has('ie') < 9 ? lang.mixin({}, evt) : evt;
				g.focus.stopEvent(evt); //Prevent scrolling the whole page.
				r = t.model.idToIndex(t._focusCellRow) + rowStep;
				r = r < 0 ? 0 : (r >= vc ? vc - 1 : r);
				c = t._focusCellCol + colStep;
				c = c < 0 ? 0 : (c >= columnCount ? columnCount - 1 : c);
				g.vScroller.scrollToRow(r).then(function(){
					t._focusCell(0, r, c);
					t.onMoveToCell(r, c, e);
				});
			}
		},

		_nextCell: function(r, c, dir, checker){
			var d = new Deferred(),
				g = this.grid,
				cc = g._columns.length,
				rc = g.view.visualCount;
			do{
				c += dir;
				if(c < 0 || c >= cc){
					r += dir;
					c = c < 0 ? cc - 1 : 0;
					if(r < 0){
						r = rc - 1;
						c = cc - 1;
					}else if(r >= rc){
						r = 0;
						c = 0;
					}
				}
			}while(!checker(r, c));
			g.vScroller.scrollToRow(r).then(function(){
				g.hScroller.scrollToColumn(g._columns[c].id);
				d.callback({r: r, c: c});
			});
			return d;
		},

		_blurCell: function(){
			return !!query('.gridxCellFocus', this.domNode).removeClass('gridxCellFocus');
		},

		_onFocus: function(evt){
			var bn = this.domNode,
				nl = query(evt.target).closest('.gridxCell', bn);

			//refocus body if target is bodynode itself
			if(evt.target == this.domNode){
				return true;
			}

			if(nl[0] && this._isDescendantCellNode(nl[0])){
				var colIndex = this.grid._columnsById[nl[0].getAttribute('colid')].index,
					visualIndex = parseInt(nl.closest('.gridxRow', bn)[0].getAttribute('visualindex'), 10);
				return this._focusCell(0, visualIndex, colIndex);
			}
			return false;
		}
	});
});
