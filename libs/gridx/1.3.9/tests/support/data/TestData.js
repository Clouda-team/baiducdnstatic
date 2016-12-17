define([], function(){

	var seed = 9973;
	var randomNumber = function(range){
		var a = 8887;
		var c = 9643;
		var m = 8677;
		seed = (a * seed + c) % m;
		var res = Math.floor(seed / m * range);
		return res;
	};

	var chars = "0,1,2,3, ,4,5,6,7, ,8,9,a,b, ,c,d,e,f, ,g,h,i,j, ,k,l,m,n, ,k,o,p,q, ,r,s,t,u, ,v,w,x,y, ,z".split(',');
	var randomString = function(){
		var len = randomNumber(50), i, str = [];
		for(i = 0; i < len; ++i){
			str.push(chars[randomNumber(chars.length)]);
		}
		return str.join('');
	};

	var randomDate = function(){
		return new Date(randomNumber(10000000000000));
	};

	var generateItem = function(index){
		return {
			id: index + 1,
			number: randomNumber(100),
			string: randomString(),
			date: randomDate().toDateString(),
			time: randomDate().toTimeString().split(' ')[0],
			bool: randomNumber(10) < 5,
			order: index + 1
		};
	};

	return {
		resetSeed: function(){
			seed = 9973;
		},

		getData: function(args){
			var size = args.size === undefined ? 100 : args.size;
			var data = {
				identifier: 'id', 
				label: 'id', 
				items: []
			};
			for(var i = 0; i < size; ++i){
				data.items.push(generateItem(i));
			}
			return data;
		},

		layouts: [
			[
				{id: 'id', field: 'id', name: 'Identity'},
				{id: 'number', field: 'number', name: 'Number'}
			],
			[
				{id: 'id', field: 'id', name: 'Identity'},
				{id: 'number', field: 'number', name: 'Number'},
				{id: 'string', field: 'string', name: 'String'}
			],
			[
				{/*id: 'id',*/ field: 'id', name: 'Identity', width: '20px'},
				{/*id: 'number',*/ field: 'number', name: 'Number', width: '10em'},
				{/*id: 'string',*/ field: 'string', name: 'String', width: '200px'},
				{/*id: 'date',*/ field: 'date', name: 'Date', width: '10%'},
				{/*id: 'time',*/ field: 'time', name: 'Time', width: '20%'},
				{/*id: 'bool',*/ field: 'bool', name: 'Boolean', width: '30%'}
			],
			[
				{id: 'id', field: 'id', name: 'Identity', dataType: 'number'},
				{id: 'number', field: 'number', name: 'Number', dataType: 'number'},
				{id: 'string', field: 'string', name: 'String', dataType: 'string'},
				{id: 'date', field: 'date', name: 'Date', dataType: 'date'},
				{id: 'time', field: 'time', name: 'Time', dataType: 'time'},
				{id: 'bool', field: 'bool', name: 'Boolean', dataType: 'boolean'}
			],
			[
				{id: 'number', field: 'number', name: 'Number'},
				{id: 'string', field: 'string', name: 'String'},
				{id: 'date', field: 'date', name: 'Date'},
				{id: 'time', field: 'time', name: 'Time'},
				{id: 'bool', field: 'bool', name: 'Boolean'}
			],
			[
				{id: 'id', field: 'id', name: 'Identity', width: '200px'},
				{id: 'number', field: 'number', name: 'Number', width: '200px'},
				{id: 'string', field: 'string', name: 'String', width: '200px'},
				{id: 'date', field: 'date', name: 'Date', width: '200px'}
			],
			[
				{id: 'id', field: 'id', name: 'Identity', dataType: 'number'},
				{id: 'number', field: 'number', name: 'Number', dataType: 'number'},
				{id: 'date', field: 'date', name: 'Date', dataType: 'date'},
				{id: 'time', field: 'time', name: 'Time', dataType: 'time'},
				{id: 'bool', field: 'bool', name: 'Boolean', dataType: 'boolean'}
			]
		]
	};
});
