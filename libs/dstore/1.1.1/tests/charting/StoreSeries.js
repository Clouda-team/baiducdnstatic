define([
	'intern!object',
	'intern/chai!assert',
	'dojo/_base/declare',
	'dojo/json',
	'dstore/Memory',
	'dstore/Trackable',
	'dstore/charting/StoreSeries'
], function(registerSuite, assert, declare, JSON, Memory, Trackable, StoreSeries){

	var testSeriesObj = {
		// This is a mock Series object for testing.
		isTestSeries: true,
		chart: {
			updateSeries: function(){
				// do nothing
			},
			delayedRender: function(){
				// do nothing
			}
		}
	};

	var storeData, store;

	registerSuite({
		name: 'dstore charting StoreSeries',

		beforeEach: function(){
			storeData = [];
			for(var i = 1; i <= 5; i++){
				storeData.push({id: i, value: i, data: 'data' + i});
			}
			store = new Memory({
				data: storeData
			});
		},

		'initial fetch - default value': function(){
			var series = new StoreSeries(store);
			var data = series.data;
			assert.lengthOf(data, 5);
			assert.include(data, 1);
			assert.include(data, 2);
			assert.include(data, 3);
			assert.include(data, 4);
			assert.include(data, 5);
		},

		'initial fetch - value = data': function(){

			var series = new StoreSeries(store, 'data');
			var data = series.data;
			assert.lengthOf(data, 5);
			assert.include(data, 'data1');
			assert.include(data, 'data2');
			assert.include(data, 'data3');
			assert.include(data, 'data4');
			assert.include(data, 'data5');
		},

		'initial fetch - value function': function(){

			var series = new StoreSeries(store, function(object){
				return object.data + '-' + object.id;
			});
			var data = series.data;
			assert.lengthOf(data, 5);
			assert.include(data, 'data1-1');
			assert.include(data, 'data2-2');
			assert.include(data, 'data3-3');
			assert.include(data, 'data4-4');
			assert.include(data, 'data5-5');
		},

		'initial fetch - value object': function(){

			var series = new StoreSeries(store, { data1: 'value', data2: 'data' });
			var data = series.data;
			assert.lengthOf(data, 5);
			assert.strictEqual(JSON.stringify(data[0]), '{"data1":1,"data2":"data1"}');
			assert.strictEqual(JSON.stringify(data[4]), '{"data1":5,"data2":"data5"}');
		},

		'set series object': function(){
			testSeriesObj.updated = false;
			var series = new StoreSeries(store, 'value');
			series.setSeriesObject(testSeriesObj);
			assert.strictEqual(series.series, testSeriesObj);
		},

		'fetch': function(){
			var series = new StoreSeries(store, 'data');
			var data = series.data;
			assert.lengthOf(data, 5);
			assert.include(data, 'data1');
			assert.include(data, 'data2');
			assert.include(data, 'data3');
			assert.include(data, 'data4');
			assert.include(data, 'data5');

			store.put({id: 4, value: 4, data: 'mod data 44'});
			data = series.data;
			assert.lengthOf(data, 5);
			assert.include(data, 'data1');
			assert.include(data, 'data2');
			assert.include(data, 'data3');
			assert.include(data, 'data4');
			assert.include(data, 'data5');

			series.fetch();
			data = series.data;
			assert.lengthOf(data, 5);
			assert.include(data, 'data1');
			assert.include(data, 'data2');
			assert.include(data, 'data3');
			assert.include(data, 'mod data 44');
			assert.include(data, 'data5');
		},

		'observable store - update': function(){
			store = new (declare([Memory, Trackable]))({
				data: storeData
			});

			var series = new StoreSeries(store, 'data');
			var data = series.data;
			assert.lengthOf(data, 5);
			assert.include(data, 'data1');
			assert.include(data, 'data2');
			assert.include(data, 'data3');
			assert.include(data, 'data4');
			assert.include(data, 'data5');

			store.put({id: 1, value: 1, data: 'mod data 11'});

			data = series.data;
			assert.lengthOf(data, 5);
			assert.include(data, 'mod data 11');
			assert.include(data, 'data2');
			assert.include(data, 'data3');
			assert.include(data, 'data4');
			assert.include(data, 'data5');

			store.put({id: 5, value: 5, data: 'mod data 55'});

			data = series.data;
			assert.lengthOf(data, 5);
			assert.include(data, 'mod data 11');
			assert.include(data, 'data2');
			assert.include(data, 'data3');
			assert.include(data, 'data4');
			assert.include(data, 'mod data 55');
		},

		'observable store - delete': function(){
			store = new (declare([Memory, Trackable]))({
				data: storeData
			});

			var series = new StoreSeries(store, 'data');
			var data = series.data;
			assert.lengthOf(data, 5);
			assert.include(data, 'data1');
			assert.include(data, 'data2');
			assert.include(data, 'data3');
			assert.include(data, 'data4');
			assert.include(data, 'data5');

			store.remove(5);

			data = series.data;
			assert.lengthOf(data, 4);
			assert.include(data, 'data1');
			assert.include(data, 'data2');
			assert.include(data, 'data3');
			assert.include(data, 'data4');

			store.remove(1);
			data = series.data;
			assert.lengthOf(data, 3);
			assert.include(data, 'data2');
			assert.include(data, 'data3');
			assert.include(data, 'data4');
		}
	});
});
