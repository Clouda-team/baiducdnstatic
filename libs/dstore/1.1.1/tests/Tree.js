define([
	'intern!object',
	'intern/chai!assert',
	'dojo/_base/declare',
	'dstore/Memory',
	'dstore/Tree'
], function (registerSuite, assert, declare, Memory, Tree) {
	var TestStore = declare([ Memory, Tree ]);

	var store = new TestStore({
		Model: null,
		data: [
			{ parent: null, id: '1', name: 'root1' },
			{ parent: '1', id: '1.1', name: 'child1.1' },
			{ parent: '1', id: '1.2', name: 'child1.2' },
			{ parent: '1.2', id: '1.2.1', name: 'grandchild1.2.1' },
			{ parent: '1.2', id: '1.2.2', name: 'grandchild1.2.2' },
			{ parent: '1', id: '1.3', name: 'child1.3' },
			{ parent: null, id: '2', name: 'root2' },
			{ parent: '2', id: '2.1', name: 'child2.1' },
			{ parent: '2', id: '2.2', name: 'child2.2' },
			{ parent: null, id: '3', name: 'root3' }
		]
	});

	registerSuite({
		name: 'dstore/Tree',

		'getRootCollection': function () {
			// slice() to get a copy of the results without a totalLength property
			var results = store.getRootCollection().fetchSync().slice();

			assert.deepEqual(results, [
				{ parent: null, id: '1', name: 'root1' },
				{ parent: null, id: '2', name: 'root2' },
				{ parent: null, id: '3', name: 'root3' }
			]);
		},

		'mayHaveChildren': function () {
			assert.isTrue(store.mayHaveChildren({}));
			assert.isTrue(store.mayHaveChildren({ hasChildren: true }));
			assert.isFalse(store.mayHaveChildren({ hasChildren: false }));
		},

		'getChildren': function () {
			var childlessObject = store.getSync('3');
			var children = store.getChildren(childlessObject).fetchSync().slice();
			assert.deepEqual(children, []);

			var parentObject = store.getSync('1');
			children = store.getChildren(parentObject).fetchSync().slice();
			assert.deepEqual(children, [
				{ parent: '1', id: '1.1', name: 'child1.1' },
				{ parent: '1', id: '1.2', name: 'child1.2' },
				{ parent: '1', id: '1.3', name: 'child1.3' }
			]);

			var grandparentObject = store.getSync('1.2');
			children = store.getChildren(grandparentObject).fetchSync().slice();
			assert.deepEqual(children, [
				{ parent: '1.2', id: '1.2.1', name: 'grandchild1.2.1' },
				{ parent: '1.2', id: '1.2.2', name: 'grandchild1.2.2' }
			]);
		}
	});
});
