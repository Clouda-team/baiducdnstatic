define([
	'intern!object',
	'intern/chai!assert',
	'../db/has!indexeddb?../db/IndexedDB',
	'../db/has!sql?../db/SQL',
	'../db/LocalStorage',
	'../LocalDB',
	'dojo/promise/all',
	'dojo/_base/array',
	'dojo/sniff'
], function (registerSuite, assert, IndexedDB, SQL, LocalStorage, LocalDB, all, arrayUtil, has) {
	var numbers = [
		{id: 1, name: 'one', prime: false, mappedTo: 'E', words: ['banana']},
		{id: 2, name: 'two', even: true, prime: true, mappedTo: 'D', words: ['banana', 'orange']},
		{id: 3, name: 'three', prime: true, mappedTo: 'C', words: ['apple', 'orange']},
		{id: 4, name: 'four', even: true, prime: false, mappedTo: null, nested: {a: 1}},
		{id: 5, name: 'five', prime: true, mappedTo: 'A', nested: {a: 2}}
	];

	var letters = [
		{id: 'A', lower: 'a', vowel: true},
		{id: 'B', lower: 'b', vowel: false},
		{id: 'C', lower: 'c', vowel: false},
		{id: 'D', lower: 'd', vowel: false},
		{id: 'E', lower: 'e', vowel: true},
		{id: 'F', lower: 'f', vowel: false},
		{id: 'G', lower: 'g', vowel: false},
		{id: 'H', lower: 'h', vowel: false},
		{id: 'I', lower: 'i', vowel: true},
		{id: 'J', lower: 'j', vowel: false},
		{id: 'K', lower: 'k', vowel: false},
		{id: 'L', lower: 'l', vowel: false},
		{id: 'M', lower: 'm', vowel: false},
		{id: 'N', lower: 'n', vowel: false},
		{id: 'O', lower: 'o', vowel: true},
		{id: 'P', lower: 'p', vowel: false},
		{id: 'Q', lower: 'q', vowel: false}
	];

	var dbConfig = {
		version: 8,
		stores: {
			test: {
				name: 10,
				even: {},
				id: {
					autoIncrement: true,
					preference: 100
				},
				words: {
					multiEntry: true,
					preference: 5
				},
				mappedTo: {
					indexed: false
				},
				'nested.a': {
					preference: 3
				}
			},
			test2: {
				id: {
					preference: 100
				},
				lower: {
					preference: 50
				},
				vowel: {}
			}
		}
	};
	if (IndexedDB) {
		registerSuite(testsForDB('dstore/db/IndexedDB', IndexedDB));
	}
	if (window.openDatabase) {
		registerSuite(testsForDB('dstore/db/SQL', SQL));
	}
	registerSuite(testsForDB('dstore/db/LocalStorage', LocalStorage));
	function testsForDB(name, DB) {
		// need to reset availability
		dbConfig.available = null;
		var numberStore = new DB({dbConfig: dbConfig, storeName: 'test'});
		var letterStore = new DB({dbConfig: dbConfig, storeName: 'test2'});
		var Filter = numberStore.Filter;
		function testQuery(filter, options, expectedResults) {
			if (!expectedResults) {
				expectedResults = options;
				options = undefined;
			}
			return function () {
				if (options && options.multi) {
					try {
						IDBKeyRange.only([ 1 ]);
					} catch (error) {
						// If we land here, we're in IE or Edge and multiEntry is not supported
						return;
					}
				}
				var i = 0;
				var collection = numberStore.filter(filter, options);
				return collection.fetch().then(function (fetched) {
					// check to make sure each one is in there
					arrayUtil.forEach(fetched, function (object) {
						assert.isTrue(arrayUtil.indexOf(expectedResults, object.id) > -1);
					});
					assert.strictEqual(expectedResults.length, fetched.length);
				}).then(function () {
					// now apply the sort
					if (options) {
						if (options.sort) {
							collection = collection.sort(options.sort);
						}
					}
					return collection.forEach(function (object) {
						assert.strictEqual(expectedResults[i++], object.id);
					});
				}).then(function () {
					return collection.select('id').fetch();
				}).then(function (fetched) {
					// the selected values
					assert.deepEqual(expectedResults, fetched.slice(0));
				}).then(function () {
					assert.strictEqual(expectedResults.length, i);
					var range = options && options.range || {start: 1, end: 3};
					var expectedCount = expectedResults.length;
					if (range) {
						expectedResults = expectedResults.slice(range.start, range.end);
						var fetchedRange = collection.fetchRange(range);
						return fetchedRange.then(function (fetched) {
							fetched.forEach(function (object, i) {
								assert.strictEqual(expectedResults[i], object.id);
							});
							assert.strictEqual(expectedResults.length, fetched.length);
							return fetchedRange.totalLength.then(function (totalLength) {
								if (expectedCount > expectedResults.length) {
									// IndexedDB will just estimate the count in this case
									assert.isTrue(totalLength > expectedResults.length);
								} else {
									assert.strictEqual(totalLength, expectedCount);
								}
							});
						});
					}
				});
			};
		}
		return {
			name: name,
			setup: function () {
				var results = [];
				return numberStore.fetch().then(function (data) {
					// make a copy
					data = data.slice(0);
					for (var i = 0, l = data.length; i < l; i++) {
						results.push(numberStore.remove(data[i].id));
					}
					return all(results);
				}).then(function () {
					results = [];
					// load new data
					for (var i = 0; i < numbers.length; i++) {
						results.push(numberStore.put(numbers[i]));
					}
					return all(results);
				}).then(function () {
					return letterStore.fetch();
				}).then(function (data) {
					results = [];
					// make a copy
					data = data.slice(0);
					for (var i = 0, l = data.length; i < l; i++) {
						results.push(letterStore.remove(data[i].id));
					}
					return all(results);
				}).then(function() {
					results = [];
					// load new data
					for (var i = 0; i < letters.length; i++) {
						results.push(letterStore.put(letters[i]));
					}
					return all(results);
				});

			},
			'{id: 2}': testQuery({id: 2}, [2]),
			'{name: "four"}': testQuery({name: 'four'}, {range: {start: 0, end: 1}}, [4]),
			'{name: "two"}': testQuery({name: 'two'}, [2]),
			'{even: true}': testQuery({even: true}, {range: {start: 0, end: 1}}, [2, 4]),
			'{even: true, name: "two"}': testQuery({even: true, name: 'two'}, [2]),
			// test non-indexed values
			'{mappedTo: "C"}': testQuery({mappedTo: 'C'}, [3]),
			// union
			'[{name: "two"}, {mappedTo: "C"}, {mappedTo: "D"}]':
					testQuery(
						new Filter().or(
							new Filter({name: 'two'}),
							new Filter({mappedTo: 'C'}),
							new Filter({mappedTo: 'D'})), [2, 3]),
			// jshint quotmark: false
			"gte('id', 1).lte('id', 3)": testQuery(new Filter().gte('id', 1).lte('id', 3), {range: {start: 0, end: 1}}, [1, 2, 3]),
			"gte('name', 'm').lte('name', 'three')": testQuery(new Filter().gte('name', 'm').lte('name', 'three'),
				{sort:[{property: 'id'}]}, [1, 3]),
			"gte('name', 'one').lte('name', 'three')": testQuery(new Filter().gte('name', 'one').lte('name', 'three'), 
				{sort:[{property: 'id'}]}, [1, 3]),
			"gt('name', 'one').lte('name', 'three')":
					testQuery(new Filter().gt('name', 'one').lte('name', 'three'),
						{range: {start: 0, end: 2}, sort:[{property: 'mappedTo'}]}, [3]),
			"gte('name', 'one').lt('name', 'three')":
					testQuery(new Filter().gte('name', 'one').lt('name', 'three'),
						{sort:[{property: 'name', descending: true}]}, [1]),
			"gt('name', 'one').lt('name', 'three')":
					testQuery(new Filter().gt('name', 'one').lt('name', 'three'), {sort:[{property: 'id'}]}, []),
			"match('name', /^t/)": testQuery(new Filter().match('name', /^t/), {sort:[{property: 'name'}]}, [3, 2]),
			'{name: "not a number"}': testQuery({name: 'not a number'}, {range: {start: 0, end: 1}}, []),
			"contains('words', ['orange'])": testQuery(new Filter().contains('words', ['orange']), {multi: true}, [2, 3]),
			"contains('words', [new Filter().match('words', /^or/)])": testQuery(new Filter().contains('words', [
					new Filter().match('words', /^or/)]), {multi: true, sort:[{property: 'id'}], range: {start: 0, end: 1}}, [2, 3]),
			"contains('words', ['apple', 'banana'])": testQuery(new Filter().contains('words', ['apple', 'banana']),
					{multi: true, range: {start: 0, end: 2}}, []),
			"contains('words', ['orange', 'banana']":
					testQuery(new Filter().contains('words', ['orange', 'banana']), {multi: true, sort:[{property: 'mappedTo'}]}, [2]),
			"contains('words', ['orange', 'banana'])":
					testQuery(new Filter().gte('id', 0).lte('id', 4).contains('words', ['orange', 'banana']), {multi: true}, [2]),
			// '{name: '*e'}': testQuery({name: '*e'}, [5, 1, 3]), don't know if we even support this yet
			"gte('id', 1).lte('id', 3), sort by name +": testQuery(
					new Filter().gte('id', 1).lte('id', 3), {sort:[{property: 'name'}]}, [1, 3, 2]),
			"gte('nested.a', 1).lte('nested.a', 2), sort by name +": testQuery(
					new Filter().gte('nested.a', 1).lte('nested.a', 2), {sort:[{property: 'nested.a'}]}, [4, 5]),
			"eq('nested.a', 1)": testQuery(
					new Filter().eq('nested.a', 1), {}, [4]),
			"gte('id', 1).lte('id', 3), sort by name -":
					testQuery(new Filter().gte('id', 1).lte('id', 3), {
						sort:[{property: 'name', descending: true}],
						range: {start: 0, end: 1}
					}, [2, 3, 1]),
			"gte('id', 0).lte('id', 4)": testQuery(new Filter().gte('id', 0).lte('id', 4),
					{sort:[{property: 'id'}], range: {start: 1, end: 3}}, [1, 2, 3, 4]),
			"in('id', [2, 4, 5])": testQuery(new Filter().in('id', [2, 4, 5]),
					{sort:[{property: 'id'}], range: {start: 1, end: 3}}, [2, 4, 5]),
			"in('id', [2, 4, 5]).select(['id', 'name'])": function () {
				var selected = numberStore.filter(new Filter().in('id', [2, 4, 5])).select(['id', 'name']);
				return selected.fetch().then(function (data) {
					assert.deepEqual(data.slice(0), [
						{id: 2, name: 'two'},
						{id: 4, name: 'four'},
						{id: 5, name: 'five'}
					]);
				});
			},
			"in('id', [2, 4, 5]).select('name')": function () {
				var selected = numberStore.filter(new Filter().in('id', [2, 4, 5])).select('name');
				return selected.fetch().then(function (data) {
					assert.deepEqual(data.slice(0), [
						'two',
						'four',
						'five'
					]);
				});
			},
			"in('mappedTo', letterStore.filter({vowel: true}).select('id'))":
				testQuery(new Filter().in('mappedTo', letterStore.filter({vowel: true}).select('id')),
					{sort:[{property: 'name'}], range: {start: 1, end: 3}}, [5, 1]),
			'db interaction': function () {
				return numberStore.get(1).then(function(one) {
					assert.strictEqual(one.id, 1); 
					assert.strictEqual(one.name, 'one');
					assert.strictEqual(one.prime, false);
					assert.strictEqual(one.mappedTo, 'E');
					return all([
							numberStore.remove(2),
							numberStore.remove(4),
							numberStore.add({id: 6, name: 'six', prime: false, words: ['pineapple', 'orange juice']})
						]).then(function() {
						return all([
							testQuery(new Filter().gte('name', 's').lte('name', 'u'), {sort:[{property: 'id'}]}, [3, 6])(),
							testQuery(new Filter().contains('words', [new Filter().match('words', /^orange/)]), {multi: true}, [3, 6])()
						]);
					});
				});
			},
			'reload db': function () {
				// reload the DB store and make sure the data is still there
				dbConfig.openRequest = null;
				function Model() {}
				Model.prototype.method = function () {
					return true;
				};
				numberStore = new DB({
					dbConfig: dbConfig,
					storeName: 'test',
					Model: Model
				});
				return numberStore.get(1).then(function(one) {
					assert.strictEqual(one.id, 1);
					assert.strictEqual(one.name, 'one');
					assert.strictEqual(one.prime, false);
					assert.strictEqual(one.mappedTo, 'E');
					assert.isTrue(one.method());
					return all([
						testQuery(new Filter().gte('name', 's').lte('name', 'u'), {sort:[{property: 'id'}]}, [3, 6])(),
						testQuery(new Filter().contains('words', [new Filter().match('words', /^orange/)]), {multi: true}, [3, 6])()
					]);
				});
			},
			'find a LocalDB': function () {
				// make sure we resolved to at least one of them
				assert.isTrue(LocalDB === IndexedDB || LocalDB === LocalStorage || LocalDB === SQL, 'resolved a store');
			}
		};
	}
});
