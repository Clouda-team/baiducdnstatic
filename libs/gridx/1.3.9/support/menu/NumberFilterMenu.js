define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"./_FilterMenuBase",
	"dijit/CheckedMenuItem"
], function(declare, array, _FilterMenuBase, CheckedMenuItem){

/*=====
	return declare(_FilterMenuBase, {
		// summary:
		//		This is a number range adaptive filter sample.

		// numbers: Integer[]
		//		The number ranges for the adaptive filter.
		// example:
		//		numbers: [-Infinity, 10, 50, 100] will show the adaptive filter: '< 10', '10 - 50', '50 - 100'
		numbers: []
	});
=====*/

	return declare(_FilterMenuBase, {	
		numbers: [],

		_createMenuItems: function(){
			var t = this,
				numbers = t.numbers,
				arr = [],
				n = numbers.shift();
			while(numbers.length){
				if(n === -Infinity){
					n = numbers.shift();
					arr.push('< ' + n);
				}else{
					var s;
					if(numbers[0] === Infinity){
						s = '> ' + n;
						numbers.length = 0;
					}else{
						s = n + ' - ';
						n = numbers.shift();
						s += n;
					}
					arr.push(s);
				}
			}

			array.forEach(arr, function(item){
				t.addChild(new CheckedMenuItem({
					label: item,
					onChange: function(){
						t._addRule();
					}
				}));
			});
		},

		_addRule: function(){
			var colId = this.colId,
				key = 'numberfilter',
				exp = '1>1';
			array.forEach(this.getChildren(), function(mi){
				if(mi.get('checked')){
					var label = mi.get('label');
					if(/\</.test(label)){
						exp += '|| value ' + label;
					}else if(/\>/.test(label)){
						exp += '|| value' + label;
					}else{
						var arr = label.split(' ');
						var low = arr[0], high = arr[2];
						exp += '|| (value >=' + low + ' && value <=' + high + ')';
					}
				}
			});
			
			if(exp != '1>1'){
				eval('var checker = function(value){return ' + exp + ';};');
				this._addFilter(key, function(row){

					return checker(parseFloat(row.data[colId], 10));
				});
			}else{
				this._removeFilter(key);
			}
		}
	});
});
