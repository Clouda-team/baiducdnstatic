define([
	"require",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"dojo/aspect",
	'dojo/store/Memory',
	'dojo/store/JsonRest',
	"./cache/Sync",
	"./cache/Async"
], function(require, declare, array, lang, Deferred, DeferredList, aspect, Memory, JsonRest, Sync, Async){

/*=====
	return declare([], {
		// summary:
		//		This class handles all of the data logic in grid.
		// description:
		//		It provides a clean and useful set of APIs to encapsulate complicated data operations, 
		//		even for huge asynchronous (server side) data stores.
		//		It is built upon a simple extension mechanism, allowing new (even user defined) data operaions to be pluged in.
		//		An instance of this class can be regarded as a stand-alone logic grid providing consistent data processing 
		//		functionalities. This class can even be instanticated alone without any grid UI.

		clearCache: function(){
		},

		isId: function(){
		},

		byIndex: function(index, parentId){
			// summary:
			//		Get the row cache by row index.
			// index: Integer
			//		The row index
			// parentId: String?
			//		If parentId is valid, the row index means the child index under this parent.
			// returns:
			//		The row cache
			return null;	//gridx.core.model.__RowCache
		},

		byId: function(id){
			// summary:
			//		Get the row cache by row id
			// id: String
			//		The row ID
			// returns:
			//		The row cache
			return null;	//gridx.core.model.__RowCache
		},

		indexToId: function(index, parentId){
			// summary:
			//		Transform row index to row ID. If not exist, return undefined.
			// index: Integer
			//		The row index
			// parentId: String?
			//		If parentId is valid, the row index means the child index under this parent.
			// returns:
			//		The row ID
			return '';	//String
		},

		idToIndex: function(id){
			// summary:
			//		Transform row ID to row index. If not exist, return -1.
			// id: String
			//		The row ID
			// returns:
			//		The row index
			return -1;	//Integer
		},

		treePath: function(id){
			// summary:
			//		Get tree path of row by row ID
			// id: String
			//		The row ID
			// returns:
			//		An array of parent row IDs, from root to parent.
			//		Root level rows have parent of id ""(empty string).
			return [];	//String[]
		},

		parentId: function(id){
			// summary:
			//		Get the parent ID of the given row.
			// id: String
			//		The row ID
			// returns:
			//		The parent ID.
			return [];
		},

		hasChildren: function(id){
			// summary:
			//		Check whether a row has children rows.
			// id: String
			//		The row ID
			// returns:
			//		Whether this row has child rows.
			return false;	//Boolean
		},

		children: function(id){
			// summary:
			//		Get IDs of children rows.
			// id: String
			//		The row ID
			// returns:
			//		An array of row IDs
			return [];	//Array
		},

		size: function(parentId){
			// summary:
			//		Get the count of rows under the given parent. 
			// parentId: String?
			//		The ID of a parent row. No parentId means root rows.
			// returns:
			//		The count of (child) rows
			return -1;	//Integer
		},

		keep: function(id){
			// summary:
			//		Lock up a row cache in memory, avoid clearing it out when cache size is reached.
			// id: String
			//		The row ID
		},

		free: function(id){
			// summary:
			//		Unlock a row cache in memory, so that it could be cleared out when cache size is reached.
			// id: String?
			//		The row ID. If omitted, all kept rows will be freed.
		},

		when: function(args, callback, scope){
			// summary:
			//		Call this method to make sure all the pending data operations are executed and
			//		all the needed rows are at client side.
			// description:
			//		This method makes it convenient to do various grid operations without worrying too much about server side
			//		or client side store. This method is the only asynchronous public method in grid model, so that most of
			//		the custom code can be written in synchronous way.
			// args: Object|null?
			//		Indicate what rows are needed by listing row IDs or row indexes.
			//		Acceptable args include: 
			//		1. A single row index.
			//		e.g.: model.when(1, ...)
			//		2. A single row index range object in form of: {start: ..., count: ...}.
			//		If count is omitted, means all remaining rows.
			//		e.g.: model.when({start: 10, count: 100}, ...)
			//		3. An array of row indexes and row index ranges.
			//		e.g.: model.when([0, 1, {start: 10, count: 3}, 100], ...)
			//		4. An object with property "index" set to the array defined in 3.
			//		e.g.: model.when({
			//			index: [0, 1, {start: 10, count: 3}, 100]
			//		}, ...)
			//		5. An object with property "id" set to an array of row IDs.
			//		e.g.: model.when({
			//		id: ['a', 'b', 'c']
			//		}, ...)
			//		6. An object containing both contents defined in 4 and 5.
			//		7. An empty object
			//		The model will fetch the store size. Currently it is implemented by fetching the first page of data.
			//		8. null or call this method without any arguments.
			//		This is useful when we only need to execute pending data operations but don't need to fetch rows.
			// callback: Function?
			//		The callback function is called when all the pending data operations are executed and all
			// returns:
			//		A Deferred object indicating when all this process is finished. Note that in this Deferred object,
			//		The needed rows might not be available since they might be cleared up to reduce memory usage.
		},

		scan: function(args, callback){
			// summary:
			//		Go through all the rows in several batches from start to end (or according to given args),
			//		and execute the callback function for every batch of rows.
			// args: Object
			//		An object containing scan arguments
			// callback: Function(rows,startIndex)
			//		The callback function.
			// returns:
			//		If return true in this function, the scan process will end immediately.
		},

		onDelete: function(){
			// summary:
			//		Fired when a row is deleted from store
			// tags:
			//		callback
		},

		onNew: function(){
			// summary:
			//		Fired when a row is added to the store
			// tags:
			//		callback
		},

		onSet: function(){
			// summary:
			//		Fired when a row's data is changed
			// tags:
			//		callback
		},

		onSizeChange: function(){
			// summary:
			//		Fired when the size of the grid model is changed
			// tags:
			//		callback
		}
	});
=====*/

	var isArrayLike = lang.isArrayLike,
		isString = lang.isString;

	function isId(it){
		return it || it === 0;
	}

	function isIndex(it){
		return typeof it == 'number' && it >= 0;
	}

	function isRange(it){
		return it && isIndex(it.start);
	}

	function normArgs(self, args){
		var i, rgs = [], ids = [],
		res = {
			range: rgs,
			id: ids 
		},
		f = function(a){
			if(isRange(a)){
				rgs.push(a);
			}else if(isIndex(a)){
				rgs.push({start: a, count: 1});
			}else if(isArrayLike(a)){
				for(i = a.length - 1; i >= 0; --i){
					if(isIndex(a[i])){
						rgs.push({
							start: a[i],
							count: 1
						});
					}else if(isRange(a[i])){
						rgs.push(a[i]);
					}else if(isString(a)){
						ids.push(a[i]);
					}
				}
			}else if(isString(a)){
				ids.push(a);
			}
		};
		if(args && (args.index || args.range || args.id)){
			f(args.index);
			f(args.range);
			if(isArrayLike(args.id)){
				for(i = args.id.length - 1; i >= 0; --i){
					ids.push(args.id[i]);
				}
			}else if(isId(args.id)){
				ids.push(args.id);
			}
		}else{
			f(args);
		}
		if(!rgs.length && !ids.length && self.size() < 0){
			//first time load, try to load a page
			rgs.push({start: 0, count: self._cache.pageSize || 1});
		}
		return res;
	}

	return declare([], {
		constructor: function(args){
			var t = this,
				g = args,
				cacheClass = args.cacheClass || Sync;
			cacheClass = typeof cacheClass == 'string' ? require(cacheClass) : cacheClass;
			t.store = args.store;
			t._exts = {};
			t._cmdQueue = [];
			t._model = t._cache = new cacheClass(t, args);
			t._createExts(args.modelExtensions || [], args);
			var m = t._model;
			t._cnnts = [
				aspect.after(m, "onDelete", lang.hitch(t, "onDelete"), 1),
				aspect.after(m, "onNew", lang.hitch(t, "onNew"), 1),
				aspect.after(m, "onSet", lang.hitch(t, "onSet"), 1)
			];
		},
	
		destroy: function(){
			array.forEach(this._cnnts, function(cnnt){
				cnnt.remove();
			});
			for(var n in this._exts){
				this._exts[n].destroy();
			}
			this._cache.destroy();
		},

		clearCache: function(){
			this._cache.clear();
		},

		isId: isId,

		setStore: function(store){
			this.store = store;
			this._cache.setStore(store);
		},

		//Public-------------------------------------------------------------------
		when: function(args, callback, scope){
			this._oldSize = this.size();
			// execute pending operations and then fetch data
			this._addCmd({
				name: '_cmdRequest',
				scope: this,
				args: arguments,
				async: 1
			});
			return this._exec();
		},

		scan: function(args, callback){
			var d = new Deferred(),
				start = args.start || 0,
				pageSize = args.pageSize || this._cache.pageSize || 1,
				count = args.count,
				end = count > 0 ? start + count : Infinity,
				scope = args.whenScope || this,
				whenFunc = args.whenFunc || scope.when;
			var f = function(s){
				d.progress(s / (count > 0 ? s + count : scope.size()));
				whenFunc.call(scope, {
					id: [],
					range: [{
						start: s,
						count: pageSize
					}]
				}, function(){
					var i, r, rows = [];
					for(i = s; i < s + pageSize && i < end; ++i){
						r = scope.byIndex(i);
						if(r){
							rows.push(r);
						}else{
							end = -1;
							break;
						}
					}
					if(callback(rows, s) || i == end){
						end = -1;
					}
				}).then(function(){
					if(end == -1){
						d.callback();
					}else{
						f(s + pageSize);
					}
				});
			};
			f(start);
			return d;
		},

		_sizeAll: function(parentId, isWhole){
			var size = this.size(parentId, isWhole),
				count = 0,
				i, childId;

			size = size === -1 ? 0 : size;
			count += size;
			
			for (i = 0; i < size; i++) {
				childId = this.indexToId(i, parentId, isWhole);
				if (this.isId(childId)) count += this._sizeAll(childId, isWhole);
			}

			return count;
		},

		//Events---------------------------------------------------------------------------------
		onDelete: function(/*id, index*/) {},

		onNew: function(/*id, index, row*/) {},

		onSet: function(/*id, index, row*/) {},

		onSizeChange: function(/*size, oldSize*/) {},

		//Package----------------------------------------------------------------------------
		_msg: function(/* msg */){},

		_addCmd: function(args){
			//Add command to the command queue, and combine same kind of commands if possible.
			var cmds = this._cmdQueue,
				cmd = cmds[cmds.length - 1];
			if(cmd && cmd.name == args.name && cmd.scope == args.scope){
				cmd.args.push(args.args || []);
			}else{
				args.args = [args.args || []];
				cmds.push(args);
			}
		},

		//Private----------------------------------------------------------------------------
		_onSizeChange: function(){
			var t = this,
				oldSize = t._oldSize,
				size = t._oldSize = t.size();
			if(oldSize != size){
				t.onSizeChange(size, oldSize);
			}
		},

		_onParentSizeChange: function(parentId, isAdd) {},

		_cmdRequest: function(){
			var t = this;
			return new DeferredList(array.map(arguments, function(args){
				var arg = args[0],
					finish = function(){
						t._onSizeChange();
						//TODO: fire events here
						//args[1] is callback, args[2] is scope
						if(args[1]){
							args[1].call(args[2]);
						}
					};
				if(arg === null || !args.length){
					var d = new Deferred();
					finish();
					d.callback();
					return d;
				}
				return t._model._call('when', [normArgs(t, arg), finish]);
			}), 0, 1);
		},

		_exec: function(){
			//Execute commands one by one.
			var t = this,
				c = t._cache,
				d = new Deferred(),
				cmds = t._cmdQueue,
				finish = function(d, err){
					t._busy = 0;
					if(c._checkSize){
						c._checkSize();
					}
					if(err){
						d.errback(err);
					}else{
						d.callback();
					}
				},
				func = function(){
					if(array.some(cmds, function(cmd){
						return cmd.name == '_cmdRequest';
					})){
						try{
							while(cmds.length){
								var cmd = cmds.shift(),
									dd = cmd.scope[cmd.name].apply(cmd.scope, cmd.args);
								if(cmd.async){
									Deferred.when(dd, func, lang.partial(finish, d));
									return;
								}
							}
						}catch(e){
							finish(d, e);
							return;
						}
					}
					finish(d);
				};
			if(t._busy){
				return t._busy;
			}
			t._busy = d;
			func();
			return d;
		},

		_createExts: function(exts, args){
			//Ensure the given extensions are valid
			exts = array.filter(array.map(exts, function(ext){
				return typeof ext == 'string' ? require(ext) : ext;
			}), function(ext){
				return ext && ext.prototype;
			});
			//Sort the extensions by priority
			exts.sort(function(a, b){
				return a.prototype.priority - b.prototype.priority;
			});
			for(var i = 0, len = exts.length; i < len; ++i){
				//Avoid duplicated extensions
				//IMPORTANT: Assume extensions all have different priority values!
				if(i == exts.length - 1 || exts[i] != exts[i + 1]){
					var ext = new exts[i](this, args);
					this._exts[ext.name] = ext;
				}
			}
		}
	});
});
