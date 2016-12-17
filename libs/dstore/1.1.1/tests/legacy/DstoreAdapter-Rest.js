define([
	'intern!object',
	'intern/chai!assert',
	'dstore/Rest',
	'dojo/request/registry',
	'dojo/_base/lang',
	'dojo/aspect',
	'../mockRequest',
	'dstore/legacy/DstoreAdapter',
	'dojo/text!../data/node1.1',
	'dojo/text!../data/treeTestRoot'
], function (
	registerSuite,
	assert,
	Rest,
	request,
	lang,
	aspect,
	mockRequest,
	DstoreAdapter,
	nodeData_1_1,
	treeTestRootData
) {

	var Model = function () {};

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

	registerSuite({
		name: 'DstoreAdapter-Rest',
		before: function () {
			registryHandle = request.register(/.*mockRequest.*/, mockRequest);
		},

		after: function () {
			registryHandle.remove();
		},
		beforeEach: function(){
			store = new DstoreAdapter(new Rest({
				target: '/mockRequest/',
				headers: globalHeaders,
				Model: Model
			}));
		},
		'get': function () {
			mockRequest.setResponseText(nodeData_1_1);

			return store.get('data/node1.1').then(function (object) {
				assert.strictEqual(object.name, 'node1.1');
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
			return store.put(objectWithoutId).then(function () {
				mockRequest.assertHttpMethod('POST');
			});
		},
		'query iterative': function () {
			mockRequest.setResponseText(treeTestRootData);

			var i = 0;
			return store.query('data/treeTestRoot').forEach(function (object) {
				i++;
				assert.strictEqual(object.name, 'node' + i);
			});
		},
		'query iterative with options': function () {
			mockRequest.setResponseText(treeTestRootData);

			var i = 0;
			return store.query('data/treeTestRoot', { start: 0 }).map(function (object) {
				i++;
				assert.strictEqual(object.name, 'node' + i);
				return object;
			});
		}
	});
});
