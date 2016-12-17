define([
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/array",
	"dojo/query",
	"../core/_Module"
], function(declare, Deferred, array, query, _Module){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: hiddenColumns.
		//		Hide columns.
		// description:
		//		Hide columns and change the column array at the same time so that other grid features 
		//		are not affected by hidden columns. That means, hidden columns can no longer be accessed 
		//		through grid.columns() function.

		// init: String[]
		//		IDs of columns to be hidden when grid is initially created.
		init: [],

		add: function(colId){
			// summary:
			//		Hide all the given columns in arguments.
			// colId: String|gridx.core.Column...
			//		Column IDs can be provided directly as arguments.
			//		gridx.core.Column object can also be provided.
			// example:
			//	|	//Hide columnA
			//	|	grid.hiddenColumns.add("columnA");
			//	|	//Hide columnB, columnC and columnD
			//	|	grid.hiddenColumns.add("columnB", "columnC", "columnD");
			//	|	//Column object is also acceptable.
			//	|	var col = grid.column("columnA");
			//	|	grid.hiddenColumns.add(col);
		},
		
		remove: function(colId){
			// summary:
			//		Show all the given columns in arguments.
			// colId: String|gridx.core.Column...
			//		Column IDs can be provided directly as arguments.
			//		gridx.core.Column object can also be provided.
			// example:
			//	|	//show columnA
			//	|	grid.hiddenColumns.remove("columnA");
			//	|	//show columnB, columnC and columnD
			//	|	grid.hiddenColumns.remove("columnB", "columnC", "columnD");
			//	|	//Column object is also acceptable.
			//	|	var col = { id: "columnA", ...};	//Can also be a column object retreived before it is hidden.
			//	|	grid.hiddenColumns.remove(col);
		},

		clear: function(){
			// summary:
			//		Show all hidden columns.
		},

		onShow: function(colIds){
			// summary:
			// 		Fired when a specific column with colId is showing.
			// colIds: Array
			//		Column ids are used here because hiddenColumns.remove() 
			// 		can accept a list of column ids to show.
		},

		onHide: function(colIds){
			// summary:
			// 		Fired when a specific column with colId is hidden.
			// colIds: Array
			//		Column ids are used here because hiddenColumns.add() 
			// 		can accept a list of column ids to hide.
		}

		get: function(){
			// summary:
			//		Get an array of current hidden column IDs.
			// returns:
			//		An array of current hidden column IDs.
		}
	});
