require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/XQueryReadStore',
	'dojox/data/QueryReadStore',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/allModules',
	'dojo/domReady!'
], function(parser, dataSource, memoryFactory, xstoreFactory, QueryReadStore){

	clientStore = memoryFactory({
		dataSource: dataSource, 
		size: 2000
	});

	serverStore = new QueryReadStore({
		idAttribute: 'id',
		url: 'support/stores/QueryReadStore.php'
	});

	serverLayout = [
		{id: 'id', field: 'id', name: 'Identity'},
		{id: 'name', field: 'name', name: 'name'},
		{id: 'label', field: 'label', name: 'label'},
		{id: 'abbreviation', field: 'abbreviation', name: 'abbreviation'},
		{id: 'capital', field: 'capital', name: 'capital'}
	];
	
	layout = [
		{id: 'id', field: 'id', name: 'Identity'},
		{id: 'Year', field: 'Year', name: 'Year'},
		{id: 'Album', field: 'Album', name: 'Album'},
		{id: 'Length', field: 'Length', name: 'Length'},
		{id: 'Track', field: 'Track', name: 'Track'},
		{id: 'Download Date', field: 'Download Date', name: 'Download Date'},
		{id: 'Last Played', field: 'Last Played', name: 'Last Played'},
		{id: 'Heard', field: 'Heard', name: 'Heard'}
	];

	parser.parse();
});
