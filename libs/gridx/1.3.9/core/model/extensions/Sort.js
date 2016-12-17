define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	/*====='../Model',=====*/
	'../_Extension'
], function(declare, lang, json,
	/*=====Model, =====*/
	_Extension){

/*=====
	Model.sort = function(){};

	return declare(_Extension, {
		// summary:
		//		Using store's sorting feature. Can define a base sort order for grid.
	});
=====*/

	return declare(_Extension, {
		name: 'sort',

		priority: 30,

		constructor: function(model, args){
			var t = this, bs = args.baseSort;
			t._mixinAPI('sort');
			if(bs && bs.length){
				t._baseSort = bs;
				t._sort();
			}
		},

		//Public--------------------------------------------------------------
		sort: function(/* sortSpec */){
			this.model._addCmd({
				name: '_cmdSort',
				scope: this,
				args: arguments
			});
		},

		//Private--------------------------------------------------------------
		_cmdSort: function(){
			var a = arguments;
			this._sort.apply(this, a[a.length - 1]);
		},

		_sort: function(sortSpec){
			var t = this, m = t.model, bs = t._baseSort, c = m._cache,
				op = c.options = c.options || {}, i, s, toSort;
			if(lang.isArrayLike(sortSpec)){
				for(i = 0; i < sortSpec.length; ++i){
					s = sortSpec[i];
					if(s.colId){
						s.attribute = c.columns ? (c.columns[s.colId].field || s.colId) : s.colId;
					}else{
						s.colId = s.attribute;
					}
				}
				if(bs){
					sortSpec = sortSpec.concat(bs);
				}
			}else{
				sortSpec = bs;
			}
			if(op.sort && op.sort.length){
				if(json.toJson(op.sort) !== json.toJson(sortSpec)){
					toSort = 1;	//1 as true
				}
			}else if(sortSpec && sortSpec.length){
				toSort = 1;
			}
			op.sort = lang.clone(sortSpec);
			if(toSort){
				c.clear();
			}
			m._msg('storeChange');
		}
	});
});
