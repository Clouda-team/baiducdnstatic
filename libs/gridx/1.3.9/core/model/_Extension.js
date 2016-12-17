define([
	'dojo/_base/declare',
	"dojo/_base/lang",
	'dojo/aspect'
], function(declare, lang, aspect){

/*=====
	return declare([], {
		// summary:
		//		Abstract base class for all model components (including cache)

		onNew: function(){},
		onDelete: function(){},
		onSet: function(){}
	});
=====*/

	return declare([], {
		constructor: function(model){
			var t = this,
				i = t.inner = model._model;
			t._cnnts = [];
			t.model = model;
			model._model = t;
			if(i){
				t.aspect(i, 'onDelete', '_onDelete');
				t.aspect(i, 'onNew', '_onNew');
				t.aspect(i, 'onSet', '_onSet');
			}
		},

		destroy: function(){
			for(var i = 0, len = this._cnnts.length; i < len; ++i){
				this._cnnts[i].remove();
			}
		},

		aspect: function(obj, e, method, scope, pos){
			var cnnt = aspect[pos || 'after'](obj, e, lang.hitch(scope || this, method), 1);
			this._cnnts.push(cnnt);
			return cnnt;
		},

		//Events----------------------------------------------------------------------
		//Make sure every extension has the oppotunity to decide when to fire an event at its level.
		_onNew: function(){
			this.onNew.apply(this, arguments);
		},

		_onSet: function(){
			this.onSet.apply(this, arguments);
		},

		_onDelete: function(){
			this.onDelete.apply(this, arguments);
		},

		onNew: function(){},
		onDelete: function(){},
		onSet: function(){},

		//Protected-----------------------------------------------------------------
		_call: function(method, args){
			var t = this,
				m = t[method],
				n = t.inner;
			return m ? m.apply(t, args || []) : n && n._call(method, args);
		},

		_mixinAPI: function(){
			var i,
				m = this.model,
				args = arguments,
				api = function(method){
					return function(){
						return m._model._call(method, arguments);
					};
				};
			for(i = args.length - 1; i >= 0; --i){
				m[args[i]] = api(args[i]);
			}
		}
	});
});
