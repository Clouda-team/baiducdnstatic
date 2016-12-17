require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/allModules',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'dijit/layout/BorderContainer',
	'dijit/layout/TabContainer',
	'dijit/layout/ContentPane',
	'dijit/Dialog',
	'dojo/domReady!'
], function(parser, dataSource, storeFactory, modules){

	store = storeFactory({
		dataSource: dataSource, 
		size: 200
	}); 

	mods = [
		modules.ColumnResizer,
		modules.RowHeader,
		modules.TouchScroll,
		modules.VirtualVScroller
	];

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
		{id: 'id', field: 'id', name: 'Identity', width: '120px'},
		{id: 'Genre', field: 'Genre', name: 'Genre', width: '180px'},
		{id: 'Artist', field: 'Artist', name: 'Artist', width: '220px'},
		{id: 'Year', field: 'Year', name: 'Year', width: '100px'},
		{id: 'Album', field: 'Album', name: 'Album', width: '260px'},
		{id: 'Name', field: 'Name', name: 'Name (auto)'},
		{id: 'Length', field: 'Length', name: 'Length (auto)'},
		{id: 'Track', field: 'Track', name: 'Track (auto)'},
		{id: 'Composer', field: 'Composer', name: 'Composer (auto)'},
		{id: 'Download Date', field: 'Download Date', name: 'Download Date (auto)'},
		{id: 'Last Played', field: 'Last Played', name: 'Last Played (auto)'},
		{id: 'Heard', field: 'Heard', name: 'Heard (auto)'}
	];

	layout4 = [
		{id: 'id', field: 'id', name: 'Identity (auto)'},
		{id: 'Year', field: 'Year', name: 'Year (auto)'},
		{id: 'Genre', field: 'Genre', name: 'Genre (30%)', width: '30%'},
		{id: 'Artist', field: 'Artist', name: 'Artist (20%)', width: '20%'},
		{id: 'Name', field: 'Name', name: 'Name (30%)', width: '30%'}
	];
	
	layout4_1 = [
		{id: 'id', field: 'id', name: 'Identity (30%)', width: '30%'},
		{id: 'Year', field: 'Year', name: 'Year (30%)', width: '30%'},
		{id: 'Genre', field: 'Genre', name: 'Genre (20%)', width: '20%'},
		{id: 'Artist', field: 'Artist', name: 'Artist (20%)', width: '20%'},
		{id: 'Name', field: 'Name', name: 'Name (auto)', width: 'auto'}
	];
	
	layout5 = [
		{id: 'id', field: 'id', name: 'Identity', width: '50px'},
		{id: 'Name', field: 'Name', name: 'Name (30%)', width: '30%'},
		{id: 'Genre', field: 'Genre', name: 'Genre (20%)', width: '20%'},
		{id: 'Year', field: 'Year', name: 'Year (auto)'},
		{id: 'Length', field: 'Length', name: 'Length (auto)'},
		{id: 'Track', field: 'Track', name: 'Track (auto)'},
		{id: 'Artist', field: 'Artist', name: 'Artist (30%)', width: '30%'},
		{id: 'Album', field: 'Album', name: 'Album (40%)', width: '40%'},
		{id: 'Composer', field: 'Composer', name: 'Composer (30%)', width: '30%'}
	];

	layout6 = [
		{id: 'id', field: 'id', name: 'Identity (40px)', width: '40px'},
		{id: 'Genre', field: 'Genre', name: 'Genre (10em)', width: '10em'},
		{id: 'Artist', field: 'Artist', name: 'Artist (15%)', width: '15%'},
		{id: 'Year', field: 'Year', name: 'Year (auto)'},
		{id: 'Album', field: 'Album', name: 'Album (180px)', width: '180px'},
		{id: 'Name', field: 'Name', name: 'Name (8em)', width: '8em'},
		{id: 'Length', field: 'Length', name: 'Length (5%)', width: '5%'},
		{id: 'Track', field: 'Track', name: 'Track (auto)'},
		{id: 'Composer', field: 'Composer', name: 'Composer (auto)'}
	];

	layout7 = [
		{id: 'id', field: 'id', name: 'Identity', width: '50px'},
		{id: 'Genre', field: 'Genre', name: 'Genre', width: '180px'},
		{id: 'Artist', field: 'Artist', name: 'Artist', width: '200px'},
		{id: 'Year', field: 'Year', name: 'Year', width: '50px'},
		{id: 'Album', field: 'Album', name: 'Album', width: '230px'},
		{id: 'Name', field: 'Name', name: 'Name', width: '200px'},
		{id: 'Length', field: 'Length', name: 'Length', width: '5em'},
		{id: 'Track', field: 'Track', name: 'Track'},
		{id: 'Composer', field: 'Composer', name: 'Composer'}
	];

	layout8 = [
		{id: 'id', field: 'id', name: 'Identity', width: '5%'},
		{id: 'Genre', field: 'Genre', name: 'Genre', width: '15%'},
		{id: 'Artist', field: 'Artist', name: 'Artist', width: '20%'},
		{id: 'Name', field: 'Name', name: 'Name', width: '30%'},
		{id: 'Length', field: 'Length', name: 'Length'}
	];

	parser.parse();
});
