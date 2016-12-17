define([
	'intern!object',
	'intern/chai!assert',
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/json',
	'dojo/request/registry',
	'dojo/when',
	'dojo/promise/all',
	'dstore/Request',
	'dstore/SimpleQuery',
	'./mockRequest',
	'dojo/text!./data/treeTestRoot'

], function (
	registerSuite,
	assert,
	declare,
	lang,
	JSON,
	request,
	when,
	whenAll,
	Request,
	SimpleQuery,
	mockRequest,
	treeTestRootData
) {

	var Model = declare(null, {});

	function runHeaderTest(method, args) {
		return store[method].apply(store, args).then(function () {
			mockRequest.assertRequestHeaders(requestHeaders);
			mockRequest.assertRequestHeaders(globalHeaders);
		});
	}

	function runCollectionTest(collection, rangeArgs, expected) {
		var expectedResults = [
			{ id: 1, name: 'one' },
			{ id: 2, name: 'two' }
		];
		mockRequest.setResponseText(JSON.stringify(expectedResults));
		var results;
		if (!expected) {
			expected = rangeArgs;
			results = collection.fetch();
		} else {
			mockRequest.setResponseHeaders({
				'Content-Range': rangeArgs.start + '-' + rangeArgs.end + '/' + expectedResults.length
			});
			results = collection.fetchRange(rangeArgs);
			results = results.totalLength.then(function (totalLength) {
				assert.strictEqual(totalLength, expectedResults.length);
				return results;
			});
		}
		return results.then(function (results) {
			expected.headers && mockRequest.assertRequestHeaders(expected.headers);
			expected.queryParams && mockRequest.assertQueryParams(expected.queryParams);

			// We cannot just assert deepEqual with results and expectedResults
			// because the store converts results into model instances with additional members.
			assert.strictEqual(results.length, expectedResults.length);
			for(var i = 0; i < results.length; ++i) {
				var result = results[i],
					expectedResult = expectedResults[i];
				for(var key in expectedResult) {
					assert.strictEqual(result[key], expectedResult[key]);
				}
			}
		});
	}

	var globalHeaders = {

		'test-global-header-a': 'true',
		'test-global-header-b': 'yes'
	};
	var requestHeaders = {
		'test-local-header-a': 'true',
		'test-local-header-b': 'yes',
		'test-override': 'overridden'
	};
	var store;

	var registryHandle;
	function createRequestTests (Store) {
		return {
			name: 'dstore Request',

			before: function () {
				registryHandle = request.register(/.*mockRequest.*/, mockRequest);
			},

			after: function () {
				registryHandle.remove();
			},

			beforeEach: function () {
				mockRequest.setResponseText('{}');
				mockRequest.setResponseHeaders({});
				store = new Store({
					target: '/mockRequest/',
					headers: globalHeaders,
					Model: Model
				});
				store.Model.prototype.describe = function () {
					return 'name is ' + this.name;
				};
				createRequestTests.store = store;
			},

			'filter': function () {
				mockRequest.setResponseText(treeTestRootData);

				return when(store.filter('data/treeTestRoot').fetch()).then(function (results) {
					var object = results[0];
					assert.strictEqual(object.name, 'node1');
					assert.strictEqual(object.describe(), 'name is node1');
					assert.strictEqual(object.someProperty, 'somePropertyA');
				});
			},

			'filter iterative': function () {
				mockRequest.setResponseText(treeTestRootData);

				var i = 0;
				return store.filter('data/treeTestRoot').forEach(function (object) {
					i++;
					assert.strictEqual(object.name, 'node' + i);
					// the method we added
					assert.equal(typeof object.describe, 'function');
				});
			},

			'filter object': function () {
				var filter = { prop1: 'Prop1Value', prop2: 'Prop2Value' };
				return runCollectionTest(store.filter(filter), { queryParams: filter });
			},

			'filter builder': function () {
				var filter = new store.Filter();
				var betweenTwoAndFour = filter.gt('id', 2).lt('price', 5);
				return runCollectionTest(store.filter(betweenTwoAndFour), { queryParams: {
					id: 'gt=2',
					price: 'lt=5'
				}});
			},

			'filter builder ne or': function () {
				var filter = new store.Filter();
				var betweenTwoAndFour = filter.ne('id', 2).or(filter.eq('foo', true), filter.eq('foo'));
				return runCollectionTest(store.filter(betweenTwoAndFour), { queryParams: {
					id: 'ne=2',
					'(foo': 'true|foo=undefined)'
				}});
			},

			'filter relational': function () {
				var filter = new store.Filter();
				var innerFilter = new store.Filter().eq('foo', true);
				var nestedFilter = filter['in']('id', store.filter(innerFilter).select('id'));
				return runCollectionTest(store.filter(nestedFilter), { queryParams: {
					id: 'in=(/mockRequest/?foo=true&select(id))'
				}});
			},

			'sort': function () {
				var sortedCollection = store.sort({
					property: 'prop1',
					descending: true
				}, {
					property: 'prop2'
				}, {
					property: 'prop3',
					descending: true
				});
				return runCollectionTest(sortedCollection, {
					queryParams: {
						'sort(-prop1,+prop2,-prop3)': ''
					}
				});
			},

			'sort with this.sortParam': function () {
				store.sortParam = 'sort-param';

				var sortedCollection = store.sort({
					property: 'prop1',
					descending: true
				}, {
					property: 'prop2'
				}, {
					property: 'prop3',
					descending: true
				});
				return runCollectionTest(sortedCollection, {
					queryParams: {
						'sort-param': '-prop1,+prop2,-prop3'
					}
				});
			},

			'sort with different prefixes': function () {
				store.descendingPrefix = '--';
				store.ascendingPrefix = '++';

				var sortedCollection = store.sort({
					property: 'prop1',
					descending: true
				}, {
					property: 'prop2'
				}, {
					property: 'prop3',
					descending: true
				});
				return runCollectionTest(sortedCollection, {
					queryParams: {
						'sort(--prop1,++prop2,--prop3)': ''
					}
				});
			},
			'select': function () {
				var selectCollection = store.select(['prop1', 'prop2']);
				return runCollectionTest(selectCollection, {
					queryParams: {
						'select(prop1,prop2)': ''
					}
				});
			},
			'select with selectParam': function () {
				store.selectParam = 'select-param';
				var selectCollection = store.select(['prop1', 'prop2']);
				return runCollectionTest(selectCollection, {
					queryParams: {
						'select-param': 'prop1,prop2'
					}
				});
			},
			'range': function () {
				return runCollectionTest(store, {start: 15, end: 25}, {
					queryParams: {
						'limit(10,15)': ''
					}
				});
			},
			'range with rangeParam': function () {
				store.rangeStartParam = 'start';
				store.rangeCountParam = 'count';
				return runCollectionTest(store, {start: 15, end: 25}, {
					queryParams: {
						'start': '15',
						'count': '10'
					}
				});
			},
			'range with headers': function () {
				store.useRangeHeaders = true;
				return runCollectionTest(store, {start: 15, end: 25}, {
					headers: {
						'Range': 'items=15-24'
					}
				});
			},

			'range with headers without end': function () {
				store.useRangeHeaders = true;
				return runCollectionTest(store, {start: 15, end: Infinity}, {
					headers: {
						'Range': 'items=15-Infinity'
					}
				});
			},

			'filter+sort+fetchRange': function () {
				var filter = { prop1: 'Prop1Value', prop2: 'Prop2Value' };
				var collection = store.filter(filter).sort('prop1');
				return runCollectionTest(collection, {start: 15, end: 25}, {
					queryParams: lang.mixin({}, filter, {
						'limit(10,15)': '',
						'sort(+prop1)': ''
					})
				});
			},

			'composition with client-side queriers': function () {
				var RestWithQueryEngine = declare([ Store, SimpleQuery ], {
					target: '/mockRequest/'
				});

				var store = new RestWithQueryEngine(),
					expectedResults = [
						{ id: 1, name: 'one', odd: true },
						{ id: 2, name: 'two', odd: false },
						{ id: 3, name: 'three', odd: true }
					];
				mockRequest.setResponseText(JSON.stringify(expectedResults));
				var filter = { odd: true },
					filteredCollection = store.filter(filter),
					sortedCollection,
					getTopQueryLogEntry = function (collection) {
						var queryLog = collection.queryLog;
						return queryLog[queryLog.length - 1];
					},
					querier;

				assert.strictEqual(filteredCollection.queryLog.length, 1);
				return when(filteredCollection.fetch()).then(function (results) {
					mockRequest.assertQueryParams(filter);
					assert.strictEqual(results.length, expectedResults.length);

					var queryLogEntry = getTopQueryLogEntry(filteredCollection);
					assert.property(queryLogEntry, 'querier');
					querier = queryLogEntry.querier;

					var filteredResults = querier(expectedResults);
					assert.equal(filteredResults.length, 2);
					assert.deepEqual(filteredResults[0], expectedResults[0]);
					assert.deepEqual(filteredResults[1], expectedResults[2]);

					sortedCollection = filteredCollection.sort('id', true);
					assert.strictEqual(sortedCollection.queryLog.length, 2);

					return sortedCollection.fetch();
				}).then(function (results) {
					mockRequest.assertQueryParams({ 'sort(-id)': '' });
					assert.strictEqual(results.length, expectedResults.length);

					var queryLogEntry = getTopQueryLogEntry(sortedCollection);
					assert.property(queryLogEntry, 'querier');
					querier = (function () {
						var existingQueryer = querier,
							newQueryer = queryLogEntry.querier;
						return function (data) {
							return newQueryer(existingQueryer(data));
						};
					})();

					var sortedFilteredResults = querier(expectedResults);
					assert.equal(sortedFilteredResults.length, 2);
					assert.deepEqual(sortedFilteredResults[0], expectedResults[2]);
					assert.deepEqual(sortedFilteredResults[1], expectedResults[0]);

					return sortedCollection.fetchRange({start: 0, end: 25});
				}).then(function (results) {
					mockRequest.assertQueryParams({
						'sort(-id)': '',
						'limit(25)': ''
					});
					assert.strictEqual(results.length, expectedResults.length);
				});
			}
		};
	}
	registerSuite(createRequestTests(Request));
	registerSuite({
		name: 'dstore Request default',
		cancel: function () {
			var store = new Request({
				target: '/test/'
			});
			var results = store.fetch();
			assert.property(results.response, 'then');
			results.cancel();
		}
	});
	return createRequestTests;
});
