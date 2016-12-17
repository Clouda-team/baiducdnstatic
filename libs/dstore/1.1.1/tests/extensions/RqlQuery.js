define([
	'intern!object',
	'intern/chai!assert',
	'dojo/_base/declare',
	'dstore/extensions/RqlQuery',
	'dstore/Memory'
], function (registerSuite, assert, declare, RqlQuery, Memory) {

	var TestModel = declare(null, {
		describe: function () {
			return this.name + ' is ' + (this.prime ? '' : 'not ') + 'a prime';
		}
	});

	var TestStore = declare([ Memory, RqlQuery ]);

	var rqlMemory = new TestStore({
		data: [
			{id: 1, name: 'one', prime: false, mappedTo: 'E'},
			{id: 2, name: 'two', prime: true, mappedTo: 'D', even: true},
			{id: 3, name: 'three', prime: true, mappedTo: 'C'},
			{id: 4, name: 'four', prime: false, mappedTo: null, even: true},
			{id: 5, name: 'five', prime: true, mappedTo: 'A'}
		],
		Model: TestModel
	});

	registerSuite({
		name: 'dstore RqlMemory',

		'get': function () {
			assert.strictEqual(rqlMemory.getSync(1).name, 'one');
			assert.strictEqual(rqlMemory.getSync(4).name, 'four');
			assert.strictEqual(rqlMemory.getSync(1).describe(), 'one is not a prime');
		},

		'filter': function () {
			assert.strictEqual(rqlMemory.filter('prime=true').fetchSync().length, 3);
			assert.strictEqual(rqlMemory.filter('prime=true').fetchRangeSync({start: 1, end: 2}).totalLength, 3);
			assert.strictEqual(rqlMemory.filter('prime=true').fetchRangeSync({start: 1, end: 2}).length, 1);
			assert.strictEqual(rqlMemory.filter({prime: true}).fetchSync().length, 3);
			assert.strictEqual(rqlMemory.filter('prime=true&even!=true').fetchSync().length, 2);
			assert.strictEqual(rqlMemory.filter('prime=true&id>3').fetchSync().length, 1);

			assert.strictEqual(rqlMemory.filter('(prime=true|id>3)').fetchSync().length, 4);
			assert.strictEqual(rqlMemory.filter('(prime=true|id>3)').fetchRangeSync({start: 1, end: 3}).length, 2);
		}
	});

});
