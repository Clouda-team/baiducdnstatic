define([
	'../SimpleQuery',
	'dojo/_base/declare',
	'../Filter',
	'intern!object',
	'intern/chai!assert'
], function (SimpleQuery, declare, Filter, registerSuite, assert) {
	var testData = [
		{ id: 1, name: 'one', odd: true },
		{ id: 2, name: 'two', odd: false },
		{ id: 3, name: 'three', odd: true },
		{ id: 4, name: 'four', odd: false },
		{ id: 5, name: 'five', odd: true }
	];

	var simpleQuery = new SimpleQuery();

	registerSuite({
		name: 'SimpleQuery',

		'filter with predicate': function () {
			var filter = simpleQuery._createFilterQuerier({
				type: 'function',
				args: [function (o) { return o.odd; }]
			});

			assert.deepEqual(filter(testData), [
				{ id: 1, name: 'one', odd: true },
				{ id: 3, name: 'three', odd: true },
				{ id: 5, name: 'five', odd: true }
			]);
		},

		'filter with object': function () {
			var filterExpression = new Filter();
			var filter = simpleQuery._createFilterQuerier(filterExpression.eq('odd', false));

			assert.deepEqual(filter(testData), [
				{ id: 2, name: 'two', odd: false },
				{ id: 4, name: 'four', odd: false }
			]);
		},

		'sort with array of sort attributes': function () {
			var sort = simpleQuery._createSortQuerier([
				{ property: 'odd' },
				{ property: 'name', descending: true }
			]);

			assert.deepEqual(sort(testData), [
				{ id: 2, name: 'two', odd: false },
				{ id: 4, name: 'four', odd: false },
				{ id: 3, name: 'three', odd: true },
				{ id: 1, name: 'one', odd: true },
				{ id: 5, name: 'five', odd: true }
			]);
		},

		'sort with comparator': function () {
			var sort = simpleQuery._createSortQuerier(function (a, b) {
				a = a.name;
				b = b.name;
				return (a < b) ? -1 : (a === b ? 0 : 1);
			});

			assert.deepEqual(sort(testData), [
				{ id: 5, name: 'five', odd: true },
				{ id: 4, name: 'four', odd: false },
				{ id: 1, name: 'one', odd: true },
				{ id: 3, name: 'three', odd: true },
				{ id: 2, name: 'two', odd: false }
			]);
		},

		'sort null and undefined with strings': function () {
			var sort = simpleQuery._createSortQuerier([ { property: 'name' } ]);
			var sortDescending = simpleQuery._createSortQuerier([ { descending: true, property: 'name' } ]);
			var data = testData.slice();
			data.splice(2 , 0, { id: 6, odd: false });
			data.splice(2, 0, { id: 7, name: null, odd: true });

			assert.deepEqual(sort(data), [
				{ id: 5, name: 'five', odd: true },
				{ id: 4, name: 'four', odd: false },
				{ id: 1, name: 'one', odd: true },
				{ id: 3, name: 'three', odd: true },
				{ id: 2, name: 'two', odd: false },
				{ id: 7, name: null, odd: true },
				{ id: 6, odd: false }
			]);

			assert.deepEqual(sortDescending(data), [
				{ id: 6, odd: false },
				{ id: 7, name: null, odd: true },
				{ id: 2, name: 'two', odd: false },
				{ id: 3, name: 'three', odd: true },
				{ id: 1, name: 'one', odd: true },
				{ id: 4, name: 'four', odd: false },
				{ id: 5, name: 'five', odd: true }
			]);
		},

		'sort null and undefined with numbers': function () {
			var sort = simpleQuery._createSortQuerier([ { property: 'id' } ]);
			var sortDescending = simpleQuery._createSortQuerier([ { descending: true, property: 'id' } ]);
			var data = testData.slice();
			data.splice(2 , 0, {});
			data.splice(2, 0, { id: null});
			data.splice(2, 0, { id: -1});

			assert.deepEqual(sort(data), [
				{ id: -1 },
				{ id: 1, name: 'one', odd: true },
				{ id: 2, name: 'two', odd: false },
				{ id: 3, name: 'three', odd: true },
				{ id: 4, name: 'four', odd: false },
				{ id: 5, name: 'five', odd: true },
				{ id: null },
				{}
			]);

			assert.deepEqual(sortDescending(data), [
				{},
				{ id: null },
				{ id: 5, name: 'five', odd: true },
				{ id: 4, name: 'four', odd: false },
				{ id: 3, name: 'three', odd: true },
				{ id: 2, name: 'two', odd: false },
				{ id: 1, name: 'one', odd: true },
				{ id: -1 }
			]);
		}
	});
});
