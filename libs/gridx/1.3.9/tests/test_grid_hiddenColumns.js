require([
	'dojo/parser',
	'dojo/_base/Deferred',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/allModules',
	'dojo/domReady!'
], function(parser, Deferred, dataSource, storeFactory){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	layout = [
		{id: 'id', field: 'id', name: 'id:1'},
		{id: 'Genre', field: 'Genre', name: 'Genre:2'},
		{id: 'Artist', field: 'Artist', name: 'Artist:3'},
		{id: 'Album', field: 'Album', name: 'Album:4'},
		{id: 'Name', field: 'Name', name: 'Name:5'},
		{id: 'Year', field: 'Year', name: 'Year:6'},
		{id: 'Length', field: 'Length', name: 'Length:7'},
		{id: 'Track', field: 'Track', name: 'Track:8'},
		{id: 'Composer', field: 'Composer', name: 'Composer:9'},
		{id: 'Download Date', field: 'Download Date', name: 'Download Date:10'},
		{id: 'Last Played', field: 'Last Played', name: 'Last Played:11'},
		{id: 'Heard', field: 'Heard', name: 'Heard:12'}
	];

	Deferred.when(parser.parse(), function(){
		configGrid.connect(configGrid.select.row, 'onSelected', function(row){
			// var t = new Date;
			grid.hiddenColumns.add(row);
			// console.log('hide: ' + (new Date - t));
		});
		configGrid.connect(configGrid.select.row, 'onDeselected', function(row){
			// var t = new Date;
			grid.hiddenColumns.remove(row);
			// console.log('show: ' + (new Date - t));
		});

		dojo.connect(grid.hiddenColumns, 'onShow', function(colIds){
			console.log(colIds);
		});
		dojo.connect(grid.hiddenColumns, 'onHide', function(colIds){
			console.log(colIds);
		});
	});

	showAll = function(){
		var t = new Date;
		grid.hiddenColumns.clear();
		console.log('clear: ' + (new Date - t));
		configGrid.select.row.clear();
	};
});
