define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	'../_Extension'
], function(declare, array, lang, Deferred, _Extension) {
/*=====
	Model.filter = function(){};
	Model.hasFilter = function(){};
	Model.onFilterProgress = function(){};
	
	return declare(_Extension, {
		// summary:
		//		Filtering grid data at client side.
	});
=====*/

	var hitch = lang.hitch,
		forEach = array.forEach,
		indexOf = array.indexOf;

	return declare(_Extension, {
		// Not compatible with Map extension!
		name: 'clientFilter',

		priority: 20,

		constructor: function(model, args){
			this.pageSize = args.pageSize || 100;
			this._mixinAPI('filter', 'hasFilter');
			model.onFilterProgress = function(){};
			this.aspect(model, '_msg', '_receiveMsg');
			this.aspect(model, 'setStore', 'clear');
		},

		_valid: false,		//valid filter means there are truelly rows that are filterred out

		//Public---------------------------------------------------------------------

		//pageSize: 100,

		clear: function(){
			this._ids = 0;
			this._indexes = {};
			
			this._struct = {};
			this._struct[''] = [undefined];
			
			this._valid = false;
		},

		filter: function(checker){
			this.model._addCmd({
				name: '_cmdFilter',
				scope: this,
				args: arguments,
				async: 1
			});
		},

		hasFilter: function(){
			return !!this._ids;
		},

		hasChildren: function(id){
			var t = this,
				ids = t._ids,
				inner = t.inner;

			if(ids){
				//FIX me:
				//In filter mode, we don't want the rows to have tree-relationship with each other,
				//compulsively return false here to make tree expand/collapse button disappear in each row.
				return inner._call('hasChildren', arguments) && this._struct[id] && this._struct[id].length > 1;
			}else{
				return inner._call('hasChildren', arguments);
			}
		},

		children: function(id){
			var t = this,
				ids = t._ids,
				inner = t.inner,
				_struct;

			if(ids){
				_struct = this._struct[id];
				return _struct instanceof Array ? _struct.slice(1) : [];
			}else{
				return inner._call('children', arguments);
			}
		},

		byIndex: function(index, parentId){
			var t = this,
				ids = t._ids,
				inner = t.inner,
				id = ids && t._struct[parentId? parentId : ''][index + 1];

			return !t.model.isId(parentId) && ids ? t.model.isId(id) && inner._call('byId', [id]) : inner._call('byIndex', arguments);
		},

		byId: function(id){
			return (this.ids && this._indexes[id] === undefined) ? null : this.inner._call('byId', arguments);
		},

		indexToId: function(index, parentId, skip){
			if(this._ids && !skip){
				return this._struct[this.model.isId(parentId)? parentId: ''][index + 1];
			}else{
				return this.inner._call('indexToId', arguments);
			}
		},

		idToIndex: function(id) {
			if(!this._ids){
				return this.inner._call('idToIndex', arguments);
			}

			var pid = this._struct[id] && this._struct[id][0],
				//Use indexOf provided by Dojo, since IE8 doesn't have [].indexOf function.
				index = indexOf(this._struct[pid] || [], id);

			return index > 0 ? index - 1 : -1;
		},

		size: function(parentId, skip){
			var _struct;

			if(this._ids && !skip){
				_struct = this._struct[this.model.isId(parentId)? parentId : ''];
				return _struct? _struct.length - 1 : -1;
			}

			return this.inner._call('size', arguments);
		},

		when: function(args, callback){
			var t = this,
				f = function(){
					if(t._ids){
						t._mapWhenArgs(args);
					}
					return t.inner._call('when', [args, callback]);
				};
			if(t._refilter){
				t._refilter = 0;
				if(t._ids){
					var d = new Deferred();
					t._reFilter().then(function(){
						f().then(hitch(d, d.callback), hitch(d, d.errback));
					});
					return d;
				}
			}
			return f();
		},

		//Private---------------------------------------------------------------------
		_cmdFilter: function(){
			var a = arguments;
			return this._filter.apply(this, a[a.length - 1]);
		},

		_filter: function(checker){
			var t = this,
				oldSize = t.size(),
				m = t.model;

			t.clear();
			if(lang.isFunction(checker)){
				var ids = [], temp,
					scanCallback = function(rows/* object|string array */, start, parentId){
						if(!rows.length){
							return false;
						}
						var i, id, row, len, children, pid,/*parent id*/
							end = start + rows.length;

						parentId = parentId !== undefined? parentId: '';
						for(i = start; i < end; ++i){
							id = t.indexToId(i, parentId);
							row = t.byIndex(i, parentId);
							if(row){
								if(checker(row, id)){
									//match
									ids.push(id);
									t._add(id);
									t._indexes[id] = i;
								}else{
									//not match
									t._valid = true;
								}
								children = m.children(id);
								if(children.length){
									pid = m.parentId(children[0]);
									scanCallback(children, 0, pid);
								}
							}else{
								break;
							}
						}
					};

				return t.model.scan({
					start: 0,
					pageSize: t.pageSize,
					whenScope: t,
					whenFunc: t.when
				}, scanCallback).then(function(){
					if(ids.length == t.size() && !t._valid){
						//Filtered item size equals cache size, so filter is useless.
						t.clear();
					}else{
						t._ids = ids;
						t.model._msg('filter', ids);
					}
				}, 0, t.model.onFilterProgress);
			}else{
				var d = new Deferred();
				d.callback();
				t.model._msg('clearFilter', ids);
				return d;
			}
		},

		_add: function(id){
			if(id === undefined || id === null){return;}

			var t = this,
				m = t.model,
				treepath = t.model.treePath(id),
				treepathLen = treepath.length, temp, i,
				parentId = t.model.parentId(id);

			if(!t._struct[id]){
				t._struct[id] = [parentId];
			}
			temp = t._struct[id];
			if(parentId !== undefined && parentId !== null){
				if(!t._struct.hasOwnProperty(parentId)){
					t._struct[parentId] = [m.parentId(parentId)];
				}
				if(indexOf(t._struct[parentId], id) < 0){
					t._struct[parentId].push(id);
				}
			}
			// }else{
			// temp.push(parentId);
			for(i = treepathLen - 1; i >= 0; i--){
				t._add(treepath[i]);
			}
		},

		_mapWhenArgs: function(args){
			//Map ids and index ranges to what the store needs.
			var t = this, ranges = [], size = t._ids.length;
			args.id = array.filter(args.id, function(id){
				return t._indexes[id] !== undefined;
			});
			forEach(args.range, function(r){
				if(t.model.isId(r.parentId)){
					ranges.push(r);
				}else{
					if(!r.count || r.count < 0){
						//For open ranges, must limit the size because we know the filtered size here.
						var cnt = size - r.start;
						if(cnt <= 0){
							return;
						}
						r.count = cnt;
					}
					for(var i = 0; i < r.count; ++i){
						var idx = t._mapIndex(i + r.start);
						if(idx !== undefined){
							ranges.push({
								start: idx,
								count: 1
							});
						}
					}
				}
			});
			args.range = ranges;
		},

		_mapMoveArgs: function(args){
			var t = this;
			if(args.length == 3){
				var indexes = [];
				for(var i = args[0], end = args[0] + args[1]; i < end; ++i){
					indexes.push(t._mapIndex(i));
				}
				args[0] = indexes;
				args[1] = t._mapIndex(args[2]);
				args.pop();
			}else{
				args[0] = array.map(args[0], function(index){
					return t._mapIndex(index);
				});
				args[1] = t._mapIndex(args[1]);
			}
		},

		_mapIndex: function(index){
			return this._indexes[this._ids[index]];
		},

		_moveFiltered: function(start, count, target){
			var t = this, size = t._ids.length;
			if(start >= 0 && start < size && 
				count > 0 && count < Infinity && 
				target >= 0 && target < size && 
				(target < start || target > start + count)){

				var i, len, indexes = [];
				for(i = start, len = start + count; i < len; ++i){
					indexes.push(t._mapIndex(i));
				}
				t.inner._call('moveIndexes', [indexes, t._mapIndex(target)]);
			}
		},

		_reFilter: function(){
			var t = this;
			return t.inner._call('when', [{
				id: t._ids,
				range: []
			}, function(){
				forEach(t._ids, function(id){
					var idx = t.inner._call('idToIndex', [id]);
					t._indexes[id] = idx;
				});
				t._ids.sort(function(a, b){
					return t._indexes[a] - t._indexes[b];
				});
				// sync client filter local struct order with cache struct order
				t.syncOrder();
			}]);
		},

		syncOrder: function() {
			var struct = this.model._cache._struct;
			// handle special root id array
			for (var id in this._struct) {
				var idArray = this._struct[id];
				if (idArray.length > 2) {
					if (id === '') idArray.shift();
					this._syncOrder(idArray, struct[id]);
					if (id === '') idArray.unshift(undefined);
				}
			}
		},

		_syncOrder: function(arrayA, arrayB) {
			var index = {};
			arrayA.forEach(function(a) {
				index[a] = indexOf(arrayB, a);
			});

			arrayA.sort(function(a, b) {
				return index[a] - index[b];
			});
		},

		_onMoved: function(map){
			var t = this;
			forEach(t._ids, function(id){
				var oldIdx = t._indexes[id];
				if(map[oldIdx] !== undefined){
					t._indexes[id] = map[oldIdx];
				}
			});
			t._ids.sort(function(a, b){
				return t._indexes[a] - t._indexes[b];
			});
		},

		_receiveMsg: function(msg, args){
			var t = this;
			if(t._ids){
				if(msg == 'storeChange'){
					t._refilter = 1;
				}else if(msg == 'moved'){
					t._onMoved(args);
				}else if(msg == 'beforeMove'){
					t._mapMoveArgs(args);
				}
			}
		},

		_onNew: function(id){
			var t = this;
			if(t._ids){
				t._ids.push(id);
				t._refilter = 1;
			}
			t.onNew.apply(t, arguments);
		},

		_onDelete: function(id, index, row){
			var t = this, indexes = t._indexes, ids = t._ids;
			if(ids){
				var i = indexOf(ids, id),
					idx = indexes[id];
				if(i >= 0){
					ids.splice(i, 1);
				}
				if(i >= 0 && idx !== undefined){
					index = i;
					for(i in indexes){
						if(indexes[i] > idx){
							--indexes[i];
						}
					}
				}else{
					index = undefined;
					t._refilter = 1;
				}
			}
			t.onDelete(id, index, row);
		}
	});
});
