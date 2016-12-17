require([
	'dojo/parser',
	'dojo/query',
	'dojo/dom-style',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'dojo/date/locale',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/core/model/extensions/FormatSort',
	'gridx/allModules',
	'gridx/modules/Sort',
	'dojo/domReady!'
], function(parser, query, domStyle, dataSource, storeFactory, locale){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	layout = [
		{ id: 'id', field: "id", name:"Index", dataType:"number"},
		{ id: 'Genre', field: "Genre", name:"Genre", width: '200px'},
		{ id: 'Artist', field: "Artist", name:"Artist", width: '200px', sortable: 'descend'},
		{ id: 'Year', field: "Year", name:"Year", dataType:"number", width: '100px', sortable: 'ascend'},
		{ id: 'Album', field: "Album", name:"Album (unsortable)", sortable: false, width: '200px'},
		{ id: 'Name', field: "Name", name:"Name", width: '200px'},
		{ id: 'DownloadDate', field: "Download Date", name:"Date",
			//Need FormatSort extension to make this effective
			comparator: function(a, b){
				var d1 = locale.parse(a, {selector: 'date', datePattern: 'yyyy/M/d'});
				var d2 = locale.parse(b, {selector: 'date', datePattern: 'yyyy/M/d'});
				return d1 - d2;
			}
		},
		{ id: 'LastPlayed', field: "Last Played", name:"Last Played", width: '100px'},
		{ id: 'Summary', name: 'Summary Genre and Year', width: '200px', formatter: function(rawData){
			return rawData.Genre + '_' + rawData.Year;
		}, sortFormatted: true}
	];

	parser.parse().then(function(){
	});
});
