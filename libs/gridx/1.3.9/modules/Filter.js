define([
	"../core/_Module",
	"../core/model/extensions/ClientFilter",
	"../core/model/extensions/Query",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred"
], function(_Module, ClientFilter, Query, declare, array, lang, Deferred){

/*=====
	var Filter = declare(_Module, {
		// summary:
		//		module name: filter.
		//		This module makes it possible for user to set arbitrary filter condition to grid.

		serverMode: false,

		setupQuery: function(obj){
		},

		setFilter: function(checker, skipUpdateBody){
			// summary:
			//		Apply function *checker* as the filter condition to filter every row.
			// checker: Function(rowCache, rowId)|null|undefined (or anything that is invalid)
			//		A function only returning TRUE or FALSE. It is used to decide whether a row should survive.
			//		If it is null (or anything invalid here), then clear the current filter.
			// skipUpdateBody: Boolean?
			//		Whether to immediately update grid UI after filtering.
			// return:
			//		undefined
			// throw:
			//		If *skipUpdateBody* is not TRUE, then must not throw, else, only allowed to throw the exceptions
			//		that are generated from the *checker* function.
			//		If *checker* is not a function, or null, should not throw.
		},

		clearFilter: function(){
			// summary:
			//		Remove the current filters applied on the grid. When there is not filterBar applied on
			//		the grid, user can call grid.filter.clearFilter() to logically clear the filters.
			//		When filterBar is applied, user should use grid.filterBar.clearFilter() to clear filter,
			//		otherwise the filter status will not sync between filter(logic) and filterBar(UI).
			// return:
			//		undefined
		},

		getFilter: function(){
			// summary:
			//		Return the current checker function.
			// return: Function|null|undefined (or anything that is invalid)
			//		The current checker function
			return this._checker;
		},

		refresh: function(){
			// summary:
			//		Re-filter the grid with current filter. Useful when data is changed.
			// return:
			//		Deferred when refreshing is completed.
		},

		onFilter: function(){
		}
	});

	Filter.__FilterExpressionTools = declare([], {
		// summary:
		//		A filter expression is just a function returning TRUE/FALSE.
		//		Here provides a set of useful expression tools to help construct complicated filter expressions for grid.
		//		These expressions are not bound to any specific grid instance, so they can be directly reused for many grids.
		// example:
		//	|		var expr = and(
		//	|				and(
		//	|					startWith(column('colA', 'string'), value('123abc', 'string')),
		//	|					greater(column('colB', 'number'), value(456, 'number'))
		//	|				),
		//	|				or(
		//	|					lessEqual(column('colC', 'number'), value(89, 'number')),
		//	|					not(
		//	|						endWith(column('colD', 'string'), value('xyz', 'string'))
		//	|					)
		//	|				)
		//	|			);

		column: function(colId, type, converter, useRawData){
			// summary:
			//		Used in filter condition expression to identify a grid column
			// colId: String|Number
			//		The id of the grid column, usually string.
			//		NOTE: If useRawData is set to true, this should be the field name in store instead of the column id.
			// type: String?
			//		The data type of the grid column. If omitted, default to "string".
			// converter: Function?
			//		A data type converter function, used when the default converting does not work.
			//		For date or time type, converting to a Date object is enough.
			// useRawData: Boolean?
			//		To filter the store data (raw data) or the grid data (formatted data).
			//		If set to true, colId should be the field name in store.
			// return: Function
			//		A filter expression.
			// example:
			//	|	//Omitting namespace here.
			//	|	var c = column('ISO Date Column', 'date', function(data){
			//	|		return dojo.date.stamp.fromISOString(data);
			//	|	});
			//	|	//Create a filter expression to checker whether the cell data equals today's date.
			//	|	var expr = equal(c, value(new Date(), 'date'));
		},

		value: function(v, type, converter){
			// summary:
			//		Used in filter condition expression to represent a pure value.
			// v: Anything
			//		The value to be used in the filter condition
			// type: String?
			//		The data type of the value. If omitted, this function tris to infer by itself using typeof.
			// converter: Function?
			//		A data type converter function, used when the default converting does not work.
			//		For date or time type, converting to a Date object is enough.
			// return: Function
			//		A filter expression
		},
		
		isEmpty: function(expr, emptyValues){
			// summary:
			//		A filter condition operaton to check whether an expression's result is empty.
			// expr: Function
			//		A filter condition expression.
			// emptyValue: Array?
			//		An array of values to be regarded as empty. If omitted, default to ""(empty string), null and undefined.
			// return: Function
			//		A filter expression
		},
		
		and: function(){
			// summary:
			//		A filter operation to check whether all the filter expressions passed in have TRUE results.
			// return: Function
			//		A filter expression
		},
		
		or: function(){
			// summary:
			//		A filter operation to check whether any of the filter expressions passed in have TRUE result.
			// return: Function
			//		A filter expression
		},
		
		not: function(predicate){
			// summary:
			//		A filter operation to check whether the result of the *predicate* is FALSE.
			// predicate: Function
			//		A filter expression.
			// return: Function
			//		A filter expression.
		},
		
		equal: function(expr1, expr2){
			// summary:
			//		A filter operation to check whether the given two expressions have the same result.
			// expr1: Function
			//		A filter expression.
			// expr2: Function
			//		A filter expression.
			// return: Function
			//		A filter expression.
		},
		
		greater: function(expr1, expr2){
			// summary:
			//		A filter operation to check whether the result of *expr1* is greater than that of *expr2*.
			// expr1: Function
			//		A filter expression.
			// expr2: Function
			//		A filter expression.
			// return: Function
			//		A filter expression.
		},
		
		less: function(expr1, expr2){
			// summary:
			//		A filter operation to check whether the result of *expr1* is less than that of *expr2*.
			// expr1: Function
			//		A filter expression.
			// expr2: Function
			//		A filter expression.
			// return: Function
			//		A filter expression.
		},
		
		greaterEqual: function(expr1, expr2){
			// summary:
			//		A filter operation to check whether the result of *expr1* is greater than or equal to that of *expr2*.
			// expr1: Function
			//		A filter expression.
			// expr2: Function
			//		A filter expression.
			// return: Function
			//		A filter expression.
		},
		
		lessEqual: function(expr1, expr2){
			// summary:
			//		A filter operation to check whether the result of *expr1* is less than or equal to that of *expr2*.
			// expr1: Function
			//		A filter expression.
			// expr2: Function
			//		A filter expression.
			// return: Function
			//		A filter expression.
		},
		
		match: function(expr, regExpr){
			// summary:
			//		A filter operation to check whether the result of *expr* matches the given regular expression *regExpr*.
			// expr: Function
			//		A filter expression returning string value.
			// regExpr: RegEx
			//		A regular expression.
			// return: Function
			//		A filter expression.
		},
		
		contain: function(expr1, expr2, caseSensitive){
			// summary:
			//		A filter operation to check wheter the string result of *expr1* contains that of *expr2*.
			// expr1: Function
			//		A filter expression.
			// expr2: Function
			//		A filter expression.
			// return: Function
			//		A filter expression.
		},
		
		startWith: function(expr1, expr2, caseSensitive){
			// summary:
			//		A filter operation to check wheter the string result of *expr1* starts with that of *expr2*.
			// expr1: Function
			//		A filter expression.
			// expr2: Function
			//		A filter expression.
			// return: Function
			//		A filter expression.
		},
		
		endWith: function(expr1, expr2, caseSensitive){
			// summary:
			//		A filter operation to check wheter the string result of *expr1* ends with that of *expr2*.
			// expr1: Function
			//		A filter expression.
			// expr2: Function
			//		A filter expression.
			// return: Function
			//		A filter expression.
		}
	});

	return Filter;
=====*/

	var module = declare(_Module, {

		name: 'filter',

		modelExtensions: [ClientFilter, Query],

		constructor: function(){
			this.setFilter(this.arg('preCondition'), 1);
			this.aspect(this.grid.model, 'setStore', function(){
				this._checker = null;
			});
		},

		serverMode: false,

		caseSensitive: false,

		setupQuery: function(obj){
			return obj;
		},

		setFilter: function(checker, skipUpdateBody){
			var t = this;
			if(t.arg("serverMode")){
				if(!t._checker){
					t.grid.view.backupOpenInfo();	
				}
				t.grid.vScroller._lastScrollTop = 0;
			}

			if(checker != t._checker){
				t._checker = checker;
				t.refresh(skipUpdateBody).then(function(){
					t.onFilter();
				});
			}
		},

		clearFilter: function(skipUpdateBody){
			var t = this;
			if(t.arg("serverMode")){
				t.grid.view.restoreOpenInfo();
				t.grid.vScroller._lastScrollTop = 0;
			}			
			t._checker = null;
			t.refresh(skipUpdateBody).then(function(){
				t.onClearFilter();
			});
		},

		getFilter: function(){
			return this._checker;
		},

		refresh: function(skipUpdateBody){
			var t = this,
				g = t.grid,
				m = t.model,
				d = new Deferred(),
				checker = t._checker;
			if(t.arg('serverMode')){
				var setupQuery = t.arg('setupFilterQuery') || t.arg('setupQuery');
				m.query(setupQuery.call(t, checker && checker.expr));
			}else{
				if (g.tree && g.tree.loadChildRecursive) {
					g.tree.loadChildRecursive('').then(function() {
						m.filter(checker);
					});
				} else {
					m.filter(checker);
				}
			}
			// m.clearCache();
			Deferred.when(!skipUpdateBody && g.body.refresh(), function(){
				d.callback();
				// t.onFilter();
			}, function(e){
				d.errback(e);
			});
			return d;
		},

		onFilter: function(){},

		onClearFilter: function(){}
	});

	//Util
	function valueConvert(d, type, converter, caseSensitive) {
		if (lang.isFunction(converter)) {
			d = converter(d);
		}
		switch (type) {
			case 'number':
				return parseFloat(d, 10);
			case 'boolean':
				return !!d;
			case 'date':
				d = new Date(d);
				d.setHours(0);
				d.setMinutes(0);
				d.setSeconds(0);
				d.setMilliseconds(0);
				return d.getTime();
			case 'datetime':
				d = new Date(d);
				// d.setHours(0);
				// d.setMinutes(0);
				// d.setSeconds(0);
				// d.setMilliseconds(0);
				return d.getTime();
			case 'time':
				d = new Date(d);
				if(!isNaN(d.getTime())){	//d is not invalid date
					d.setDate(1);
					d.setMonth(0);
					d.setFullYear(2000);
					return d.getTime();
				}
				return null;
			default: //string
				return (!caseSensitive) ? (d + '').toLowerCase() : d + '';
				//d = d ? ((!caseSensitive) ? (d + '').toLowerCase() : d + '') : '';
				//return d;
				// return d ? ((!caseSensitive) ? (d + '').toLowerCase() : d + '') : '';
				// return (d === null || d === undefined) ? '' : String(d);
		}
	}

	function wrap(checker, op, operands, options){
		if(lang.isArray(operands)){
			operands = array.map(operands, function(operand){
				return operand.expr;
			});
		}
		return lang.mixin(checker, {
			expr: lang.mixin({
				op: op,
				data: operands
			}, options || {})
		});
	}

	function stringOperator(args, expr1, expr2, caseSensitive, op){
		var str1 = String(expr1.apply(0, args)),
			str2 = String(expr2.apply(0, args));
		if(!caseSensitive){
			str1 = str1.toLowerCase();
			str2 = str2.toLowerCase();
		}
		return op(str1, str2);
	}

	return lang.mixin(module, {
		//Data
		column: function(/* String|Number */colId, /* String? */type, /* Function? */converter, /* Boolean? */useRawData, caseSensitive){
			type = String(type || 'string').toLowerCase();
			return wrap(function(row){
				if (typeof row.data === 'undefined') row.data = row._data();
				return valueConvert( row[useRawData ? 'rawData' : 'data'][colId], type, converter, caseSensitive);
			}, type, colId, {isCol: true});
		},

		value: function(v, type, converter, caseSensitive){
			type = String(type || typeof v).toLowerCase();
			v = valueConvert(v, type, converter, caseSensitive);
			return wrap(function(){
				return v;
			}, type, v);
		},

		//Empty check
		isEmpty: function(expr, emptyValues){
			return wrap(function(){
				var v = expr.apply(0, arguments);
				if(emptyValues){
					return array.indexOf(emptyValues, v) >= 0;
				}else{
					return v === "" || v === null || v === undefined;
				}
			}, "isEmpty", [expr]);
		},
		
		//Is not Empty check
		//Currently it will only appear in serverMode of filter for string-typed column
		//It has no NLS, and it is not recommended to use if you need fully nls support
		isNotEmpty: function(expr, notEmptyValues){
			return wrap(function(){
				var v = expr.apply(0, arguments);
				if(notEmptyValues){
					return array.indexOf(notEmptyValues, v) >= 0;
				}else{
					return v !== "" && v !== null && v !== undefined;
				}
			}, "isNotEmpty", [expr]);
		},	

		//Logic operations
		and: function(/* filter expressions */){
			var parts = array.filter(arguments, function(arg){
				return lang.isFunction(arg);
			});
			return wrap(function(){
				var args = arguments;
				return array.every(parts, function(part){
					return part.apply(0, args);
				});
			}, "and", parts);
		},

		or: function(){
			var parts = array.filter(arguments, function(arg){
				return lang.isFunction(arg);
			});
			return wrap(function(){
				var args = arguments;
				return array.some(parts, function(part){
					return part.apply(0, args);
				});
			}, "or", parts);
		},

		not: function(predicate){
			return wrap(function(){
				return !predicate.apply(0, arguments);
			}, "not", [predicate]);
		},

		//Compare operations
		equal: function(expr1, expr2){
			return wrap(function(){
				return expr1.apply(0, arguments) === expr2.apply(0, arguments);
			}, "equal", [expr1, expr2]);
		},

		greater: function(expr1, expr2){
			return wrap(function(){
				return expr1.apply(0, arguments) > expr2.apply(0, arguments);
			}, "greater", [expr1, expr2]);
		},

		less: function(expr1, expr2){
			return wrap(function(){
				return expr1.apply(0, arguments) < expr2.apply(0, arguments);
			}, "less", [expr1, expr2]);
		},

		greaterEqual: function(expr1, expr2){
			return wrap(function(){
				var v1 = expr1.apply(0, arguments);
				var v2 = expr2.apply(0, arguments);
				return v1 !== undefined && v1 !== null &&
						v2 !== undefined && v2 !== null &&
						v1 >= v2;
			}, "greaterEqual", [expr1, expr2]);
		},

		lessEqual: function(expr1, expr2){
			return wrap(function(){
				var v1 = expr1.apply(0, arguments);
				var v2 = expr2.apply(0, arguments);

				return v1 !== undefined && v1 !== null &&
						v2 !== undefined && v2 !== null &&
						v1 <= v2;
			}, "lessEqual", [expr1, expr2]);
		},

		//String operations
		match: function(expr, regExpr){
			return wrap(function(){
				return String(expr.apply(0, arguments)).search(regExpr) >= 0;
			}, "match", [expr, {
				expr: {
					op: "regex",
					data: regExpr
				}
			}]);
		},

		contain: function(expr1, expr2, caseSensitive){
			return wrap(function(){
				return stringOperator(arguments, expr1, expr2, caseSensitive, function(str1, str2){
					return str1.indexOf(str2) >= 0;
				});
			}, "contain", [expr1, expr2]);
		},

		startWith: function(expr1, expr2, caseSensitive){
			return wrap(function(){
				return stringOperator(arguments, expr1, expr2, caseSensitive, function(str1, str2){
					return str1.substring(0, str2.length) === str2;
				});
			}, "startWith", [expr1, expr2]);
		},

		endWith: function(expr1, expr2, caseSensitive){
			return wrap(function(){
				return stringOperator(arguments, expr1, expr2, caseSensitive, function(str1, str2){
					return str1.substring(str1.length - str2.length) === str2;
				});
			}, "endWith", [expr1, expr2]);
		}
	});
});
