require([
	'gridx/Grid',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/TestPane',
	'gridx/allModules'
], function(Grid, dataSource, storeFactory, TestPane, mods){

	var columnSetIdx = 0;

	destroy = function(){
		if(window.grid){
			grid.destroy();
			window.grid = undefined;
		}
	};

	create = function(){
		if(!window.grid){
			var store = storeFactory({
				dataSource: dataSource,
				size: 100
			});
			var layout = dataSource.layouts[columnSetIdx];
			grid = new Grid({
				id: 'grid',
				// data: [
				// 	{id: 1, name: 'yury'},
				// 	{id: 2, name: 'gee'},
				// 	{id: 3, name: 'citychess', city: 'shanghai'},
				// 	{id: 4, name: 'jennifer'}
				// ],
			});
			grid.placeAt('gridContainer');
			grid.startup();
		}
	};

	// create();
});
