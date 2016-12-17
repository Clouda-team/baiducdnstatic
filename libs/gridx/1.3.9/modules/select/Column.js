define([
/*====="../../core/Column", =====*/
	"dojo/_base/declare",
	"dojo/query",
	"dojo/_base/array",
	"dojo/_base/sniff",
	"dojo/_base/event",
	"dojo/dom-class",
	"dojo/keys",
	"./_Base",
	"../../core/_Module"
], function(/*=====Column, =====*/declare, query, array, has, event, domClass, keys, _Base, _Module){

/*=====
	Column.select = function(){
		// summary:
		//		Select this column.
	};
	Column.deselect = function(){
		// summary:
		//		Deselect this column.
	};
	Column.isSelected = function(){
		// summary:
		//		Whether this column is selected.
	};

	return declare(_Base, {
		// summary:
		//		module name: selectColumn.
		//		Provides simple column selection.
		// description:
		//		This module provides a simple way for selecting columns by clicking or SPACE key, 
		//		or CTRL + Click to select multiple columns.
		// example:
		//		1. Use select api on grid column object obtained from grid.column(i)
		//		|	grid.column(1).select();
		//		|	grid.column(1).deselect();
		//		|	grid.column(1).isSelected();
		//		2. Use select api on select.column module
		//		|	grid.select.column.selectById(columnId);
		//		|	grid.select.column.deSelectById(columnId);
		//		|	grid.select.column.isSelected(columnId);
		//		|	grid.select.column.getSelected();//[]
		//		|	grid.select.column.clear();

		selectById: function(id){
			// summary:
			//		Select target column by id
		},

		deselectById: function(id){
			// summary:
			//		Deselect target column by id
		},

		isSelected: function(id){
			// summary:
			//		Check if a column is selected 
		},

		getSelected: function(){
			// summary:
			//		Get array of column id of all selected columns
		},

		clear: function(notClearId){
			// summary:
			//		Clear all column selections
		},

		onSelected: function(col){
			// summary:
			//		Fired when a column is selected.
			// col: gridx.core.Column
			//		The column object
		},

		onDeselected: function(col){
			// summary:
			//		Fired when a column is deselected.
			// col: gridx.core.Column
			//		The column object
		},

		onHighlightChange: function(){
			// summary:
			//		Fired when a column's highlight is changed.
			// tags:
			//		private package
		}
	});
=====*/

	return declare(_Base, {
		name: "selectColumn",

		columnMixin: {
			select: function(){
				this.grid.select.column.selectById(this.id);
				return this;
			},
			deselect: function(){
				this.grid.select.column._markById(this.id, 0);
				return this;
			},
			isSelected: function(){
				return this.grid.select.column.isSelected(this.id);
			}
		},
		
		//Public API----------------------------------------------------------------------
		selectById: function(/*String*/id){
			if(!this.arg('multiple')){
				this.clear(id);
			}
			this._markById(id, 1);
		},
		
		deselectById: function(/*String*/id){
			this._markById(id, 0);
		},
		
		isSelected: function(/*String*/id){
			var c = this.grid._columnsById[id];
			return !!(c && c._selected);
		},
		
		getSelected: function(){
			var ids = [], i, c,
				g = this.grid,
				cols = g._columns,
				count = cols.length;
			for(i = 0; i < count; ++i){
				c = cols[i];
				if(c._selected){
					ids.push(c.id);
				}
			}
			return ids;
		},
		
		clear: function(notClearId){
			var columns = this.grid._columns, i, count = columns.length;
			for(i = 0; i < count; ++i){
				if(columns[i].id !== notClearId){
					this._markById(columns[i].id, 0);
				}
			}
		},

		//Private-------------------------------------------------------------------------------
		_type: 'column',

		_init: function(){
			var t = this,
				g = t.grid;
			t.batchConnect(
				[g, 'onHeaderCellClick', function(e){
					if(e.columnId === '__indirectSelect__'){
						return;
					}
					if(!domClass.contains(e.target, 'gridxArrowButtonNode')){
						t._select(e.columnId, g._isCtrlKey(e));
					}
				}],
				[g, has('ff') < 4 ? 'onHeaderCellKeyUp' : 'onHeaderCellKeyDown', function(e){
					if(e.keyCode == keys.SPACE || e.keyCode == keys.ENTER){
						t._select(e.columnId, g._isCtrlKey(e));
						event.stop(e);
					}
				}]
			);
		},

		_markById: function(id, toSelect){
			var t = this, c = t.grid._columnsById[id];
			if(t.arg('enabled')){
				toSelect = !!toSelect;
				if(c && !c._selected == toSelect){
					c._selected = toSelect;
					t._highlight(id, toSelect);
					t[toSelect ? "onSelected" : "onDeselected"](t.grid.column(id, 1), id);
					t._onSelectionChange();
				}
			}
		},
		
		_highlight: function(id, toHighlight){
			var t = this, g = t.grid;
			query("[colid='" + g._escapeId(id) + "']", g.bodyNode).forEach(function(node){
				domClass.toggle(node, 'gridxColumnSelected', toHighlight);
				t.onHighlightChange({column: g._columnsById[id].index}, toHighlight);
			});
		},

		_onRender: function(start, count){
			var i, j, node,
				end = start + count,
				g = this.grid,
				bn = g.bodyNode,
				cols = array.filter(g._columns, function(col){
					return col._selected;
				});
			for(i = cols.length - 1; i >= 0; --i){
				for(j = start; j < end; ++j){
					node = query(['[visualindex="', j, '"] [colid="', g._escapeId(cols[i].id), '"]'].join(''), bn)[0];
					domClass.add(node, 'gridxColumnSelected');
				}
			}
		}
	});
});
