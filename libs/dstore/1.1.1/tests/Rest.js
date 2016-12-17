define([
	'intern!object',
	'intern/chai!assert',
	'dstore/Rest',
	'./Request',
	'dojo/_base/lang',
	'dojo/aspect',
	'./mockRequest',
	'dojo/text!./data/node1.1'
], function (
	registerSuite,
	assert,
	Rest,
	createRequestTests,
	lang,
	aspect,
	mockRequest,
	nodeData_1_1
) {

	function runHeaderTest(method, args) {
		return store[method].apply(store, args).then(function () {
			mockRequest.assertRequestHeaders(requestHeaders);
			mockRequest.assertRequestHeaders(globalHeaders);
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

	var tests = createRequestTests(Rest);
	aspect.after(tests, 'beforeEach', function () {
		store = createRequestTests.store;
	})
	lang.mixin(tests, {
		name: 'dstore Rest',
		'get': function () {
			mockRequest.setResponseText(nodeData_1_1);

			return store.get('data/node1.1').then(function (object) {
				assert.strictEqual(object.name, 'node1.1');
				assert.strictEqual(object.describe(), 'name is node1.1');
				assert.strictEqual(object.someProperty, 'somePropertyA1');
			});
		},
		'headers get 1': function () {
			return runHeaderTest('get', [ 'mockRequest/1', requestHeaders ]);
		},

		'headers get 2': function () {
			return runHeaderTest('get', [ 'mockRequest/2', { headers: requestHeaders } ]);
		},
		'headers remove': function () {
			return runHeaderTest('remove', [ 'mockRequest/3', { headers: requestHeaders } ]);
		},

		'headers put': function () {
			return runHeaderTest('put', [
				{},
				{
					id: 'mockRequest/4',
					headers: requestHeaders
				}
			]);
		},

		'headers add': function () {
			return runHeaderTest('add', [
				{},
				{
					id: 'mockRequest/5',
					headers: requestHeaders
				}
			]);
		},

		'put object without ID': function () {
			var objectWithoutId = { name: 'one' };
			mockRequest.setResponseText(store.stringify(objectWithoutId));
			return store.put(objectWithoutId).then(function () {
				mockRequest.assertHttpMethod('POST');
			});
		},

		'put object with ID': function () {
			var objectWithId = { id: 1, name: 'one' };
			mockRequest.setResponseText(store.stringify(objectWithId));
			return store.put(objectWithId).then(function () {
				mockRequest.assertHttpMethod('PUT');
			});
		},

		'put object with store.defaultNewToStart': function () {
			function testPutPosition(object, options, expectedHeaders) {
				store.defaultNewToStart = undefined;
				return store.put(object, options).then(function () {
					mockRequest.assertRequestHeaders(expectedHeaders.defaultUndefined);
				}).then(function () {
					store.defaultNewToStart = false;
					return store.put(object, options);
				}).then(function () {
					mockRequest.assertRequestHeaders(expectedHeaders.defaultEnd);
					store.defaultNewToStart = true;
					return store.put(object, options);
				}).then(function () {
					mockRequest.assertRequestHeaders(expectedHeaders.defaultStart);
				});
			}

			var objectWithId = { id: 1, name: 'one' },
				objectWithoutId = { name: 'missing identity' },
				optionsWithoutOverwrite = {},
				optionsWithOverwriteTrue = { overwrite: true },
				optionsWithOverwriteFalse = { overwrite: false },
				noExpectedPositionHeaders = {
					defaultUndefined: { 'Put-Default-Position': null },
					defaultEnd: { 'Put-Default-Position': null },
					defaultStart: { 'Put-Default-Position': null }
				},
				expectedPositionHeaders = {
					defaultUndefined: { 'Put-Default-Position': 'end' },
					defaultEnd: { 'Put-Default-Position': 'end' },
					defaultStart: { 'Put-Default-Position': 'start' }
				};

			var tests = [
				[ objectWithId, optionsWithoutOverwrite, noExpectedPositionHeaders ],
				[ objectWithId, optionsWithOverwriteTrue, noExpectedPositionHeaders ],
				[ objectWithId, optionsWithOverwriteFalse, expectedPositionHeaders ],
				[ objectWithoutId, optionsWithoutOverwrite, expectedPositionHeaders ],
				[ objectWithoutId, optionsWithOverwriteTrue, expectedPositionHeaders ],
				[ objectWithoutId, optionsWithOverwriteFalse, expectedPositionHeaders ]
			];

			var promise = testPutPosition.apply(null, tests[0]);
			for (var i = 0; i < tests.length; ++i) {
				promise = promise.then(function () {
					return testPutPosition.apply(null, tests[i]);
				});
			}
		},

		'put object with options.beforeId': function () {
			store.defaultNewToStart = true;
			return store.put({ id: 1, name: 'one' }, { beforeId: 123 }).then(function () {
				mockRequest.assertRequestHeaders({
					'Put-Before': 123,
					'Put-Default-Position': null
				});
			}).then(function () {
				return store.put({ id: 2, name: 'two' }, { beforeId: null });
			}).then(function () {
				mockRequest.assertRequestHeaders({
					'Put-Before': null,
					'Put-Default-Position': 'end'
				});
			});
		},

		'get and save': function () {
			var expectedObject = { id: 1, name: 'one' };
			mockRequest.setResponseText(store.stringify(expectedObject));
			return store.get('anything').then(function (object) {
				mockRequest.setResponseText(store.stringify(expectedObject));
				return store.put(object).then(function (result) {
					assert.deepEqual(store.stringify(result), store.stringify(expectedObject));
				});
			});
		}
	});
	registerSuite(tests);
});
