define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/DeferredList',
	'dojo/_base/Deferred',
	'dojo/_base/array',
	'../_Extension'
], function(declare, lang, DeferredList, Deferred, array, _Extension){
/*=====
	return declare([], {
		// Summary:
		//			Enable model to change data without affecting the store.
		//			All the changes will be saved in the modify extension.
		//			The byId and byIndex function will be wrapped in this extension.
		
		set: function(){
			// summary:
			//		Set some fields in a row.
			//		Can set multiple fields altogether.
			//		This is one single operation.
			// rowId: String
			// rawData: object
			//		{field1: '...', feild2: '...'}
			
			//Fire this.onSet();
			
		},
		
		undo: function(){
			// summary:
			//		Undo last edit change.
			// returns:
			//		True if successful, false if nothing to undo.
			return false;	//Boolean
		},
		
		redo: function(){
			// summary:
			//		redo next edit change.
			// returns:
			//		True if successful, false if nothing to redo.		
			return false;	//Boolean
		},
		
		save:  function(){
			// summary:
			//		write to store. Clear undo list.
			// returns:
			//		A Deferred object indicating all the store save operation has finished.			
		},
		
		clearLazyDat: function(){
			// summary:
			//		Undo all. Clear undo list. The initial name of this function is 'clear'.
			//		When use grid.model.clear(), this function won't be run because 
			//		there is a function named 'clear'in ClientFilter.
			//		So rename this function to clearLazyData which is more in detail about what this 
			//		function really do.			
		
		},
		
		isChanged: function(){
			// summary:
			//		Check whether a field is changed for the given row.
			// rowId:
			// field: String?
			//		If omitted, checked whether any field of the row is changed.
			// returns:
			//		True if it does get changed.
			return false;	//Boolean
		},
		
		getChanged: function(){
			// summary:
			//		Get all the changed rows Ids.
			// returns:
			//		An array of changed row IDs.
			return [];	//Array
		},

		onSave: function(rowids){
			// summary:
			//		Fired when successfully saved to store.
			// rowIds: array
			//		
			
		},
		
		onUndo: function(rowId, newData, oldData){
			// summary:
			//		Fired when successfully undid.
			//
			//	rowIds: string
			//
			//	newData: the data to change to
			//	
			//	oldData: the data change from 
		},

		onRedo: function(rowId, newData, oldData){
			// summary:
			//		Fired when successfully redid.
			//	rowIds: string
			//
			//	newData: the data to change to
			//	
			//	oldData: the data change from

		}
	
	})
=====*/

	return declare(_Extension, {
		name: 'modify',

		priority: 19,
		
		constructor: function(model, args){
			var t = this,
				s = model.store;
			
			t._globalOptList = [];
			t._globalOptIndex = -1;
			t._cellOptList = {};
			
			t._lazyData = {};
			t._lazyRawData = {};
			
			t._cache = model._cache;
			t._mixinAPI('set', 'redo', 'undo', 'isChanged', 'getChanged', 'save', 'clearLazyData');
			
			model.onSetLazyData = function(){};
			model.onRedo = model.onUndo = function(){};
			
			var old = s.fetch;
		},

		//Public--------------------------------------------------------------
		byId: function(id){
			var t = this,
				c = t.inner._call('byId', arguments);
			if(!c) return c;
			var d = lang.mixin({}, c);
			
			d.rawData = lang.mixin({}, d.rawData, t._lazyRawData[id]);
			if (d.data) {
				d.data = lang.mixin({}, d.data, t._lazyData[id]);
			}
			return d;
		},
		
		byIndex: function(index, parentId){
			var t = this,
				c = t.inner._call('byIndex', arguments),
				id = t.inner._call('indexToId', arguments);

			if(!c) return c;
			var d = lang.mixin({}, c);
			
			d.rawData = lang.mixin({}, d.rawData, t._lazyRawData[id]);
			if (d.data) {
				d.data = lang.mixin({}, d.data, t._lazyData[id]);
			}
			return d;
		},
		
		set: function(rowId, rawData){
			var t = this,
				opt = {},
				list = t._globalOptList,
				index = t._globalOptIndex;
			opt.type = 0;			//set row
			opt.rowId = rowId;
			opt.newData = rawData;
			opt.oldData = {};
			
			
			var rd = t.byId(rowId).rawData;
			for(var f in rawData){
				opt.oldData[f] = rd[f];
			}
			
			list.splice(index + 1, (list.length - 1 - index), opt);
			t._globalOptIndex++;
			
			var oldRowData = t.byId(rowId);
			t._set(rowId, rawData);
			var newRowData = t.byId(rowId);
			
			this.onSet(rowId, index, newRowData, oldRowData);		//trigger model.onset
		},

		undo: function(){
			var t = this,
				opt = t._globalOptList[t._globalOptIndex];
			if(opt){
				t._globalOptIndex--;
				if(opt.type === 0){
					var rowId = opt.rowId,
						oldData = opt.newData,
						newData = opt.oldData;
						
					t._onUndo(rowId, newData, oldData);
				}
				return true;
			}
			return false;
		},

		redo: function(){
			var t = this,
				opt = t._globalOptList[t._globalOptIndex + 1];
			if(opt){
				t._globalOptIndex++;
				if(opt.type === 0){
					var rowId = opt.rowId,
						oldData = opt.oldData,
						newData = opt.newData;
					t._onRedo(rowId, newData, oldData);
				}
				return true;
			}
			return false;
		},

		clearLazyData: function(){
			var t = this,
				cl = t.getChanged();
			
			while(0 <= t._globalOptIndex){
				t.undo();
			}
			
			t._globalOptList = [];
			t._lazyRawData = {};
			t._lazyData = {};
		},

		save: function(){
			var t = this,
				cl = t.getChanged(),
				da = [],
				dl,
				d = new Deferred();

			if(cl.length){
				array.forEach(cl, function(rid){
					var d = t._saveRow(rid);
					da.push(d);
				});
				dl = new DeferredList(da);
				dl.then(function(){
					//t.clear();
					t._globalOptList = [];
					t._globalOptIndex = -1;
					t._lazyRawData = {};
					t._lazyData = {};
					t.onSave(dl);
					d.callback();
				}, function(){
					d.errback();
				});
			}else{
				d.callback();
			}
			return d;
		},

		isChanged: function(rowId, field){
			var t = this,
				cache = t.inner._call('byId', [rowId]),
				ld = t._lazyRawData[rowId];
			if(field){
				if(ld){
					return ld[field] !== undefined? ld[field] !== cache.rawData[field] : false;
				}
			}else{
				if(ld){
					var bool = false;
					for(var f in ld){
						if(ld[f] !== cache.rawData[f]){
							return true;
						}
					}
				}
			}
			return false;
		},

		getChanged: function(){
			var t = this,
				a = [];
			for(var rid in t._lazyRawData){
				if(t.isChanged(rid)){
					a.push(rid);
				}
			}
			return a;
		},

		onSave: function(rowids){
			// summary:
			//		Fired when successfully saved to store.
			// rowIds: array
			//		
			
		},
		
		onUndo: function(rowId, newData, oldData){
			// summary:
			//		Fired when successfully undid.
			//
			//	rowIds: string
			//
			//	newData: the data to change to
			//	
			//	oldData: the data change from 
		},

		onRedo: function(rowId, newData, oldData){
			// summary:
			//		Fired when successfully redid.
			//	rowIds: string
			//
			//	newData: the data to change to
			//	
			//	oldData: the data change from

		},

		//Private-------------------------------------------------------------------
		_onSet: function(){
			//clear
			//fire onSet
			var t = this;
			
			t._globalOptList = [];
			t._globalOptIndex = -1;

			t.onSet.apply(t, arguments);
		},
		
		_onUndo: function(rowId, newData, oldData){
			var index = this._cache.idToIndex(rowId),
				t = this;
			
			var oldRowData = t.byId(rowId);
			t._set(rowId, newData);
			var newRowData = t.byId(rowId);
			this.onSet(rowId, index, newRowData, oldRowData);		//trigger model.onset
			this.onUndo(rowId, newData, oldData);
		},
		
		_onRedo: function(rowId, newData, oldData){
			var index = this._cache.idToIndex(rowId),
				t = this;
			
			var oldRowData = t.byId(rowId);
			t._set(rowId, newData);
			var newRowData = t.byId(rowId);
			this.onSet(rowId, index, newRowData, oldRowData);		//trigger model.onset
			this.onRedo(rowId, newData, oldData);
		},
		
		_set: function(rowId, rawData){
			var t = this,
				c = t.inner._call('byId', [rowId]),
				obj = {};
			
			if(t._lazyRawData[rowId]){
				lang.mixin(t._lazyRawData[rowId], rawData);
			}else{
				t._lazyRawData[rowId] = lang.mixin({}, rawData);
			}
			// if(c.lazyData){
				// lang.mixin(c.lazyData, rawData);
			// }else{
				// c.lazyData = lang.mixin({}, rawData);
			// }
			var columns = t._cache.columns,
				crd = lang.mixin({}, c.rawData, t._lazyRawData[rowId]);
				
			
			for(var cid in columns){
				obj[cid] = columns[cid].formatter? columns[cid].formatter(crd) : crd[columns[cid].field || cid];
			}
			t._lazyData[rowId] = obj; 
		},

		_saveRow: function(rowId){
			var t = this,
				s = t.model.store,
				item = t.byId(rowId).item,
				rawData = t._lazyRawData[rowId],
				d;

			if(s.setValue){
				d = new Deferred();
				try{
					for(var field in rawData){
						s.setValue(item, field, rawData[field]);
					}
					s.save({
						onComplete: lang.hitch(d, d.callback),
						onError: lang.hitch(d, d.errback)
					});
				}catch(e){
					d.errback(e);
				}
			}
			return d || Deferred.when(s.put(lang.mixin({}, item, rawData)));
		}
		
	});
	
});
