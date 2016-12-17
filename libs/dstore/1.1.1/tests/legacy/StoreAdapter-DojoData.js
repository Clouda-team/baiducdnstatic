define([
	'dojo/_base/declare',
	'dojo/Deferred',
	'dojo/data/ItemFileWriteStore',
	'dojo/store/DataStore',
	'intern!object',
	'intern/chai!assert',
	'dojo/store/Memory',
	'dojo/_base/lang',
	'dojo/when',
	'dstore/legacy/StoreAdapter',
	'../data/testData'
], function (declare, Deferred, ItemFileWriteStore, DataStore, registerSuite, assert, Memory, lang, when, StoreAdapter, testData) {

	var Model = function () {};

	function getResultsArray(store) {
		var results = [];
		store.forEach(function (data) {
			results.push(data);
		});
		return results;
	}
	var store;

	registerSuite(lang.mixin({
		name: 'legacy dstore adapter - dojo data',

		beforeEach: function () {
			var dataStore = new DataStore({
				store: new ItemFileWriteStore({
					data: lang.clone(testData)
				})
			});
			store = new StoreAdapter({
				objectStore: dataStore,
				Model: Model
			});
			store.Model.prototype.describe = function () {
				return this.name + ' is ' + (this.prime ? '' : 'not ') + 'a prime';
			};
		},

		'get': function () {
			assert.strictEqual(store.get(1).name, 'one');
			assert.strictEqual(store.get(4).name, 'four');
			assert.isTrue(store.get(5).prime);
			assert.strictEqual(store.getIdentity(store.get(1)), 1);
		},

		'Model': function () {
			assert.strictEqual(store.get(1).describe(), 'one is not a prime');
			assert.strictEqual(store.get(3).describe(), 'three is a prime');
			var results = getResultsArray(store.filter({even: true}));
			assert.strictEqual(results.length, 2, 'The length is 2');
			assert.strictEqual(results[1].describe(), 'four is not a prime');
		},

		'filter': function () {
			assert.strictEqual(getResultsArray(store.filter({prime: true})).length, 3);
			assert.strictEqual(getResultsArray(store.filter({even: true}))[1].name, 'four');
		},

		'filter with string': function () {
			assert.strictEqual(getResultsArray(store.filter({name: 'two'})).length, 1);
			assert.strictEqual(getResultsArray(store.filter({name: 'two'}))[0].name, 'two');
		},

		'filter with regexp': function () {
			assert.strictEqual(getResultsArray(store.filter({name: /^t/})).length, 2);
			assert.strictEqual(getResultsArray(store.filter({name: /^t/}))[1].name, 'three');
			assert.strictEqual(getResultsArray(store.filter({name: /^o/})).length, 1);
			assert.strictEqual(getResultsArray(store.filter({name: /o/})).length, 3);
		},

		'filter with paging': function () {
			when(store.filter({prime: true}).fetchRange({start: 1, end: 2}), function (results) {
				assert.strictEqual(results.length, 1);
			});
			when(store.filter({even: true}).fetchRange({start: 1, end: 2}), function (results) {
				assert.strictEqual(results[0].name, 'four');
			});
		},

		'put new': function () {
			store.put({
				id: 6,
				perfect: true
			});
			assert.isTrue(store.get(6).perfect);
		}
		// if we have the update DataStore (as of Dojo 1.10), we will use these tests as well
	}, DataStore.prototype.add &&
	{
		'put update': function () {
			var four = store.get(4);
			four.square = true;
			store.put(four);
			four = store.get(4);
			assert.isTrue(four.square);
		},


		'add duplicate': function () {
			store.add({
				id: 5,
				perfect: true
			}).then(function () {
				assert.fail('add duplicate not rejected');
			}, function () {
				console.log('add duplicate failed as expected');
			});
		},

		'add new': function () {
			store.add({
				id: 7,
				prime: true
			});
			assert.isTrue(store.get(7).prime);
		},

		'remove': function () {
			return store.remove(3).then(function (result) {
				assert.isTrue(result);
				assert.strictEqual(store.get(3), undefined);
			});
		},

		'remove missing': function () {
			return store.remove(30).then(function (result) {
				assert.isFalse(result);
				// make sure nothing changed
				assert.strictEqual(store.get(1).id, 1);
			});
		},

		'filter after changes': function () {
			store.add({ id: 7, prime: true });
			assert.strictEqual(getResultsArray(store.filter({prime: true})).length, 4);
			assert.strictEqual(getResultsArray(store.filter({perfect: true})).length, 0);
			store.remove(3);
			store.put({ id: 6, perfect: true });
			assert.strictEqual(getResultsArray(store.filter({prime: true})).length, 3);
			assert.strictEqual(getResultsArray(store.filter({perfect: true})).length, 1);
		}
	}));
});
