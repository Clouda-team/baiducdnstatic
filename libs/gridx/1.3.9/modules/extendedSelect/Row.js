define([
/*====="../../core/Row", =====*/
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/event",
	// "dojo/query",
	'../../support/query',
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/_base/sniff",
	"dojo/dom-class",
	"dojo/mouse",
	"dojo/keys",
	"../../core/_Module",
	"./_RowCellBase"
], function(/*=====Row, =====*/declare, array, event, query, lang, Deferred, has, domClass, mouse, keys, _Module, _RowCellBase){

/*=====
	Row.select = function(){
		// summary:
		//		Select this row.
	};
	Row.deselect = function(){
		// summary:
		//		Deselect this row.
	};
	Row.isSelected = function(){
		// summary:
		//		Check whether this row is selected.
	};
	Row.isSelectable = function(){
		// summary:
		//		Check whether this row is selectable.
	};
	Row.setSelectable = function(selectable){
		// summary:
		//		Set this row to be selectable or not.
	};
	
	return declare(_RowCellBase, {
		// summary:
		//		module name: selectRow.
		//		Provides advanced row selections.
		// description:
		//		This module provides an advanced way for selecting rows by clicking, swiping, SPACE key, or CTRL/SHIFT CLICK to select multiple rows.
		//		This module uses gridx/core/model/extensions/Mark.
		//
		// example:
		//		1. Use select api on grid row object obtained from grid.row(i)
		//		|	grid.row(1).select();
		//		|	grid.row(1).deselect();
		//		|	grid.row(1).isSelected();
		//
		//		2. Use select api on select.row module
		//		|	grid.select.row.selectById(rowId);
		//		|	grid.select.row.deSelectById(rowId);
		//		|	grid.select.row.isSelected(rowId);
		//		|	grid.select.row.getSelected();//[]
		//		|	grid.select.row.clear();

		// triggerOnCell: Boolean
		//		Whether row will be selected by clicking on cell, false by default
		triggerOnCell: false,

		// treeMode: Boolean
		//		Whether to apply tri-state selection for child rows.
		treeMode: true,

		// unselectable: Object
		//		User can set unselectable rows in this hash object. The hash key is the row ID.
		unselectable: {},

		selectById: function(rowId){
			// summary:
			//		Select rows by id.
			// rowId: String...
			//		Row IDs
		},

		deselectById: function(rowId){
			// summary:
			//		Deselect rows by id.
			// rowId: String...
			//		Row ID
		},

		selectByIndex: function(rowIndex){
			// summary:
			//		Select a row by index
			//		This function can also select multiple rows.
			//	|	//Select several individual rows:
			//	|	gridx.select.row.selectByIndex(rowIndex1, rowIndex2, rowIndex3, ...);
			//	|	//Select a range of rows:
			//	|	gridx.select.row.selectByIndex([rowStartIndex, rowEndIndex]);
			//	|	//Select multiple ranges of rows:
			//	|	gridx.select.row.selectByIndex([rowStartIndex1, rowEndIndex1], [rowStartIndex2, rowEndIndex2], ...);
			// rowIndex: Integer...
			//		Row visual indexes
		},

		deSelectByIndex: function(rowIndex){
			// summary:
			//		Deselect a row by index.
			//		This function can also deselect multiple rows. Please refer to selectByIndex().
			// rowIndex: Integer...
			//		Row visual indexes
		},

		getSelected: function(){
			// summary:
			//		Get id array of all selected row IDs.
		},

		isSelected: function(rowId){
			// summary:
			//		Check if the given rows are all selected.
			// rowId: String...
			//		Row IDs
			// returns:
			//		True if all given columns are selected; false if not.
		},

		clear: function(){
			// summary:
			//		Deselected all selected rows;
		},

		onHighlightChange: function(){
			// summary:
			//		Fired when row highlight is changed.
			// tags:
			//		private
		}
	});
=====*/

	return declare(_RowCellBase, {
		name: 'selectRow',

		allowRight: false,		//allow mouse right click to trigger select

		unselectable: {},

		rowMixin: {
			select: function(){
				this.grid.select.row.selectById(this.id);
				return this;
			},

			deselect: function(){
				this.grid.select.row.deselectById(this.id);
				return this;
			},

			isSelected: function(){
				return this.model.getMark(this.id) === true;
			},

			isSelectable: function(){
				return this.grid.select.row._isSelectable(this.id);
			},

			setSelectable: function(selectable){
				this.grid.select.row.setSelectable(this.id, selectable);
			},

			isMarkable: function(){
				return this.grid.select.row._isMarkable(this.id);
			},

			setMarkable: function(markable){
				this.grid.select.row.setMarkable(this.id, markable);
			}
		},

		//Public-----------------------------------------------------------------
		treeMode: true,

		setSelectable: function(rowId, selectable){
			var t = this,
				m = t.model,
				n = t.grid.body.getRowNode({
					rowId: rowId
				});
			//m.setMarkable(rowId, selectable);
			t.unselectable[rowId] = !selectable;
			if(n){
				domClass.toggle(n, 'gridxRowUnselectable', !selectable);
				t.onHighlightChange({row: parseInt(n.getAttribute('visualindex'), 10)}, m.getMark(rowId));
				t.onSelectionChange();
			}
		},

		setMarkable: function(rowId, markable){
			var t = this,
				m = t.model,
				n = t.grid.body.getRowNode({
					rowId: rowId
				});
			if(n)
				domClass.toggle(n, 'gridxRowUnmarkable', !markable);
			t.unmarkable[rowId] = !markable;
			m.setMarkable(rowId, markable);
			this.setSelectable(rowId, markable);
		},

		getSelected: function(){
			return this.model.getMarkedIds();
		},

		isSelected: function(){
			return array.every(arguments, function(id){
				return this.model.getMark(id) === true;
			}, this);
		},

		clear: function(silent){
			query(".gridxRowSelected", this.grid.mainNode).forEach(function(node){
				domClass.remove(node, 'gridxRowSelected');
				node.removeAttribute('aria-selected');
			});
			query(".gridxRowPartialSelected", this.grid.mainNode).forEach(function(node){
				domClass.remove(node, 'gridxRowPartialSelected');
			});
			this._clear();
			this.model.clearMark();
			if(!silent){
				this._onSelectionChange();
			}
		},

		onHighlightChange: function(){},

		//Private---------------------------------------------------------------------
		_type: 'row',

		_isSelectable: function(rowId){
			return !this.arg('unselectable', {})[rowId];
		},

		_getUnselectableRows: function(){
			var ret = [],
				t = this,
				unselectable = this.arg('unselectable');
			for(var id in unselectable){
				if(unselectable[id] && t.model.byId(id)){
					ret.push(id);
				}
			}
			return ret;
		},

		_isMarkable: function(rowId){
			var unmarkable = this.arg('unmarkable'),
				ret = rowId in unmarkable ? !unmarkable[rowId] : true;
			return ret;
		},

		_getUnmarkableRows: function(){
			var ret = [],
				t = this,
				unmarkable = t.arg('unmarkable');
			for(var id in unmarkable){
				if(t.unmarkable[id] && t.model.byId(id)){
					ret.push(id);
				}
			}
			return ret;
		},

		_init: function(){
			var t = this,
				g = t.grid,
				unselectable = t.arg('unselectable', {}),
				unmarkable = t.arg('unmarkable', {});

			for(var id in unmarkable)
				unselectable[id] = unmarkable[id];

			//#12078
			//tri-state selection status is meaningless for grid without tree module
			t.model.treeMarkMode('', t.arg('treeMode') && g.tree);

			for(var id in unmarkable){
				t.model.setMarkable(id, !unmarkable[id]);
			}

			t.inherited(arguments);
			//Use special types to make filtered out rows unselected
			t.model._spTypes.select = 1;	//1 as true
			t.model.setMarkable(lang.hitch(t, t._isSelectable));
			function canSelect(e){
				if(e.columnId){
					var col = g._columnsById[e.columnId];
					if(t.arg('triggerOnCell')){
						return col.rowSelectable !== false &&
							!domClass.contains(e.target, 'gridxTreeExpandoIcon') &&
							!domClass.contains(e.target, 'gridxTreeExpandoInner');
					}
					return col.rowSelectable;
				}
				return !e.columnId;
			}
			t.batchConnect(
				g.rowHeader && [g.rowHeader, 'onMoveToRowHeaderCell', '_onMoveToRowHeaderCell'],
				[g, 'onRowMouseDown', function(e){
					if((mouse.isLeft(e) || (t.arg('allowRight')) && !g.select.row.isSelected(e.rowId)) && canSelect(e) && (e.rowHeaderCellNode || e.cellNode)){
						t._isOnCell = e.columnId;
						if(t._isOnCell){
							g.body._focusCellCol = e.columnIndex;
						}
						t._start({row: e.visualIndex, rowId: e.rowId }, g._isCtrlKey(e), e.shiftKey);
						if(!e.shiftKey && !t.arg('canSwept')){
							t._end();
						}
					}
				}],
				[g, 'onRowTouchStart', function(e){
					if(canSelect(e) && (e.rowHeaderCellNode || e.cellNode)){
						t._isOnCell = e.columnId;
						if(t._isOnCell){
							g.body._focusCellCol = e.columnIndex;
						}
						t._start({row: e.visualIndex, rowId: e.rowId }, g._isCtrlKey(e) || e.columnId === '__indirectSelect__', e.shiftKey);
						if(!e.shiftKey && !t.arg('canSwept')){
							t._end();
						}
					}
				}],
				[g, 'onRowTouchEnd', '_end'],
				[g.body, 'onAfterRow', function(row){
					var unmarkable = !row.isMarkable();
					var unselectable = unmarkable || !row.isSelectable();
					domClass.toggle(row.node(), 'gridxRowUnmarkable', unmarkable);
					domClass.toggle(row.node(), 'gridxRowUnselectable', unselectable);
				}],
				[g, 'onRowMouseOver', function(e){
					if(t._selecting && t.arg('triggerOnCell') && e.columnId){
						g.body._focusCellCol = e.columnIndex;
					}
					t._highlight({row: e.visualIndex});
				}],
				[g, has('ff') < 4 ? 'onRowKeyUp' : 'onRowKeyDown', function(e){
					if(e.keyCode == keys.SPACE && (!e.columnId ||
							(g._columnsById[e.columnId].rowSelectable) ||
							//When trigger on cell, check if we are navigating on body, reducing the odds of conflictions.
							(t.arg('triggerOnCell') && (!g.focus || g.focus.currentArea() == 'body')))
							&& (e.rowHeaderCellNode || e.cellNode)){
						event.stop(e);
						t._isOnCell = e.columnId;
						t._start({row: e.visualIndex, rowId: e.rowId }, g._isCtrlKey(e), e.shiftKey);
						t._end();
					}
				}],
				[g.model, 'setStore', '_syncUnmarkable']);
		},

		_markById: function(args, toSelect){
			var m = this.model;
			array.forEach(args, function(arg){
				m.markById(arg, toSelect);
			});
			m.when();
		},

		_markByIndex: function(args, toSelect){
			var g = this.grid,
				m = this.model,
				view = g.view,
				rowInfo;
			array.forEach(args, function(arg){
				if(lang.isArrayLike(arg)){
					var start = arg[0],
						end = arg[1],
						i, count;
					if(start >= 0 && start < Infinity){
						if(end >= start && end < Infinity){
							count = end - start + 1;
						}else{
							count = view.visualCount - start;
						}
						rowInfo = view.getRowInfo({visualIndex: start});
						start = rowInfo.rowIndex;
						for(i = 0; i < count; ++i){
							m.markByIndex(i + start, toSelect, '', rowInfo.parentId);
						}
					}
				}else if(arg >= 0 && arg < Infinity){
					rowInfo = view.getRowInfo({visualIndex: arg});
					m.markByIndex(rowInfo.rowIndex, toSelect, '', rowInfo.parentId);
				}
			});
			return m.when();
		},

		_onRender: function(start, count){
			var t = this, i, end = start + count;
			for(i = start; i < end; ++i){
				var item = {row: i},
					toHighlight = t._isSelected(item) || (t._selecting && t._toSelect &&
						t._inRange(i, t._startItem.row, t._currentItem.row, 1));
				if(toHighlight){
					t._doHighlight(item, toHighlight);
				}
			}
		},

		_onMark: function(id, toMark, oldState, type){
			if(type == 'select' && this.grid.body.renderedIds[id]){
			// if(type == 'select'){
				var nodes = query('[rowid="' + this.grid._escapeId(id) + '"]', this.grid.mainNode);
				if(nodes.length){
					nodes.forEach(function(node){
						var selected = toMark && toMark != 'mixed';
						domClass.toggle(node, 'gridxRowSelected', selected);
						domClass.toggle(node, 'gridxRowPartialSelected', toMark == 'mixed');
						node.setAttribute('aria-selected', !!selected);
					});
					this.onHighlightChange({row: parseInt(nodes[0].getAttribute('visualindex'), 10)}, toMark);
				}
			}
		},

		_onMoveToCell: function(rowVisIndex, colIndex, e){
			var t = this;
			if(t.arg('triggerOnCell') && e.shiftKey && (e.keyCode == keys.UP_ARROW || e.keyCode == keys.DOWN_ARROW)){
				t._start({row: rowVisIndex}, t.grid._isCtrlKey(e), 1);	//1 as true
				t._end();
			}
		},

		_onMoveToRowHeaderCell: function(rowVisIndex, e){
			if(e.shiftKey){
				this._start({row: rowVisIndex}, this.grid._isCtrlKey(e), 1);	//1 as true
				this._end();
			}
		},

		_isSelected: function(target){
			var t = this,
				id = t._getRowId(target.row);
			return t._isRange ? array.indexOf(t._refSelectedIds, id) >= 0 : t.model.getMark(id);
		},

		_beginAutoScroll: function(){
			this.grid.autoScroll.horizontal = false;
		},

		_endAutoScroll: function(){
			this.grid.autoScroll.horizontal = true;
		},

		_doHighlight: function(target, toHighlight){
			query('[visualindex="' + target.row + '"]', this.grid.mainNode).forEach(function(node){
				var selected = toHighlight && toHighlight != 'mixed';
				domClass.toggle(node, 'gridxRowSelected', selected);
				domClass.toggle(node, 'gridxRowPartialSelected', toHighlight == 'mixed');
				node.setAttribute('aria-selected', !!selected);
			});
			this.onHighlightChange(target, toHighlight);
		},

		_end: function(){
			this.inherited(arguments);
			delete this._isOnCell;
		},

		_focus: function(target){
			var g = this.grid, focus = g.focus;
			if(focus){
				g.body._focusCellRow = target.row;
				focus.focusArea(this._isOnCell ? 'body' : 'rowHeader', true);
			}
		},

		_addToSelected: function(start, end, toSelect){
			var t = this,
				view = t.grid.view,
				m = t.model,
				lastEndItem = t._lastEndItem,
				i, d;

			if(!t._isRange){
				//todo: can be removed later
				t._refSelectedIds = m.getMarkedIds();
				for(i = Math.min(start.row, end.row); i <= Math.max(start.row, end.row); ++i){
 					 var rowInfo = view.getRowInfo({visualIndex: i});
					 m.markByIndex(rowInfo.rowIndex, t._isSelectable(rowInfo.rowId) && toSelect, '', rowInfo.parentId);
				}
				return m.when();
			}else{
				// end.row between start.row and lastEndItem.row
				if(t._inRange(end.row, start.row, lastEndItem.row)){
					if(lastEndItem.row > end.row){
						// list from low to high: start.row, end.row, lastEndItem.row
						rowStart = end.row+1;
						rowEnd = lastEndItem.row;
					}else{
						// list from low to high: lastEndItem.row, end.row, start.row
						rowStart = lastEndItem.row;
						rowEnd = end.row-1;
					}					
					d = new Deferred();
					m.when({
						rowStart: rowStart, 
						rowEnd: rowEnd
					}, function(){
						for(i = rowStart; i <= rowEnd; ++i){
							m.markById(m.indexToId(i), false); 
						}
					}).then(function(){
						m.when(null, function(){
							d.callback();
						});
					});
				}else{
					ummark_start = Math.min(start.row, lastEndItem.row);
					ummark_end = Math.max(start.row, lastEndItem.row);
					mark_start = Math.min(start.row, end.row);
					mark_end = Math.max(start.row, end.row);

					d = new Deferred();
					m.when({
						ummark_start : ummark_start, 
						ummark_end : ummark_end,
						mark_start : mark_start,
						mark_end : mark_end
					}, function(){
						for(i = ummark_start; i <= ummark_end; ++i){
							m.markById(m.indexToId(i), false); 
						}
						for(i = mark_start; i <= mark_end; ++i){
							 var rowInfo = view.getRowInfo({visualIndex: i});
							 m.markByIndex(rowInfo.rowIndex, t._isSelectable(rowInfo.rowId) && toSelect, '', rowInfo.parentId);
						}
					}).then(function(){
						m.when(null, function(){
							d.callback();
						});
					});
				}
				return d;
			}
		},

		_highlightSingle: function(target, toHighlight){	//prevent highlight at UI level if a row is not selectable
			var rowId = this._getRowId(target.row);
			if(!this._isSelectable(rowId)){
				toHighlight = this.model.getMark(rowId);
			}else{
				toHighlight = toHighlight ? this._toSelect : this._isSelected(target);
			}
			this._doHighlight(target, toHighlight);
		},
		
		// _syncUnselectable: function(){
		// 	var t = this,
		// 		unselectable = t.arg('unselectable');
		// 	for(var id in unselectable){
		// 		t.model.setMarkable(id, !unselectable[id]);
		// 	}
		// }

		_syncUnmarkable: function(){
			var t = this,
				unmarkable = t.arg('unmarkable');
			for(var id in unmarkable){
				t.model.setMarkable(id, !unmarkable[id]);
			}
		}
	});
});
