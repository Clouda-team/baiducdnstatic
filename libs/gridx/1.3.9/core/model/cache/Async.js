define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"./Sync"
], function(declare, array, lang, Deferred, DeferredList, Sync){

/*=====
	return declare(Sync, {
		// summary:
		//		Implement lazy-loading for server side store.

		// isAsync: Boolean
		//		Whether this cache is for asynchronous(server side) store.
		isAsync: true,

		// cacheSize: Integer
		//		The max cached row count in client side.
		//		By default, do not clear cache when scrolling, this is the same with DataGrid
		cacheSize: -1,

		// pageSize: Integer
		//		The recommended row count for every fetch.
		pageSize: 100
	});
=====*/

	var hitch = lang.hitch;

	function fetchById(self, args, success, fail){
		//Although store supports query by id, it does not support get index by id, so must find the index by ourselves.
		var i, r, len, pid,
			ranges = args.range,
			isTree = self.store.getChildren;
		// classify range requests into different parent ids.
		args.pids = {};
		args.pids[self.layerId()] = args.range;
		if(isTree && ranges && ranges.length){
			for(i = ranges.length - 1; i >= 0; --i){
				r = ranges[i];
				pid = r.parentId;
				if(!self.model.isId(pid)){
					pid = self.layerId();
				}
				if(self.model.isId(pid)){
					args.id.push(pid);
					args.pids[pid] = args.pids[pid] || [];
					args.pids[pid].push(r);
					ranges.splice(i, 1);
				}
			}
		}
		var ids = findMissingIds(self, args.id),
			mis = [];
		if(ids.length){
			array.forEach(ids, function(id){
				var idx = self.idToIndex(id);
				if(idx >= 0 && !self.treePath(id).pop()){
					// the requested row is a root and have index,
					// so fetch it by index, which is a quicker way.
					ranges.push({
						start: idx,
						count: 1
					});
				}else{
					mis.push(id);
				}
			});
			searchRootLevel(self, mis, function(ids){
				if(ids.length && isTree){
					// some row not found in root level, search in children
					searchChildLevel(self, ids, function(ids){
						if(ids.length){
							console.warn('Requested row ids are not found: ', ids);
						}
						success(args);
					}, fail);
				}else{
					success(args);
				}
			}, fail);
		}else{
			success(args);
		}
	}

	function fetchByIndex(self, args, success, fail){
		var toFetch = [],
			dl = [],
			checkValid = function(size, r){
				if(r.count > 0 && size < r.start + r.count){
					r.count = size - r.start;
				}
				return r.start < size;
			};
		for(var pid in args.pids){
			var size = self._size[pid],
				ranges = args.pids[pid] =
					connectRanges(self,
						mergePendingRequests(self, pid, dl,
							findMissingIndexes(self, pid,
								mergeRanges(args.pids[pid]))));
			if(size > 0){
				ranges = array.filter(ranges, lang.partial(checkValid, size));
			}
			for(var i = 0; i < ranges.length; ++i){
				ranges[i].parentId = pid;
			}
			[].push.apply(toFetch, ranges);
		}
		args._req = dl.length && new DeferredList(dl, 0, 1);
		self._requests.push(args);
		if(toFetch.length){
			new DeferredList(array.map(toFetch, function(r){
				return self._storeFetch(r);
			}), 0, 1).then(success, fail);
		}else{
			success(args);
		}
	}

	function mergePendingRequests(self, parentId, dl, ranges){
		var i, req,
			reqs = self._requests;
		for(i = reqs.length - 1; i >= 0; --i){
			req = reqs[i];
			// check if some part of this range request is already covered by previous pending requests.
			ranges = minus(ranges, req.pids[parentId]);
			if(ranges._overlap && array.indexOf(dl, req._def) < 0){
				dl.push(req._def);
			}
		}
		return ranges;
	}

	function minus(rangesA, rangesB){
		//Minus index range list B from index range list A, 
		//assuming A and B do not have overlapped ranges.
		//This is a set operation
		if(!rangesB || !rangesB.length || !rangesA.length){
			return rangesA;
		}
		var indexes = [], f = 0, r, res = [],
			mark = function(idx, flag){
				indexes[idx] = indexes[idx] || 0;
				indexes[idx] += flag;
			},
			markRanges = function(ranges, flag){
				var i, r;
				for(i = ranges.length - 1; i >= 0; --i){
					r = ranges[i];
					mark(r.start, flag);
					if(r.count){
						mark(r.start + r.count, -flag);
					}
				}
			};
		markRanges(rangesA, 1);
		markRanges(rangesB, 2);
		for(var i = 0, len = indexes.length; i < len; ++i){
			if(indexes[i]){
				f += indexes[i];
				if(f === 1){
					res.push({
						start: i
					});
				}else{
					if(f === 3){
						res._overlap = true;
					}
					r = res[res.length - 1];
					if(r && !r.count){
						r.count = i - r.start;
					}
				}
			}
		}
		return res;
	}

	function mergeRanges(r){
		//Merge index ranges into separate ones.
		var ranges = [], i, t, a, b, c, merged;
		while(r.length > 0){
			c = a = r.pop();
			merged = 0;
			for(i = r.length - 1; i >= 0; --i){
				b = r[i];
				if(a.start < b.start){
					//make sure a is always after b, so the logic can be simplified
					t = b;
					b = a;
					a = t;
				}
				//If b is an open range, and starts before a, then b must include a.
				if(b.count){
					//b is a closed range, it's possible to overlap.
					if(a.start <= b.start + b.count){
						//overlap
						if(a.count && a.start + a.count > b.start + b.count){
							b.count = a.start + a.count - b.start;
						}else if(!a.count){
							b.count = null;
						}
						//otherwise, b includes a
					}else{
						//not overlap, try next range
						a = c;
						continue;
					}
				}
				//now n is a merged range
				r[i] = b;
				merged = 1;
				break;
			}
			if(!merged){
				//Can not merge, this is a sperate range
				ranges.push(c);
			}
		}
		return ranges;
	}

	function connectRanges(self, ranges){
		//Connect small ranges into big ones to reduce request count
		//FIXME: find a better way to do this!
		var results = [], a, b, ps = self.pageSize;
		ranges.sort(function(a, b){
			return a.start - b.start;
		});
		while(ranges.length){
			a = ranges.shift();
			if(ranges.length){
				b = ranges[0];
				if(b.count && b.count + b.start - a.start <= ps){
					b.count = b.count + b.start - a.start;
					b.start = a.start;
					continue;
				}else if(!b.count && b.start - a.start < ps){
					b.start = a.start;
					continue;
				}
			}
			results.push(a);
		}
		//Improve performance for most cases
		if(results.length == 1 && results[0].count < ps){
			results[0].count = ps;
		}
		return results;
	}

	function findMissingIds(self, ids){
		var c = self._cache;
		return array.filter(ids, function(id){
			return !c[id];
		});
	}

	function findMissingIndexes(self, parentId, ranges){
		//Removed loaded rows from the request index ranges.
		//generate unsorted range list.
		var i, j, r, end, newRange,
			results = [],
			indexMap = self._struct[parentId] || [],
			totalSize = self._size[parentId];
		for(i = ranges.length - 1; i >= 0; --i){
			r = ranges[i];
			end = r.count ? r.start + r.count : indexMap.length - 1;
			newRange = 1;
			for(j = r.start; j < end; ++j){
				var id = indexMap[j + 1];
				if(!id || !self._cache[id]){
					if(newRange){
						results.push({
							parentId: parentId,
							start: j,
							count: 1
						});
					}else{
						++results[results.length - 1].count;
					}
					newRange = 0;
				}else{
					newRange = 1;
				}
			}
			if(!r.count){
				if(!newRange){
					delete results[results.length - 1].count;
				}else if(totalSize < 0 || j < totalSize){
					results.push({
						parentId: parentId,
						start: j
					});
				}
			}
		}
		return results;
	}

	function searchRootLevel(self, ids, success, fail){
		//search root level for missing ids
		var indexMap = self._struct[''],
			ranges = [],
			lastRange,
			premissing; //Whether the previous item is missing
		if(ids.length){
			for(var i = 1, len = indexMap.length; i < len; ++i){
				if(!indexMap[i]){
					if(premissing){
						lastRange.count++;
					}else{
						premissing = 1;
						ranges.push(lastRange = {
							start: i - 1,
							count: 1
						});
					}
				}
			}
			ranges.push({
				start: indexMap.length < 2 ? 0 : indexMap.length - 2
			});
		}
		var func = function(ids){
			if(ids.length && ranges.length){
				self._storeFetch(ranges.shift()).then(function(){
					func(findMissingIds(self, ids));
				}, fail);
			}else{
				success(ids);
			}
		};
		func(ids);
	}

	function searchChildLevel(self, ids, success, fail){
		//Search children level of current level for missing ids
		var st = self._struct,
			parentIds = st[''].slice(1),
			func = function(ids){
				if(ids.length && parentIds.length){
					var pid = parentIds.shift();
					self._storeFetch({
						parentId: pid
					}).then(function(){
						[].push.apply(parentIds, st[pid].slice(1));
						func(findMissingIds(self, ids));
					}, fail);
				}else{
					success(ids);
				}
			};
		func(ids);
	}

	return declare(Sync, {
		isAsync: true,

		constructor: function(model, args){
			var cs = parseInt(args.cacheSize, 10),
				ps = parseInt(args.pageSize, 10);
			this.cacheSize = cs >= 0 ? cs : -1;
			this.pageSize = ps > 0 ? ps : 100;
		},

		when: function(args, callback){
			var t = this,
				d = args._def = new Deferred(),
				fail = hitch(d, d.errback),
				innerFail = function(e){
					t._requests.pop();
					fail(e);
				};
			// fetch by row id first, because this can greatly 
			// increase the hit-rate for fetchByIndex
			fetchById(t, args, function(args){
				fetchByIndex(t, args, function(args){
					Deferred.when(args._req, function(){
						var err;
						if(callback){
							try{
								callback();
							}catch(e){
								err = e;
							}
						}
						t._requests.shift();
						if(err){
							d.errback(err);
						}else{
							d.callback();
						}
					}, innerFail);
				}, innerFail);
			}, fail);
			return d;
		},

		keep: function(id, lock){
			var t = this,
				k = t._kept;
			if(t._cache[id] && t._struct[id] && !k[id]){
				k[id] = 1;
				++t._keptSize;
			}
			if(k[id] && !t._lock[id] && lock){
				t._lock[id] = 1;
				++t._lockSize;
			}
		},

		free: function(id, unlock){
			var t = this;
			if(!t.model.isId(id)){
				//free all. Not free locked items.
				t._kept = lang.clone(t._lock);
				t._keptSize = t._lockSize;
			}else if(t._kept[id]){
				if(!t._lock[id]){
					//free unlocked items.
					delete t._kept[id];
					--t._keptSize;
				}else if(unlock){
					//if explictly unlock an item, only unlock it, but not free it,
					//so that next time it'll be freed.
					delete t._lock[id];
					--t._lockSize;
				}
			}
		},

		clear: function(){
			var t = this;
			if(t._requests && t._requests.length){
				t._clearLock = 1;	//1 as true
				return;
			}
			t.inherited(arguments);
			t._requests = [];
			t._priority = [];
			t._kept = {};
			t._lock = {};
			t._keptSize = 0;
			t._lockSize = 0;
		},

		//-----------------------------------------------------------------------------------------------------------
		_init: function(){},

		_checkSize: function(){
			// only meaningful when casheSize is limited
			var t = this, id,
				cs = t.cacheSize,
				p = t._priority;
			if(t._clearLock){
				t._clearLock = 0;	//0 as false
				t.clear();
			}else if(cs >= 0){
				cs += t._keptSize;
//                console.warn("### Cache size:", p.length,
//                        ", To release: ", p.length - cs,
//                        ", Keep size: ", this._keptSize);
				while(p.length > cs){
					id = p.shift();
					if(t._kept[id]){
						p.push(id);
					}else{
						delete t._cache[id];
					}
				}
			}
		}
	});
});
