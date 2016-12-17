define([
/*====="../core/Row",=====*/
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"../core/_Module"
], function(/*=====Row, =====*/declare, array, lang, Deferred, _Module){

/*=====
	Row.visualIndex = function(){
		// summary:
		//		Get the visual index (the position in current grid body) of this row.
		//		See documents of the View module for more details on visual index.
		// returns:
		//		The visual index of this row.
	};

	var View = declare(_Module, {
		// summary:
		//		module name: view.
		//		Manages how many and what rows should be shown in the current grid body.
		// description:
		//		This module defines a key concept: visual index, which is the position of a row in current grid body.
		//		Visual index is important in row rendering because it makes the render logic (or other row related logic)
		//		indenpendent of the data structure. The grid body just asks this View module which row should be rendered
		//		for position 1, and which for position 2, etc, without worrying about paging or tree expansion.
		//		Note the first row in the current grid body always has visual index of zero.
		//		And visual index has no special meaning for child rows in tree grid, so if a root row has visual index 1
		//		and it is expanded, then its first child row will have visual index 2. If that root row is collapsed, its child rows
		//		will have no visual indexes (because not displayed), and its next sibling row will have visual index 2.
		//		Also note that a row with a valid visual index doesn't have to be rendered out or even loaded, 
		//		due to the existence of virtual scrolling.

		// rootStart: [readonly] Integer
		//		The row index of the first root row in the current grid body.
		rootStart: 0,

		// rootCount: [readonly] Integer
		//		The count of root rows that exist in the current grid body.
		rootCount: 0,

		// visualCount: [readonly] Integer
		//		The count of rows (including children) that should be shown in the current grid body.
		visualCount: 0,

		getRowInfo: function(args){
			// summary:
			//		Get complete row info by partial row info. This function can be used to convert between row index and visual index.
			// args: View.__RowInfo
			//		A row info object containing partial row info
			// returns:
			//		A row info object containing as complete as possible row info.
		},

		logicExpand: function(id){
			// summary
			//		Logically expand a row (fetching children of the row and update visual index)
			// tags:
			//		private
		},

		logicCollapse: function(id){
			// summary:
			//		Logically collapse a row (update visual index)
			// tags:
			//		private
		},

		updateRootRange: function(start, count, skipUpdate){
			// summary:
			//		Change root range to [start, start + count). Visual index will be updated accordingly.
			// tags:
			//		private
		},

		updateVisualCount: function(){
			// summary:
			//		Update the count of the rows that should be rendered (including child rows) in the current grid body.
			//		This function will fetch all openned rows from store if necessary.
			// tags:
			//		private
			// returns:
			//		A Deferred object indicating when the visual count is updated succesfully.
		},

		onUpdate: function(){
			// summary:
			//		Fired when root range is changed.
			// tags:
			//		private
		}
	});

	View.__RowInfo = declare([], {
		// summary:
		//		This structure includes all possible information that can be used to identify a row, it is used
		//		to retrieve a row in grid body.
		//		Usually user only need to provide some of them that is sufficient to uniquely identify a row,
		//		e.g. rowId, or rowIndex and parentId, or visualIndex.

		// rowId: String|Number
		//		The ID of a row.
		rowId: '',

		// rowIndex: Integer
		//		The index of a row. It is the index below the parent of this row. The parent of root rows is an imaginary row
		//		with id "" (empty string).
		rowIndex: 0,

		// parentId: String|Number
		//		The parent ID of a row. Should be provided together with rowIndex. Default to root (empty string).
		parentId: '',

		// visualIndex: Integer
		//		The visual index of a row. It represents the visual position of this row in the current body view.
		//		The visual index of the first row in the current grid body is always zero. Visual index of a row might change
		//		after paging or tree expansion/collapsing, while row index (the index under its parent row) does not.
		visualIndex: 0
	});

	View.__CellInfo = declare(View.__RowInfo, {
		// summary:
		//		This structure includes all possible information that can be used to identify a cell, it is used
		//		to retrieve a cell in grid body.
		//		Usually user only need to provide some of them that is sufficient to uniquely identify the row of a cell,
		//		e.g. rowId, or rowIndex and parentId, or visualIndex.

		// colId: String|Number
		//		The ID of a column (should not be false values)
		colId: '',

		// colIndex: Integer
		//		The index of a column.
		colIndex: 0
	});

	return View;
=====*/

	return declare(_Module, {
		name: 'view',

		load: function(args){
			var t = this,
				m = t.model,
				g = t.grid,
				persistedOpenInfo = g.persist ? g.persist.registerAndLoad('tree', function(){
					return t._openInfo;
				}) : {};
			t._clear();
			t.aspect(m, 'onSizeChange', '_onSizeChange');
			t.aspect(m, '_onParentSizeChange', '_onParentSizeChange');
			t.aspect(m, 'onDelete', '_onDelete');
			t.aspect(m, 'setStore', function(){
				//If server store changes without notifying grid, expanded rows should remain expanded.
				if(t.arg('clearOnSetStore')){
					t._clear();
				}
			}, t, 'before');
			t.aspect(m, '_msg', '_receiveMsg');
			// t.aspect(m, 'filter', '_onFilter');

			t._loadLevels(persistedOpenInfo).then(function(){
				var size = t._openInfo[''].count = m.size();
				t.rootCount = t.rootCount || size - t.rootStart;
				if(t.rootStart + t.rootCount > size){
					t.rootCount = size - t.rootStart;
				}
				for(var id in persistedOpenInfo){
					t._expand(id);
				}
				t._updateVC();
				t.loaded.callback();
			}, function(e){
				t._err = e;
				t.loaded.callback();
			});
		},

		rowMixin: {
			visualIndex: function(){
				return this.grid.view.getRowInfo({
					rowId: this.id
				}).visualIndex;
			}
		},

		clearOnSetStore: true,

		rootStart: 0,

		rootCount: 0,

		visualCount: 0,

		getRowInfo: function(args){
			var t = this,
				m = t.model,
				id = args.rowId;
			if(m.isId(id)){
				args.rowIndex = m.idToIndex(id);
				args.parentId = m.parentId(id);
			}
			if(typeof args.rowIndex == 'number' && args.rowIndex >= 0){
				//Given row index and parentId, get visual index.
				if(!m.isId(args.parentId)){
					args.parentId = '';
				}
				args.visualIndex = t._getVisualIndex(args.parentId, args.rowIndex);
			}else if(typeof args.visualIndex == 'number' && args.visualIndex >= 0){
				//Given visual index, get row index and parent id.
				var layerId = m.layerId();
				if(m.isId(layerId)){
					args.rowIndex = args.visualIndex;
					args.parentId = layerId;
				}else{
					var rootOpenned = t._openInfo[''].openned,
						vi = t.rootStart + args.visualIndex;
					for(var i = 0; i < rootOpenned.length; ++i){
						var root = t._openInfo[rootOpenned[i]];
						if(m.idToIndex(root.id) < t.rootStart){
							vi += root.count;
						}else{
							break;
						}
					}
					var info = {
						parentId: '',
						preCount: 0
					};
					while(!info.found){
						info = t._getChild(vi, info);
					}
					args.rowIndex = info.rowIndex;
					args.parentId = info.parentId;
				}
			}else{
				//Nothing we can do here...
				return args;
			}
			args.rowId = m.isId(id) ? id : m.indexToId(args.rowIndex, args.parentId);
			return args;
		},

		//Package------------------------------------------------------------------------------
		logicExpand: function(id){
			var t = this,
				d = new Deferred();
			t.model.when({
				parentId: id,
				start: 0,
				count: 1
			}, function(){
				if(t._expand(id)){
					t._updateVC();
				}
			}).then(function(){
				d.callback();
			}, function(e){
				d.errback(e);
			});
			return d;
		},

		logicCollapse: function(id){
			var t = this,
				openInfo = t._openInfo,
				info = openInfo[id];
			if(info){
				var parentId = t.model.parentId(id),
					parentOpenInfo = t._parentOpenInfo[parentId],
					childCount = info.count;
				parentOpenInfo.splice(array.indexOf(parentOpenInfo, id), 1);
				info = openInfo[parentId];
				while(info){
					info.count -= childCount;
					info = openInfo[info.parentId];
				}
				delete openInfo[id];
				t.model.free(id, 1);
				t._updateVC();
			}
		},

		updateRootRange: function(start, count, skipUpdate){
			var t = this;
			t.rootStart = start;
			t.rootCount = count;
			return t.updateVisualCount().then(function(){
				if(!skipUpdate){
					t.onUpdate();
				}
			});
		},

		updateVisualCount: function(){
			var t = this;
			return t._loadLevels().then(function(){
				t._updateVC();
			});
		},

		//Event---------------------------------------------------------------------------------
		onUpdate: function(){},

		//Private-------------------------------------------------------------------------------
		_parentOpenInfo: null,
		_openInfo: null,

		_clear: function(){
			var openned = [];
			this._openInfo = {
				'': {
					id: '',
					parentId: null,
					path: [],
					count: 0,
					openned: openned
				}
			};
			this._parentOpenInfo = {
				'': openned
			};
		},

		_expand: function(id){
			var t = this,
				m = t.model;
			if(m.hasChildren(id)){
				var parentId = m.parentId(id),
					openInfo = t._openInfo,
					poi = t._parentOpenInfo,
					parentOpenInfo = poi[parentId] = poi[parentId] || [];
				poi[id] = poi[id] || [];
				if(!openInfo[id]){
					var index = m.idToIndex(id);
					if(index >= 0){
						m.keep(id, 1);
						if(array.indexOf(parentOpenInfo, id) < 0){
							parentOpenInfo.push(id);
						}
						var childCount = m.size(id);
						for(var i = poi[id].length - 1; i >= 0; --i){
							childCount += openInfo[poi[id][i]].count;
						}
						openInfo[id] = {
							id: id,
							parentId: parentId,
							path: m.treePath(id).slice(1).concat([id]),
							count: childCount,
							openned: poi[id]
						};
						var info = openInfo[parentId];
						while(info){
							info.count += childCount;
							info = openInfo[info.parentId];
						}
						return 1;
					}
				}
			}
		},

		_getVisualIndex: function(parentId, rowIndex){
			var t = this,
				m = this.model,
				openInfo = this._openInfo,
				info = openInfo[parentId],
				preCount = 0,
				rootIndex = parentId === '' ? rowIndex : m.idToIndex(m.rootId(parentId));
			if(info && rootIndex >= t.rootStart && rootIndex < t.rootStart + t.rootCount){
				while(info){
					preCount += rowIndex;
					for(var i = 0; i < info.openned.length; ++i){
						var child = openInfo[info.openned[i]],
							index = m.idToIndex(child.id);
						if(index < rowIndex && (info.id !== '' || index >= t.rootStart)){
							preCount += child.count;
						}
					}
					info.openned.sort(function(a, b){
						return m.idToIndex(a) - m.idToIndex(b);
					});
					rowIndex = m.idToIndex(info.id);
					if(m.isId(info.id)){
						preCount++;
					}
					info = openInfo[info.parentId];
				}
				//All child rows before rootStart are not counted in, so minus rootStart directly.
				return preCount - t.rootStart;
			}
			return null;
		},

		_getChild: function(visualIndex, info){
			var m = this.model,
				item = this._openInfo[info.parentId],
				preCount = info.preCount + m.idToIndex(item.id) + 1,
				commonMixin = {
					found: true,
					visualIndex: visualIndex
				};
			//Have to sort the opened rows to calc the visual index.
			//But if there are too many opened, this sorting will be slow, any better idea?
			//Note the index can't be maintained since it is changing when sorted or filtered etc.
			item.openned.sort(function(a, b){
				return m.idToIndex(a) - m.idToIndex(b);
			});
			for(var i = 0, len = item.openned.length; i < len; ++i){
				var childId = item.openned[i],
					child = this._openInfo[childId],
					index = m.idToIndex(childId),
					vidx = index + preCount;
				if(vidx === visualIndex){
					return lang.mixin({
						parentId: item.id,
						rowIndex: index
					}, commonMixin);
				}else if(vidx < visualIndex && vidx + child.count >= visualIndex){
					return {
						parentId: childId,
						preCount: preCount
					};
				}else if(vidx + child.count < visualIndex){
					preCount += child.count;
				}
			}
			return lang.mixin({
				parentId: item.id,
				rowIndex: visualIndex - preCount
			}, commonMixin);
		},

		_loadLevels: function(openInfo){
			openInfo = openInfo || this._openInfo;
			var m = this.model,
				d = new Deferred(),
				id, levels = [];
			if(this.grid.arg && !this.grid.arg("serverMode")){
				for(id in openInfo){
					if(m.isId(id)){
						var i, path = openInfo[id].path;
						for(i = 0; i < path.length; ++i){
							levels[i] = levels[i] || [];
							levels[i].push({
								parentId: path[i],
								start: 0,
								count: 1
							});
						}
					}
				}
			}
			var fetchLevel = function(level){
				if(level < levels.length){
					m.when(levels[level], function(){
						array.forEach(levels[level], function(arg){
							m.keep(arg.parentId, 1);
						});
						fetchLevel(level + 1);
					}).then(null, function(e){
						d.errback(e);
					});
				}else{
					m.when({}).then(function(){
						d.callback();
					}, function(e){
						d.errback(e);
					});
				}
			};
			fetchLevel(0);
			return d;
		},

		_updateVC: function(){
			var t = this,
				m = t.model,
				openInfo = t._openInfo,
				info = openInfo[''],
				len = info.openned.length, 
				size = m.size(),
				i, child, index;
			if(size < t.rootStart + t.rootCount){
				if(size > t.rootStart){
					t.rootCount = size - t.rootStart;
				}else{
					t.rootStart = 0;
					t.rootCount = size;
				}
			}
			size = t.rootCount;
			for(i = 0; i < len; ++i){
				child = openInfo[info.openned[i]];
				index = m.idToIndex(child.id);
				if(index >= t.rootStart && index < t.rootStart + t.rootCount){
					size += child.count;
				}
			}
			t.visualCount = size;
		},

		_onSizeChange: function(size, oldSize){
			var t = this;
			if(!t.paging && t.rootStart === 0 && (t.rootCount === oldSize || oldSize < 0)){
				t.updateRootRange(0, size);
			}
		},

		_onParentSizeChange: function(parentId, isAdd){
			var t = this,
				rowInfo = t.getRowInfo({rowId: parentId});

			if (rowInfo.visualIndex  !== null && rowInfo.visualIndex !== undefined && isAdd) {
				t.grid.body.renderRows(rowInfo.visualIndex, 1);
			
				if (this._openInfo && this._openInfo[parentId]) {
					// this._openInfo[parentId].count++;
					this.logicCollapse(parentId);
					this.logicExpand(parentId).then(function() {
						t.grid.body.lazyRefresh();
					});
				}
			}
		},

		_receiveMsg: function(msg){
			var info = this._openInfo,
				m = this.model;

			if(msg === 'filter'){
				this.__openInfo = this._openInfo;
				this.__parentOpenInfo = this._parentOpenInfo;
				this._clear();
			}else if(msg === 'clearFilter'){
				this._openInfo = this.__openInfo || this._openInfo;
				this._parentOpenInfo = this.__parentOpenInfo || this._parentOpenInfo;
			}
		},

		_onDelete: function(rowId, rowIndex, treePath){
			if(treePath){
				var t = this,
					openInfo = t._openInfo,
					parentOpenInfo = t._parentOpenInfo,
					info = openInfo[rowId],
					model = t.model,
					parentId = treePath.pop(),
					count = 1,
					deleteItem = function(id, parentId){
						var info = openInfo[id],
							openedChildren = parentOpenInfo[id] || [];
						array.forEach(openedChildren, function(child){
							deleteItem(child);
						});
						delete parentOpenInfo[id];
						if(info){
							delete openInfo[id];
							parentId = info.parentId;
						}else if(!model.isId(parentId)){
							//FIXME: don't know what to do here...
							return;
						}
						var ppoi = parentOpenInfo[parentId],
							i = array.indexOf(ppoi, id);
						if(i >= 0){
							ppoi.splice(i, 1);
						}
					};
				if(info){
					count += info.count;
					info = openInfo[info.parentId];
				}else if(model.isId(parentId)){
					info = openInfo[parentId];
				}
				deleteItem(rowId, parentId);
				while(info){
					info.count -= count;
					info = openInfo[info.parentId];
				}
				//sometimes number typed ID can be accidentally changed to string type.
				if(String(parentId) == String(model.layerId()) && rowIndex >= t.rootStart && rowIndex < t.rootStart + t.rootCount){
					t.rootCount--;
				}
				var rootIndex = model.idToIndex(model.rootId(rowId));
				if(rootIndex >= t.rootStart && rootIndex < t.rootStart + t.rootCount){
					t.visualCount -= count;
				}
			}else{
				//FIXME: what to do if some unknown row is deleted?
				// this._clear();
			}
			this.grid.body.lazyRefresh();
		},

		backupOpenInfo: function(){
			var t = this,
				g = t.grid;
			if(t._openInfo && t._openInfo[""]){
				t.__openInfo = lang.clone(t._openInfo);
				for (var x in t._openInfo){
					if(x != ""){
						delete t._openInfo[x];
					} 
				}
				var openned = [];
				t._openInfo[""].openned = openned;
				for (var x in t._parentOpenInfo){
					delete t._parentOpenInfo[x]
				}
				t._parentOpenInfo[""] = openned;
			}			
		},

		restoreOpenInfo: function(){
			var t = this,
				g = t.grid;
		
			if(t.__openInfo){
				t._openInfo = t.__openInfo;
				for (var x in t._openInfo){
					t._parentOpenInfo[x] = t._openInfo[x].openned;
					 
				}
				delete t.__openInfo;
			}
		}
	});
});
