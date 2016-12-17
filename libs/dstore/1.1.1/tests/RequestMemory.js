define([
	'intern!object',
	'intern/chai!assert',
	'require',
	'dojo/_base/array',
	'dojo/_base/declare',
	'../RequestMemory',
	'../Trackable'
], function (registerSuite, assert, require, arrayUtil, declare, RequestMemory, Trackable) {

	var store;
	function mapResultIds(results) {
		return arrayUtil.map(results, function (item) {
			return item.id;
		});
	}
	registerSuite({
		name: 'RequestMemory',

		beforeEach: function () {
			store = new (declare([RequestMemory, Trackable]))({
				target: require.toUrl('dstore/tests/data/treeTestRoot')
			});
		},

		'.get': function () {
			return store.get('node2').then(function (item) {
				assert.strictEqual(
					JSON.stringify(item),
					JSON.stringify({ 'id': 'node2', 'name':'node2', 'someProperty':'somePropertyB' })
				);
			});
		},

		'.put': function () {
			var updatedItem;
			var updateEventFired;
			store.on('update', function (event) {
				assert.isObject(event.target);
				updateEventFired = true;
			});
			return store.get('node5').then(function (item) {
				item.changed = true;
				updatedItem = item;

				var putResult = store.put(updatedItem);
				assert.isDefined(putResult && putResult.then, 'put should return a promise');
				return putResult;
			}).then(function () {
				return store.get('node5');
			}).then(function (item) {
				assert.strictEqual(JSON.stringify(item), JSON.stringify(updatedItem));
				assert.isTrue(updateEventFired);
			});
		},

		'.put downstream': function () {
			var updatedItem;
			var updateEventFired;
			var node4View = store.filter({name: 'node4'});
			node4View.on('update', function (event) {
				assert.isObject(event.target);
				updateEventFired = true;
			});
			return node4View.get('node4').then(function (item) {
				item.changed = true;
				updatedItem = item;

				return store.put(updatedItem);
			}).then(function () {
				return store.get('node4');
			}).then(function (item) {
				assert.strictEqual(JSON.stringify(item), JSON.stringify(updatedItem));
				assert.isTrue(updateEventFired);
			});
		},

		'.add': function () {
			var newItem = { 'id': 'node6', 'name':'node6', 'someProperty':'somePropertyB' };
			var addEventFired;
			store.on('add', function () {
				addEventFired = true;
			});
			var addResult = store.add(newItem);
			assert.isDefined(addResult && addResult.then, 'add should return a promise');
			return addResult.then(function () {
				return store.get('node6');
			}).then(function (item) {
				assert.strictEqual(JSON.stringify(item), JSON.stringify(newItem));
				assert.isTrue(addEventFired);
			});
		},

		'.add downstream': function () {
			var newItem = { 'id': 'node7', 'name':'node7', 'someProperty':'somePropertyB' };
			var addEventFired;
			var node7View = store.filter({name: 'node7'});
			node7View.on('add', function () {
				addEventFired = true;
			});
			var addResult = store.add(newItem);
			return addResult.then(function () {
				assert.isTrue(addEventFired);
			});
		},

		'.remove': function () {
			return store.get('node3').then(function (item) {
				assert.ok(item);
				var removeResult = store.remove('node3');
				assert.isDefined(removeResult && removeResult.then, 'remove should return a promise');
				return removeResult;
			}).then(function () {
				return store.get('node3');
			}).then(function (item) {
				assert.strictEqual(arguments.length, 1);
				assert.isUndefined(item);
			});
		},

		'filter': function () {
			var results = store.filter({ someProperty: 'somePropertyB' }).fetch().then(mapResultIds);
			return results.then(function (data) {
				assert.deepEqual(data.slice(), [ 'node2', 'node5' ]);
			});
		},

		'.sort': function () {
			var results = store.sort([
					{ property: 'someProperty', descending: true },
					{ property: 'name', descending: false }
				]).fetch().then(mapResultIds);
			return results.then(function (data) {
				assert.deepEqual(data.slice(), [ 'node3', 'node2', 'node5', 'node1', 'node4' ]);
			});
		},

		'.fetchRange': function () {
			var results = store.fetchRange({start: 1, end: 4}).then(mapResultIds);
			return results.then(function (data) {
				assert.deepEqual(data.slice(), [ 'node2', 'node3', 'node4' ]);
			});
		},

		'combined queries': function () {
			var results = store
				.filter(function (item) {
					return item.someProperty !== 'somePropertyB';
				})
				.sort('name', true)
				.fetchRange({start: 1, end: 3}).then(mapResultIds);
			return results.then(function (data) {
				assert.deepEqual(data.slice(), [ 'node3', 'node1' ]);
			});
		}
	});
});
