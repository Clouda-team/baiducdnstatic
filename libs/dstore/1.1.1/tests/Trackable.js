define([
	'intern!object',
	'intern/chai!assert',
	'dojo/_base/array',
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dstore/Memory',
	'dstore/Store',
	'dstore/Trackable',
	'dstore/SimpleQuery'
], function (registerSuite, assert, arrayUtil, declare, lang, Memory, Store, Trackable, SimpleQuery) {

	function createData(numItems) {
		var data = [];
		var i;
		for (i = 0; i < numItems; i++) {
			data.push({id: i, name: 'item ' + i, order: i});
		}
		return data;
	}

	function createTestSuite(suiteName, createStore) {

		// A store for testing Trackable with only partial in-memory data
		var PartialDataStore = declare([ Store, SimpleQuery ], (function () {
			var proto = {
				constructor: function () {
					this.backingMemoryStore = createStore({ data: this.data }, Memory);
					delete this.data;

				}
			};

			arrayUtil.forEach(
				[
					'getIdentity', 'get', 'add', 'put', 'remove', 'getSync', 'addSync', 'putSync', 'removeSync',
					'fetch', 'fetchRange', 'fetchSync', 'fetchRangeSync'
				],
				function (method) {
					proto[method] = function () {
						var backingStore = this.backingMemoryStore;
						return backingStore[method].apply(backingStore, arguments);
					};
				}
			);

			arrayUtil.forEach(['filter', 'sort'], function (method) {
				proto[method] = function () {
					var newBackingStore = this.backingMemoryStore[method].apply(this.backingMemoryStore, arguments);
					return lang.mixin(this.inherited(arguments), {
						backingMemoryStore: newBackingStore
					});
				};
			});

			return proto;
		})());

		function createPrimeNumberStore() {
			return createStore({
				data: [
					{id: 0, name: 'zero', even: true, prime: false},
					{id: 1, name: 'one', prime: false},
					{id: 2, name: 'two', even: true, prime: true},
					{id: 3, name: 'three', prime: true},
					{id: 4, name: 'four', even: true, prime: false},
					{id: 5, name: 'five', prime: true}
				]
			}, Memory);
		}

		function createPartialDataStore(numItems) {
			return createStore({
				data: createData(numItems),

				// Make backing store an observed collection so its data is kept up-to-date
				track: function () {
					this.backingMemoryStore = this.backingMemoryStore.track();
					return this.inherited(arguments);
				}
			}, PartialDataStore);
		}

		var store = createPrimeNumberStore();

		return {
			name: suiteName,

			'get': function () {
				assert.strictEqual(store.getSync(1).name, 'one');
				assert.strictEqual(store.getSync(4).name, 'four');
				assert.isTrue(store.getSync(5).prime);
			},

			'filter': function () {
				var filteredCollection = store.filter({prime: true});

				var changes = [], secondChanges = [];
				var tracked = filteredCollection.track();
				tracked.fetch();
				assert.strictEqual(tracked._results.length, 3);
				tracked.on('add, update, delete', function (event) {
					changes.push(event);
				});
				var secondObserverUpdate = tracked.on('update', function (event) {
					secondChanges.push(event);
				});
				var secondObserverRemove = tracked.on('delete', function (event) {
					secondChanges.push(event);
				});
				var secondObserverAdd = tracked.on('add', function (event) {
					secondChanges.push(event);
				});
				var expectedChanges = [],
					expectedSecondChanges = [];
				var two = tracked._results[0];
				two.prime = false;
				store.put(two); // should remove it from the array
				assert.strictEqual(tracked._results.length, 2);
				expectedChanges.push({
					type: 'update',
					target: two,
					index: undefined,
					previousIndex: 0,
					totalLength: 2
				});
				expectedSecondChanges.push(expectedChanges[expectedChanges.length - 1]);
				secondObserverUpdate.remove();
				secondObserverRemove.remove();
				secondObserverAdd.remove();
				var one = store.getSync(1);
				one.prime = true;
				store.put(one); // should add it
				expectedChanges.push({
					type: 'update',
					target: one,
					index: 2,
					previousIndex: undefined,
					totalLength: 3
				});
				assert.strictEqual(tracked._results.length, 3);
				// shouldn't be added
				var six = {id: 6, name: 'six'};
				store.add(six);
				assert.strictEqual(tracked._results.length, 3);

				expectedChanges.push({
					type: 'add',
					target: store._restore(six),
					index: undefined,
					totalLength: 3
					// no index because the addition doesn't have a place in the filtered results
				});

				// should be added
				var seven = {id: 7, name: 'seven', prime: true};
				store.add(seven);
				assert.strictEqual(tracked._results.length, 4);

				expectedChanges.push({
					type: 'add',
					target: store._restore(seven),
					index: 3,
					totalLength: 4
				});
				var three = store.getSync(3);
				store.remove(3);
				expectedChanges.push({
					type: 'delete',
					id: 3,
					target: store._restore(three),
					previousIndex: 0,
					totalLength: 3
				});
				assert.strictEqual(tracked._results.length, 3);

				assert.deepEqual(secondChanges, expectedSecondChanges);
				assert.deepEqual(changes, expectedChanges);
			},

			'filter with zero id': function () {
				var filteredCollection = store.filter({});
				var results;
				filteredCollection.fetch().then(function (data) {
					results = data;
				});
				assert.strictEqual(results.length, 7);
				var tracked = filteredCollection.track();
				tracked.on('update', function (event) {
					// we only do puts so previous & new indices must always been the same
					assert.ok(event.index === event.previousIndex);
				});
				store.put({id: 5, name: '-FIVE-', prime: true});
				store.put({id: 0, name: '-ZERO-', prime: false});
			},

			'paging with store.data': function () {
				var results,
					bigStore = createStore({ data: createData(100) }, Memory),
					bigFiltered = bigStore.filter({}).sort('order');

				var observations = [];
				// temporarily hide this so we don't load everything
				bigFiltered.fetchSync = null;
				var bigObserved = bigFiltered.track();
				delete bigFiltered.fetchSync;
				bigObserved.on('update', function (event) {
					observations.push(event);
					console.log(' observed: ', event);
				});
				bigObserved.on('add', function (event) {
					observations.push(event);
					console.log(' observed: ', event);
				});
				bigObserved.on('delete', function (event) {
					observations.push(event);
					console.log(' observed: ', event);
				});
				bigObserved.fetchRange({ start: 0, end: 25 });
				bigObserved.fetchRange({ start: 25, end: 50 });
				bigObserved.fetchRange({ start: 50, end: 75 });
				bigObserved.fetchRange({ start: 75, end: 100 });

				var results = bigObserved._partialResults;
				bigStore.add({id: 101, name: 'one oh one', order: 2.5});
				assert.strictEqual(results.length, 101);
				assert.strictEqual(observations.length, 1);
				bigStore.remove(101);
				assert.strictEqual(observations.length, 2);
				assert.strictEqual(results.length, 100);
				bigStore.add({id: 102, name: 'one oh two', order: 26.5});
				assert.strictEqual(results.length, 101);
				assert.strictEqual(observations.length, 3);
			},

			'paging with store._partialResults': function () {
				var bigStore = createPartialDataStore(100),
					bigFiltered = bigStore.filter({}).sort('order'),
					latestObservation,
					item,
					bigObserved;
				// temporarily hide this so we don't load everything
				bigFiltered.fetchSync = null;
 				bigObserved = bigFiltered.track();
 				delete bigFiltered.fetchSync;

				var assertObservationIs = function (expectedObservation) {
						expectedObservation = lang.delegate(expectedObservation);
						if (expectedObservation.type in { add: 1, update: 1 }
							&& !('index' in expectedObservation)) {
							expectedObservation.index = undefined;
						}
						if (expectedObservation.type in { update: 1, 'delete': 1 }
							&& !('previousIndex' in expectedObservation)) {
							expectedObservation.previousIndex = undefined;
						}
						assert.deepEqual(latestObservation, expectedObservation);
					};
				bigObserved.on('update', function (event) {
					latestObservation = event;
				});
				bigObserved.on('add', function (event) {
					latestObservation = event;
				});
				bigObserved.on('delete', function (event) {
					latestObservation = event;
				});

				// An update outside of requested ranges has an indeterminate index
				item = bigStore.getSync(0);
				item.order = 1.25;
				bigStore.put(item);
				assertObservationIs({ type: 'update', target: item });

				// An addition outside of requested ranges has an indeterminate index
				item = bigStore._restore({ id: 1.5, name: 'item 1.5', order: 1.5 });
				bigStore.add(item);
				assertObservationIs({ type: 'add', target: item });

				// Remove additional item to make subsequent item indices and id's line up
				bigStore.remove(item.id);
				assertObservationIs({ type: 'delete', id: item.id });

				// An update sorted to the beginning of a range and the data has a known index
				bigObserved.fetchRange({ start: 0, end: 25 });
				item = bigStore.getSync(0);
				item.order = 0;
				bigStore.put(item);
				assertObservationIs({ type: 'update', target: item, index: 0, previousIndex: 1, totalLength: 100 });

				// An addition sorted to the beginning of a range and the data has a known index
				item = bigStore._restore({ id: -1, name: 'item -1', order: -1 });
				bigStore.add(item);
				assertObservationIs({ type: 'add', target: item, index: 0, totalLength: 101 });

				// Remove additional item to make subsequent item indices and id's line up
				bigStore.remove(item.id);
				assertObservationIs({ type: 'delete', id: item.id, previousIndex: 0, totalLength: 100 });

				// An update sorted to the end of a range has an indeterminate index
				item = bigStore.getSync(24);
				item.name = 'item 24 updated';
				bigStore.put(item);
				assertObservationIs({ type: 'update', target: item, previousIndex: 24, totalLength: 99 });

				// An addition sorted to the end of a range has an indeterminate index
				item = bigStore._restore({ id: 24.1, name: 'item 24.1', order: 24.1 });
				bigStore.add(item);
				assertObservationIs({ type: 'add', target: item, totalLength: 99 });

				// Remove additional item to make subsequent item indices and id's line up
				bigStore.remove(item.id);
				assertObservationIs({ type: 'delete', id: item.id, totalLength: 99 });

				// The previous update with an undetermined index resulted in an item dropping from the first range
				// and the first range being reduced to 0-23 instead of 0-24.
				// Requesting 24-50 instead of 25-50 in order to request a contiguous range.
				// Trackable should treat contiguous requested ranges as a single range.
				bigObserved.fetchRange({ start: 24, end: 50 });

				// An update sorted to the end of a range but adjacent to another range has a known index
				item = bigStore.getSync(22);
				item.order = 23.1;
				bigStore.put(item);
				assertObservationIs({ type: 'update', target: item, index: 23, previousIndex: 22, totalLength: 100 });

				// An addition sorted to the end of a range but adjacent to another range has a known index
				item = bigStore._restore({ id: 23.2, name: 'item 23.2', order: 23.2 });
				bigStore.add(item);
				assertObservationIs({ type: 'add', target: item, index: 24, totalLength: 101 });

				// Remove additional item to make subsequent item indices and id's line up
				bigStore.remove(item.id);
				assertObservationIs({ type: 'delete', id: item.id, previousIndex: 24, totalLength: 100 });

				// An update sorted to the beginning of a range but adjacent to another range has a known index
				item = bigStore.getSync(25);
				item.order = 23.9;
				bigStore.put(item);
				assertObservationIs({ type: 'update', target: item, index: 24, previousIndex: 25, totalLength: 100 });

				// An addition sorted to the beginning of a range but adjacent to another range has a known index
				item = bigStore._restore({ id: 23.8, name: 'item 23.8', order: 23.8 });
				bigStore.add(item);
				assertObservationIs({ type: 'add', target: item, index: 24, totalLength: 101 });

				// Remove additional item to make subsequent item indices and id's line up
				bigStore.remove(item.id);
				assertObservationIs({ type: 'delete', id: item.id, previousIndex: 24, totalLength: 100 });

				// Request range at end of data
				bigObserved.fetchRange({ start: 75, end: 100 });

				// An update at the end of a range and the data has a known index
				item = bigStore.getSync(98);
				item.order = 99.1;
				bigStore.put(item);
				assertObservationIs({ type: 'update', target: item, index: 99, previousIndex: 98, totalLength: 100 });

				// An addition at the end of a range and the data has a known index
				item = bigStore._restore({ id: 99.2, name: 'item 99.2', order: 99.2 });
				bigStore.add(item);
				assertObservationIs({ type: 'add', target: item, index: 100, totalLength: 101 });

				// An update at the beginning of a range has an indeterminate index
				item = bigStore.getSync(76);
				item.order = 74.9;
				bigStore.put(item);
				assertObservationIs({ type: 'update', target: item, beforeIndex: 75, previousIndex: 76, totalLength: 100 });

				// An addition at the beginning of a range has an indeterminate index
				item = bigStore._restore({ id: 74.8, name: 'item 74.8', order: 74.8 });
				bigStore.add(item);
				assertObservationIs({ type: 'add', target: item, beforeIndex: 76, totalLength: 100 });
			},

			'paging releaseRange with store._partialResults': function () {
				var itemCount = 100,
					store = createPartialDataStore(itemCount),
					rangeToBeEclipsed = { start: 5, end: 15 },
					rangeToBeSplit = { start: 25, end: 45 },
					rangeToBeHeadTrimmed = { start: 55, end: 65 },
					rangeToBeTailTrimmed = { start: 80, end: 95 },
					eclipsingRange = { start: 0, end: 20 },
					splittingRange = { start: 30, end: 40 },
					headTrimmingRange = { start: 50, end: 60 },
					tailTrimmingRange = { start: 90, end: 100 };

				// temporarily hide this so we don't load everything
				store.fetchSync = null;
 				var trackedStore = store.track();
 				// restore
 				delete store.fetchSync;

				var assertRangeDefined = function (start, end) {
						for(var i = start; i < end; ++i) {
							assert.notEqual(trackedStore._partialResults[i], undefined);
						}
					},
					assertRangeUndefined = function (start, end) {
						for(var i = start; i < end; ++i) {
							assert.equal(trackedStore._partialResults[i], undefined);
						}
					};

				// Remove all of a range
				trackedStore.fetchRange({ start: rangeToBeEclipsed.start, end: rangeToBeEclipsed.end });
				assertRangeDefined(rangeToBeEclipsed.start, rangeToBeEclipsed.end);
				trackedStore.releaseRange(eclipsingRange.start, eclipsingRange.end);
				assertRangeUndefined(rangeToBeEclipsed.start, rangeToBeEclipsed.end);

				// Split a range
				trackedStore.fetchRange({ start: rangeToBeSplit.start, end: rangeToBeSplit.end });
				assertRangeDefined(rangeToBeSplit.start, rangeToBeSplit.end);
				trackedStore.releaseRange(splittingRange.start, splittingRange.end);
				assertRangeDefined(rangeToBeSplit.start, splittingRange.start);
				assertRangeUndefined(splittingRange.start, splittingRange.end);
				assertRangeDefined(splittingRange.end, rangeToBeSplit.end);

				// Remove from range head
				trackedStore.fetchRange({ start: rangeToBeHeadTrimmed.start, end: rangeToBeHeadTrimmed.end });
				assertRangeDefined(rangeToBeHeadTrimmed.start, rangeToBeHeadTrimmed.end);
				trackedStore.releaseRange(headTrimmingRange.start, headTrimmingRange.end);
				assertRangeUndefined(headTrimmingRange.start, headTrimmingRange.end);
				assertRangeDefined(headTrimmingRange.end, rangeToBeHeadTrimmed.end);

				// Remove from range tail
				trackedStore.fetchRange({ start: rangeToBeTailTrimmed.start, end: rangeToBeTailTrimmed.end });
				assertRangeDefined(rangeToBeTailTrimmed.start, rangeToBeTailTrimmed.end);
				trackedStore.releaseRange(tailTrimmingRange.start, tailTrimmingRange.end);
				assertRangeDefined(rangeToBeTailTrimmed.start, tailTrimmingRange.start);
				assertRangeUndefined(tailTrimmingRange.start, tailTrimmingRange.end);
			},

			'new item with default index': function () {
				var store = createPartialDataStore(100);
				// temporarily hide this so we don't load everything
				store.fetchSync = null;
 				var trackedStore = store.track();
 				// restore
 				delete store.fetchSync;

				return trackedStore.fetchRange({ start: 0, end: 25 }).then(function () {
					var addEvent = null;
					trackedStore.on('add', function (event) {
						addEvent = event;
					});

					// add a new item with the default of bottom
					// a new item with a default index outside a known range is treated as if it has no known index
					var expectedNewItem = store._restore({ id: 200, name: 'item-200', order: Infinity });
					store.add(expectedNewItem);
					assert.isNotNull(addEvent);
					assert.deepEqual(addEvent.target, expectedNewItem);
					assert.isTrue('index' in addEvent);
					assert.isUndefined(addEvent.index);

					// choose a defaultIndex at the top (in known range)
					store.defaultNewToStart = true;
					// a new item with a default index within a known range has a known index
					addEvent = null;
					expectedNewItem = store._restore({ id: 201, name: 'item-201', order: Infinity });

					store.add(expectedNewItem);
					assert.isDefined(addEvent);
					assert.deepEqual(addEvent.target, expectedNewItem);
					assert.propertyVal(addEvent, 'index', 0);

					store.defaultNewToStart = false;
					return trackedStore.fetchRange({ start: 25, end: 102 }).then(function () {
						// now add to the bottom, where it is in range
						expectedNewItem = store._restore({ id: 202, name: 'item-202', order: Infinity });

						store.add(expectedNewItem);
						assert.isDefined(addEvent);
						assert.deepEqual(addEvent.target, expectedNewItem);
						assert.propertyVal(addEvent, 'index', 102);
					});
				});
			},

			'new item in empty store - with queryExecutor': function () {
				var store = createStore({ data: [] }, Memory),
					collection = store.filter({ type: 'test-item' }).track();

				var actualEvent;
				collection.on('add', function (event) {
					actualEvent = event;
				});

				var expectedTarget = collection.addSync({
					type: 'test-item',
					id: 1,
					name: 'one'
				});

				assert.deepEqual(actualEvent, {
					type: 'add',
					index: 0,
					target: expectedTarget,
					totalLength: 1
				});
			},

			'new item in empty store - without queryExecutor': function () {
				var store = createStore({ data: [] }, Memory),
					collection = store.track();

				var actualEvent;
				collection.on('add', function (event) {
					actualEvent = event;
				});

				var expectedTarget = collection.addSync({
					type: 'test-item',
					id: 1,
					name: 'one'
				});

				assert.deepEqual(actualEvent, {
					type: 'add',
					index: 0,
					target: expectedTarget,
					totalLength: 1
				});
			},

			'new item - with options.beforeId and queryExecutor': function () {
				var store = createPrimeNumberStore(),
					evenCollection = store.filter({ even: true }).track();
				var data = evenCollection._results;

				store.defaultNewToStart = true;
				store.add({ id: 6, name: 'six', even: true }, { beforeId: 2 });
				store.add({ id: -2, name: 'negative-two', even: true }, { beforeId: null });

				assert.strictEqual(data[1].id, 6);
				assert.strictEqual(data[2].id, 2);
				assert.strictEqual(data[data.length - 1].id, -2);
			},

			'new item - with options.beforeId and no queryExecutor': function () {
				var store = createPrimeNumberStore(),
					collection = store.track();	
				collection.fetchSync();
				var data = collection._results;

				store.defaultNewToStart = true;
				store.add({ id: 6, name: 'six', even: true }, { beforeId: 2 });
				store.add({ id: -2, name: 'negative-two', even: true }, { beforeId: null });

				assert.strictEqual(data[2].id, 6);
				assert.strictEqual(data[3].id, 2);
				assert.strictEqual(data[data.length - 1].id, -2);
			},

			'updated item - with options.beforeId and queryExecutor': function () {
				var store = createPrimeNumberStore(),
					evenCollection = store.filter({ even: true }).track();
				var data = evenCollection._results;

				store.defaultNewToStart = true;
				store.put(store.getSync(4), { beforeId: 2 });
				store.put(store.getSync(0), { beforeId: null });

				assert.strictEqual(data[0].id, 4);
				assert.strictEqual(data[1].id, 2);
				assert.strictEqual(data[data.length - 1].id, 0);
			},

			'updated item - with options.beforeId and no queryExecutor': function () {
				var store = createPrimeNumberStore(),
					collection = store.track();
				var data = collection._results;

				store.defaultNewToStart = true;
				store.put(store.getSync(4), { beforeId: 2 });
				store.put(store.getSync(3), { beforeId: null });

				assert.strictEqual(data[2].id, 4);
				assert.strictEqual(data[3].id, 2);
				assert.strictEqual(data[data.length - 1].id, 3);
			},

			'type': function () {
				assert.isFalse(store === store.track(function () {}));
			},

			'track and collection.tracking.remove': function () {
				var store = createStore({ data: createData(10) }, Memory),
					trackedCollection = store.track();

				assert.property(trackedCollection, 'tracking');

				// Fetch so tracking has data to work with
				trackedCollection.fetch();

				var lastEvent = null;
				trackedCollection.on('add, update', function (event) {
					lastEvent = event;
				});

				store.put({ id: 11, name: 'item-11', order: 11 });
				assert.isNotNull(lastEvent);
				assert.isDefined(lastEvent.index);

				trackedCollection.tracking.remove();
				lastEvent = null;
				store.put({ id: 12, name: 'item-12', order: 12 });
				assert.isNull(lastEvent);
			},

			'fetch preserves totalLength API': function () {
				var store = createStore({ data: [] }, Memory);
				var trackedCollection = store.track();
				var results = trackedCollection.fetch();

				assert.isDefined(results.totalLength, 'totalLength should be defined on fetch results');
			},

			'fetchRange preserves totalLength API': function () {
				var store = createStore({ data: [] }, Memory);
				var trackedCollection = store.track();
				var results = trackedCollection.fetchRange({ start: 0, end: 10 });

				assert.isDefined(results.totalLength, 'totalLength should be defined on fetch results');
			}
		};
	}

	registerSuite(createTestSuite('Trackable mixin', function (properties, BaseStore) {
		return new (declare([ BaseStore, Trackable ]))(properties);
	}));

	registerSuite(createTestSuite('Trackable.create()', function (properties, BaseStore) {
		return Trackable.create(new BaseStore(properties));
	}));
});
