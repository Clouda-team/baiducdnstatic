require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'dojo/store/JsonRest',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/core/model/cache/Async',
	'gridx/allModules',
	'dojo/domReady!'
], function(parser, dataSource, storeFactory, JsonRest){
	jsonStore = new JsonRest({target: 'support/stores/test_grid_filter.php/'});

	layoutServerSide = [
		{id: 'id', field: 'id', name: 'Identity', dataType: 'number'},
		{id: 'Genre', field: 'Genre', name: 'Genre', dataType: 'string'},
		{id: 'Artist', field: 'Artist', name: 'Artist', dataType: 'string'},
		{id: 'Album', field: 'Album', name: 'Album', dataType: 'string'},
		{id: 'Name', field: 'Name', name: 'Name', dataType: 'string'},
		{id: 'Year', field: 'Year', name: 'Year', dataType: 'number'},
		{id: 'Length', field: 'Length', name: 'Length', dataType: 'string'},
		{id: 'Track', field: 'Track', name: 'Track', dataType: 'number'},
		{id: 'Composer', field: 'Composer', name: 'Composer', dataType: 'string'},
		{id: 'Download Date', field: 'Download Date', name: 'Download Date', dataType: 'date'},
		{id: 'Last Played', field: 'Last Played', name: 'Last Played', dataType: 'time'},
		{id: 'Heard', field: 'Heard', name: 'Heard', dataType: 'boolean'}
	];

	parser.parse();
});
