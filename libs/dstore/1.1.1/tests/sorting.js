define([
	'intern/chai!assert',
	'dojo/when'
], function (assert, when) {
	return function createSortTests (name, before, sort) {
		return {
			name: name,
			beforeEach: before([
				{ id: 1, field1: 'one', field2: '1' },
				{ id: 2, field1: 'one', field2: '2' },
				{ id: 3, field1: 'two', field2: '5' },
				{ id: 4, field1: 'two', field2: '4' },
				{ id: 5, field1: 'two', field2: '3' },
				{ id: 6, field1: 'one', field2: '3' }
			]),
			'multiple sort fields - ascend + ascend': function () {
				return when(sort({ property: 'field1' },
					{ property: 'field2' })).then(function (results) {
					/**
					 * {id: 1, field1: 'one', field2: '1'},
					 * {id: 2, field1: 'one', field2: '2'},
					 * {id: 6, field1: 'one', field2: '3'}
					 * {id: 5, field1: 'two', field2: '3'},
					 * {id: 4, field1: 'two', field2: '4'},
					 * {id: 3, field1: 'two', field2: '5'},
					 */
					assert.strictEqual(results.length, 6, 'Length is 6');
					assert.strictEqual(results[0].id, 1);
					assert.strictEqual(results[1].id, 2);
					assert.strictEqual(results[2].id, 6);
					assert.strictEqual(results[3].id, 5);
					assert.strictEqual(results[4].id, 4);
					assert.strictEqual(results[5].id, 3);
				});
			},

			'multiple sort fields - ascend + descend': function () {
				return when(sort({ property: 'field1', descending: false },
					{ property: 'field2', descending: true })).then(function (results) {
					assert.strictEqual(results.length, 6, 'Length is 6');
					/**
					 * {id: 6, field1: 'one', field2: '3'}
					 * {id: 2, field1: 'one', field2: '2'},
					 * {id: 1, field1: 'one', field2: '1'},
					 * {id: 3, field1: 'two', field2: '5'},
					 * {id: 4, field1: 'two', field2: '4'},
					 * {id: 5, field1: 'two', field2: '3'},
					 */
					assert.strictEqual(results[0].id, 6);
					assert.strictEqual(results[1].id, 2);
					assert.strictEqual(results[2].id, 1);
					assert.strictEqual(results[3].id, 3);
					assert.strictEqual(results[4].id, 4);
					assert.strictEqual(results[5].id, 5);
				});
			},

			'multiple sort fields - descend + ascend': function () {
				return when(sort({ property: 'field1', descending: true },
					{ property: 'field2', descending: false })).then(function (results) {
					/**
					 * {id: 5, field1: 'two', field2: '3'},
					 * {id: 4, field1: 'two', field2: '4'},
					 * {id: 3, field1: 'two', field2: '5'},
					 * {id: 1, field1: 'one', field2: '1'},
					 * {id: 2, field1: 'one', field2: '2'},
					 * {id: 6, field1: 'one', field2: '3'}
					 */
					assert.strictEqual(results.length, 6, 'Length is 6');
					assert.strictEqual(results[0].id, 5);
					assert.strictEqual(results[1].id, 4);
					assert.strictEqual(results[2].id, 3);
					assert.strictEqual(results[3].id, 1);
					assert.strictEqual(results[4].id, 2);
					assert.strictEqual(results[5].id, 6);
				});
			},

			'multiple sort fields - descend + descend': function () {
				return when(sort({ property: 'field1', descending: true },
					{ property: 'field2', descending: true })).then(function (results) {
					/**
					 * {id: 3, field1: 'two', field2: '5'},
					 * {id: 4, field1: 'two', field2: '4'},
					 * {id: 5, field1: 'two', field2: '3'},
					 * {id: 6, field1: 'one', field2: '3'}
					 * {id: 2, field1: 'one', field2: '2'},
					 * {id: 1, field1: 'one', field2: '1'},
					 */
					assert.strictEqual(results.length, 6, 'Length is 6');
					assert.strictEqual(results[0].id, 3);
					assert.strictEqual(results[1].id, 4);
					assert.strictEqual(results[2].id, 5);
					assert.strictEqual(results[3].id, 6);
					assert.strictEqual(results[4].id, 2);
					assert.strictEqual(results[5].id, 1);
				});
			}
		};
	};
});