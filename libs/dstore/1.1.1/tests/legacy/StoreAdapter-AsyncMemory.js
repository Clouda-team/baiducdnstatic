define([
	'dojo/_base/declare',
	'dojo/Deferred',
	'intern!object',
	'intern/chai!assert',
	'dojo/store/Memory',
	'dojo/store/util/QueryResults',
	'dstore/legacy/StoreAdapter'
], function (declare, Deferred, registerSuite, assert, Memory, QueryResults, StoreAdapter) {

	var Model = function () {};

	function makeAsync(query){
		return function(){
			var args = arguments;
			var inherited = this.getInherited(args);
			var def = new Deferred(function(){
				clearTimeout(timer);
			});
			var self = this;
			var timer = setTimeout(function(){
				try {
					def.resolve(inherited.apply(self, args));
				} catch (e) {
					def.reject(e);
				}
			}, 2);
			return query ? new QueryResults(def.promise) : def.promise;
		};
	}
	var AsyncMemory = declare(Memory, {
		query: makeAsync(true),
		get: makeAsync(),
		put: makeAsync(),
		remove: makeAsync()
	});

	var store;

	registerSuite({
		name: 'legacy dstore adapter - AsyncMemory',

		beforeEach: function () {
			store = new StoreAdapter({
				objectStore: new AsyncMemory({
					data: [
						{id: 1, name: 'one', prime: false, mappedTo: 'E'},
						{id: 2, name: 'two', even: true, prime: true, mappedTo: 'D'},
						{id: 3, name: 'three', prime: true, mappedTo: 'C'},
						{id: 4, name: 'four', even: true, prime: false, mappedTo: null},
						{id: 5, name: 'five', prime: true, mappedTo: 'A'}
					]
				}),
				Model: Model
			});
			store.Model.prototype.describe = function () {
				return this.name + ' is ' + (this.prime ? '' : 'not ') + 'a prime';
			};
		},

		'get': function () {
			return store.get(1).then(function (object) {
				assert.strictEqual(object.name, 'one');
				assert.strictEqual(store.getIdentity(object), 1);
				assert.strictEqual(object.describe(), 'one is not a prime');
			});
		},

		'filter': function () {
			return store.filter({prime: true}).fetch().then(function (results) {
				assert.strictEqual(results.length, 3);
			});
		},

		'filter with string': function () {
			return store.filter({name: 'two'}).fetch().then(function (results) {
				assert.strictEqual(results.length, 1);
				assert.strictEqual(results[0].name, 'two');
			});
		},
		'filter with paging': function () {
			return store.filter({prime: true}).fetchRange({start: 1, end: 2}).then(function (results) {
				assert.strictEqual(results.length, 1);
				assert.strictEqual(results[0].name, 'three');
			});
		},

		'put update': function () {
			return store.get(4).then(function (four) {
				four.square = true;
				return store.put(four).then(function () {
					return store.get(4).then(function (four) {
						assert.isTrue(four.square);
					});
				});
			});
		},

		'put new': function () {
			return store.put({
				id: 6,
				perfect: true
			}).then(function () {
				return store.get(6).then(function (six) {
					assert.isTrue(six.perfect);
				});
			});
		},

		'add duplicate': function () {
			return store.add({
				id: 5,
				perfect: true
			}).then(function () {
				assert.fail('should throw');
			}, function () {
				// should fail
			});
		},

		'add new': function () {
			return store.add({
				id: 7,
				prime: true
			}).then(function () {
				return store.get(7).then(function (seven) {
					assert.isTrue(seven.prime);
				});
			});
		},

		'remove': function () {
			return store.remove(3).then(function (result) {
				assert.isTrue(result);
				return store.get(3);
			}).then(function (three) {
				assert.strictEqual(three, undefined);
			});
		},

		'remove missing': function () {
			return store.remove(77).then(function (result) {
				assert.isFalse(!!result);
			});
		}
	});
});
