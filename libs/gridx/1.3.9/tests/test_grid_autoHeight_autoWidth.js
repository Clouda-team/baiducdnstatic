require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	"gridx/allModules",
	'dojo/domReady!'
], function(parser, dataSource, storeFactory){

	layout = [
		{id: 'id', field: 'id', name: 'Identity', width: '80px'},
		{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px'},
		{id: 'Artist', field: 'Artist', name: 'Artist', width: '120px'},
		{id: 'Year', field: 'Year', name: 'Year', width: '80px'},
		{id: 'Album', field: 'Album', name: 'Album', width: '160px'},
		{id: 'Name', field: 'Name', name: 'Name', width: '80px'},
		{id: 'Length', field: 'Length', name: 'Length', width: '80px'},
		{id: 'Track', field: 'Track', name: 'Track', width: '80px'},
		{id: 'Composer', field: 'Composer', name: 'Composer', width: '160px'}
	];

	store = storeFactory({
		dataSource: dataSource, 
		size: 10
	});
	emptyStore = storeFactory({
		dataSource: dataSource, 
		size: 0
	});

	parser.parse();
});
