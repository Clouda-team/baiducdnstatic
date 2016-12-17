define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"dojo/query",
	"dojo/dnd/Manager",
	"./_Base",
	"../../core/_Module"
], function(declare, array, domGeometry, domClass, query, DndManager, _Base, _Module){

/*=====
	return declare(_Base, {
		// summary:
		//		module name: dndColumn.
		//		This module provides an implementation of column drag & drop.
		// description:
		//		This module supports column reordering within grid, dragging out of grid, and dragging into grid.
		//		This module depends on "_dnd", "selectColumn" and "moveColumn" modules.

		// accept: String[]
		//		Can drag in what kind of stuff
		//		For now can not drag in any columns.
		accept: [],

		// provide: String[]
		//		Can drag out what kind of stuff
		provide: []
	});
=====*/

	return declare(_Base, {
		name: 'dndColumn',

		required: ['_dnd', 'selectColumn', 'moveColumn'],

		getAPIPath: function(){
			return {
				dnd: {
					column: this
				}
			};
		},

		preload: function(){
			var t = this,
				g = t.grid;
			t.inherited(arguments);
			t._selector = g.select.column;
			t.connect(g.header, 'onRender', '_initHeader');
		},
		
		//Public---------------------------------------------------------------------------------------
		accept: [],

		provide: ['grid/columns'],

		//Package--------------------------------------------------------------------------------------
		_checkDndReady: function(evt){
			var t = this;
			if(t._selector.isSelected(evt.columnId)){
				t._selectedColIds = t._selector.getSelected();
				t.grid.dnd._dnd.profile = t;
				return true;
			}
			return false;
		},

		onDraggedOut: function(/*source*/){
			//TODO: Support drag columns out (remove columns).
		},

		//Private--------------------------------------------------------------------------------------
		_cssName: "Column",

		_initHeader: function(){
			query('.gridxCell', this.grid.header.domNode).attr('aria-grabbed', 'false');
		},

		_onBeginDnd: function(source){
			var t = this;
			source.delay = t.arg('delay');
			array.forEach(t._selectedColIds, function(id){
				query('[colid="' + t.grid._escapeId(id) + '"].gridxCell', t.grid.header.domNode).attr('aria-grabbed', 'true');
			});
		},

		_getDndCount: function(){
			return this._selectedColIds.length;
		},

		_onEndDnd: function(){
			query('[aria-grabbed="true"].gridxCell', this.grid.header.domNode).attr('aria-grabbed', 'false');
		},

		_buildDndNodes: function(){
			var gid = this.grid.id;
			return array.map(this._selectedColIds, function(colId){
				return ["<div id='", gid, "_dndcolumn_", colId, "' gridid='", gid, "' columnid='", colId, "'></div>"].join('');
			}).join('');
		},
	
		_onBeginAutoScroll: function(){
			this.grid.autoScroll.vertical = false;
		},

		_onEndAutoScroll: function(){
			this.grid.autoScroll.vertical = true;
		},

		_getItemData: function(id){
			return id.substring((this.grid.id + '_dndcolumn_').length);
		},
		
		//---------------------------------------------------------------------------------------------
		_calcTargetAnchorPos: function(evt, containerPos){
			var node = evt.target,
				t = this,
				g = t.grid,
				ltr = g.isLeftToRight(),
				columns = g._columns,
				ret = {
					height: containerPos.h + "px",
					width: '',
					top: ''
				},
				escapeId = g._escapeId,
				func = function(n){
					var id = n.getAttribute('colid'),
						index = g._columnsById[id].index,
						first = n,
						last = n,
						firstIdx = index,
						lastIdx = index;
					if(t._selector.isSelected(id)){
						firstIdx = index;
						while(firstIdx > 0 && t._selector.isSelected(columns[firstIdx - 1].id)){
							--firstIdx;
						}
						first = query(".gridxHeaderRow [colid='" + escapeId(columns[firstIdx].id) + "']", g.headerNode)[0];
						lastIdx = index;
						while(lastIdx < columns.length - 1 && t._selector.isSelected(columns[lastIdx + 1].id)){
							++lastIdx;
						}
						last = query(".gridxHeaderRow [colid='" + escapeId(columns[lastIdx].id) + "']", g.headerNode)[0];
					}
					if(first && last){
						var firstPos = domGeometry.position(first),
							lastPos = domGeometry.position(last),
							middle = (firstPos.x + lastPos.x + lastPos.w) / 2,
							pre = evt.clientX < middle;
						if(pre){
							ret.left = (firstPos.x - containerPos.x - 1) + "px";
						}else{
							ret.left = (lastPos.x + lastPos.w - containerPos.x - 1) + "px";
						}
						t._target = pre ^ ltr ? lastIdx + 1 : firstIdx;
					}else{
						delete t._target;
					}
					return ret;
				};
			while(node){
				if(domClass.contains(node, 'gridxCell')){
					return func(node);
				}
				node = node.parentNode;
			}
			//For FF, when dragging from another grid, the evt.target is always grid.bodyNode!
			// so have to get the cell node by position, which is relatively slow.
			var rowNode = query(".gridxRow", g.bodyNode)[0],
				rowPos = domGeometry.position(rowNode.firstChild);
			if(rowPos.x + rowPos.w <= evt.clientX){
				ret.left = (rowPos.x + rowPos.w - containerPos.x - 1) + 'px';
				t._target = columns.length;
			}else if(rowPos.x >= evt.clientX){
				ret.left = (rowPos.x - containerPos.x - 1) + 'px';
				t._target = 0;
			}else if(query(".gridxCell", rowNode).some(function(cellNode){
				var cellPos = domGeometry.position(cellNode);
				if(cellPos.x <= evt.clientX && cellPos.x + cellPos.w >= evt.clientX){
					node = cellNode;
					return true;
				}
			})){
				return func(node);
			}
			return ret;
		},

		_onMouseMove: function(){
			var t = this;
			var flag = true;

			if(t._target >= 0){

				if (t.grid.columnLock && t._target < t.grid.columnLock.count) {
					flag = false;
				}

				var indexes = array.map(t._selectedColIds, function(colId){
					return t.grid._columnsById[colId].index;
				});

				if (t.grid.columnLock) {
					if (array.some(indexes, function(index) {
						return index < t.grid.columnLock.count;
					})) {						
						console.warn('can not move locked columns');
						flag = false;
					}
				}
			}
			var manager=DndManager.manager();
			manager.canDropFlag = flag;
			manager.avatar.update();
		},
		
		_onDropInternal: function(nodes, copy){
			var t = this;
			if(t._target >= 0){
				if (t.grid.columnLock && t._target < t.grid.columnLock.count) {
					return false;
				}
				var indexes = array.map(t._selectedColIds, function(colId){
					return t.grid._columnsById[colId].index;
				});

				if (t.grid.columnLock) {
					if (array.some(indexes, function(index) {
						return index < t.grid.columnLock.count;
					})) {
						console.warn('can not move locked columns');
						return false;
					}
				}
				t.grid.move.column.move(indexes, t._target);
			}
		},
		
		_onDropExternal: function(/*source, nodes, copy*/){
			//TODO: Support drag in columns from another grid or non-grid source
		}
	});
});