=====*/

	return declare(_Module, {
		name: 'hiddenColumns',

		load: function(args, startup){
			var t = this,
				g = t.grid,
				ids = t.arg('init', []);
			t._cols = g._columns.slice();
			t.aspect(g, 'setColumns', function(){
				t._cols = g._columns.slice();
			});
			if(g.move && g.move.column){
				t.connect(g.move.column, 'onMoved', '_syncOrder');
			}
			if(g.persist){
				ids = ids.concat(g.persist.registerAndLoad('hiddenColumns', function(){
					return t.get();
				}) || []);
			}
			if(ids.length){
				startup.then(function(){
					t.add.apply(t, ids);
					t.loaded.callback();
				});
			}else{
				t.loaded.callback();
			}
		},

		add: function(){
			var t = this,
				g = t.grid,
				columnsById = g._columnsById,
				columns = g._columns,
				columnLock = g.columnLock,
				lockCount = 0,
				hash = {},
				cols = array.filter(array.map(arguments, function(id){
					id = id && typeof id === "object" ? id.id : id;
					return columnsById[id];
				}), function(col){
					return col && !col.ignore && (col.hidable === undefined || col.hidable);
				});
			//remove duplicated arguments.
			for(var i = 0, len = cols.length; i < len; ++i){
				hash[cols[i].id] = cols[i];
			}
			cols = [];
			for(var arg in hash){
				cols.push(hash[arg]);
			}
			if(columnLock){
				lockCount = columnLock.count;
				columnLock.unlock();
			}
			array.forEach(cols, function(col){
				if(col.index < lockCount){
					//If a locked column is hidden, should unlock it.
					--lockCount;
				}
				col.hidden = true;
				delete columnsById[col.id];
				columns.splice(array.indexOf(columns, col), 1);
				//Directly remove dom nodes instead of refreshing the whole body to make it faster.
				query('[colid="' + g._escapeId(col.id) + '"].gridxCell', g.domNode).forEach(function(node){
					node.parentNode.removeChild(node);
				});
			});
			if(cols.length){
				array.forEach(columns, function(col, i){
					col.index = i;
				});
			}
			g.columnWidth._adaptWidth();
			query('.gridxCell', g.bodyNode).forEach(function(node){
				var s = node.style,
					w = s.width = s.minWidth = s.maxWidth = columnsById[node.getAttribute('colid')].width;
			});
			//FIXME: this seems ugly....
			if(g.vScroller._doVirtualScroll){
				g.body.onForcedScroll();
			}
			return t._refresh(0).then(function(){
				t.onHide(array.map(cols, function(col){
					return col.id;
				}));
				if(columnLock && lockCount > 0){
					columnLock.lock(lockCount);
				}
			});
		},

		remove: function(){
			var t = this,
				g = t.grid,
				columns = g._columns,
				columnLock = g.columnLock,
				lockCount = 0,
				changed,
				cols = [];
			if(columnLock){
				lockCount = columnLock.count;
				columnLock.unlock();
			}
			array.forEach(arguments, function(id){
				id = id && typeof id === "object" ? id.id : id;
				var c,
					index = -1,
					i = 0,
					len = t._cols.length;
				for(; i < len; ++i){
					c = t._cols[i];
					if(c.id === id && c.hidden){
						delete c.hidden;
						c.index = ++index;
						cols.push(c);
						break;
					}else if(!c.hidden){
						index = c.index;
					}
				}
				if(i < len){
					changed = 1;
					t.grid._columnsById[id] = c;
					// restored column should not appear before locked columns
					if(index < lockCount){
						c.index = index = lockCount;
					}
					columns.splice(index, 0, c);
					for(i = index + 1; i < columns.length; ++i){
						columns[i].index = i;
					}
				}
			});
			return t._refresh(changed).then(function(){
				t.onShow(array.map(cols, function(col){
					return col.id;
				}));
				if(columnLock && lockCount > 0){
					columnLock.lock(lockCount);
				}
			});
		},

		clear: function(){
			var g = this.grid,
				columnLock = g.columnLock,
				lockCount = 0,
				changed;
			if(columnLock){
				lockCount = columnLock.count;
				columnLock.unlock();
			}
			g._columns = array.map(this._cols, function(col, i){
				col.index = i;
				if(col.hidden){
					changed = 1;
					delete col.hidden;
					g._columnsById[col.id] = col;
				}
				return col;
			});
			return this._refresh(changed).then(function(){
				if(columnLock && lockCount > 0){
					columnLock.lock(lockCount);
				}
			});
		},

		get: function(){
			var t = this,
				res = [],
				cols = t._cols,
				i = 0;
			for(; i < cols.length; ++i){
				if(cols[i].hidden){
					res.push(cols[i].id);
				}
			}
			return res;
		},

		onShow: function(colIds){},

		onHide: function(colIds){},

		_syncOrder: function(){
			var t = this,
				cols = t._cols,
				columns = t.grid._columns,
				i = 0,
				j = 0,
				c, k;
			//Sort the cached columns to have the same order as g._columns.
			for(; i < columns.length && j < cols.length; ++i, ++j){
				//j must not overflow here because t._cols and g._columns are synced up.
				for(c = cols[j]; c.hidden; c = cols[j]){
					++j;
				}
				if(columns[i] != c){
					k = array.indexOf(cols, columns[i]);
					cols[j] = cols[k];
					cols[k] = c;
				}
			}
		},

		_refresh: function(changed){
			var g = this.grid;
			if(changed){
				g.header.refresh();
				g.columnWidth._adaptWidth();
				return g.body.refresh();
			}else{
				var d = new Deferred();
				g.header.onRender();
				d.callback();
				return d;
			}
		}
	});
});
