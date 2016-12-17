define([
	"dojo/_base/declare",
	/*====='../Model',=====*/
	'../_Extension'
], function(declare,
	/*=====Model, =====*/
	_Extension){

/*=====
	Model.query = function(){};

	return declare(_Extension, {
		// summary:
		//		Pass query to store. Using store's query system.
	});
=====*/

	return declare(_Extension, {
		name: 'query',

		priority: 40,

		constructor: function(model, args){
			this._mixinAPI('query');
			this._cmdQuery(0, 0, [args.query, args.queryOptions]);
		},

		//Public--------------------------------------------------------------
		query: function(/* query, queryOptions */){
			this.model._addCmd({
				name: '_cmdQuery',
				scope: this,
				args: arguments
			});
		},
	
		//Private--------------------------------------------------------------
		_cmdQuery: function(){
			var a = arguments,
				args = a[a.length - 1],
				m = this.model,
				c = m._cache,
				op = c.options = c.options || {};
			op.query = args[0];
			op.queryOptions = args[1];
			m._msg('storeChange');
			c.clear();
		}
	});
});
