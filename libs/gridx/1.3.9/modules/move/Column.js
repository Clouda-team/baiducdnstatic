define([
/*====="../../core/Column", =====*/
	"dojo/_base/declare",
	"dojo/query",
	"dojo/_base/array",
	"dojo/keys",
	"../../core/_Module"
], function(/*=====Column, =====*/declare, query, array, keys, _Module){

/*=====
	Column.moveTo = function(target){
		// summary:
		//		Move this column to the position before the column with index "target"
		// target: Integer
		//		The target index
	};

	return declare(_Module, {
		// summary:
		//		module name: moveColumn.
		//		This module provides several APIs to move columns within grid.
		// description:
		//		This module does not include any UI. So different kind of column dnd UI implementations can be built
		//		upon this module.
		//		But this module does provide a keyboard support for reordering columns. When focus is on a column header,
		//		pressing CTRL+LEFT/RIGHT ARROW will move the column around within grid.

		// moveSelected: Boolean
		//		When moving using keyboard, whether to move all selected columns together.
		moveSelected: true,

		// constraints: Hash-Object
		//		Define several constraint ranges. Columns within these ranges can not be moved out of the range.
		//		Columns outside these ranges can not be moved into these ranges.
		//		Hash key is the starting column index, value is the end column index.
		//		End index should be always larger than start index.
		//		For example: { 0: 3 } means the first 4 columns can only be moved within themselves,
		//		they can not be moved out and other columns can not be moved in.
		constraints: Object,

		move: function(columnIndexes, target){
			// summary:
			//		Move some columns to the given target position
			// columnIndexes: Integer[]
			//		The current indexes of columns to move
			// target: Integer
			//		The moved columns will be inserted before the column with this index.
		},

		moveRange: function(start, count, target){
			// summary:
			//		Move a range of columns to a given target position
			// start: Integer
			//		The index of the first column to move
			// count: Integer
			//		The count of columns to move
		},

		onMoved: function(){
			// summary:
			//		Fired when column move is performed successfully
			// tags:
			//		callback
		}
	});
=====*/

	return declare(_Module, {
		name: 'moveColumn',
		
		getAPIPath: function(){
			return {
				move: {
					column: this
				}
			};
		},

		preload: function(){
			this.aspect(this.grid, 'onHeaderCellKeyDown', '_onKeyDown');
		},

		columnMixin: {
			moveTo: function(target){
				this.grid.move.column.moveRange(this.index(), 1, target);
				return this;
			}
		},
		
		//public---------------------------------------------------------------
		moveSelected: true,

		//constraints: null,

		_isInConstraints: function(idx, target){
			var c = this.arg('constraints', {}),
				outRange = function(a, b, start){
					return idx >= start && idx <= c[start] && (target < start || target > c[start] + 1);
				};
			for(var start in c){
				if(outRange(idx, target, start) || outRange(target, idx, start)){
					return 0;
				}
			}
			return 1;
		},

		move: function(columnIndexes, target){
			if(typeof columnIndexes === 'number'){
				columnIndexes = [columnIndexes];
			}
			var map = [], i, len, columns = this.grid._columns, pos, movedCols = [];
			for(i = 0, len = columnIndexes.length; i < len; ++i){
				if(this._isInConstraints(columnIndexes[i], target)){
					map[columnIndexes[i]] = true;
				}
			}
			for(i = map.length - 1; i >= 0; --i){
				if(map[i]){
					movedCols.unshift(columns[i]);
					columns.splice(i, 1);
				}
			}
			for(i = 0, len = columns.length; i < len; ++i){
				if(columns[i].index >= target){
					pos = i;
					break;
				}
			}
			if(pos === undefined){
				pos = columns.length;
			}
			this._moveComplete(movedCols, pos);
		},
	
		moveRange: function(start, count, target){
			if(target < start || target > start + count){
				var colsToMove = [];
				for(var i = 0; i < count; ++i){
					if(this._isInConstraints(start + i, target)){
						colsToMove.push(start + i);
					}
				}
				this.move(colsToMove, target);
			}
		},
		
		//Events--------------------------------------------------------------------
		onMoved: function(){},
		
		//Private-------------------------------------------------------------------
		_moveComplete: function(movedCols, target){
			var g = this.grid,
				map = {},
				columns = g._columns,
				i, movedColIds = {},
				targetId = target < columns.length ? columns[target].id : null,
				update = function(tr){
					var cells = query('> .gridxCell', tr).filter(function(cellNode){
						return movedColIds[cellNode.getAttribute('colid')];
					});
					if(targetId === null){
						cells.place(tr);
					}else{
						var nextNode = query('> [colid="' + g._escapeId(targetId) + '"]', tr)[0];
						if(nextNode){
							cells.place(nextNode, 'before');
						}else if(target > 0){
							var tid = columns[target - 1].id;
							var prevNode = query('> [colid="' + g._escapeId(tid) + '"]', tr)[0];
							if(prevNode){
								cells.place(prevNode, 'after');
							}
						}
					}
				};
			for(i = movedCols.length - 1; i >= 0; --i){
				map[movedCols[i].index] = target + i;
				movedColIds[movedCols[i].id] = 1;
			}
			[].splice.apply(columns, [target, 0].concat(movedCols));
			for(i = columns.length - 1; i >= 0; --i){
				columns[i].index = i;
			}
			query('.gridxHeaderRowInner > table > tbody > tr', g.headerNode).forEach(update);
			query('.gridxRow > table > tbody > tr', g.bodyNode).forEach(update);
			this.onMoved(map);
		},

		_onKeyDown: function(e){
			var t = this,
				g = t.grid,
				selector = t.arg('moveSelected') && g.select && g.select.column,
				ltr = g.isLeftToRight(),
				preKey = ltr ? keys.LEFT_ARROW : keys.RIGHT_ARROW,
				postKey = ltr ? keys.RIGHT_ARROW : keys.LEFT_ARROW;
			if(g._isCtrlKey(e) && !e.shiftKey && !e.altKey && (e.keyCode == preKey || e.keyCode == postKey)){
				var target = e.columnIndex,
					colIdxes = selector && selector.isSelected(e.columnId) ?
						array.map(selector.getSelected(), function(id){
							return g._columnsById[id].index;
						}) : [e.columnIndex],
					node = g.header.getHeaderNode(e.columnId);
				if(e.keyCode == preKey){
					while(array.indexOf(colIdxes, target) >= 0){
						target--;
					}
					if(target >= 0){
						t.move(colIdxes, target);
						g.header._focusNode(node);
					}
				}else if(e.keyCode == postKey){
					while(array.indexOf(colIdxes, target) >= 0){
						target++;
					}
					if(target < g._columns.length){
						t.move(colIdxes, target + 1);
						g.header._focusNode(node);
					}
				}
			}
		}
	});
});
