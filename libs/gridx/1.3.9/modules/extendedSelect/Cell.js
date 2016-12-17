define([
/*====="../../core/Cell", =====*/
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/event",
	"dojo/query",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/_base/sniff",
	"dojo/dom-class",
	"dojo/mouse",
	"dojo/keys",
	"../../core/_Module",
	"./_RowCellBase"
], function(/*=====Cell, =====*/declare, array, event, query, lang, Deferred, has, domClass, mouse, keys, _Module, _RowCellBase){

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
		//		Check if this cell is selected.
	};

	return declare(_RowCellBase, {
		// summary:
		//		module name: selectCell.
		//		Provides advanced cell selections.
		// description:
		//		This module provides an advanced way for selecting cells by clicking, swiping, SPACE key, or CTRL/SHIFT CLICK to select multiple cell.
		//		This module uses gridx/core/model/extensions/Mark.
		//
		// example:
		//		1. Use select api on cell object obtained from grid.cell(i,j)
		//		|	grid.cell(1,1).select();
		//		|	grid.cell(1,1).deselect();
		//		|	grid.cell(1,1).isSelected();
		//
		//		2. Use select api on select.cell module
		//		|	grid.select.cell.selectById(columnId);
		//		|	grid.select.cell.deSelectById(columnId);
		//		|	grid.select.cell.isSelected(columnId);
		//		|	grid.select.cell.getSelected();//[]
		//		|	grid.select.cell.clear();

		selectById: function(rowId, columnId){
			// summary:
			//		Select a cell by (rowId, columnId)
		},

		deselectById: function(rowId, columnId){
			// summary:
			//		Deselect a cell by (rowId, columnId)
		},

		selectByIndex: function(rowIndex, columnIndex){
			// summary:
			//		Select a cell by (rowIndex, columnIndex);
			//		This function can also be used to select multiple cells:
			//	|	//Selecting several individual cells:
			//	|	grid.select.row.selectByIndex([rowIndex1, columnIndex1], [rowIndex2, columnIndex2], [rowIndex3, columnIndex3]);
			//	|	//Selecting a range of cells:
			//	|	grid.select.row.selectByIndex(rowStartIndex, columnStartIndex, rowEndIndex, columnEndIndex);
			//	|	//Selecting several ranges of cells:
			//	|	grid.select.row.selectByIndex(
			//	|		[rowStartIndex1, columnStartIndex1, rowEndIndex1, columnEndIndex1],
			//	|		[rowStartIndex2, columnStartIndex2, rowEndIndex2, columnEndIndex2]
			//	|	);
			// rowIndex: Integer
			//		Row index of this cell
			// rowIndex: Integer
			//		Column index of this cell
		},

		deSelectByIndex: function(rowIndex, columnIndex){
			// summary:
			//		Deselect a cell by (rowIndex, columnIndex)
			//		This function can also be used to deselect multiple cells. Please refer to selectByIndex().
			// rowIndex: Integer
			//		Row index of this cell
			// rowIndex: Integer
			//		Column index of this cell
		},

		getSelected: function(){
			// summary:
			//		Get an array of selected cells e.g.[['row1', 'col1'], ['row2', 'col2']]
		},

		clear: function(){
			// summary:
			//		Deselected all selected cells
		},

		isSelected: function(rowId, columnId){
			// summary:
			//		Check if the given cell is selected.
			// rowId: String|Number
			//		Row ID of the cell
			// columnId: String|Number
			//		Column ID of the cell
			// returns:
			//		True if selected, false if not.
		}
	});
=====*/

	var isArrayLike = lang.isArrayLike;

	function createItem(rowId, visualIndex, columnId, columnIndex){
		return {
			rid: rowId,
			r: visualIndex,
			cid: columnId,
			c: columnIndex
		};
	}

	return declare(_RowCellBase, {
		name: 'selectCell',

		cellMixin: {
			select: function(){
				this.grid.select.cell.selectByIndex(this.row.index(), this.column.index());
				return this;
			},
			deselect: function(){
				this.grid.select.cell.deselectByIndex(this.row.index(), this.column.index());
				return this;
			},
			isSelected: function(){
				return this.grid.select.cell.isSelected(this.row.id, this.column.id);
			}
		},
		
		//Public-----------------------------------------------------------------
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

		clear: function(silent){
			var t = this;
			query(".gridxCellSelected", t.grid.bodyNode).forEach(function(node){
				domClass.remove(node, 'gridxCellSelected');
				node.removeAttribute('aria-selected');
			});
			array.forEach(t.grid._columns, function(col){
				t.model.clearMark(t._getMarkType(col.id));
			});
			t._clear();
			if(!silent){
				t._onSelectionChange();
			}
		},

		isSelected: function(rowId, columnId){
			return this.model.getMark(rowId, this._getMarkType(columnId));
		},
		
		//Private---------------------------------------------------------------------
		_type: 'cell',

		_markTypePrefix: "select_",

		_getMarkType: function(colId){
			var type = this._markTypePrefix + colId;
			this.model._spTypes[type] = 1;
			return type;
		},

		_markById: function(args, toSelect){
			if(!isArrayLike(args[0])){
				args = [args];
			}
			var t = this, columns = t.grid._columnsById, model = t.model;
			array.forEach(args, function(cell){
				var rowId = cell[0], colId = cell[1];
				if(rowId && columns[colId]){
					model.markById(rowId, toSelect, t._getMarkType(colId));
				}
			});
			model.when();
		},

		_markByIndex: function(args, toSelect){
			if(!isArrayLike(args[0])){
				args = [args];
			}
			args = array.filter(args, function(arg){
				if(isArrayLike(arg) && arg.length >= 2 && 
					arg[0] >= 0 && arg[0] < Infinity && arg[1] >= 0 && arg[1] < Infinity){
					if(arg.length >= 4 && arg[2] >= 0 && arg[2] < Infinity && arg[3] >= 0 && arg[3] < Infinity){
						arg._range = 1;	//1 as true
					}
					return true;
				}
			});
			var t = this,
				m = t.model,
				g = t.grid,
				columns = g._columns,
				view = g.view,
				i, j, col, type, rowInfo;
			array.forEach(args, function(arg){
				if(arg._range){
					var a = Math.min(arg[0], arg[2]),
						b = Math.max(arg[0], arg[2]),
						n = b - a + 1,
						c1 = Math.min(arg[1], arg[3]),
						c2 = Math.max(arg[1], arg[3]);
					for(i = c1; i <= c2; ++i){
						col = columns[i];
						if(col){
							rowInfo = view.getRowInfo({visualIndex: a});
							a = rowInfo.rowIndex;
							type = t._getMarkType(col.id);
							for(j = 0; j < n; ++j){
								m.markByIndex(a + j, toSelect, type, rowInfo.parentId);
							}
						}
					}
				}else{
					col = columns[arg[1]];
					if(col){
						rowInfo = view.getRowInfo({visualIndex: arg[0]});
						i = rowInfo.rowIndex;
						m.markByIndex(i, toSelect, t._getMarkType(col.id), rowInfo.parentId);
					}
				}
			});
			return m.when();
		},

		_init: function(){
			var t = this, g = t.grid;
			t.inherited(arguments);
			t.batchConnect(
				[g, 'onCellMouseDown', function(e){
					if(mouse.isLeft(e) &&
						(!g.select.row || !g.select.row.arg('triggerOnCell')) &&
						!domClass.contains(e.target, 'gridxTreeExpandoIcon') &&
						!domClass.contains(e.target, 'gridxTreeExpandoInner')){
						t._start(createItem(e.rowId, e.visualIndex, e.columnId, e.columnIndex), g._isCtrlKey(e), e.shiftKey);
						if(!e.shiftKey && !t.arg('canSwept')){
							t._end();
						}
					}
				}],
				[g, 'onCellMouseOver', function(e){
					t._highlight(createItem(e.rowId, e.visualIndex, e.columnId, e.columnIndex));
				}],
				[g, has('ff') < 4 ? 'onCellKeyUp' : 'onCellKeyDown', function(e){
					if(e.keyCode === keys.SPACE && (!g.focus || g.focus.currentArea() == 'body')){
						event.stop(e);
						t._start(createItem(e.rowId, e.visualIndex, e.columnId, e.columnIndex), g._isCtrlKey(e), e.shiftKey);
						t._end();
					}
				}]
			);
		},

		_onRender: function(start, count){
			var t = this, i, j,
				m = t.model,
				g = t.grid,
				cols = g._columns,
				end = start + count;
			for(i = 0; i < cols.length; ++i){
				var cid = cols[i].id,
					type = t._getMarkType(cid);
				if(m.getMarkedIds(type).length){
					for(j = start; j < end; ++j){
						var rid = t._getRowId(j);
						if(m.getMark(rid, type) || (t._selecting && t._toSelect &&
							t._inRange(i, t._startItem.c, t._currentItem.c, 1) && //1 as true
							t._inRange(j, t._startItem.r, t._currentItem.r, 1))){	//1 as true
							domClass.add(query('[visualindex="' + j + '"] [colid="' + g._escapeId(cid) + '"]', g.bodyNode)[0], 'gridxCellSelected');
						}
					}
				}
			}
		},

		_onMark: function(id, toMark, oldState, type){
			var t = this;
			if(lang.isString(type) && !t._marking && type.indexOf(t._markTypePrefix) === 0){
				var escapeId = t.grid._escapeId,
					rowNode = query('[rowid="' + escapeId(id) + '"]', t.grid.bodyNode)[0];
				if(rowNode){
					var cid = type.substr(t._markTypePrefix.length),
						node = query('[colid="' + escapeId(cid) + '"]', rowNode)[0];
					if(node){
						domClass.toggle(node, 'gridxCellSelected', toMark);
					}
				}
			}
		},

		_onMoveToCell: function(rowVisIndex, colIndex, e){
			if(e.shiftKey){
				var t = this,
					g = t.grid,
					rid = t._getRowId(rowVisIndex),
					cid = g._columns[colIndex].id;
				t._start(createItem(rid, rowVisIndex, cid, colIndex), g._isCtrlKey(e), 1);	//1 as true
				t._end();
			}
		},

		_isSelected: function(item){
			var t = this;
			if(!item.rid){
				item.rid = t._getRowId(item.r);
			}
			if(t._isRange){
				var rids = t._refSelectedIds[item.cid];
				return rids && array.indexOf(rids, item.rid) >= 0;
			}else{
				return t.model.getMark(item.rid, t._getMarkType(item.cid));
			}
		},

		_highlight: function(target){
			var t = this,
				current = t._currentItem;
			if(t._selecting){
				if(current === null){
					//First time select.
					t._highlightSingle(target, 1);	//1 as true
					//In IE, when setSelectable(false), the onfocusin event will not fire on doc, so the focus border is gone.
					//So refocus it here.
					if(has('ie') || has('trident')){
						t._focus(target);
					}
				}else{
					var start = t._startItem,
						highlight = function(from, to, toHL){
							var colDir = to.c > from.c ? 1 : -1,
								rowDir = to.r > from.r ? 1 : -1,
								i, j, p, q, rids = {};
							if(!toHL){
								for(j = from.r, p = to.r + rowDir; j != p; j += rowDir){
									rids[j] = t.model.indexToId(j);
								}
							}
							for(i = from.c, q = to.c + colDir; i != q; i += colDir){
								var cid = t.grid._columns[i].id;
								for(j = from.r, p = to.r + rowDir; j != p; j += rowDir){
									t._highlightSingle(createItem(rids[j], j, cid, i), toHL);
								}
							}
						};
					if(t._inRange(target.r, start.r, current.r) ||
						t._inRange(target.c, start.c, current.c) ||
						t._inRange(start.r, target.r, current.r) ||
						t._inRange(start.c, target.c, current.c)){
						highlight(start, current, 0);	//0 as false
					}
					highlight(start, target, 1);	//1 as true
					t._focus(target);
				}
				t._currentItem = target;
			}
		},

		_doHighlight: function(item, toHighlight){
			var i, j, rowNodes = this.grid.bodyNode.childNodes;
			for(i = rowNodes.length - 1; i >= 0; --i){
				if(rowNodes[i].getAttribute('visualindex') == item.r){
					var cellNodes = rowNodes[i].getElementsByTagName('td');
					for(j = cellNodes.length - 1; j >= 0; --j){
						if(cellNodes[j].getAttribute('colid') == item.cid){
							domClass.toggle(cellNodes[j], 'gridxCellSelected', toHighlight);
							cellNodes[j].setAttribute('aria-selected', !!toHighlight);
							return;
						}
					}
					return;
				}
			}
		},

		_focus: function(target){
			if(this.grid.focus){
				this.grid.body._focusCell(null, target.r, target.c);
			}
		},

		_getSelectedIds: function(){
			var t = this, res = {};
			array.forEach(t.grid._columns, function(col){
				var ids = t.model.getMarkedIds(t._getMarkType(col.id));
				if(ids.length){
					res[col.id] = ids;
				}
			});
			return res;
		},
		
		_beginAutoScroll: function(){},

		_endAutoScroll: function(){},

		_addToSelected: function(start, end, toSelect){
			var t = this,
				model = t.model,
				view = t.grid.view,
				d = new Deferred(),
				lastEndItem = t._lastEndItem,
				rowInfo,
				packs = [],

				rowStart, 
				rowEnd, 
				columnStart, 
				columnEnd,

				finish = function(){
					model.when().then(function(){
						d.callback();
					});
				};

			if(!t._isRange){
		 		t._refSelectedIds = t._getSelectedIds();
		 		// mark selected cells
		 		packs.push({
					rowStart: Math.min(start.r, end.r),
					rowEnd: Math.max(start.r, end.r),
					columnStart: Math.min(start.c, end.c),
					columnEnd: Math.max(start.c, end.c),
					action: "mark" 
				});
			}
			else{
				// end cell inside rectangle set by start cell and lastEndItem cell
				if(t._inRange(end.c, start.c, lastEndItem.c) && t._inRange(end.r, start.r, lastEndItem.r)){
					// first step: unmark selected cells in rows below or above end.r
					if(lastEndItem.r > end.r){
						rowStart = view.getRowInfo({visualIndex: end.r}).rowIndex+1;
						rowEnd = view.getRowInfo({visualIndex: lastEndItem.r}).rowIndex;
					}else{
						rowStart = view.getRowInfo({visualIndex: lastEndItem.r}).rowIndex;
						rowEnd = view.getRowInfo({visualIndex: end.r}).rowIndex-1;
					}
					packs.push({
						rowStart: rowStart,
						rowEnd: rowEnd,
						columnStart: Math.min(start.c, end.c),
						columnEnd: Math.max(start.c, end.c),
						action: "unmark" 
					});
					// second step: unmark selected cells in columns between end.c and lastEndItem.c
					if(lastEndItem.c > end.c){
						columnStart = end.c+1;
						columnEnd = lastEndItem.c;
					}else{
						columnStart = lastEndItem.c;
						columnEnd = end.c-1;
					}
					packs.push({
						rowStart: Math.min(start.r, lastEndItem.r),
						rowEnd: Math.max(start.r, lastEndItem.r),
						columnStart: columnStart,
						columnEnd: columnEnd,
						action: "unmark" 
					});
				}else{
					packs.push({
						rowStart: Math.min(start.r, lastEndItem.r),
						rowEnd: Math.max(start.r, lastEndItem.r),
						columnStart: Math.min(start.c, lastEndItem.c),
						columnEnd: Math.max(start.c, lastEndItem.c),
						action: "unmark" 
					});
					packs.push({
						rowStart: Math.min(start.r, end.r),
						rowEnd: Math.max(start.r, end.r),
						columnStart: Math.min(start.c, end.c),
						columnEnd: Math.max(start.c, end.c),
						action: "mark" 
					});
				}
			}
			if(packs.length){
				model.when(packs, function(){
					var i, j, k, pack;
					for(i = 0; i < packs.length; ++i){
						pack = packs[i];

						if(pack.action == "unmark"){
							for(j = pack.columnStart; j <= pack.columnEnd; ++j){
								var cid = t.grid._columns[j].id,
									type = t._getMarkType(cid);
								for(k = pack.rowStart; k <= pack.rowEnd; ++k){
									model.markById(model.indexToId(k), false, type);
								}
							}
						}else{
							for(j = pack.columnStart; j <= pack.columnEnd; ++j){
								var cid = t.grid._columns[j].id,
								type = t._getMarkType(cid);
								for(k = pack.rowStart; k <= pack.rowEnd; ++k){
									rowInfo = view.getRowInfo({visualIndex: k});
									model.markByIndex(rowInfo.rowIndex, toSelect, type, rowInfo.parentId);
								}
							}
						}	
					}
				}).then(finish);
			}else{
				finish();
			}
			return d;
		}
	});
});
