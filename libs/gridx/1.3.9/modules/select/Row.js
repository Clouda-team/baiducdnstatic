define([
/*====="../../core/Row", =====*/
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/sniff",
	"dojo/_base/event",
	// "dojo/query",
	'gridx/support/query',
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/keys",
	"./_RowCellBase",
	"../../core/_Module"
], function(/*=====Row, =====*/declare, array, has, event, query, lang, domClass, keys, _RowCellBase, _Module){

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
		//		Whether this row is selected.
	};
	Row.isSelectable = function(){
		// summary:
		//		Check whether this row is selectable.
	};
	Row.setSelectable = function(){
		// summary:
		//		Set this row to be selectable or not.
	};

	return declare(_RowCellBase, {
		// summary:
		//		module name: selectRow.
		//		Provides simple row selection.
		// description:
		//		This module provides a simple way for selecting rows by clicking or SPACE key, or CTRL + Click to select multiple rows.
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

		// triggerOnCell: [readonly] Boolean
		//		Whether row can be selected by clicking on cell, false by default
		triggerOnCell: false,

		// treeMode: Boolean
		//		Whether to apply tri-state selection for child rows.
		treeMode: true,

		// unselectable: Object
		//		User can set unselectable rows in this hash object. The hash key is the row ID.
		unselectable: {},

		// setSelectable: Function(rowId, selectable)
		//		TODOC
		setSelectable: function(){},

		selectById: function(rowId){
			// summary:
			//		Select a row by id.
		},

		deselectById: function(rowId){
			// summary:
			//		Deselect a row by id.
		},

		isSelected: function(rowId){
			// summary:
			//		Check if a row is already selected.
		},

		getSelected: function(){
			// summary:
			//		Get id array of all selected rows
		},

		clear: function(notClearId){
			// summary:
			//		Deselected all selected rows;
		},

		onSelected: function(row, rowId){
			// summary:
			//		Fired when a row is selected.
			// row: grid.core.Row
			//		The Row object (null if the row is not yet loaded);
			// rowId:
			//		The row ID
		},

		onDeselected: function(row, rowId){
			// summary:
			//		Fired when a row is deselected.
			// row: grid.core.Row
			//		The Row object (null if the row is not yet loaded);
			// rowID:
			//		The row ID
		},

		onHighlightChange: function(){
			// summary:
			//		Fired when a row's highlight is changed.
			// tags:
			//		private
		},
	});
=====*/

	return declare(_RowCellBase, {
		name: "selectRow",
		
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
				return this.grid.select.row.isSelected(this.id);
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

		//Public API--------------------------------------------------------------------------------
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

		clear: function(notClearId){
			if(this.arg('enabled')){
				var model = this.model;
				array.forEach(model.getMarkedIds(), function(id){
					if(id !== notClearId){
						model.markById(id, 0);
					}
				});
				model.when();
			}
		},

		//Private--------------------------------------------------------------------------------
		_type: 'row',

		_isSelectable: function(rowId){
			var unselectable = this.arg('unselectable'),
				ret = rowId in unselectable ? !unselectable[rowId] : true;
			return ret;
		},

		_getUnselectableRows: function(){
			var ret = [],
				t = this,
				unselectable = t.arg('unselectable');
			for(var id in unselectable){
				if(t.unselectable[id] && t.model.byId(id)){
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
				unselectable = t.arg('unselectable', {});
				unmarkable = t.arg('unmarkable', {});

			for(var id in unmarkable)
				unselectable[id] = unmarkable[id];

			t.model.treeMarkMode('', t.arg('treeMode'));

			for(var id in unmarkable){
				t.model.setMarkable(id, !unmarkable[id]);
			}

			t.inherited(arguments);
			t.model._spTypes.select = 1;
			t.model.setMarkable(lang.hitch(t, '_isSelectable'));
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
				[g, 'onRowMouseDown', function(e){
					//Have to check whether we are on the 
					if(canSelect(e) && (e.rowHeaderCellNode || e.cellNode)){
						t._select(e.rowId, g._isCtrlKey(e));
					}
				}],
				[g, 'onRowTouchStart', function(e){
					if(canSelect(e) && (e.rowHeaderCellNode || e.cellNode)){
						t._select(e.rowId, g._isCtrlKey(e) || e.columnId === '__indirectSelect__');
					}
				}],
				[g.body, 'onAfterRow', function(row){
					var unmarkable = !row.isMarkable();
					var unselectable = unmarkable || !row.isSelectable();
					domClass.toggle(row.node(), 'gridxRowUnmarkable', unmarkable);
					domClass.toggle(row.node(), 'gridxRowUnselectable', unselectable);
				}],
				[g, has('ff') < 4 ? 'onRowKeyUp' : 'onRowKeyDown', function(e){
					if(e.keyCode == keys.SPACE && (!e.columnId ||
							(g._columnsById[e.columnId].rowSelectable) ||
							//When trigger on cell, check if we are navigating on body, reducing the odds of conflictions.
							(t.arg('triggerOnCell') && (!g.focus || g.focus.currentArea() == 'body')))
							&& (e.rowHeaderCellNode || e.cellNode)){
						var cell = g.cell(e.rowId, e.columnId);
						if(!(cell && cell.isEditing && cell.isEditing())){
							t._select(e.rowId, g._isCtrlKey(e));
							event.stop(e);
						}
					}
				}],
				[g.model, 'setStore', '_syncUnmarkable']
				);
		},

		_onMark: function(id, toMark, oldState, type){
			if(type == 'select'){
				var t = this;
				t._highlight(id, toMark);
				t[toMark ? 'onSelected' : 'onDeselected'](t.grid.row(id, 1), id);
				t._onSelectionChange();
			}
		},

		_highlight: function(rowId, toHighlight){
			var nodes = query('[rowid="' + this.grid._escapeId(rowId) + '"]', this.grid.mainNode),
				selected = toHighlight && toHighlight != 'mixed';
			if(nodes.length){
				nodes.forEach(function(node){
					domClass.toggle(node, "gridxRowSelected", selected);
					domClass.toggle(node, "gridxRowPartialSelected", toHighlight == 'mixed');
					node.setAttribute('aria-selected', !!selected);
				});
				this.onHighlightChange({row: parseInt(nodes[0].getAttribute('visualindex'), 10)}, toHighlight);
			}
		},

		_markById: function(id, toMark){
			var t = this,
				m = t.model,
				g = t.grid,
				row = g.row(id);
			if(m.treeMarkMode() && !m.getMark(id) && toMark){
				toMark = 'mixed';
			}
			m.markById(id, toMark);
			m.when();
		},

		_onRender: function(start, count){
			var t = this,
				g = t.grid,
				model = t.model,
				end = start + count,
				i, id, rowNode;
			for(i = start; i < end; ++i){
				rowNode = t.grid.body.getRowNode({visualIndex: i});
				if(rowNode){
					id = rowNode.getAttribute('rowid');
					t._highlight(id, model.getMark(id));
				}
			}
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
