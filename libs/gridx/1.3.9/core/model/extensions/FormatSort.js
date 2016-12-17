define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/data/util/sorter",
	"../_Extension"
], function(declare, array, lang, sorter, _Extension){

/*=====
	return declare(_Extension, {
		// summary:
		//		Make formatted data sortable
	});
=====*/

	function createSortFunc(attr, dir, comp, store){
		return function(itemA, itemB){
			return store.getValue ?
				//Old store
				dir * comp(store.getValue(itemA, attr), store.getValue(itemB, attr)) :
				//New store
				dir * comp(itemA[attr], itemB[attr]);
		};
	}

	function createFormatSortFunc(attr, dir, comp, store, cache, formatter){
		var formatCache = {};
		return function(itemA, itemB){
			var idA = store.getIdentity(itemA),
				idB = store.getIdentity(itemB);
			if(!formatCache[idA]){
				formatCache[idA] = formatter(cache._itemToObject(itemA));
			}
			if(!formatCache[idB]){
				formatCache[idB] = formatter(cache._itemToObject(itemB));
			}
			return dir * comp(formatCache[idA], formatCache[idB]);
		};
	}

	return declare(_Extension, {
		name: 'formatSort',

		priority: 50,

		constructor: function(model){
			var t = this, c = t.cache = model._cache;
			t.aspect(c, "onBeforeFetch", "_onBeforeFetch");
			t.aspect(c, "onAfterFetch", "_onAfterFetch");
		},

		//Private--------------------------------------------------------------------
		_onBeforeFetch: function(req){
			var t = this,
				store = t.model.store;
			t._oldCreateSortFunction = sorter.createSortFunction;
			sorter.createSortFunction = lang.hitch(t, t._createComparator);
			//FIXME: How to check whether it is a new store?
			if(req.sort && lang.isFunction(store.put)){
				req.sort = t._createComparator(req.sort, store);
			}
		},

		_onAfterFetch: function(){
			if(this._oldCreateSortFunction){
				sorter.createSortFunction = this._oldCreateSortFunction;
				delete this._oldCreateSortFunction;
			}
		},

		_createComparator: function(sortSpec, store){
			var sortFunctions = [], c = this.cache,
				map = store.comparatorMap, bc = sorter.basicComparator;
			array.forEach(sortSpec, function(sortAttr){
				var attr = sortAttr.attribute,
					dir = sortAttr.descending ? -1 : 1,
					comp = bc,
					col = c.columns && c.columns[sortAttr.colId];
				if(map){
					if(typeof attr !== "string" && attr.toString){
						attr = attr.toString();
					}
					comp = map[attr] || bc;
				}
				if(col && col.comparator){
					comp = col.comparator;
				}
				var formatter = col && col.sortFormatted && col.formatter;
				sortFunctions.push(formatter ?
					createFormatSortFunc(attr, dir, comp, store, c, formatter) :
					createSortFunc(attr, dir, comp, store)
				);
			});
			return function(rowA, rowB){
				var i, len, ret = 0;
				for(i = 0, len = sortFunctions.length; !ret && i < len; ++i){
					ret = sortFunctions[i](rowA, rowB);
				}
				return ret;
			};
		}
	});
});
