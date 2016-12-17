require([
	'dojo/parser',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'dijit/layout/BorderContainer',
	'dijit/layout/ContentPane',
	'gridx/support/QuickFilter',
	'gridx/allModules',
	'dojo/domReady!'
], function(parser, Grid, Cache, dataSource, storeFactory){

	store = storeFactory({
		dataSource: dataSource, 
		size: 200
	}); 

	layout1 = [
		{id: 'id', field: 'id', name: 'Identity', width: '50px'},
		{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px'},
		{id: 'Artist', field: 'Artist', name: 'Artist', width: '100px'},
		{id: 'Year', field: 'Year', name: 'Year', width: '80px'},
		{id: 'Album', field: 'Album', name: 'Album', width: '150px'},
		{id: 'Name', field: 'Name', name: 'Name', width: '160px'},
		{id: 'Length', field: 'Length', name: 'Length', width: '80px'},
		{id: 'Track', field: 'Track', name: 'Track', width: '50px'},
		{id: 'Composer', field: 'Composer', name: 'Composer', width: '200px'},
		{id: 'Download Date', field: 'Download Date', name: 'Download Date', width: '200px'},
		{id: 'Last Played', field: 'Last Played', name: 'Last Played', width: '200px'},
		{id: 'Heard', field: 'Heard', name: 'Heard', width: '80px'}
	];

	layout2 = [
		{id: 'id', field: 'id', name: 'Identity', width: '50px'},
		{id: 'Genre', field: 'Genre', name: 'Genre (auto)'},
		{id: 'Artist', field: 'Artist', name: 'Artist (auto)'},
		{id: 'Year', field: 'Year', name: 'Year', width: '50px'},
		{id: 'Album', field: 'Album', name: 'Album (auto)'},
		{id: 'Name', field: 'Name', name: 'Name (auto)'},
		{id: 'Length', field: 'Length', name: 'Length', width: '50px'},
		{id: 'Track', field: 'Track', name: 'Track', width: '40px'}
	];

	layout3 = [
		{id: 'id', field: 'id', name: 'Identity (auto)'},
		{id: 'Year', field: 'Year', name: 'Year (auto)'},
		{id: 'Genre', field: 'Genre', name: 'Genre (30%)', width: '30%'},
		{id: 'Artist', field: 'Artist', name: 'Artist (20%)', width: '20%'},
		{id: 'Name', field: 'Name', name: 'Name (30%)', width: '30%'}
	];

	layout4 = [
		{id: 'id', field: 'id', name: 'Identity (auto)'},
		{id: 'Year', field: 'Year', name: 'Year (auto)'},
		{id: 'Genre', field: 'Genre', name: 'Genre (30%)', width: '30%'},
		{id: 'Artist', field: 'Artist', name: 'Artist (20%)', width: '20%'},
		{id: 'Name', field: 'Name', name: 'Name (30%)', width: '30%'}
	];

	layout5 = [
		{id: 'id', field: 'id', name: 'Identity'},
		{id: 'Year', field: 'Year', name: 'Year'},
		{id: 'Genre', field: 'Genre', name: 'Genre'},
		{id: 'Artist', field: 'Artist', name: 'Artist'},
		{id: 'Name', field: 'Name', name: 'Name'}
	];

	parser.parse();
});
