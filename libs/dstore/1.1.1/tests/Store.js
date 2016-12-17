define([
	'../Store',
	'dojo/_base/declare',
	'dojo/_base/lang',
	'intern!object',
	'intern/chai!assert'
], function (Store, declare, lang, registerSuite, assert) {

	var Model = declare(null, {
		constructor: function (args) {
			declare.safeMixin(this, args);
		}
	});
	var store;
	registerSuite({
		name: 'dstore Store',

		beforeEach: function () {
			store = new Store();
		},

		'getIdentity and _setIdentity': {
			'direct property access and assignment': function () {
				var object = { id: 'default', 'custom-id': 'custom' };

				assert.strictEqual(store.getIdentity(object), 'default');
				store._setIdentity(object, 'assigned-id');
				assert.strictEqual(object.id, 'assigned-id');
				assert.strictEqual(store.getIdentity(object), object.id);

				store.idProperty = 'custom-id';
				assert.strictEqual(store.getIdentity(object), 'custom');
				store._setIdentity(object, 'assigned-id');
				assert.strictEqual(object['custom-id'], 'assigned-id');
				assert.strictEqual(store.getIdentity(object), object['custom-id']);
			},
			'getter and setter': function () {
				var object = {
						_properties: {
							id: 'default',
							'custom-id': 'custom',
						},
						get: function (name) {
							return this._properties[name];
						},
						set: function (name, value) {
							this._properties[name] = value;
						}
					};

				assert.strictEqual(store.getIdentity(object), 'default');
				store._setIdentity(object, 'assigned-id');
				assert.strictEqual(object._properties.id, 'assigned-id');
				assert.strictEqual(store.getIdentity(object), object._properties.id);

				store.idProperty = 'custom-id';
				assert.strictEqual(store.getIdentity(object), 'custom');
				store._setIdentity(object, 'assigned-id');
				assert.strictEqual(object._properties['custom-id'], 'assigned-id');
				assert.strictEqual(store.getIdentity(object), object._properties['custom-id']);
			}
		},

		'filter': function () {
			var filter1 = { prop1: 'one' },
				expectedQueryLog1 = [ {
					type: 'filter', arguments: [ filter1 ], normalizedArguments: [ {
						type: 'eq',
						args: { // we have to match Argument type, which is not a real array
							0: 'prop1',
							1: 'one'
						}
					} ]
				} ],
				filter2 = function filterFunc() {},
				expectedQueryLog2 = expectedQueryLog1.concat({
					type: 'filter', arguments: [ filter2 ], normalizedArguments: [ {
						type: 'function',
						args: [filter2]
					} ]
				}),
				filteredCollection;

			filteredCollection = store.filter(filter1);
			// deepEqual just won't work on the data in these
			assert.equal(JSON.stringify(filteredCollection.queryLog), JSON.stringify(expectedQueryLog1));

			filteredCollection = filteredCollection.filter(filter2);
			assert.equal(JSON.stringify(filteredCollection.queryLog), JSON.stringify(expectedQueryLog2));
		},

		'sort': function () {
			var sortObject = { property: 'prop1', descending: true },
				sortObjectArray = [ sortObject, { property: 'prop2' } ],
				comparator = function comparator() {},
				expectedQueryLog1 = [ {
					type: 'sort',
					arguments: [ sortObject.property, sortObject.descending ],
					normalizedArguments: [ [ sortObject ] ]
				} ],
				expectedQueryLog2 = [ {
					type: 'sort',
					arguments: [ sortObject ],
					normalizedArguments: [ [ sortObject ] ]
				} ],
				expectedQueryLog3 = expectedQueryLog2.concat({
					type: 'sort',
					arguments: [ sortObjectArray ],
					normalizedArguments: [ [ sortObject, lang.mixin({ descending: false }, sortObjectArray[1]) ] ]
				}),
				expectedQueryLog4 = expectedQueryLog3.concat({
					type: 'sort', arguments: [ comparator ], normalizedArguments: [ comparator ]
				}),
				sortedCollection;

			sortedCollection = store.sort(sortObject.property, sortObject.descending);
			assert.deepEqual(sortedCollection.queryLog, expectedQueryLog1);

			sortedCollection = store.sort(sortObject);
			assert.deepEqual(sortedCollection.queryLog, expectedQueryLog2);

			sortedCollection = sortedCollection.sort(sortObjectArray);
			assert.deepEqual(sortedCollection.queryLog, expectedQueryLog3);

			sortedCollection = sortedCollection.sort(comparator);
			assert.deepEqual(sortedCollection.queryLog, expectedQueryLog4);
		},

		'restore': function () {
			var TestModel = declare(Model, {
				_restore: function (Constructor) {
					// use constructor based restoration
					var restored = new Constructor(this);
					restored.restored = true;
					return restored;
				}
			});
			var store = new Store({
				Model: TestModel
			});
			var restoredObject = store._restore({foo: 'original'});
			assert.strictEqual(restoredObject.foo, 'original');
			assert.strictEqual(restoredObject.restored, true);
			assert.isTrue(restoredObject instanceof TestModel);
		},

		events: function () {
			var methodCalls = [],
				events = [];

			// rely on autoEventEmits
			var store = new (declare(Store, {
				put: function (object) {
					methodCalls.push('put');
					return object;
				},
				add: function (object) {
					methodCalls.push('add');
					return object;
				},
				remove: function (id) {
					methodCalls.push('remove');
				}
			}))();
			store.on('add', function (event) {
				events.push(event.type);
			});
			// test comma delimited as well
			store.on('update, delete', function (event) {
				events.push(event.type);
			});
			store.put({});
			store.add({});
			store.remove(1);

			assert.deepEqual(methodCalls, ['put', 'add', 'remove']);
			assert.deepEqual(events, ['update', 'add', 'delete']);
		},

		'events with beforeId': function () {
			var store = new Store(),
				beforeIds = [];

			store.on('add, update', function (event) {
				beforeIds.push(event.beforeId);
			});

			store.add({}, { beforeId: 123 });
			store.put({}, { beforeId: 321 });

			assert.deepEqual(beforeIds, [ 123, 321 ]);
		},

		'emit should catch errors thrown by listeners': function () {
			var store = new Store(),
				testEmit = lang.hitch(store, 'emit', 'test-event');

			assert.doesNotThrow(testEmit);

			store.on('test-event', function () {
				throw new Error('listener error');
			});
			assert.doesNotThrow(testEmit);
		},

		forEach: function () {
			var store = new (declare(Store, {
				fetch: function () {
					return [0, 1, 2];
				}
			}))();
			var results = [];
			store.forEach(function (item, i, instance) {
				assert.strictEqual(item, i);
				results.push(item);
				assert.strictEqual(instance, store);
			});
			assert.deepEqual(results, [0, 1, 2]);
		},

		'extends declare-based Model constructors and adds a _store reference on the prototype': function () {
			var DeclaredTestModel = declare(null);

			var store = new Store({ Model: DeclaredTestModel });
			assert.notStrictEqual(store.Model, DeclaredTestModel);
			assert.instanceOf(new store.Model(), DeclaredTestModel);
		},

		'does not extend Model constructors not based on declare': function () {
			function TestModel() {}

			var store = new Store({ Model: TestModel });
			assert.strictEqual(store.Model, TestModel);
		}
	});
});
