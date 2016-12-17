define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/unload",
	"dojo/cookie",
	"../core/_Module"
], function(declare, array, lang, json, unload, cookie, _Module){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: persist.
		//		Provide a mechanism to persist various grid features when the grid is destroyed,
		//		so that when a new grid with the same id (or the same persist key) is created,
		//		all these features will be restored.
		//		By default use cookie, but users can also provide custom put and get functions.
		//		Note: since dojox.storage is still experimental, and with HTML5 we will hardly need
		//		things like gears or behavior storage, so we aren't supporting dojox.storage by default.

		// enabled: Boolean
		//		Whether this module is enabled (also means whether all registered features are persistable).
		enabled: true,

		// options:
		//		Options meaningful to the persist mechanism. By default it mean the cookie options.
		options: null,
		
		// key: String
		//		This is the storage key of this grid. If not provided (by default), the grid id is used as the key.
		//		This property is essential when a grid with a different id wants to load from this storage.
		key: '',
	
		put: function(key, value, options){
			// summary:
			//		This is NOT a public method, but users can provide their own to override it.
			//		This function is called when finally saving things into some kind of storage.
			// key: String
			//		The persist key of this grid.
			// value: Object
			//		A JSON object, containing everything we want to persist for this grid.
		},
	
		get: function(key){
			// summary:
			//		This is NOT a public method, but users can provide their own to override it.
			//		This function is called when loading things from storage.
			// return:
			//		Then things we stored before.
		},
	
		registerAndLoad: function(name, saver, scope){
			// summary:
			//		Register a feature to be persisted, and then load (return) its contents.
			// name: String
			//		A unique name of the feature to be persisted.
			// saver: Function() return object
			//		A function to be called when persisting the grid.
			// return:
			//		The loaded contents of the given feature.
		},

		features: function(){
			// summary:
			//		Get the names of all the persistable features.
			//		These names can be used in enable(), disable() or isEnabled() methods.
			// return:
			//		An array of persistable feature names.
		},
	
		enable: function(name){
			// summary:
			//		Enable persistance of the given feature, that is, will persist this feature when the save function
			//		is called. If name is not provided (undefined or null), then enable all registered features.
			// name: String
			//		Name of a feature.
		},
	
		disable: function(name){
			// summary:
			//		Disable persistance of the given feature, that is, will NOT persist this feature when the save
			//		function is called. If name is not provided (undefined or null), then disable all registered features.
			// name: String
			//		Name of a feature.
		},
	
		isEnabled: function(name){
			// summary:
			//		Check whether a feature is enabled or not.
			// name: String
			//		Name of a feature. If omitted, means every feature.
			// return:
			//		Whether this feature (or every feature) is enabled.
		},
	
		save: function(){
			// summary:
			//		Save all the enabled features.
		}
	});
=====*/

	return declare(_Module, {
		name: 'persist',
	
		constructor: function(grid){
			// summary:
			//		All initializations, if any, must be done in the constructor, instead of the load function.
			// grid: Object
			//		The grid itself.
			var t = this,
				gridDestroy = grid.destroy;
			//Initialize arguments
			t.arg('key', window.location + '/' + grid.id, function(arg){
				return arg;
			});
			t._persistedList = {};
			// Save states when grid destroy or window unload
			grid.destroy = function(){
				t.save();
				gridDestroy.call(grid);
			};
			//column state register/restore
			t._restoreColumnState();
			unload.addOnWindowUnload(function(){
				t.save();
			});
		},
	
		//Public---------------------------------------------------------
		enabled: true,

		options: null,
		
		key: '',
	
		put: function(key, value, options){
			if(value && lang.isObject(value)){
				cookie(key, json.toJson(value), options);
			}else{
				cookie(key, null, {expires: -1});
			}
		},
	
		get: function(key){
			return json.fromJson(cookie(key));
		},
	
		registerAndLoad: function(name, saver, scope){
			this._persistedList[name] = {
				saver: saver,
				scope: scope,
				enabled: true
			};
			var get = this.arg('get'),
				content = '_content' in this ? this._content : (this._content = get(this.arg('key')));
			return content ? content[name] : null;
		},

		features: function(){
			var list = this._persistedList,
				features = [],
				name;
			for(name in list){
				if(list.hasOwnProperty(name)){
					features.push(name);
				}
			}
			return features;
		},
	
		enable: function(name){
			this._setEnable(name, 1);
		},
	
		disable: function(name){
			this._setEnable(name, 0);
		},
	
		isEnabled: function(name){
			var feature = this._persistedList[name];
			if(feature){
				return feature.enabled;
			}
			return name ? false : this.arg('enabled');
		},
	
		save: function(){
			var t = this,
				contents = null,
				put = t.arg('put');
			if(t.arg('enabled')){
				var name,
					feature,
					list = t._persistedList;
				contents = {};
				for(name in list){
					feature = list[name];
					if(feature.enabled){
						contents[name] = feature.saver.call(feature.scope || lang.global);
					}
				}
			}
			delete t._content;
			put(t.arg('key'), contents, t.arg('options'));
		},
	
		//Private--------------------------------------------------------
		//_persistedList: null,
		
		_setEnable: function(name, enabled){
			var list = this._persistedList;
			enabled = !!enabled;
			if(list[name]){
				list[name].enabled = enabled;
			}else if(!name){
				for(name in list){
					list[name].enabled = enabled;
				}
				this.enabled = enabled;
			}
		},
		
		//For column state restore---------------------
		_restoreColumnState: function(){
			var t = this,
				grid = t.grid,
				colHash = {},
				columns = t.registerAndLoad('column', t._columnStateSaver, t);
			if(lang.isArray(columns)){
				array.forEach(columns, function(c){
					colHash[c.id] = c;
				});
				//persist column width
				array.forEach(grid._columns, function(col){
					var c = colHash[col.id];
					if(c && c.id == col.id){
						col.declaredWidth = col.width = c.width;
					}
				});
				grid._columns.sort(function(ca, cb){
					var c1 = colHash[ca.id];
					var c2 = colHash[cb.id];
					if(c1 && c2){
						return c1.index - c2.index;
					}else if(!c1 && c2){
						return 1;
					}else if(c1 && !c2){
						return -1;
					}
					return ca.index - cb.index;
				});
				grid.setColumns(grid._columns);
			}
		},
		
		_columnStateSaver: function(){
			return array.map(this.grid._columns, function(c){
				return {
					id: c.id,
					index: c.index,
					width: c.width
				};
			});
		}
	});
});
