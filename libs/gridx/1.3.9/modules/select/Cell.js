define([
/*====="../../core/Cell", =====*/
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/sniff",
	"dojo/_base/event",
	"dojo/dom-class",
	"dojo/keys",
	"./_RowCellBase",
	"../../core/_Module"
], function(/*=====Cell, =====*/declare, array, has, event, domClass, keys, _RowCellBase, _Module){

/*=====
	Cell.select = function(){
		// summary:
		//		Select this cell.
	};
	Cell.deselect = function(){
		// summary:
		//		Deselect this cell.
	};
	Cell.isSelected = function(){
		// summary:
		//		Whether this cell is selected.
	};

	return declare(_RowCellBase, {
		// summary:
		//		module name: selectCell.
		//		Provides simple cell selection.
		// description:
		//		This module provides a simple way for selecting cells by clicking or SPACE key, or CTRL + Click to select multiple cells.
		//		This module uses gridx/core/model/extensions/Mark.
		//
		// example:
		//		1. Use select api on grid cell object obtained from grid.cell(i, j)
		//		|	grid.cell(1,1).select();
		//		|	grid.cell(1,1).deselect();
		//		|	grid.cell(1,1).isSelected();
		//
		//		2. Use select api on select.cell module
		//		|	grid.select.cell.selectById(rowId, columnId);
		//		|	grid.select.cell.deSelectById(rowId, columnId);
		//		|	grid.select.cell.isSelected(rowId, columnId);		
		//		|	grid.select.cell.getSelected();//[]
		//		|	grid.select.cell.clear();

		selectById: function(rowId, columnId){
			// summary:
			//		Select a cell by [rowId, columnId].
		},
		
		deselectById: function(rowId, columnId){
			// summary:
			//		Deselect a cell by [rowId, columnId].
		},
		
		isSelected: function(rowId, columnId){
			// summary:
			//		Check if a cell is already selected.
		},
		
		getSelected: function(){
			// summary:
			//		Get arrays of [rowId, columnId] of all the selected cells
		},
		
		clear: function(notClearCell){
			// summary:
			//		Deselected all the selected cells;
		},

		onSelected: function(cell, rowId, colId){
			// summary:
			//		Fired when a cell is selected.
			// cell: gridx.core.Cell
			//		The cell object (null if the row of the cell is not yet loaded)
			// rowId: string|number
			//		The row id
			// colId: string|number
			//		The column id
		},

		onDeselected: function(cell, rowId, colId){
			// summary:
			//		Fired when a cell is deselected.
			// cell: gridx.core.Cell
			//		The cell object
			// rowId: string|number
			//		The row id
			// colId: string|number
			//		The column id
		},

		onHighlightChange: function(){
			// summary:
			//		Fired when a cell's highlight is changed.
			// tags:
			//		private package
		}
	});
=====*/

	return declare(_RowCellBase, {
		name: "selectCell",
		
		cellMixin: {
			select: function(){
				this.grid.select.cell.selectById(this.row.id, this.column.id);
				return this;
			},
			
			deselect: function(){
				this.grid.select.cell.deselectById(this.row.id, this.column.id);
				return this;
			},
			
			isSelected: function(){
				return this.grid.select.cell.isSelected(this.row.id, this.column.id);
			}
		},
		
		//Public API--------------------------------------------------------------------------------
		getSelected: function(){
			var t = this, res = [];
			array.forEach(t.grid._columns, function(col){
				var ids = t.model.getMarkedIds(t._getMarkType(col.id));
				res.push.apply(res, array.map(ids, function(rid){
					return [rid, col.id];
				}));
			});
			return res;
		},
		
		clear: function(notClearCell){
			var t = this, m = t.model;
			if(t.arg('enabled')){
				array.forEach(t.grid._columns, function(col){
					var markType = t._getMarkType(col.id),
						selected = m.getMarkedIds(markType), 
						len = selected.length, i;
					for(i = 0; i < len; ++i){
						if(!notClearCell || notClearCell[1] !== col.id || notClearCell[0] !== selected[i]){
							m.markById(selected[i], 0, markType);
						}
					}
				});
				m.when();
			}
		},

		//Private--------------------------------------------------------------------------------
		_type: 'cell',

		_markTypePrefix: "select_",
	
		_getMarkType: function(colId){
			var type = this._markTypePrefix + colId;
			this.model._spTypes[type] = 1;
			return type;
		},

		_init: function(){
			var t = this,
				g = t.grid;
			t.inherited(arguments);
			var doSelect = function(e){
				if((!g.select.row || !g.select.row.arg('triggerOnCell')) &&
					!domClass.contains(e.target, 'gridxTreeExpandoIcon') &&
					!domClass.contains(e.target, 'gridxTreeExpandoInner')){
					t._select([e.rowId, e.columnId], g._isCtrlKey(e));
				}
			};
			t.batchConnect(
				[g, 'onCellClick', doSelect],
				[g, 'onCellTouchStart', doSelect],
				[g, has('ff') < 4 ? 'onCellKeyUp' : 'onCellKeyDown', function(e){
					if(e.keyCode == keys.SPACE && (!g.focus || g.focus.currentArea() == 'body')){
						t._select([e.rowId, e.columnId], g._isCtrlKey(e));
						event.stop(e);
					}
				}]);
		},

		_isSelected: function(cell){
			return this.isSelected(cell[0], cell[1]);
		},

		_onMark: function(rowId, toMark, oldState, type){
			var t = this;
			if(type.indexOf(t._markTypePrefix) === 0){
				var colId = type.substr(t._markTypePrefix.length);
				if(t.grid._columnsById[colId]){
					t._highlight(rowId, colId, toMark);
					t[toMark ? 'onSelected' : 'onDeselected'](t.grid.cell(rowId, colId, 1), rowId, colId);
					t._onSelectionChange();
				}
			}
		},
		
		_highlight: function(rowId, colId, toHighlight){
			var node = this.grid.body.getCellNode({
				rowId: rowId, 
				colId: colId
			});
			if(node){
				domClass.toggle(node, "gridxCellSelected", toHighlight);
				node.setAttribute('aria-selected', !!toHighlight);
				this.onHighlightChange();
			}
		},

		_markById: function(item, toMark){
			var t = this, m = this.model;
			m.markById(item[0], toMark, t._getMarkType(item[1]));
			m.when();
		},
		
		_onRender: function(start, count){
			var t = this, model = t.model, end = start + count, i, j, rowId, colId,
				columns = t.grid._columns; 
			for(i = start; i < end; ++i){
				rowId = model.indexToId(i);
				for(j = columns.length - 1; j >= 0; --j){
					colId = columns[j].id;
					if(model.getMark(rowId, t._getMarkType(colId))){
						t._highlight(rowId, colId, 1);
					}
				}
			}
		}
	});
});
