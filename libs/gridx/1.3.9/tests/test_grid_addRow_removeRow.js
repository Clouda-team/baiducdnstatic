require([
	'dojo/parser',
	'dojo/_base/Deferred',
	'dojo/_base/lang',
	'dojo/DeferredList',
	'gridx/Grid',
	'gridx/tests/support/data/TestData',
//    'gridx/core/model/cache/Sync',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/stores/Memory',
//    'gridx/tests/support/stores/JsonRest',
	'gridx/allModules',
	'dojo/domReady!'
], function(parser, Deferred, lang, DeferredList, Grid, dataSource, Cache, storeFactory){

	var newId = 1000000;

	var getNewItem = function(){
		var item = dataSource.getData(1).items[0];
		++newId;
		item.order = item.id = newId;
		return item;
	};

	store = storeFactory({
		path: './support/stores',
		dataSource: dataSource, 
		size: 1000
	});

	newRow = function(){
		Deferred.when(grid.store.add(getNewItem()), function(){
			console.log("A new item is saved to server");
		});
	};

	addSomeRows = function(){
		var rows = [], dl = [];
		for(var i = 0; i < 10; ++i){
			rows.push(getNewItem());
			var d = new Deferred();
			Deferred.when(grid.store.add(rows[rows.length - 1]), lang.hitch(d, d.callback));
			dl.push(d);
		}
		new DeferredList(dl).then(function(){
			console.debug('add ok');
		});
	};

	deleteSomeRows = function(){
		grid.model.when({start: 0, count: 10}, function(){
			var i, rowIds = [], dl = [];
			for(i = 0; i < 10; ++i){
				if(grid.row(i)){
					rowIds.push(grid.row(i).id);
				}
			}
			for(i = 0; i < rowIds.length; ++i){
				var d = new Deferred();
				Deferred.when(grid.store.remove(rowIds[i]), lang.hitch(d, d.callback));
				dl.push(d);
			}
			if(dl.length){
				new DeferredList(dl).then(function(){
					console.debug('delete ok');
				});
			}
		});
	};

	deleteFirstRow = function(){
		grid.model.when(0, function(){
			if(grid.row(0)){
				grid.store.remove(grid.row(0).id);
			}
		});
	};

	deleteLastRow = function(){
		grid.model.when({start: 0}, function(){
			if(grid.rowCount()){
				grid.store.remove(grid.row(grid.rowCount() - 1).id);
			}
		});
	};

	parser.parse();
});
